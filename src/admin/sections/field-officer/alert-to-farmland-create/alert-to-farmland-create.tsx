'use client';

import { Box, Card, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'src/routes/hooks';
import { IFarmlandAlert } from 'src/types/farmlands';
import { getAlertDetails } from 'src/api/field-officer';
import { paths } from 'src/routes/paths';
import AlertToFarmLandFarm from './alert-to-farmland-form';
import CreateAlertToFarmlandStepper from './create-alert-to-farmland-stepper';
// ----------------------------------------------------------------------

type Props = {
  alertId: string;
};

function AlertToFarmlandCreate({ alertId }: Props) {

  const router = useRouter();

  const [activeStep, setActiveStep] = useState(0);

  const [alert, setAlert] = useState<IFarmlandAlert>();

  const [alertsLoading, setAlertsLoading] = useState(false);

  const [alertsEmpty, setAlertsEmpty] = useState(false);

  useEffect(() => {
    const fetchAlertDetails = async (alert_id: string) => {
      setAlertsLoading(true);
      try {
        if(parseInt(alert_id, 10) > 0 ){
          const response = await getAlertDetails(alert_id);
          const alerts: IFarmlandAlert = response.data;
          if (alerts.farmlandCode) {
            router.push(paths.fo.documents(alerts.farmlandId));
          }
          setAlert(alerts);
        }else{
          setAlert({
            "firstName": "",
            "lastName": "",
            "contactEmail": "",
            "contactNumber": "",
            "dob": "",
            "gender": "0",
            "landCost": 0,
            "landLatitude": "",
            "landLongitude": "",
            "religion": "0",
          } as IFarmlandAlert)
        }
      } catch (error) {
        console.error(error);
        setAlertsEmpty(true);
      } finally {
        setAlertsLoading(false);
      }
    };

    fetchAlertDetails(alertId); // Make sure to pass the correct ID
  }, [alertId, router]);


  return (
    <Stack direction="row" spacing="20px" py="20px" minHeight="90vh">
      <CreateAlertToFarmlandStepper alertCode={alert?.alertCode as string} />

      <Stack width="80%" spacing={1.5} minHeight="100%">
        <Card sx={{ borderRadius: 1, p: 2 }}>
          <Stack
            key={1}
            direction="row"
            alignItems="center"
            py="10px"
            pl="10px"
            pr="20px"
            borderRadius={10}
            bgcolor="#8280FF4D"
            border="1px solid #8280FF"
            justifyContent="flex-start"
            width="fit-content"
          >
            <Stack
              width="18px"
              height="18px"
              alignItems="center"
              justifyContent="center"
              border="1px solid #8280FF"
              borderRadius="999px"
            >
              <Box width="12px" height="12px" borderRadius="999px" bgcolor="#8280FF" />
            </Stack>
            <Typography ml="10px" color="#8280FF">
              Owner Details
            </Typography>
          </Stack>
        </Card>

        {alert && <AlertToFarmLandFarm
          selectedFarmland={alert}
          isCompleted={false}
        />}
      </Stack>
    </Stack>
  );
}

export default AlertToFarmlandCreate;
