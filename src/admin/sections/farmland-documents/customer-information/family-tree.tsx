import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { fetchDocumentDetails, saveFarmlandDocument } from 'src/api/farmlands';
import { FarmlandDocumentBody, FarmlandDocuments } from 'src/types/farmlands';
import { useBoolean } from 'src/hooks/use-boolean';
import TimelineButtonView from '../timeline-buttons';


// -----------------------------------------------------------------------------------------
interface FamilyMember {
  relationShip: string;
  name: string;
  age: string;
  gender?: string;
}

interface Props {
  documentIndex: number;
  document: FarmlandDocuments;
  farmlandId: number;
  onNext: (index: number) => void;
}

const MemberCard = ({
  member,
  showGender = false,
  allMembers,
  setAllMembers,
  setMember,
  editable,
}: {
  member: FamilyMember;
  showGender?: boolean;
  allMembers?: FamilyMember[];
  setMember?: (val: FamilyMember) => void;
  setAllMembers?: (val: FamilyMember[]) => void;
  editable: boolean;
}) => (
  <Card
    sx={{
      p: 0.5,
      width: '140px',
      bgcolor: '#fff',
      borderRadius: '8px',
      boxShadow: 'none',
      border: '1px solid #e0e0e0',
    }}
  >
    <Box
      sx={{
        mb: 0.5,
        fontWeight: 'bold',
        bgcolor: '#cb9404',
        color: '#fff',
        px: 1,
        borderRadius: '4px',
      }}
    >
      <Typography variant="caption">{member?.relationShip}</Typography>
    </Box>

    <TextField
      fullWidth
      size="small"
      placeholder={`${member?.relationShip} Name`}
      value={member?.name || ''}
      inputProps={{
        readOnly: !editable,
      }}
      onChange={(e) => {
        const inputValue = e.target.value;
        // Only update if the input matches letters and spaces
        if (/^[a-zA-Z\s]*$/.test(inputValue)) {
          if (allMembers && allMembers?.length > 0) {
            const newMembers = [...allMembers];
            const index = allMembers.indexOf(member);
            newMembers[index] = { ...member, name: inputValue };
            setAllMembers?.(newMembers);
          } else {
            setMember?.({ ...member, name: inputValue });
          }
        }
      }}
      onBlur={(e) => {
        const inputValue = e.target.value.trim();
        if (/^[a-zA-Z\s]*$/.test(inputValue)) {
          if (allMembers && allMembers?.length > 0) {
            const newMembers = [...allMembers];
            const index = allMembers.indexOf(member);
            newMembers[index] = { ...member, name: inputValue };
            setAllMembers?.(newMembers);
          } else {
            setMember?.({ ...member, name: inputValue });
          }
        }
      }}
      sx={{ mb: 0.5 }}
    />

    <TextField
      fullWidth
      size="small"
      placeholder="Age"
      value={member?.age || ''} // Ensure value is never undefined
      inputProps={{
        readOnly: !editable,
        inputMode: 'numeric', // Shows numeric keyboard on mobile
      }}
      onChange={(e) => {
        const inputValue = e.target.value;
        // Only update if the input matches numbers (and empty string)
        if (/^\d*$/.test(inputValue)) {
          if (allMembers && allMembers?.length > 0) {
            const newMembers = [...allMembers];
            const index = allMembers.indexOf(member);
            newMembers[index] = { ...member, age: inputValue };
            setAllMembers?.(newMembers);
          } else {
            setMember?.({ ...member, age: inputValue });
          }
        }
      }}
      onBlur={(e) => {
        // Optional: Add validation or formatting when leaving the field
        const inputValue = e.target.value;
        if (inputValue && !/^\d+$/.test(inputValue)) {
          // If you want to clear invalid input on blur
          if (allMembers && allMembers?.length > 0) {
            const newMembers = [...allMembers];
            const index = allMembers.indexOf(member);
            newMembers[index] = { ...member, age: '' };
            setAllMembers?.(newMembers);
          } else {
            setMember?.({ ...member, age: '' });
          }
        }
      }}
      sx={{ mb: showGender ? 0.5 : 0 }}
    />

    {showGender && (
      <Select
        fullWidth
        size="small"
        displayEmpty
        value={member?.gender || ''}
        inputProps={{
          readOnly: !editable,
        }}
        onChange={(e) => {
          if (allMembers && allMembers?.length > 0) {
            const newMembers = [...allMembers];
            const index = allMembers.indexOf(member);
            newMembers[index] = { ...member, gender: e.target.value };
            if (setAllMembers) {
              setAllMembers(newMembers);
            }
          }
        }}
      >
        <MenuItem value="">Gender</MenuItem>
        <MenuItem value="Male">Male</MenuItem>
        <MenuItem value="Female">Female</MenuItem>
      </Select>
    )}
  </Card>
);

const ProfileIcon = () => (
  <Box
    sx={{
      width: 24,
      height: 24,
      borderRadius: '50%',
      bgcolor: '#1976d2',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
    }}
  >
    <span style={{ fontSize: '12px' }}>👤</span>
  </Box>
);

function FamilyTree({ document, farmlandId, documentIndex, onNext }: Props) {
  const confirm = useBoolean();
  const [editable, setEditable] = useState<boolean>(document.documentStatus === 'Pending');
  const [loading, setLoading] = useState(false);
  const [documentData, setDocumentData] = useState(document);
  const [cancelButton, setCancelButton] = useState(false);
  const [timelineViewStatus, setTimelineViewStatus] = useState(false);
  const [activeView, setActiveView] = useState(timelineViewStatus ? 'timeline' : 'file');
  const [father, setFather] = useState<FamilyMember>({ relationShip: 'Father', name: '', age: '' });
  const [mother, setMother] = useState<FamilyMember>({ relationShip: 'Mother', name: '', age: '' });
  const [wives, setWives] = useState<FamilyMember[]>([{ relationShip: 'Wife', name: '', age: '' }]);
  const [children, setChildren] = useState<FamilyMember[]>([
    { relationShip: 'Children', name: '', age: '', gender: '' },
  ]);
  const [siblings, setSiblings] = useState<FamilyMember[]>([
    { relationShip: 'Sibling', name: '', age: '', gender: '' },
  ]);

  const addMember = (relationShip: string) => {
    const newMember = { relationShip, name: '', age: '', gender: '' };
    if (relationShip === 'Children') {
      setChildren([...children, newMember]);
    } else if (relationShip === 'Wife') {
      setWives([...wives, newMember]);
    } else if (relationShip === 'Sibling') {
      setSiblings([...siblings, newMember]);
    }
  };

  const removeMember = (type: string, index: number) => {
    if (type === 'Children') {
      const newChildren = [...children];
      newChildren.splice(index, 1);
      setChildren(newChildren);
    } else if (type === 'Wife') {
      const newWives = [...wives];
      newWives.splice(index, 1);
      setWives(newWives);
    } else if (type === 'Sibling') {
      const newSiblings = [...siblings];
      newSiblings.splice(index, 1);
      setSiblings(newSiblings);
    }
  };

  const setEditMode = async () => {
    setEditable(true);
    setCancelButton(true);
  };

  const onCancelEdit = async () => {
    setEditable(false);
    setCancelButton(false);
  };

  const onSave = async () => {
    try {
      if (father.name === null || father.age === null) {
        enqueueSnackbar('Father details required', {
          variant: 'error',
          anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
        });
        return;
      }

      if (mother.name === null || mother.age === null) {
        enqueueSnackbar('Mother details required', {
          variant: 'error',
          anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
        });
        return;
      }

      const body: FarmlandDocumentBody = {
        documentId: document.documentId,
        documentName: document.documentName,
        documentStatus: document.documentStatus,
        documentDetails: {
          father,
          mother,
          siblings,
          wifes: wives,
          childrens: children,
        },
      };

      await saveFarmlandDocument(farmlandId, document.documentId, body);
      enqueueSnackbar('Family details have been saved to drafts', {
        variant: 'success',
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
      });
      refreshDocumentData();
      setEditable(false);
    } catch (err) {
      console.log('ERROR: ', err);
    }
  };

  const refreshDocumentData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchDocumentDetails(farmlandId, documentData.documentId);
      setDocumentData(res.data.documentDetails);
    } catch (err) {
      console.log('ERROR:', err);
    } finally {
      setLoading(false);
    }
  }, [farmlandId, documentData.documentId]);

  useEffect(() => {
    if (document.documentDetails) {
      setFather(document.documentDetails?.father as never as FamilyMember);
      setMother(document.documentDetails?.mother as never as FamilyMember);
      setChildren(document.documentDetails?.childrens as never as FamilyMember[]);
      setWives(document.documentDetails?.wifes as never as FamilyMember[]);
      setSiblings(document.documentDetails?.siblings as never as FamilyMember[]);
    }
  }, [document, farmlandId]);

  const renderButtons = () => {
    const { reviewStatus, approveAccess, editAccess } = document;
    if (reviewStatus === 'Approved' || reviewStatus === 'Rejected') {
      return (
        <Grid xs={12} md={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            color="inherit"
            size="medium"
            sx={{ mr: 2, borderRadius: 10 }}
            disabled={documentIndex === 0}
            onClick={() => onNext(documentIndex - 1)}
          >
            {' '}
            Back{' '}
          </Button>
          <Button
            variant="contained"
            size="medium"
            color="primary"
            sx={{ borderRadius: 10 }}
            onClick={() => onNext(documentIndex + 1)}
          >
            Next
          </Button>
        </Grid>
      );
    }

    if (reviewStatus === 'Pending') {
      if (!approveAccess) {
        return (
          <Grid xs={12} md={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {!editable ? (
              <>
                {editAccess ? (
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="medium"
                    sx={{ mr: 2, borderRadius: 10 }}
                    onClick={setEditMode}
                  >
                    Edit
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="medium"
                    sx={{ mr: 2, borderRadius: 10 }}
                    disabled={documentIndex === 0}
                    onClick={() => onNext(documentIndex - 1)}
                  >
                    {' '}
                    Back{' '}
                  </Button>
                )}
                <Button
                  variant="contained"
                  size="medium"
                  color="primary"
                  sx={{ borderRadius: 10 }}
                  onClick={() => onNext(documentIndex + 1)}
                >
                  Next
                </Button>
              </>
            ) : (
              <>
                {cancelButton && (
                  <Button
                    variant="outlined"
                    size="medium"
                    color="error"
                    sx={{ mr: 2, borderRadius: 10 }}
                    onClick={onCancelEdit}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="button"
                  variant="contained"
                  size="medium"
                  color="primary"
                  sx={{ borderRadius: 10 }}
                  onClick={onSave}
                >
                  Save
                </Button>
              </>
            )}
          </Grid>
        );
      }

      // this is the previous `else` block, just moved outside the `if`
      return (
        <Grid xs={12} md={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            color="inherit"
            size="medium"
            sx={{ mr: 2, borderRadius: 10 }}
            disabled={documentIndex === 0}
            onClick={() => onNext(documentIndex - 1)}
          >
            {' '}
            Back{' '}
          </Button>
          <Button
            variant="contained"
            size="medium"
            color="primary"
            sx={{ borderRadius: 10 }}
            onClick={() => onNext(documentIndex + 1)}
          >
            Next
          </Button>
        </Grid>
      );
    }

    return null;

  }

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

      {activeView === 'file' && (
        <Card sx={{ height: '100%' }}>
          <Box
            sx={{
              p: 2,
              py: 8,
              position: 'relative',
              display: 'flex',
              maxWidth: '100%',
              overflowX: 'auto',
              alignItems: 'flex-start',
              gap: 4,
            }}
          >
            {/* Left side - Parents */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                position: 'relative',
                minWidth: 'fit-content',
              }}
            >
              {/* Father */}
              <Box sx={{ display: 'flex', alignItems: 'top', gap: 2 }}>
                <Image
                  src="/assets/images/fatherImg.svg"
                  alt="sibling-img"
                  width={38}
                  height={38}
                />
                <MemberCard
                  member={father}
                  setMember={(val) => setFather(val)}
                  editable={editable}
                />
              </Box>

              {/* Vertical line from father to mother */}
              <Box
                sx={{
                  position: 'absolute',
                  left: 15,
                  top: 31,
                  height: 225,
                  width: 2,
                  bgcolor: '#1976d2',
                }}
              />

              {/* Profile icon in the middle (between father and mother) */}
              <Box
                sx={{
                  position: 'absolute',
                  left: -8,
                  top: 160,
                }}
              >
                <Image src="/assets/images/sonImg.svg" alt="sibling-img" width={45} height={45} />
              </Box>

              {/* Mother */}
              <Box sx={{ display: 'flex', alignItems: 'top', gap: 2, mt: 10 }}>
                <Image
                  src="/assets/images/motherImg.svg"
                  alt="sibling-img"
                  width={38}
                  height={38}
                />
                <MemberCard
                  member={mother}
                  setMember={(val) => setMother(val)}
                  editable={editable}
                />
              </Box>
            </Box>

            {/* Wife section */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                marginTop: 16,
                position: 'relative',
                minWidth: 'fit-content',
              }}
            >
              {/* Horizontal line from center to wives */}
              <Box
                sx={{
                  position: 'absolute',
                  left: -194,
                  top: 53,
                  width: 200,
                  height: 2,
                  bgcolor: '#1976d2',
                }}
              />

              {wives?.map((wife, index) => (
                <Box
                  key={index}
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'top', mt: 5 }}>
                    <Image
                      src="/assets/images/wifeImg.svg"
                      alt="sibling-img"
                      width={38}
                      height={38}
                    />
                    <Box
                      sx={{
                        left: -190,
                        mt: 1.5,
                        width: 20,
                        height: 2,
                        bgcolor: '#1976d2',
                      }}
                    />
                    <Box sx={{ position: 'relative' }}>
                      <MemberCard
                        member={wife}
                        allMembers={wives}
                        setAllMembers={(val) => setWives(val)}
                        editable={editable}
                      />
                      {index > 0 && (
                        <IconButton
                          onClick={() => removeMember('Wife', index)}
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: -6,
                            right: -6,
                            padding: '2px',
                            minWidth: '16px',
                            minHeight: '16px',
                            bgcolor: '#fff',
                            border: '1px solid #e0e0e0',
                            '&:hover': { bgcolor: '#f5f5f5' },
                          }}
                        >
                          <CloseIcon sx={{ fontSize: 12 }} />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                  {editable && index === wives.length - 1 && (
                    <IconButton onClick={() => addMember('Wife')} size="small">
                      <AddCircleOutlineIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
            </Box>

            {/* Children section */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                marginTop: 14,
                position: 'relative',
                minWidth: 'fit-content',
              }}
            >
              {/* Horizontal line from center to children */}

              <Box
                sx={{
                  position: 'absolute',
                  left: -33,
                  top: 65,
                  width: 30,
                  height: 2,
                  bgcolor: '#1976d2',
                }}
              />

              {children?.map((child, index) => (
                <Box
                  key={index}
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'top', mt: 6.5, ml: -1 }}>
                    <Image
                      src="/assets/images/childrenImg.svg"
                      alt="sibling-img"
                      width={38}
                      height={38}
                    />
                    <Box
                      sx={{
                        left: -190,
                        top: 300,
                        mt: 1.5,
                        width: 20,
                        height: 2,
                        bgcolor: '#1976d2',
                      }}
                    />
                    <Box sx={{ position: 'relative' }}>
                      <MemberCard
                        member={child}
                        allMembers={children}
                        setAllMembers={(val) => setChildren(val)}
                        showGender
                        editable={editable}
                      />
                      {index > 0 && (
                        <IconButton
                          onClick={() => removeMember('Children', index)}
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: -6,
                            right: -6,
                            padding: '2px',
                            minWidth: '16px',
                            minHeight: '16px',
                            bgcolor: '#fff',
                            border: '1px solid #e0e0e0',
                            '&:hover': { bgcolor: '#f5f5f5' },
                          }}
                        >
                          <CloseIcon sx={{ fontSize: 12 }} />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                  {editable && index === children.length - 1 && (
                    <IconButton onClick={() => addMember('Children')} size="small">
                      <AddCircleOutlineIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
            </Box>

            {/* Siblings section */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                marginTop: 14,
                position: 'relative',
                minWidth: 'fit-content',
              }}
            >
              {/* Horizontal line from center to siblings */}
              <Box
                sx={{
                  position: 'absolute',
                  left: -33,
                  top: 65,
                  width: 30,
                  height: 2,
                  bgcolor: '#1976d2',
                }}
              />

              {siblings?.map((sibling, index) => (
                <Box
                  key={index}
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'top', ml: -1, mt: 6.5 }}>
                    <Image
                      src="/assets/images/siblingImg.svg"
                      alt="sibling-img"
                      width={38}
                      height={38}
                    />
                    <Box
                      sx={{
                        left: -190,
                        top: 300,
                        mt: 1.5,
                        width: 20,
                        height: 2,
                        bgcolor: '#1976d2',
                      }}
                    />
                    <Box sx={{ position: 'relative' }}>
                      <MemberCard
                        member={sibling}
                        allMembers={siblings}
                        setAllMembers={(val) => setSiblings(val)}
                        showGender
                        editable={editable}
                      />
                      {index > 0 && (
                        <IconButton
                          onClick={() => removeMember('Sibling', index)}
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: -6,
                            right: -6,
                            padding: '2px',
                            minWidth: '16px',
                            minHeight: '16px',
                            bgcolor: '#fff',
                            border: '1px solid #e0e0e0',
                            '&:hover': { bgcolor: '#f5f5f5' },
                          }}
                        >
                          <CloseIcon sx={{ fontSize: 12 }} />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                  {editable && index === siblings.length - 1 && (
                    <IconButton onClick={() => addMember('Sibling')} size="small">
                      <AddCircleOutlineIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
          <Stack sx={{ p: 2, mt: 13 }}>{renderButtons()}</Stack>
        </Card>
      )}
    </>
  );
}

export default FamilyTree;