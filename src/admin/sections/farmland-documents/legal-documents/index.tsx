import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FarmlandDocuments, FarmlandDocumentsData } from 'src/types/farmlands';
import { getFarmlandDocuments } from 'src/api/farmlands';
import LegalDocForm from './legal-doc-form';
import FarmlandDocumentsView from '../farmland-documents-view';
import LandCoordinatesForm from './land-coordinates-form';
import KycVideoForm from './kyc-video-form';
// -----------------------------------------------------------------
interface Props {
  farmlandId: number;
  documentsData: FarmlandDocumentsData | any;
  refreshDocumentSets: () => void;
}

function LegalDocuments({ farmlandId, documentsData, refreshDocumentSets }: Props) {

  const [activeStep, setActiveStep] = useState<number>(documentsData.documents[0].documentId);

  const [documentIndex, setDocumentIndex] = useState<number>(0);

  const [loading, setLoading] = useState(false);

  const [documents, setDocuments] = useState<FarmlandDocuments[]>(documentsData.documents);

  console.log(documentsData.documents)

  const router = useRouter();

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
  }, [documentsData.documentSetId, farmlandId, refreshDocumentSets, documentsData.documents]);


  const getActiveForm = () => {
    switch (activeStep) {
      case 13:
        return (
          <LandCoordinatesForm
            documentIndex={documentIndex}
            farmlandId={farmlandId}
            documentDetails={documents[documentIndex]}
            onNext={fetchDocuments}
          />
        );
      case 14:
        return (
          <KycVideoForm
            documentIndex={documentIndex}
            farmlandId={farmlandId}
            documentDetails={documents[documentIndex]}
            onNext={fetchDocuments}
          />
        );
      default:
        return (
          <LegalDocForm
            documentIndex={documentIndex}
            farmlandId={farmlandId}
            documentDetails={documents[documentIndex]}
            onNext={fetchDocuments}
          />
        );
    }
  };

  return (
    <>
      <FarmlandDocumentsView activeStep={documentIndex} documents={documents} onNext={fetchDocuments}/>
      {getActiveForm()}
    </>
  );
}

export default LegalDocuments;