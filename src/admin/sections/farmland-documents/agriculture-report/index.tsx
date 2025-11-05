import { Box } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { FarmlandDocuments, FarmlandDocumentsData } from 'src/types/farmlands';
import { getFarmlandDocuments } from 'src/api/farmlands';
import AgricultureReportForm from './agriculture-report-form';
import TypeOfSoilForm from './type-of-soil-form';
import TypeOfCropsForm from './type-of-crops-form';
import WaterLevelForm from './water-level-form';
import TypesOfCropsGrownForm from './types-of-crops-grown-form';
import CurrentYieldingCostForm from './current-yielding-cost-form';
import CurrenCultivationTypetForm from './current-cutivation-type-form';
import FutureCropPlansSuggesionForm from './future-crop-plans-suggesion-form';
import MaintananceForm from './maintanance-form';
import AdvantagesDisadvantagesForm from './advantages-disadvantages-form';
import FarmlandDocumentsView from '../farmland-documents-view';
// ----------------------------------------------------------------------
interface Props {
  farmlandId: number;
  documentsData: FarmlandDocumentsData | any;
  refreshDocumentSets: () => void;
}

function AgricultureReport({ farmlandId, documentsData, refreshDocumentSets }: Props) {

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
      case 15:
      case 16:
        return (
          <AgricultureReportForm
            documentIndex={documentIndex}
            farmlandId={farmlandId}
            documentDetails={documents[documentIndex]}
            onNext={fetchDocuments}
          />
        );
      case 17:
        return <TypeOfSoilForm
          documentIndex={documentIndex}
          farmlandId={farmlandId}
          documentDetails={documents[documentIndex]}
          onNext={fetchDocuments}
        />;
      case 18:
        return <TypeOfCropsForm
          documentIndex={documentIndex}
          farmlandId={farmlandId}
          documentDetails={documents[documentIndex]}
          onNext={fetchDocuments}
        />;
      case 19:
        return <WaterLevelForm
          documentIndex={documentIndex}
          farmlandId={farmlandId}
          documentDetails={documents[documentIndex]}
          onNext={fetchDocuments}
        />;
      case 20:
        return <TypesOfCropsGrownForm
          documentIndex={documentIndex}
          farmlandId={farmlandId}
          documentDetails={documents[documentIndex]}
          onNext={fetchDocuments}
        />;
      case 21:
        return <CurrentYieldingCostForm
          documentIndex={documentIndex}
          farmlandId={farmlandId}
          documentDetails={documents[documentIndex]}
          onNext={fetchDocuments}
        />;
      case 22:
        return <CurrenCultivationTypetForm
          documentIndex={documentIndex}
          farmlandId={farmlandId}
          documentDetails={documents[documentIndex]}
          onNext={fetchDocuments}
        />;

      case 23:
        return <FutureCropPlansSuggesionForm
          documentIndex={documentIndex}
          farmlandId={farmlandId}
          documentDetails={documents[documentIndex]}
          onNext={fetchDocuments}
        />;
      case 24:
        return <MaintananceForm
          documentIndex={documentIndex}
          farmlandId={farmlandId}
          documentDetails={documents[documentIndex]}
          onNext={fetchDocuments}
        />;
      case 25:
        return <AdvantagesDisadvantagesForm
          documentIndex={documentIndex}
          farmlandId={farmlandId}
          documentDetails={documents[documentIndex]}
          onNext={fetchDocuments}
        />;
      default:
        return <Box />;
    }
  };

  return (
    <>
      <FarmlandDocumentsView activeStep={documentIndex} documents={documents}  onNext={fetchDocuments}/>
      {documentsData && getActiveForm()}
    </>
  );
}

export default AgricultureReport;
