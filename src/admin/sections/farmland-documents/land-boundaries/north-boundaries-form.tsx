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
import { getFilterFarmlandIdentifiers } from 'src/api/filters';
import { IMapping } from 'src/types/mapping';
import { approveDocument, turnBackDocument } from 'src/api/region-officer';
import CommentDialog from 'src/components/custom-dialog/comment-dialog';
import { useBoolean } from 'src/hooks/use-boolean';
import { AuthContext } from 'src/auth/context';
import TimelineButtonView from '../timeline-buttons';

// -----------------------------------------------------------------

interface Props {
  farmlandId: number;
  documentIndex: number;
  documentDetails: FarmlandDocuments;
  onNext: (index: number) => void;
}

function NorthBoundariesForm({ farmlandId, documentIndex, documentDetails, onNext }: Props) {

  const [editable, setEditable] = useState<boolean>(documentDetails.documentStatus === 'Pending');

  const [boundaryType, setBoundaryType] = useState('0');

  const [roadType, setRoadType] = useState('0');

  const [identifiers, setIdentifiers] = useState<IMapping[]>([]);

  const [treeIdentifiers, setTreeIdentifiers] = useState<IMapping[]>([]);

  const [comments, setComments] = useState('');

  const [name, setName] = useState('');

  const [age, setAge] = useState('');

  const [widthOfRoad, setWidthOfRoad] = useState('');

  const [treesCount, setTreesCount] = useState('0');

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
    getIdentifiers('Boundaries');
    getTreesCount('Trees_Count');
    setComments(documentDetails.documentDetails?.comments || '');
    setBoundaryType(documentDetails.documentDetails?.label || '0');
    setName(documentDetails.documentDetails?.name || '');
    setAge(documentDetails.documentDetails?.age || '');
    setRoadType(documentDetails.documentDetails?.roadType || '0');
    setWidthOfRoad(documentDetails.documentDetails?.widthOfRoad || '');
    setTreesCount(documentDetails.documentDetails?.treesCount || '0');
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
  }
    , [documentDetails, farmlandId]);

  const setEditMode = async () => {
    setEditable(true);
    setCancelButton(true);
  };

  const onCancelEdit = async () => {
    setEditable(false);
    setCancelButton(false);
  };

  const getIdentifiers = async (type: string) => {
    const response = await getFilterFarmlandIdentifiers(type);
    setIdentifiers([...response]);
  }

  const getTreesCount = async (type: string) => {
    const response = await getFilterFarmlandIdentifiers(type);
    setTreeIdentifiers([...response]);
  }

  const onSave = async () => {
    if (boundaryType === '0') {
      enqueueSnackbar('Please select north boundaries', {
        variant: 'error',
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
      });
      return;
    }
    if (boundaryType === 'Land') {
      if (!name) {
        enqueueSnackbar('Please enter name', {
          variant: 'error',
          anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
        });
        return;
      }
      if (!age) {
        enqueueSnackbar('Please enter age', {
          variant: 'error',
          anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
        });
        return;
      }

    }
    if (boundaryType === 'Road') {
      if (roadType === '0' || roadType === null) {
        enqueueSnackbar('Please select type of road', {
          variant: 'error',
          anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
        });
        return;
      }

      if (!widthOfRoad) {
        enqueueSnackbar('Please enter width of road', {
          variant: 'error',
          anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
        });
        return;
      }
    }

    if (boundaryType === 'Trees') {
      if (treesCount === '0' || treesCount === null) {
        enqueueSnackbar('Please select trees count', {
          variant: 'error',
          anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
        });
        return;
      }
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
        id: identifiers.find((item) => item.label === boundaryType)?.id,
        label: boundaryType,
        roadType,
        widthOfRoad,
        treesCountId: treeIdentifiers.find((item) => item.label === treesCount)?.id,
        treesCount,
        name,
        age
      },
    };

    await saveFarmlandDocument(farmlandId, documentId, body);
    enqueueSnackbar('Document Submitted Successfully', {
      variant: 'success',
      anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
    });
    await refreshDocumentData();
    setEditable(false);
  };

  const refreshDocumentData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchDocumentDetails(farmlandId, documentDetails.documentId);
      setDocumentData(res.data); // Ensure state updates
      setComments(res.data.documentDetails?.comments || '');
      setBoundaryType(res.data.documentDetails?.label || '0');
      setName(res.data.documentDetails?.name || '');
      setAge(res.data.documentDetails?.age || '');
      setRoadType(res.data.documentDetails?.roadType || '0');
      setWidthOfRoad(res.data.documentDetails?.widthOfRoad || '');
      setTreesCount(res.data.documentDetails?.treesCount || '0');
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
    setBoundaryType(event.target.value as string);
  };

  const handleRoadTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setRoadType(event.target.value as string);
  };

  const handleTreeDropdownChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTreesCount(event.target.value as string);
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
          minHeight="64%"
          alignItems="flex-start"
          position="relative"
        >
          <Stack direction='row' justifyContent='space-between' width="100%">
            <Box width="40%">
              <Typography fontWeight="subtitle1" sx={{ my: 2, fontWeight: 'bold' }}>North Boundaries:</Typography>

              <FormProvider {...methods}>
                <RHFSelect
                  name="eastBoundaries"
                  placeholder="Select North Boundaries"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    readOnly: !editable,
                  }}
                  value={boundaryType}
                  onChange={handleDropdownChange}
                  sx={{
                    width: 1
                  }}
                >
                  <MenuItem value="0">Select North Boundaries</MenuItem>
                  {identifiers.map((reason) => (
                    <MenuItem key={reason.id} value={reason.label}>
                      {reason.label}
                    </MenuItem>
                  ))}
                </RHFSelect>

                {boundaryType === 'Land' &&
                  <Stack>
                    <Typography fontWeight="subtitle1" sx={{ my: 2, fontWeight: 'bold' }}>Land Owner Details:</Typography>

                    <Typography fontWeight="medium" sx={{ my: 2 }}>Name</Typography>
                    <RHFTextField
                      name="name"
                      value={name}
                      onChange={(e) => {
                        const input = e.target.value;
                        const lettersOnly = input.replace(/[^a-zA-Z]/g, ''); // remove non-letter characters
                        setName(lettersOnly);
                      }}
                      placeholder="Enter Name"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        readOnly: !editable,
                      }}
                    />
                    <Typography fontWeight="medium" sx={{ my: 2 }}>Age</Typography>
                    <RHFTextField
                      name="age"
                      value={age}
                      onChange={(e) => {
                        const input = e.target.value;
                        const numbersOnly = input.replace(/[^0-9]/g, ''); // remove non-numeric characters
                        setAge(numbersOnly);
                      }}
                      placeholder="Enter Age"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        readOnly: !editable,
                      }}
                    />

                  </Stack>}

                {boundaryType === 'Road' &&
                  <Stack sx={{ mb: 1, mt: 2 }}>
                    <Typography fontWeight="medium" sx={{ mb: 2 }}>Type Of Road</Typography>

                    <RadioGroup aria-label="text" name="video_style" value={roadType}
                      onChange={(e) => editable && handleRoadTypeChange(e)}>
                      <FormControlLabel value="PrivateRoad" control={<Radio />} label="private Road" />
                      <FormControlLabel value="GovernmentRoad" control={<Radio />} label="Government Road" />
                    </RadioGroup>
                  </Stack>}

                {boundaryType === 'Road' &&
                  <Stack>
                    <Typography fontWeight="medium" sx={{ my: 2 }}>Width of Road(Feet)</Typography>
                    <RHFTextField
                      name="widthOfRoad"
                      value={widthOfRoad}
                      onChange={(e) => {
                        setWidthOfRoad(e.target.value);
                      }}
                      InputProps={{
                        readOnly: !editable,
                      }}
                      placeholder="Enter Width of Road"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Stack>}

                {boundaryType === 'Trees' &&
                  <Stack sx={{ mb: 1, mt: 2 }}>
                    <RHFSelect
                      name="trees"
                      placeholder="Select trees"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        readOnly: !editable,
                      }}
                      value={treesCount}
                      onChange={handleTreeDropdownChange}
                      sx={{
                        width: 1
                      }}
                    >
                      <MenuItem value="0">Select Trees</MenuItem>
                      {treeIdentifiers.map((reason) => (
                        <MenuItem key={reason.id} value={reason.label}>
                          {reason.label}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </Stack>}

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
            }}>
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

export default NorthBoundariesForm;
