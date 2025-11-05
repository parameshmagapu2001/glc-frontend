'use client';

import {
  Stack,
  Step,
  StepConnector,
  stepConnectorClasses,
  StepIconProps,
  StepLabel,
  Stepper,
  styled,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from '@mui/material';
import Image from 'next/image';
import React, { useContext, useState } from 'react';
import { FarmlandData } from 'src/types/farmlands';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { AuthContext } from 'src/auth/context';

interface Props {
  id?: number;
  activeStep: number;
  farmlandData?: FarmlandData;
  onStepClick: (stepIndex: number, documentSetId: number) => void;
}

const getColor = (
  status: string,
  idx: number,
  activeStep: number,
  type: string,
  roleId: number,
  reviewStatus: string
) => {
  if (activeStep === idx) {
    if (type === 'bg') return '#E5E4FF';
    if (type === 'text' || type === 'border') return '#8280FF';
  }

  const isPendingReviewer =
    (roleId === 1 || roleId === 4 || roleId === 5 || roleId === 6) && reviewStatus?.toLowerCase() === 'pending';

  if (isPendingReviewer) {
    if (type === 'bg') return '#FFF';
    if (type === 'text') return '#FFD311';
    return '#FFD311';
  }

  if (status?.toLowerCase() === 'completed') {
    if (type === 'bg') return '#FFFFFF33';
    if (type === 'text') return '#0CA00C';
    return '#0CA00C';
  }

  if (status?.toLowerCase() === 'turnback') {
    if (type === 'bg') return '#FFF';
    if (type === 'text') return '#0CA00C';
    return '#0CA00C';
  }

  if (type === 'bg') return '#FFF';
  if (type === 'text') return '#0CA00C';
  return '#0CA00C';
};


const StepIconComp = (props: StepIconProps & { documentsStatus: string; reviewStatus: string; userRoleId: number }) => {
  const { active, documentsStatus, reviewStatus, userRoleId } = props;
  const color = active ? '#8280FF' : '#0000004D';

  const renderImages = () => {
    if (reviewStatus === 'Pending' && (userRoleId === 1 || userRoleId === 4 || userRoleId === 5 || userRoleId === 6)) {
      return <Image src="/assets/images/warning.png" width={18} height={18} alt="check" />;
    }
    if (documentsStatus === 'Completed') {
      return <Image src="/assets/icons/field-officer/check-green.svg" width={18} height={18} alt="check" />;
    }
    if (documentsStatus === 'Turnback') {
      return <Image src="/assets/images/questionMark.png" width={18} height={18} alt="check" />;
    }

    return <Box width="18px" height="18px" borderRadius={999} bgcolor={color} />;
  };

  return (
    <Stack
      width="24px"
      height="24px"
      borderRadius={999}
      alignItems="center"
      justifyContent="center"
      border={`1px solid ${color}`}
    >
      {renderImages()}
    </Stack>
  );
};

const CustomConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.vertical}`]: {
    marginLeft: 20,
    '& .MuiStepConnector-line': {
      borderLeftWidth: 3,
      borderColor: '#A0A0A0',
      minHeight: 40,
    },
  },
}));

const FarmlandDocumentSets: React.FC<Props> = ({ id, activeStep, farmlandData, onStepClick }) => {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const handleBackClick = () => {
    setOpenConfirmModal(true);
  };

  const handleStay = () => {
    setOpenConfirmModal(false);
  };

  const handleLeaveAndDiscard = () => {
    goToMainPage();
  };

  const goToMainPage = () => {
    if (user?.role_id === 9) {
      router.push(paths.fo.root);
    } else if (user?.role_id === 11) {
      router.push(paths.ccs.root);
    } else if (user?.role_id === 7) {
      router.push(paths.ro.root);
    } else if (user?.role_id === 8) {
      router.push(paths.io.root);
    } else if (user?.role_id === 4 || user?.role_id === 5 || user?.role_id === 6) {
      router.push(paths.vo.root);
    } else if (user?.role_id === 1) {
      router.push(paths.superAdmin.root);
    }
  };

  return (
    <>
      <Stack px="20px" py="30px" bgcolor="white" borderRadius="10px" width="20%" minHeight="100%">
        <Stack direction="row" spacing="15px" pb="15px" borderBottom="1px solid #DFDFDF">
          <Image
            onClick={handleBackClick}
            src="/assets/images/backArrow.png"
            width={14}
            height={14}
            alt="back"
            style={{ cursor: 'pointer' }}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            onClick={handleBackClick}
            sx={{ cursor: 'pointer' }}
          >
            Dashboard
          </Typography>
        </Stack>

        <Stack mt="55px" alignItems="center">
          {id && (
            <>
              <Typography>Farmland ID:</Typography>
              <Typography variant="h6">{farmlandData?.farmlandCode}</Typography>
            </>
          )}

          {user?.role_id !== 1 && (
            <Image
              src="/assets/images/farmLandForm.png"
              width={307}
              height={205}
              alt="create-farmland"
              style={{ objectFit: 'cover', marginBottom: '55px', marginTop: '30px' }}
            />
          )}

          <Stepper orientation="vertical" sx={{ width: '100%' }} connector={<CustomConnector />}>
            {farmlandData?.documentSets.map((item, index) => (
              <Step key={item.documentSetId}>
                <StepLabel
                  style={{ cursor: 'pointer' }}
                  StepIconComponent={(props) => (
                    <StepIconComp
                      {...props}
                      documentsStatus={item.documentsStatus}
                      reviewStatus={item.reviewStatus}
                      userRoleId={user?.role_id}
                    />
                  )}
                  sx={{
                    bgcolor: getColor(
                      item.documentsStatus,
                      index,
                      activeStep,
                      'bg',
                      user?.role_id,
                      item.reviewStatus
                    ),
                    border: `1px solid ${getColor(
                      item.documentsStatus,
                      index,
                      activeStep,
                      'border',
                      user?.role_id,
                      item.reviewStatus
                    )}`,
                    borderRadius: '999px',
                    px: '10px',
                  }}
                  onClick={() => onStepClick(index, item.documentSetId)}
                >
                  <Typography
                    color={getColor(
                      item.documentsStatus,
                      index,
                      activeStep,
                      'text',
                      user?.role_id,
                      item.reviewStatus
                    )}
                  >
                    {item.documentSet}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Stack>
      </Stack>

      {/* Confirmation Dialog */}
      <Dialog open={openConfirmModal} onClose={handleStay}>
        <DialogTitle>Leave page?</DialogTitle>
        <DialogContent>
          <Typography>Any changes you haven’t saved will be discarded</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStay}>Stay</Button>
          <Button onClick={handleLeaveAndDiscard} color="error">
            Leave and discard
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FarmlandDocumentSets;

