'use client';

import { Box, Button, FormControlLabel, Grid, Radio, RadioGroup, Stack, TextareaAutosize, Typography } from '@mui/material';
import Image from 'next/image';
import { enqueueSnackbar } from 'notistack';
import Timeline from '@mui/lab/Timeline';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { format } from 'date-fns';
import { fetchDocumentDetails, saveFarmlandDocument, uploadFarmlandSurveyReport } from 'src/api/farmlands';
import { approveDocument, turnBackDocument } from 'src/api/region-officer';
import { FarmlandDocumentBody, FarmlandDocuments, ITimelineItem } from 'src/types/farmlands';
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

function SurveyReportForm({ farmlandId, documentIndex, documentDetails, onNext }: Props) {

  const [editable, setEditable] = useState<boolean>(documentDetails.documentStatus === 'Pending');

  const [editAccess, setEditAccess] = useState(documentDetails.editAccess);

  const [reportType, setReportType] = useState('');

  const [privateComments, setPrivateComments] = useState('');

  const [govtComments, setGovtComments] = useState('');

  const [loading, setLoading] = useState(false);

  const [privateDocuments, setPrivateDocuments] = useState<string[]>([]);

  const [govtDocuments, setGovtDocuments] = useState<string[]>([]);

  const [documentData, setDocumentData] = useState(documentDetails);

  const [cancelButton, setCancelButton] = useState(false);

  const [timelineViewStatus, setTimelineViewStatus] = useState(documentDetails?.timeLineView);

  const [activeView, setActiveView] = useState(documentDetails?.timeLineView ? 'timeline' : 'file');

  const [activityTimeLine, setActivityTimeLine] = useState<ITimelineItem[]>([]);

  const methods = useForm();

  const [privateFiles, setPrivateFiles] = useState<File[]>([]);

  const [govFiles, setGovFiles] = useState<File[]>([]);

  const confirm = useBoolean();

  const { user } = useContext(AuthContext);

  useEffect(() => {
    setReportType(documentData.documentDetails?.reportType || '');
    setPrivateComments(documentData.documentDetails?.privateComments || '');
    setGovtComments(documentData.documentDetails?.govtComments || '');
    setPrivateDocuments(Array.isArray(documentData.documentDetails?.privateDocuments) ? documentData.documentDetails.privateDocuments : []);
    setGovtDocuments(Array.isArray(documentData.documentDetails?.govtDocuments) ? documentData.documentDetails.govtDocuments : []);
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
    , [documentData, farmlandId, documentDetails.documentId, documentDetails.timeLineView]);

  const handleStyleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReportType((event.target as HTMLInputElement).value);
  };

  const handleOnPrivateClickUpload = () => {
    const uploadBtn = document.getElementById('upload-private-file');
    uploadBtn?.click();
  };

  const handleOnGovtClickUpload = () => {
    const uploadBtn = document.getElementById('upload-govt-file');
    uploadBtn?.click();
  };

  const handleOnRemove = (name1: string) => {
    setPrivateFiles((prev) => prev.filter((item) => item.name !== name1));
  };

  const setEditMode = async () => {
    setEditable(true);
    setCancelButton(true);
  };

  const onCancelEdit = async () => {
    setEditable(false);
    setCancelButton(false);
  };

  const handleOnClickDownload = (url: string) => {
    window.open(url, '_blank');
  };

  const onSave = async () => {
    if (!reportType) {
      enqueueSnackbar('Please select report type', {
        variant: 'error',
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
      });
      return;
    }
    if (reportType === 'Private' && privateFiles.length === 0 && privateDocuments.length === 0) {
      enqueueSnackbar('Please upload atleast one file', {
        variant: 'error',
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
      });
      return;
    }

    if (reportType === 'Government' && govFiles.length === 0 && govtDocuments.length === 0) {
      enqueueSnackbar('Please upload atleast one file', {
        variant: 'error',
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
      });
      return;
    }

    if (reportType === 'Both') {
      if (privateFiles.length === 0 && privateDocuments.length ===0) {
        enqueueSnackbar('Please upload atleast one Private file', {
          variant: 'error',
          anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
        });
        return;
      }

      if (govFiles.length === 0 && govtDocuments.length === 0) {
        enqueueSnackbar('Please upload atleast one Gov file', {
          variant: 'error',
          anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
        });
        return;
      }
    }

    if (reportType === 'Government' && !govtComments) {
      enqueueSnackbar('Please enter your comments', {
        variant: 'error',
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
      });
      return;
    }

    if (reportType === 'Private' && !privateComments) {
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
        govtComments,
        privateComments,
        reportType
      },
    };
    if (privateFiles.length > 0) {
      await uploadFarmlandSurveyReport(farmlandId, documentId, "Private", privateFiles);
    }
    if (govFiles.length > 0) {
      await uploadFarmlandSurveyReport(farmlandId, documentId, "Gov", govFiles);
    }
    await saveFarmlandDocument(farmlandId, documentId, body);
    enqueueSnackbar('Document Submitted Successfully', {
      variant: 'success',
      anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
    });
    await refreshDocumentData();
    setPrivateFiles([]);
    setGovFiles([]);
    setEditable(false);
  };

  const refreshDocumentData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchDocumentDetails(farmlandId, documentDetails.documentId);
      setDocumentData(res.data); // Ensure state updates
      setReportType(res.data.documentDetails?.reportType || '');
      setPrivateDocuments(Array.isArray(documentData.documentDetails?.privateDocuments) ? documentData.documentDetails.privateDocuments : []);
      setGovtDocuments(Array.isArray(documentData.documentDetails?.govtDocuments) ? documentData.documentDetails.govtDocuments : []);
      setPrivateComments(res.data.documentDetails?.privateComments || '');
      setGovtComments(res.data.documentDetails?.govtComments || '');
      setActivityTimeLine(res.data.activityTimeline);
      setTimelineViewStatus(res.data.timeLineView || false);
      setActiveView(res.data.timeLineView ? 'timeline' : 'file');
    } catch (err) {
      console.log('ERROR:', err);
    } finally {
      setLoading(false);
    }
  }, [farmlandId, documentDetails.documentId, documentData.documentDetails?.privateDocuments, documentData.documentDetails?.govtDocuments]);

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
    const { reviewStatus, approveAccess } = documentDetails;
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
          pt="45px"
          pb={5}
          minHeight="80%"
          alignItems="flex-start"
          position="relative"
        >
          <Box width="40%">

            <FormProvider {...methods}>
              <Stack sx={{ mb: 1 }}>
                <Typography fontWeight="medium" sx={{ mb: 2 }}>Select Survey Report Type</Typography>

                <RadioGroup aria-label="text" name="video_style" value={reportType}

                  onChange={(e) => editable && handleStyleRadioChange(e)}>
                  <FormControlLabel value="Private" control={<Radio />} label="Private Survey Report" />
                  <FormControlLabel value="Government" control={<Radio />} label="Government Survey Report" />
                  <FormControlLabel value="Both" control={<Radio />} label="Both Survey Reports" />
                </RadioGroup>
              </Stack>

            </FormProvider>
          </Box>

          {(reportType === 'Private' || reportType === 'Both') &&
            <Box width="100%">

              <Typography fontWeight="medium" sx={{ mb: 2 }}>Private Survey Report</Typography>

              <Stack
                // bgcolor="white"
                borderRadius="10px"
                mt="20px"
                px="20px"
                // py="45px"
                minHeight="80%"
                direction="row"
                alignItems="flex-start"
                justifyContent="space-between"
                position="relative"
              >
                <Box>
                  {editable &&
                    <Typography fontWeight="medium">Upload Files:</Typography>}
                  {!editable && <Typography fontWeight="medium">Uploaded Files:</Typography>}
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
                      onClick={handleOnPrivateClickUpload}
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
                        Formats: PDF
                      </Typography>
                      <Typography fontSize="12px" color="#9B9B9B">
                        Maximum size: 10 MB
                      </Typography>
                    </Stack>
                  </Stack>}
                  <Box mt="30px">
                    {privateFiles && privateFiles?.length > 0
                      ? [...Array.from(privateFiles)].map((item, idx) => (
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
                              src="/assets/icons/field-officer/pdf.svg"
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
                            onClick={() => handleOnRemove(item.name)}
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

                    {privateDocuments && privateDocuments?.length > 0
                      ? [...Array.from(privateDocuments)].map((item, idx) => (
                        <Stack
                          key={idx}
                          width="400px"
                          height="70px"
                          alignItems="center"
                          flexDirection="row"
                          justifyContent='space-between'
                          bgcolor="#F1F1FF"
                          mb="20px"
                          borderRadius="5px"
                          px="12px"
                        >
                          <Stack direction='row' alignItems='center'>
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
                            <Typography fontSize="14px">
                              {item.split('/').pop()}
                            </Typography>
                          </Stack>
                          <Stack direction='row' justifyContent='flex-end' spacing={1}>
                            <Stack
                              width="30px"
                              height="30px"
                              bgcolor="white"
                              borderRadius="4px"
                              alignItems="center"
                              justifyContent="center"
                              ml="auto"
                              sx={{ cursor: 'pointer' }}
                              onClick={() => handleOnClickDownload(item)}
                            >
                              <Image
                                src="/assets/images/download.png"
                                width={40}
                                height={40}
                                alt="delete"
                              />
                            </Stack>

                            {Boolean(editAccess) && <Stack
                              width="30px"
                              height="30px"
                              bgcolor="white"
                              borderRadius="4px"
                              alignItems="center"
                              justifyContent="center"
                              ml="auto"
                              sx={{ cursor: 'pointer' }}
                              onClick={() => handleOnRemove(item.split('/').pop() || '')}
                            >
                              <Image
                                src="/assets/icons/field-officer/delete.svg"
                                width={11}
                                height={11}
                                alt="delete"
                              />
                            </Stack>}
                          </Stack>
                        </Stack>
                      ))
                      : null}

                  </Box>
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
                    value={privateComments}
                    readOnly={!editable}
                    onChange={(e) => setPrivateComments(e.target.value)}
                    placeholder="Add your comments"
                  />
                </Box>

                <input
                  type="file"
                  id="upload-private-file"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const f = e.target.files;

                    if (f) {
                      for (let i = 0; i < f.length; i += 1) {
                        const item = f.item(i);

                        if (item) {
                          setPrivateFiles((prev) => [...prev, item]);
                        }
                      }
                    }
                  }}
                  multiple
                />

              </Stack>
            </Box>}

          {(reportType === 'Government' || reportType === 'Both') &&
            <Box width="100%">
              <Typography fontWeight="medium" sx={{ mb: 2 }}>Government Survey Report</Typography>

              <Stack
                // bgcolor="white"
                borderRadius="10px"
                mt="20px"
                px="20px"
                // py="45px"
                minHeight="80%"
                direction="row"
                alignItems="flex-start"
                justifyContent="space-between"
                position="relative"
              >
                <Box>
                  {editable &&
                    <Typography fontWeight="medium">Upload Files:</Typography>}
                  {!editable && <Typography fontWeight="medium">Uploaded Files:</Typography>}
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
                      onClick={handleOnGovtClickUpload}
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
                        Formats: PDF
                      </Typography>
                      <Typography fontSize="12px" color="#9B9B9B">
                        Maximum size: 10 MB
                      </Typography>
                    </Stack>
                  </Stack>}
                  <Box mt="30px">
                    {govFiles && govFiles?.length > 0
                      ? [...Array.from(govFiles)].map((item, idx) => (
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
                              src="/assets/icons/field-officer/pdf.svg"
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
                            onClick={() => handleOnRemove(item.name)}
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
                    {govtDocuments && govtDocuments?.length > 0
                      ? [...Array.from(govtDocuments)].map((item, idx) => (
                        <Stack
                          key={idx}
                          width="400px"
                          height="70px"
                          alignItems="center"
                          flexDirection="row"
                          justifyContent='space-between'
                          bgcolor="#F1F1FF"
                          mb="20px"
                          borderRadius="5px"
                          px="12px"
                        >
                          <Stack direction='row' alignItems='center'>
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
                            <Typography fontSize="14px">
                              {item.split('/').pop()}
                            </Typography>
                          </Stack>
                          <Stack direction='row' justifyContent='flex-end' spacing={1}>
                            <Stack
                              width="30px"
                              height="30px"
                              bgcolor="white"
                              borderRadius="4px"
                              alignItems="center"
                              justifyContent="center"
                              ml="auto"
                              sx={{ cursor: 'pointer' }}
                              onClick={() => handleOnClickDownload(item)}
                            >
                              <Image
                                src="/assets/images/download.png"
                                width={40}
                                height={40}
                                alt="delete"
                              />
                            </Stack>

                            {Boolean(editAccess) && <Stack
                              width="30px"
                              height="30px"
                              bgcolor="white"
                              borderRadius="4px"
                              alignItems="center"
                              justifyContent="center"
                              ml="auto"
                              sx={{ cursor: 'pointer' }}
                              onClick={() => handleOnRemove(item.split('/').pop() || '')}
                            >
                              <Image
                                src="/assets/icons/field-officer/delete.svg"
                                width={11}
                                height={11}
                                alt="delete"
                              />
                            </Stack>}
                          </Stack>
                        </Stack>
                      ))
                      : null}
                  </Box>
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
                    value={govtComments}
                    readOnly={!editable}
                    onChange={(e) => setGovtComments(e.target.value)}
                    placeholder="Add your comments"
                  />
                </Box>

                <input
                  type="file"
                  id="upload-govt-file"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const f = e.target.files;

                    if (f) {
                      for (let i = 0; i < f.length; i += 1) {
                        const item = f.item(i);

                        if (item) {
                          setGovFiles((prev) => [...prev, item]);
                        }
                      }
                    }
                  }}
                  multiple
                />
              </Stack>
            </Box>}

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

export default SurveyReportForm;
