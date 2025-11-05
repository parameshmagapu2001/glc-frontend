'use client';

import { Box, Button, FormControlLabel, Grid, MenuItem, Radio, RadioGroup, Stack, TextareaAutosize, Typography } from '@mui/material';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import Timeline from '@mui/lab/Timeline';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import { format } from 'date-fns';
import { fetchDocumentDetails, saveFarmlandDocument } from 'src/api/farmlands';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { FarmlandDocumentBody, FarmlandDocuments, ITimelineItem } from 'src/types/farmlands';
import { approveDocument, turnBackDocument } from 'src/api/region-officer';
import { useBoolean } from 'src/hooks/use-boolean';
import CommentDialog from 'src/components/custom-dialog/comment-dialog';
import { AuthContext } from 'src/auth/context';
import TimelineButtonView from '../timeline-buttons';

// -----------------------------------------------------------------

interface Props {
  farmlandId: number;
  documentIndex: number;
  documentDetails: FarmlandDocuments;
  onNext: (index: number) => void;
}

function WaterFacilityForm({ farmlandId, documentIndex, documentDetails, onNext }: Props) {

  const [editable, setEditable] = useState<boolean>(documentDetails.documentStatus === 'Pending');

  const [waterSource, setWaterSource] = useState('Bore');

  const [comments, setComments] = useState('');

  const [waterFacility, setWaterFacility] = useState('');

  const [depthOfBore, setDepthOfBore] = useState('');

  const [loading, setLoading] = useState(false);

  const [documentData, setDocumentData] = useState(documentDetails);

  const [cancelButton, setCancelButton] = useState(false);

  const [timelineViewStatus, setTimelineViewStatus] = useState(documentDetails?.timeLineView);

  const [activeView, setActiveView] = useState(documentDetails?.timeLineView ? 'timeline' : 'file');

  const [activityTimeLine, setActivityTimeLine] = useState<ITimelineItem[]>([]);

  const methods = useForm();

  const confirm = useBoolean();

  const { user } = useContext(AuthContext);

  useEffect(() => {
    setComments(documentDetails.documentDetails?.comments || '');
    setDepthOfBore(documentDetails.documentDetails?.depthOfBore || '');
    setWaterFacility(documentDetails.documentDetails?.waterFacility || '');
    setWaterSource(documentDetails.documentDetails?.waterSource || 'Bore');

    const fetchTimeline = async () => {
      setLoading(true);
      try {
        const res = await fetchDocumentDetails(farmlandId, documentDetails.documentId);
        setActivityTimeLine(res.data.activityTimeline);
        setTimelineViewStatus(res.data.timeLineView || false);
        setActiveView(res.data.timeLineView ? 'timeline' : 'file');
      } catch (err) {
        console.log('ERROR:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, [documentDetails, farmlandId]);


  const setEditMode = async () => {
    setEditable(true);
    setCancelButton(true);
  };

  const onCancelEdit = async () => {
    setEditable(false);
    setCancelButton(false);
  };

  const handleStyleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWaterFacility((event.target as HTMLInputElement).value);
  };

  const onSave = async () => {
    if (!waterFacility) {
      enqueueSnackbar('Please select water facility', {
        variant: 'error',
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
      });
      return;
    }
    if (waterFacility === 'Available' && depthOfBore === '') {
      enqueueSnackbar('Please enter the depth of bore', {
        variant: 'error',
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
      });
      return;
    }

    if (!comments) {
      enqueueSnackbar('Please enter your comments', {
        variant: 'error',
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
      });
      return;
    }
    const documentId = documentDetails.documentId;
    const doc = documentDetails;

    const body: FarmlandDocumentBody = {
      documentId,
      documentName: doc.documentName,
      documentStatus: doc.documentStatus,
      documentDetails: {
        comments,
        waterSource,
        waterFacility,
        depthOfBore,
      },
    };

    await saveFarmlandDocument(farmlandId, documentId, body);
    enqueueSnackbar('Document Submitted Successfully', {
      variant: 'success',
      anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
    });
    setComments('');
    await refreshDocumentData();
    setEditable(false);
  };

  const refreshDocumentData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchDocumentDetails(farmlandId, documentDetails.documentId);
      setDocumentData(res.data); // Ensure state updates
      setComments(res.data.documentDetails?.comments || '');
      setWaterFacility(res.data.documentDetails?.waterFacility || '');
      setDepthOfBore(res.data.documentDetails?.depthOfBore || '');
      setWaterSource(res.data.documentDetails?.waterSource || 'Bore');
      setActivityTimeLine(res.data.activityTimeline);
      setTimelineViewStatus(res.data.timeLineView || false);
      setActiveView(res.data.timeLineView ? 'timeline' : 'file');
    } catch (err) {
      console.log('ERROR:', err);
    } finally {
      setLoading(false);
    }
  }, [farmlandId, documentDetails.documentId]);


  const handleDropdownChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setWaterSource(event.target.value as string);
  };

  const onApprove = async () => {
    const response = await approveDocument(farmlandId, documentDetails.documentId);
    if (response.data === true) {
      enqueueSnackbar('Document Approved Successfully', {
        variant: 'success',
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
      });
      onNext(documentIndex + 1);
    } else {
      enqueueSnackbar('Document Approval Failed', {
        variant: 'error',
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
      });
    }
  };

  const onTurnBackDocument = async (reason: string) => {
    const data = {
      reason
    };
    const response = await turnBackDocument(farmlandId, documentDetails.documentId, data);
    if (response.data === true) {
      await refreshDocumentData();
      confirm.onFalse();
      enqueueSnackbar('Document Turned Back Successfully', {
        variant: 'success',
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
      });
    } else {
      enqueueSnackbar('Something went wrong', {
        variant: 'error',
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
      });
    }
  };

  const renderButtons = () => {
    const { reviewStatus, approveAccess, editAccess } = documentDetails;
    if (reviewStatus === 'Approved' || reviewStatus === 'Rejected') {
      return (
        <Grid xs={12} md={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="outlined" color="inherit" size="medium" sx={{ mr: 2, borderRadius: 10 }} disabled={documentIndex === 0}
            onClick={() => onNext(documentIndex - 1)}> Back </Button>
          <Button variant="contained" size="medium" color="primary" sx={{ borderRadius: 10 }} onClick={() => onNext(documentIndex + 1)}>
            Next
          </Button>
        </Grid>
      );
    }

    if (reviewStatus === 'Pending') {
      if (approveAccess) {
        return (
          <Grid xs={12} md={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" color="inherit" size="medium" sx={{ mr: 2, borderRadius: 10 }} onClick={confirm.onTrue}>
              Turnback
            </Button>
            <Button variant="contained" size="medium" color="primary" sx={{ borderRadius: 10 }} onClick={onApprove}>
              Approve
            </Button>
          </Grid>
        );
      }

      if (!approveAccess) {
        return (
          <Grid xs={12} md={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {!editable ? (
              <>
                {editAccess ? (
                  <Button variant="outlined" color="inherit" size="medium" sx={{ mr: 2, borderRadius: 10 }} onClick={setEditMode}>
                    Edit
                  </Button>
                ) : (
                  <Button variant="outlined" color="inherit" size="medium" sx={{ mr: 2, borderRadius: 10 }} disabled={documentIndex === 0}
                    onClick={() => onNext(documentIndex - 1)}> Back </Button>
                )}
                <Button variant="contained" size="medium" color="primary" sx={{ borderRadius: 10 }} onClick={() => onNext(documentIndex + 1)}>
                  Next
                </Button>
              </>
            ) : (
              <>
                {cancelButton && <Button variant="outlined" size="medium" color="error" sx={{ mr: 2, borderRadius: 10 }} onClick={onCancelEdit}>
                  Cancel
                </Button>}
                <Button type="button" variant="contained" size="medium" color="primary" sx={{ borderRadius: 10 }} onClick={onSave}>
                  Save
                </Button>
              </>
            )}
          </Grid>
        );
      }
    }
    return null;
  };

  const handleButtonClick = (button: string) => {
    setActiveView(button);
  };

  const onHandleEdit = () => {
    setTimelineViewStatus(true)
    setActiveView('file')
    handleButtonClick('file')
  }

  return (
    <>
      {timelineViewStatus && (
        <TimelineButtonView
          handleButtonClick={handleButtonClick}
          setActiveView={setActiveView}
          activeView={activeView} />
      )}

      {activeView === 'file' &&
        <Stack
          bgcolor="white"
          borderRadius="10px"
          px="20px"
          py="45px"
          minHeight="55%"
          position="relative"
        >
          <Stack direction='row' justifyContent='space-between'>
            <Box width="40%">
              <Typography fontWeight="medium">Water Facility</Typography>

              <FormProvider {...methods}>
                <Stack sx={{ mb: 1 }}>

                  <RadioGroup aria-label="text" name="water_facility" value={waterFacility}
                    onChange={(e) => editable && handleStyleRadioChange(e)}
                  >
                    <FormControlLabel value="Available" control={<Radio />} label="Available" />
                    <FormControlLabel value="NotAvailable" control={<Radio />} label="Not Available" />
                  </RadioGroup>

                  <Stack spacing={3}>
                    {waterFacility === 'Available' &&
                      <Stack>
                        <Typography fontWeight="medium" sx={{ my: 2 }}>Primary Source of Water</Typography>

                        <RHFSelect
                          name="primarySourceOfWater"
                          label="Primary Source of Water"
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            readOnly: !editable,
                          }}
                          value={waterSource}
                          onChange={handleDropdownChange}
                          sx={{
                            width: 1
                          }}
                        >
                          <MenuItem value="0">Select Source</MenuItem>
                          <MenuItem key={1} value="Bore">Bore </MenuItem>

                        </RHFSelect>
                      </Stack>}

                    {waterFacility === 'Available' &&
                      <Stack>

                        <RHFTextField
                          name="depthOfBore"
                          label=" Depth of Bore(Feet)"
                          value={depthOfBore}
                          onChange={(e) => setDepthOfBore(e.target.value)}
                          placeholder="Enter Width of Road"
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            readOnly: !editable,
                          }}
                        />
                      </Stack>}
                  </Stack>
                </Stack>

              </FormProvider>

            </Box>
            <Box width="50%">
              <Typography fontWeight="medium">Comments:</Typography>
              <TextareaAutosize
                style={{
                  width: '100%',
                  marginTop: '10px',
                  border: '1px solid #8280FF',
                  borderRadius: '5px',
                  padding: '10px 20px',
                }}
                minRows={5}
                value={comments}
                readOnly={!editable}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add your comments"
              />
            </Box>
          </Stack>
          <Box
            sx={{
              position: 'absolute',
              bottom: 20,
              right: 20,
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            {renderButtons()}
          </Box>
        </Stack>}

      {activeView === 'timeline' && (
        <Stack
          bgcolor="white"
          borderRadius="10px"
          px="20px"
          py="45px"
          minHeight="80%"
          alignItems="flex-start"
          position="relative"
        >
          <Stack sx={{ width: '70%', px: 2 }}>
            <Timeline
              sx={{
                p: 0,
                m: 0,
                [`& .${timelineItemClasses.root}:before`]: {
                  flex: 0,
                  padding: 0,
                },
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
              }}
            >
              {activityTimeLine.map((activity, index) => {
                const lastTimeline = index === activityTimeLine.length - 1;

                return (
                  <TimelineItem key={index}>
                    <TimelineSeparator>
                      <TimelineDot color="primary" />
                      {!lastTimeline && <TimelineConnector />}
                    </TimelineSeparator>

                    <TimelineContent sx={{ pb: 4 }}>
                      <Box sx={{ color: 'text.disabled', typography: 'caption', mt: 0.5 }}>
                        {format(new Date(activity.submittedTime), 'dd MMM yyyy, hh:mm a')}
                      </Box>

                      <Box
                        sx={{
                          bgcolor: '#F1F2FF',
                          p: 2,
                          borderRadius: 2,
                          mt: 1,
                        }}
                      >
                        <Typography sx={{ fontSize: 13, mb: 1 }}>{activity.documentDetails.comments}</Typography>
                        <Stack direction='row' justifyContent='space-between'>
                          <Stack direction="row" spacing={2} mb={2}>
                            {activity.documentDetails.documents.map((file, i) => (
                              <Box
                                key={i}
                                sx={{
                                  bgcolor: 'white',
                                  px: 2,
                                  py: 1,
                                  borderRadius: 1,
                                  boxShadow: 1,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                }}
                              >
                                <img src="/assets/icons/field-officer/pdf.svg" alt="pdf" width={20} />
                                <Typography variant="body2" sx={{ fontSize: 12 }}>
                                  {file && file.split('/').pop()}
                                </Typography>
                              </Box>
                            ))}
                          </Stack>
                          {user?.role_id === 7 &&
                            <Button size="small" variant="contained" color='info' sx={{ borderRadius: 10 }} onClick={onHandleEdit}>
                              Edit
                            </Button>}
                        </Stack>
                      </Box>

                      <Box sx={{ mt: 2, ml: 3, pl: 2, borderLeft: '2px solid #E0E0E0' }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Issue mentioned by:{' '}
                          <Box component="span" sx={{ color: '#F5B400', fontWeight: 500 }}>
                            {activity.reviewedBy}
                          </Box>
                        </Typography>
                        <Box sx={{ bgcolor: '#FFF8E1', p: 2, mt: 1, borderRadius: 2 }}>
                          <Typography variant="body2" sx={{ fontSize: 13 }}>
                            {activity.reviewComments}
                          </Typography>
                        </Box>
                      </Box>
                    </TimelineContent>
                  </TimelineItem>
                );
              })}
            </Timeline>
          </Stack>
        </Stack>
      )}

      <CommentDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Reject Reason"
        content='Please provide the reason to reject'
        btnTitle="Submit"
        onSubmit={(val) => {
          onTurnBackDocument(val);
        }}
        submitButtonStatus
        readonlyStatus={false}
        comment=''
      />
    </>
  );
}

export default WaterFacilityForm;