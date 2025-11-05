import { Box } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { FarmlandDocuments, FarmlandDocumentsData } from 'src/types/farmlands';
import { getFarmlandDocuments } from 'src/api/farmlands';

import FarmlandDocumentsView from '../farmland-documents-view';
import LandscapeViewForm from './landscape-view-form';
import ShapeOfLandForm from './shape-of-land-form';
import WaterElectricityForm from './water-electricity-form';
import SurveyReportForm from './survey-report-form';
import EastBoundariesForm from './east-boundaries-form';
import WestBoundariesForm from './west-boundaries-form';
import NorthBoundariesForm from './north-boundaries-form';
import SouthBoundariesForm from './south-boundaries-form';
import LandImagesForm from './land-images-form';
// ----------------------------------------------------------------------
interface Props {
  farmlandId: number;
  documentsData: FarmlandDocumentsData | any;
  refreshDocumentSets: () => void;
}

function LandBoundaries({ farmlandId, documentsData, refreshDocumentSets }: Props) {

  const [activeStep, setActiveStep] = useState<number>(documentsData.documents[0].documentId);

  const [documentIndex, setDocumentIndex] = useState<number>(0);

  const [loading, setLoading] = useState(false);

  const [documents, setDocuments] = useState<FarmlandDocuments[]>(documentsData.documents);

  console.log(documentsData.documents)

  useEffect(() => {
    setDocuments(documentsData.documents);
    for (let i = 0; i < documentsData.documents.length; i += 1) {
      if (documentsData.documents[i].documentStatus.toLowerCase() === 'pending') {
        setActiveStep(documentsData.documents[i].documentId);
        setDocumentIndex(i);
        break;
      }
    }
  }, [documentsData.documents]);

  const fetchDocuments = useCallback(async (index: number) => {
    setLoading(true);
    try {
      if (index === documentsData.documents.length) {
        refreshDocumentSets();
      } else {
        const res = await getFarmlandDocuments(farmlandId, documentsData.documentSetId);
        if (res.data?.documents?.length > 0) {
          setDocuments(res.data.documents);
        }
        setActiveStep(documentsData.documents[index].documentId);
        setDocumentIndex(index);
      }
    } catch (err) {
      console.log('ERROR: ', err);
    } finally {
      setLoading(false);
    }
  }, [documentsData.documentSetId, documentsData.documents, farmlandId, refreshDocumentSets]);


  const getActiveForm = () => {
    switch (activeStep) {
      case 26:
        return (
          <LandImagesForm
            farmlandId={farmlandId}
            documentIndex={documentIndex}
            documentDetails={documents[documentIndex]}
            onNext={fetchDocuments}
          />
        );
      case 27:
      case 30:
        return (
          <LandscapeViewForm
            farmlandId={farmlandId}
            documentIndex={documentIndex}
            documentDetails={documents[documentIndex]}
            onNext={fetchDocuments}
          />
        );
      case 28:
        return (
          <ShapeOfLandForm
            farmlandId={farmlandId}
            documentIndex={documentIndex}
            documentDetails={documents[documentIndex]}
            onNext={fetchDocuments}
          />
        );

      case 29:
        return (
          <WaterElectricityForm
            farmlandId={farmlandId}
            documentIndex={documentIndex}
            documentDetails={documents[documentIndex]}
            onNext={fetchDocuments}
          />
        );

      case 31:
        return (
          <SurveyReportForm
            farmlandId={farmlandId}
            documentIndex={documentIndex}
            documentDetails={documents[documentIndex]}
            onNext={fetchDocuments}
          />
        );

      case 32:
        return (
          <EastBoundariesForm
            farmlandId={farmlandId}
            documentIndex={documentIndex}
            documentDetails={documents[documentIndex]}
            onNext={fetchDocuments}
          />
        );

      case 33:
        return (
          <WestBoundariesForm
            farmlandId={farmlandId}
            documentIndex={documentIndex}
            documentDetails={documents[documentIndex]}
            onNext={fetchDocuments}
          />
        );

      case 34:
        return (
          <NorthBoundariesForm
            farmlandId={farmlandId}
            documentIndex={documentIndex}
            documentDetails={documents[documentIndex]}
            onNext={fetchDocuments}
          />
        );

      case 35:
        return (
          <SouthBoundariesForm
            farmlandId={farmlandId}
            documentIndex={documentIndex}
            documentDetails={documents[documentIndex]}
            onNext={fetchDocuments}
          />
        );
      default:
        return <Box />;
    }
  };

  return (
    <>
      <FarmlandDocumentsView activeStep={documentIndex} documents={documents} onNext={fetchDocuments}/>
      {documentsData && getActiveForm()}
    </>
  );
}

export default LandBoundaries;
