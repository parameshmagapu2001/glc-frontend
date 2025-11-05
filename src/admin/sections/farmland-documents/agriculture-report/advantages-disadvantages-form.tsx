'use client';

import { Box, Button, Dialog, DialogActions, DialogContent, Grid, Rating, Stack, TextareaAutosize, Typography, useTheme } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useContext, useEffect, useState } from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import { format } from 'date-fns';
import { fetchDocumentDetails, saveFarmlandDocument, submitFarmlandDocument, updateAgentRating } from 'src/api/farmlands';
import { approveDocument, rejectFarmland, turnBackDocument } from 'src/api/region-officer';
import Image from 'src/components/image';
import { FarmlandDocumentBody, FarmlandDocuments, ITimelineItem } from 'src/types/farmlands';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { AuthContext } from 'src/auth/context';
import CommentDialog from 'src/components/custom-dialog/comment-dialog';
import { useBoolean } from 'src/hooks/use-boolean';
import TimelineButtonView from '../timeline-buttons';

// -----------------------------------------------------------------

interface Props {
  farmlandId: number;
  documentIndex: number;
  documentDetails: FarmlandDocuments;
  onNext: (index: number) => void;
}

function AdvantagesDisadvantagesForm({ farmlandId, documentIndex, documentDetails, onNext }: Props) {

  const [editable, setEditable] = useState<boolean>(documentDetails.documentStatus === 'Pending');

  const [documentStatus, setDocumentStatus] = useState<string>(documentDetails.documentStatus);

  const [comments, setComments] = useState('');

  const [openSubmitPopup, setOpenSubmitPopup] = useState(false);

  const [rateAgentPopup, setRateAgentPopup] = useState(false);

  const [cancelButton, setCancelButton] = useState(false);

  const [timelineViewStatus, setTimelineViewStatus] = useState(documentDetails?.timeLineView);

  const [activeView, setActiveView] = useState(documentDetails?.timeLineView ? 'timeline' : 'file');

  const [activityTimeLine, setActivityTimeLine] = useState<ITimelineItem[]>([]);

  const [loading, setLoading] = useState(false);

  const [value, setValue] = useState(0); // Initial rating value

  const theme = useTheme();

  const router = useRouter();

  const confirm = useBoolean();

  const { user } = useContext(AuthContext);

  useEffect(() => {
    setComments(documentDetails.documentDetails?.comments || '');

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

  const onSave = async () => {
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
        comments
      },
    };

    if (documentStatus === 'Pending') {
      await submitFarmlandDocument(farmlandId, documentId, body);
      setComments('');
      setOpenSubmitPopup(true);
    } else {
      await saveFarmlandDocument(farmlandId, documentId, body);
      setComments('');
      enqueueSnackbar('Details have been saved successfully', {
        variant: 'success',
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
      });
      await refreshDocumentData();
      setEditable(false);
    }
  };

  const goToFarmlands = useCallback(() => {
    if (user?.role_id === 9) {
      router.push(paths.fo.allFarmlands);
    } else if (user?.role_id === 11) {
      router.push(paths.ccs.total_farmland_list);
    } else if (user?.role_id === 7) {
      router.push(paths.ro.allFarmlands);
    } else if (user?.role_id === 4) {
      router.push(paths.vo.all_farmland_list);
    }
  }, [router, user?.role_id]);

  const onApprove = async () => {
    const response = await approveDocument(farmlandId, documentDetails.documentId);
    if (response.data === true) {
      if (user?.role_id !== 1) {
        setOpenSubmitPopup(true);
      } else {
        enqueueSnackbar('Details have been saved to drafts', {
          variant: 'success',
          anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
        });
        onNext(documentIndex + 1);
      }
    } else {
      enqueueSnackbar('Document Approval Failed', {
        variant: 'error',
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
      });
    }
  };

  const onRejectOrTurnBack = async (reason: string) => {
    const data = {
      reason
    };
    if (user?.role_id === 11) {
      const response = await rejectFarmland(farmlandId, data);
      if (response.data === true) {
        enqueueSnackbar('Farmland Rejected', {
          variant: 'error',
          anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
        });
        router.push(paths.ccs.total_farmland_list);
      }
    } else {
      const response = await turnBackDocument(farmlandId, documentDetails.documentId, data);
      if (response.data === true) {
        await refreshDocumentData();
        confirm.onFalse();
        enqueueSnackbar('Document Turned Back Successfully', {
          variant: 'success',
          anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
        });
      } else {
        enqueueSnackbar('Document Turn back', {
          variant: 'error',
          anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
        });
      }
    }
  };

  const refreshDocumentData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchDocumentDetails(farmlandId, documentDetails.documentId);
      setDocumentStatus(res.data.documentStatus)
      setComments(res.data.documentDetails?.comments || '');
      setActivityTimeLine(res.data.activityTimeline);
      setTimelineViewStatus(res.data.timeLineView || false);
      setActiveView(res.data.timeLineView ? 'timeline' : 'file');
    } catch (err) {
      console.log('ERROR:', err);
    } finally {
      setLoading(false);
    }
  }, [farmlandId, documentDetails.documentId]);


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
      if (approveAccess || user?.role_id === 11) {
        return (
          <Grid xs={12} md={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" color="inherit" size="medium" sx={{ mr: 2, borderRadius: 10 }} onClick={confirm.onTrue}>
              {user?.role_id === 11 ? 'Reject' : 'Turnback'}
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
                  Submit
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

  const handleRateAgent = () => {
    setRateAgentPopup(true);
    setOpenSubmitPopup(false);
  };
  const handleRating = async (newValue: number) => {
    setValue(newValue);

    try {
      const data = {
        rating: newValue,
        farmlandId,
      }
      const response = await updateAgentRating(data);
      if (response.data === true) {
        enqueueSnackbar('Thank you for your feedback!', {
          variant: 'success',
          anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
        });
      }
    } catch (error) {
      enqueueSnackbar('Failed to submit your feedback. Please try again.', {
        variant: 'error',
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
      });
    }
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
          <Stack justifyContent='space-between' width="100%">
          <Box width="60%">
              <Typography fontWeight="medium">Comments:</Typography>
              <TextareaAutosize
                style={{
                  width: '100%',
                  marginTop: '10px',
                  border: '1px solid #8280FF',
                  borderRadius: '5px',
                  padding: '8px 8px',
                  minHeight: '30px', 
                  resize: 'none',
                }}
                minRows={5}
                value={comments}
                readOnly={!editable}
                onChange={(e) => {
                  const input = e.target.value;
                  const trimmed = input.trim();
                  if (trimmed === '' && input !== '') return;
                  const words = trimmed.split(/\s+/);
                  if (words.length <= 500) {
                    setComments(input);
                  }
                }}
                placeholder="Add your comments (max 500 words)"
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
                          {user?.role_id === 9 &&
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

      <Dialog
        fullWidth
        maxWidth="xs"
        open={openSubmitPopup}
        onClose={() => setOpenSubmitPopup(false)}
        transitionDuration={{
          enter: theme.transitions.duration.shortest,
          exit: theme.transitions.duration.shortest - 80,
        }}
      >
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3 }}>
            <Typography variant="h6" align="center" sx={{ mt: 2 }}>
              {user?.role_id === 9 && 'Farmland Submitted'}
              {(user?.role_id === 11 || user?.role_id === 4) && 'Farmland Approved'}
            </Typography>
            <Stack sx={{ mt: 2 }}>
              <Image src="/assets/images/success.png" alt="success" width={115} height={115} />
            </Stack>
            <Typography variant="body1" align="center" sx={{ mt: 2, p: 1, px: 3 }}>
              {user?.role_id === 9 && 'Farmland has been successfully submitted.'}
              {(user?.role_id === 11 || user?.role_id === 4) && 'Farmland has been successfully approved.'}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', px: 3 }}>
          <Button onClick={goToFarmlands} color="info" variant="contained" size="medium" sx={{ borderRadius: 10 }}>
            Done
          </Button>
          {user?.role_id === 9 &&
            <Button color="info" variant="outlined" size="medium" sx={{ borderRadius: 10 }} onClick={handleRateAgent}>
              Rate Agent
            </Button>}
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth
        maxWidth="xs"
        open={rateAgentPopup}
        onClose={() => setRateAgentPopup(false)}
        transitionDuration={{
          enter: theme.transitions.duration.shortest,
          exit: theme.transitions.duration.shortest - 80,
        }}
      >
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3 }}>
            <Typography variant="h6" align="center" sx={{ mt: 2 }}>
              Rate Agent:
            </Typography>

            <Typography variant="body1" align="center" sx={{ mt: 2, p: 1, px: 3 }}>
              Please provide your ratings to Agent
            </Typography>
            <Stack sx={{ my: 2 }}>
              <Rating
                size="large"
                value={value}
                onChange={(event, newValue) => {
                  if (newValue !== null) {
                    handleRating(newValue);
                  }
                }}
              />
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', px: 3 }}>
          <Button onClick={goToFarmlands} color="info" variant="contained" size="medium" sx={{ borderRadius: 10 }}>
            Done
          </Button>
        </DialogActions>
      </Dialog>

      <CommentDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Reject Reason"
        content='Please provide the reason to reject'
        btnTitle="Submit"
        onSubmit={(val) => {
          onRejectOrTurnBack(val);
        }}
        submitButtonStatus
        readonlyStatus={false}
        comment=''
      />
    </>
  );
}

export default AdvantagesDisadvantagesForm;
