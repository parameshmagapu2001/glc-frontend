'use client';

import { Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useSettingsContext } from 'src/components/settings';
import { getFarmlandDocumentSets } from 'src/api/farmlands';
import { FarmlandData } from 'src/types/farmlands';
import FarmlandDocumentSets from './farmland-document-sets';
import DocumentSetView from './document-set-view';

type Props = {
  farmlandId: number;
};

function FarmlandDocumentTemplate({ farmlandId }: Props) {
  const [farmlandData, setFarmlandData] = useState<FarmlandData>();
  const [activeStep, setActiveStep] = useState(0);
  const [documentSetId, setDocumentSetId] = useState(1);
  const [totalSets, setTotalSets] = useState(0);

  const fetchDocumentSets = useCallback(async () => {
    try {
      const res = await getFarmlandDocumentSets(farmlandId);
      console.log('Fetched document sets:', res.data);
      if (res.data) {
        setFarmlandData(res.data);
        setTotalSets(res.data.documentSets.length);
        console.log('Total sets:', res.data.documentSets.length);
        for (let i = 0; i < res.data.documentSets.length; i += 1) {
          if (res.data.documentSets[i].documentsStatus.toLowerCase() === 'pending') {
            setActiveStep(i);
            setDocumentSetId(res.data.documentSets[i].documentSetId);
            console.log('Active step set to:', res.data.documentSets[i].documentSetId);
            break;
          }
        }
      }
    } catch (err) {
      console.log('ERROR: ', err);
    }
  }, [farmlandId]);

  const onNextStep = useCallback(async () => {
    try {
      const res = await getFarmlandDocumentSets(farmlandId);
      console.log('Fetched document sets:', res.data);
      if (res.data) {
        setFarmlandData(res.data);
      }
      console.log('Current activeStep:', activeStep, 'Total sets:', totalSets);
      const nextStep = activeStep + 1;
      if (nextStep >= totalSets) {
        setActiveStep(0);
        setDocumentSetId(res.data.documentSets[0].documentSetId);
      } else {
        setActiveStep(nextStep);
        setDocumentSetId(res.data.documentSets[nextStep].documentSetId);
      }
    } catch (err) {
      console.log('ERROR: ', err);
    }
  }, [activeStep, totalSets, farmlandId]);

  const handleStepClick = (stepIndex: number, docSetId: number) => {
    setActiveStep(stepIndex);
    setDocumentSetId(docSetId);
  };

  useEffect(() => {
    fetchDocumentSets();
  }, [fetchDocumentSets]);

  return (

    <Stack direction="row" spacing="20px" py="20px" minHeight="100vh">
      <FarmlandDocumentSets
        id={farmlandId}
        activeStep={activeStep}
        farmlandData={farmlandData}
        onStepClick={handleStepClick}
      />
      <Stack width="80%" spacing="20px" minHeight="100%" style={{ height: "100%" }}>
        <DocumentSetView
          documentSetId={documentSetId}
          farmlandId={farmlandId}
          areaId={farmlandData?.areaId || 0}
          fetchDocumentSets={onNextStep}
        />
      </Stack>
    </Stack>
  )
}

export default FarmlandDocumentTemplate;
