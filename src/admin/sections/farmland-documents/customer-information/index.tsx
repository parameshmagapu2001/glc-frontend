import { Box } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { FarmlandDocuments, FarmlandDocumentsData } from 'src/types/farmlands';
import { getFarmlandDocuments } from 'src/api/farmlands';
import FamilyTreeForm from './family-tree-form';
import LandDetailsForm from './land-details-form';
import OwnerDetailsForm from './owner-details-form';
import FarmlandDocumentsView from '../farmland-documents-view';
// -----------------------------------------------------------------
interface Props {
  farmlandId: number;
  documentsData: FarmlandDocumentsData | any;
  refreshDocumentSets: () => void;
  areaId: number;
}

function CustomerInformation({ farmlandId, documentsData, areaId, refreshDocumentSets }: Props) {

  const [activeStep, setActiveStep] = useState<number>(documentsData.documents[0].documentId);

  const [documentIndex, setDocumentIndex] = useState<number>(0);

  const [documents, setDocuments] = useState<FarmlandDocuments[]>(documentsData.documents);

  const [loading, setLoading] = useState(false);

  console.log(documentsData.documents)

  useEffect(() => {
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
      const res = await getFarmlandDocuments(farmlandId, documentsData.documentSetId);
      if (res.data?.documents?.length > 0) {
        setDocuments(res.data.documents);
      }
      if (index === documentsData.documents.length) {
        refreshDocumentSets();
      } else {
        setActiveStep(documentsData.documents[index].documentId);
        setDocumentIndex(index);
      }
    } catch (err) {
      console.log('ERROR:', err);
    } finally {
      setLoading(false);
    }
  }, [documentsData.documentSetId, farmlandId, refreshDocumentSets, documentsData.documents]);

  const getActiveForm = () => {
    switch (activeStep) {
      case 1:
        return (
          <OwnerDetailsForm
            farmlandId={farmlandId}
            documentIndex={documentIndex}
            document={documentsData?.documents[0]}
            onNext={fetchDocuments}
          />
        );
      case 2:
        return (
          <FamilyTreeForm
            documentIndex={documentIndex}
            document={documents[documentIndex]}
            farmlandId={farmlandId}
            onNext={fetchDocuments}
          />
        );
      case 3:
        return <LandDetailsForm
          documentIndex={documentIndex}
          document={documents[documentIndex]}
          farmlandId={farmlandId}
          onNext={fetchDocuments}
          areaId={areaId}
        />;
      default:
        return <Box />;
    }
  };

  return (
    <>
      <FarmlandDocumentsView activeStep={documentIndex} documents={documents} onNext={fetchDocuments}/>
      {getActiveForm()}
    </>
  );
}

export default CustomerInformation;
