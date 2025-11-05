'use client';

import { Avatar, Box, Button, Grid, Stack, TextareaAutosize, Typography } from '@mui/material';
import Image from 'next/image';
import { enqueueSnackbar } from 'notistack';
import Timeline from '@mui/lab/Timeline';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import { useCallback, useContext, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fetchDocumentDetails, saveFarmlandDocument, uploadFarmlandDocs, uploadFarmlandImage } from 'src/api/farmlands';
import { approveDocument, turnBackDocument } from 'src/api/region-officer';
import { FarmlandDocumentBody, FarmlandDocuments, ITimelineItem } from 'src/types/farmlands';
import CommentDialog from 'src/components/custom-dialog/comment-dialog';
import { useBoolean } from 'src/hooks/use-boolean';
import { AuthContext } from 'src/auth/context';
import TimelineButtonView from '../timeline-buttons';

// ------------------------------------------------------------------------
interface Props {
  farmlandId: number;
  documentIndex: number;
  documentDetails: FarmlandDocuments;
  onNext: (index: number) => void;
}

function LandImagesForm({ farmlandId, documentIndex, documentDetails, onNext }: Props) {

  const [editable, setEditable] = useState<boolean>(documentDetails.documentStatus === 'Pending');

  const [coverImage, setCoverImage] = useState<File | null>(null);

  const [uploadImages, setUploadImages] = useState<File[]>([]);

  const [coverImageUrl, setCoverImageUrl] = useState<String | null>(null);

  const [farmlandImages, setFarmlandImages] = useState<String[]>([]);

  const [comments, setComments] = useState('');

  const [loading, setLoading] = useState(false);

  const [cancelButton, setCancelButton] = useState(false);

  const [timelineViewStatus, setTimelineViewStatus] = useState(documentDetails?.timeLineView);

  const [activeView, setActiveView] = useState(documentDetails?.timeLineView ? 'timeline' : 'file');

  const [activityTimeLine, setActivityTimeLine] = useState<ITimelineItem[]>([]);

  const confirm = useBoolean();

  const { user } = useContext(AuthContext);

  useEffect(() => {
    setComments(documentDetails.documentDetails?.comments || '');
    setCoverImageUrl(
      documentDetails.documentDetails?.coverImage ? documentDetails.documentDetails?.coverImage : null
    );
    setFarmlandImages(Array.isArray(documentDetails.documentDetails?.farmlandImages) ? documentDetails.documentDetails.farmlandImages : []);
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

  const handleOnClickUploadCoverImage = () => {
    const uploadBtn = document.getElementById('upload-cover-image');
    uploadBtn?.click();
  };

  const handleOnClickUploadImages = () => {
    const uploadBtn = document.getElementById('upload-images');
    uploadBtn?.click();
  };

  const onSave = async () => {
    // Validate required fields
    if (!coverImage) {
      enqueueSnackbar('Please upload a cover image.', {
        variant: 'error',
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
      });
      return;
    }

    if (uploadImages.length === 0) {
      enqueueSnackbar('Please upload at least one image.', {
        variant: 'error',
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
      });
      return;
    }

    if (!comments?.trim()) {
      enqueueSnackbar('Please enter your comments.', {
        variant: 'error',
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
      });
      return;
    }

    try {
      const { documentId, documentName, documentStatus } = documentDetails;

      const body: FarmlandDocumentBody = {
        documentId,
        documentName,
        documentStatus,
        documentDetails: {
          comments: comments.trim(),
        },
      };

      if (coverImage) {
        await uploadFarmlandImage(farmlandId, documentId, coverImage);
      }

      if (uploadImages.length > 0) {
        await uploadFarmlandDocs(farmlandId, documentId, uploadImages);
      }

      await saveFarmlandDocument(farmlandId, documentId, body);

      enqueueSnackbar('Document submitted successfully.', {
        variant: 'success',
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
      });

      // Reset form
      setCoverImage(null);
      setUploadImages([]);
      await refreshDocumentData();
      setEditable(false);
    } catch (error) {
      console.error('Error saving document:', error);
      enqueueSnackbar('Failed to submit document. Please try again.', {
        variant: 'error',
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
      });
    }
  };

  const refreshDocumentData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchDocumentDetails(farmlandId, documentDetails.documentId);
      setComments(res.data.documentDetails?.comments || '');
      setCoverImageUrl(
        res.data.documentDetails?.coverImage ? res.data.documentDetails?.coverImage : null
      );
      setFarmlandImages(Array.isArray(res.data.documentDetails?.farmlandImages) ? res.data.documentDetails.farmlandImages : []);
      setActivityTimeLine(res.data.activityTimeline);
      setTimelineViewStatus(res.data.timeLineView || false);
      setActiveView(res.data.timeLineView ? 'timeline' : 'file');
    } catch (err) {
      console.log('ERROR:', err);
    } finally {
      setLoading(false);
    }
  }, [farmlandId,
    documentDetails.documentId]);


  const handleOnRemoveCoverImage = () => {
    setCoverImage(null);
  };

  const handleOnRemoveUploadImage = (name: string) => {
    setUploadImages((prev) => prev.filter((item) => item.name !== name));
  };

  const onApprove = async () => {
    const response = await approveDocument(farmlandId, documentDetails.documentId);
    if (response.data === true) {
      enqueueSnackbar('Document Approved Successfully', {
        variant: 'error',
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
          <Stack direction='row' justifyContent='space-between' width='100%'>
            <Stack>
              <Box>
                <Typography fontWeight="medium">Cover Image:</Typography>
                {!coverImage && !coverImageUrl && editable && <Stack
                  alignItems="center"
                  justifyContent="center"
                  width="400px"
                  height="250px"
                  borderRadius="10px"
                  boxShadow="0px 4px 15.6px 0px #0000001F"
                  mt="10px"
                  position="relative"
                >
                  <Box position="absolute" top="20px" right="20px">
                    <Image src="/assets/images/docUpload.png" width={55} height={55} alt="upload" />
                  </Box>
                  <Stack
                    width="80px"
                    height="80px"
                    borderRadius="999px"
                    border="3px solid #8280FF"
                    alignItems="center"
                    justifyContent="center"
                  >
                    Upload
                  </Stack>
                  <Typography color="#9B9B9B" my="12px" fontSize="12px">
                    Upload High Quality Files
                  </Typography>
                  <Button
                    sx={{
                      padding: '7px 30px',
                      backgroundColor: '#8280FF',
                      color: 'white',
                      borderRadius: '999px',
                      ':hover': {
                        backgroundColor: '#8280FF',
                        opacity: 0.7,
                      },
                    }}
                    onClick={handleOnClickUploadCoverImage}
                  >
                    Choose File
                  </Button>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    width="100%"
                    px="15px"
                    position="absolute"
                    bottom="10px"
                  >
                    <Typography fontSize="12px" color="#9B9B9B">
                      Formats: JPG, PNG
                    </Typography>
                    <Typography fontSize="12px" color="#9B9B9B">
                      Maximum size: 10 MB
                    </Typography>
                  </Stack>
                </Stack>}
                <Box mt="30px">
                  {(!coverImage || !coverImageUrl || editable) && (
                    <>
                      {coverImage &&
                        <Image
                          src={coverImage && URL.createObjectURL(coverImage)}
                          width={400}
                          height={250}
                          alt="Coverpage"
                        />}

                      {coverImageUrl && <Avatar
                        alt='Glc'
                        src={String(coverImageUrl)}
                        variant="rounded"
                        sx={{
                          width: 400,
                          height: 250,
                          mr: 2,
                          '& img': {
                            objectFit: 'fill',
                          },
                        }}
                      />
                      }
                      {(coverImage || coverImageUrl) && (
                        <Stack
                          width="400px"
                          height="70px"
                          alignItems="center"
                          flexDirection="row"
                          bgcolor="#F1F1FF"
                          mb="20px"
                          borderRadius="5px"
                          px="12px"
                        >
                          <Stack
                            width="30px"
                            height="30px"
                            bgcolor="white"
                            borderRadius="4px"
                            alignItems="center"
                            justifyContent="center"
                            mr="8px"
                          >
                            <Image
                              src="/assets/icons/field-officer/pdf.svg"
                              width={17}
                              height={17}
                              alt="pdf"
                            />
                          </Stack>
                          {coverImage && <Typography fontSize="14px">{coverImage.name}</Typography>}
                          {coverImageUrl && <Typography fontSize="14px">{coverImageUrl.split('/').pop()}</Typography>}
                          <Stack
                            width="30px"
                            height="30px"
                            bgcolor="white"
                            borderRadius="4px"
                            alignItems="center"
                            justifyContent="center"
                            ml="auto"
                            sx={{ cursor: 'pointer' }}
                            onClick={handleOnRemoveCoverImage}
                          >
                            <Image
                              src="/assets/icons/field-officer/delete.svg"
                              width={11}
                              height={11}
                              alt="delete"
                            />
                          </Stack>
                        </Stack>
                      )}
                    </>
                  )}
                </Box>
              </Box>
              <Box>
                {editable && <Typography fontWeight="medium">Upload Images:</Typography>}
                {!editable && <Typography fontWeight="medium">Uploaded Images:</Typography>}
                {editable && <Stack
                  alignItems="center"
                  justifyContent="center"
                  width="400px"
                  height="250px"
                  borderRadius="10px"
                  boxShadow="0px 4px 15.6px 0px #0000001F"
                  mt="10px"
                  position="relative"
                >
                  <Box position="absolute" top="20px" right="20px">
                    <Image src="/assets/images/docUpload.png" width={55} height={55} alt="upload" />
                  </Box>
                  <Stack
                    width="80px"
                    height="80px"
                    borderRadius="999px"
                    border="3px solid #8280FF"
                    alignItems="center"
                    justifyContent="center"
                  >
                    Upload
                  </Stack>
                  <Typography color="#9B9B9B" my="12px" fontSize="12px">
                    Upload High Quality Files
                  </Typography>
                  <Button
                    sx={{
                      padding: '7px 30px',
                      backgroundColor: '#8280FF',
                      color: 'white',
                      borderRadius: '999px',
                      ':hover': {
                        backgroundColor: '#8280FF',
                        opacity: 0.7,
                      },
                    }}
                    onClick={handleOnClickUploadImages}
                  >
                    Choose File
                  </Button>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    width="100%"
                    px="15px"
                    position="absolute"
                    bottom="10px"
                  >
                    <Typography fontSize="12px" color="#9B9B9B">
                      Formats: JPG, PNG
                    </Typography>
                    <Typography fontSize="12px" color="#9B9B9B">
                      Maximum size: 10 MB
                    </Typography>
                  </Stack>
                </Stack>}
                <Box mt="30px">
                  {uploadImages && uploadImages?.length > 0
                    ? [...Array.from(uploadImages)].map((item, idx) => (
                      <Stack
                        key={idx}
                        width="400px"
                        height="70px"
                        alignItems="center"
                        flexDirection="row"
                        bgcolor="#F1F1FF"
                        mb="20px"
                        borderRadius="5px"
                        px="12px"
                      >
                        <Stack
                          width="30px"
                          height="30px"
                          bgcolor="white"
                          borderRadius="4px"
                          alignItems="center"
                          justifyContent="center"
                          mr="8px"
                        >
                          <Image
                            src={uploadImages && URL.createObjectURL(uploadImages[idx])}
                            width={17}
                            height={17}
                            alt="pdf"
                          />
                        </Stack>
                        <Typography fontSize="14px">{item.name}</Typography>
                        <Stack
                          width="30px"
                          height="30px"
                          bgcolor="white"
                          borderRadius="4px"
                          alignItems="center"
                          justifyContent="center"
                          ml="auto"
                          sx={{ cursor: 'pointer' }}
                          onClick={() => handleOnRemoveUploadImage(item.name)}
                        >
                          <Image
                            src="/assets/icons/field-officer/delete.svg"
                            width={11}
                            height={11}
                            alt="delete"
                          />
                        </Stack>
                      </Stack>
                    ))
                    : null}
                  {farmlandImages && farmlandImages?.length > 0
                    ? [...Array.from(farmlandImages)].map((item, idx) => (
                      <Stack
                        key={idx}
                        width="400px"
                        height="70px"
                        alignItems="center"
                        flexDirection="row"
                        bgcolor="#F1F1FF"
                        mb="20px"
                        borderRadius="5px"
                        px="12px"
                      >
                        <Stack
                          width="30px"
                          height="30px"
                          bgcolor="white"
                          borderRadius="4px"
                          alignItems="center"
                          justifyContent="center"
                          mr="8px"
                        >
                          <Avatar
                            alt='Glc'
                            src={String(item)}
                            variant="rounded"
                            sx={{ width: 64, height: 64, mr: 2 }}
                          />

                        </Stack>
                        <Typography fontSize="14px">{item.split('/').pop()}</Typography>
                        <Stack
                          width="30px"
                          height="30px"
                          bgcolor="white"
                          borderRadius="4px"
                          alignItems="center"
                          justifyContent="center"
                          ml="auto"
                          sx={{ cursor: 'pointer' }}
                          onClick={() => handleOnRemoveUploadImage(String(item))}
                        >
                          <Image
                            src="/assets/icons/field-officer/delete.svg"
                            width={11}
                            height={11}
                            alt="delete"
                          />
                        </Stack>
                      </Stack>
                    ))
                    : null}

                </Box>
              </Box>
            </Stack>
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

          <input
            type="file"
            id="upload-cover-image"
            style={{ display: 'none' }}
            accept=".jpg,.jpeg,.png"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f && (f.type === 'image/jpeg' || f.type === 'image/png')) {
                setCoverImage(f);
              } else {
                alert('Invalid file format. Only JPG and PNG are allowed.');
              }
            }}
          />
          <input
            type="file"
            id="upload-images"
            style={{ display: 'none' }}
            accept=".jpg,.jpeg,.png"
            onChange={(e) => {
              const files = e.target.files;
              if (files) {
                const validFiles = Array.from(files).filter(
                  (file) => file.type === 'image/jpeg' || file.type === 'image/png'
                );
                if (validFiles.length > 0) {
                  setUploadImages((prev) => [...prev, ...validFiles]);
                } else {
                  alert('Invalid file format. Only JPG and PNG are allowed.');
                }
              }
            }}
            multiple
          />
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

export default LandImagesForm;