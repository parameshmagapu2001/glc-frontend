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
} from '@mui/material';
import { Box } from '@mui/system';
import Image from 'next/image';
import React from 'react';
import { useRouter } from 'next/navigation';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

const documentSets = ['Customer Information'];

const StepIconComp = (props: StepIconProps) => {
  const { active } = props;

  const color = active ? '#8280FF' : '#0000004D';

  return (
    <Stack
      width="24px"
      height="24px"
      borderRadius={999}
      alignItems="center"
      justifyContent="center"
      border={`1px solid ${color}`}
    >
      <Box width="18px" height="18px" borderRadius={999} bgcolor={color} />
    </Stack>
  );
};

const CustomConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.vertical}`]: {
    marginLeft: 20, // Center align with step buttons
    '& .MuiStepConnector-line': {
      borderLeftWidth: 3,
      borderColor: '#A0A0A0',
      minHeight: 40, // Minimum height between steps
    },
  },
}));

const StepperComp: React.FC = () => (
  <Stepper orientation="vertical" sx={{ width: '100%' }} connector={<CustomConnector />}>
    {documentSets.map((item, idx) => (
      <Step key={1}>
        <StepLabel
          StepIconComponent={StepIconComp}
          sx={{
            bgcolor: '#8D89CC66',
            borderRadius: '999px',
            px: '10px',
          }}
        >
          <Typography color="#8280FF">{item}</Typography>
        </StepLabel>
      </Step>
    ))}
  </Stepper>
);

type Props = {
  alertCode: string;
};

const CreateAlertToFarmlandStepper: React.FC<Props> = ({ alertCode }) => {
  const router = useRouter();

  const goToMainPage = () => {
    router.push(paths.fo.root);
  };

  return (
    <Stack px="20px" py="30px" bgcolor="white" borderRadius="10px" width="20%" minHeight="100%">
      <Stack
        direction="row"
        spacing="15px"
        pb="15px"
        borderBottom="1px solid #DFDFDF"
        onClick={goToMainPage}
        sx={{ cursor: 'pointer' }}
      >
        <Image src="/assets/images/backArrow.png" width={14} height={14} alt="back" />
        <Typography variant="body2" color="text.secondary">
          Dashboard
        </Typography>
      </Stack>
      <Stack mt="55px" alignItems="center">
        {alertCode ? (
          <>
            <Typography>Alert ID:</Typography>
            <Typography variant="h6">{alertCode}</Typography>
          </>
        ) : (
          <>
            <Typography>Create</Typography>
            <Typography variant="h6">New FarmLand</Typography>
          </>
        )}
        <Image
          src="/assets/images/farmLandForm.png"
          width={307}
          height={205}
          alt="create-farmland"
          style={{ objectFit: 'cover', marginBottom: '55px', marginTop: '30px' }}
        />
        <StepperComp
        // activeStep={activeStep}
        // farmlandCode={farmlandCode}
        // setActiveStep={setActiveStep}
        />
      </Stack>
    </Stack>
  );
};

export default CreateAlertToFarmlandStepper;
