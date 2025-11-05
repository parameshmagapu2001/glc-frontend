import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { FarmlandDocuments, FarmlandDocumentsData } from 'src/types/farmlands';
import { getFarmlandDocuments } from 'src/api/farmlands';
import FarmlandDocumentsView from '../farmland-documents-view';
import AnyIssuesForm from './any-issues-form';
import OwnerMindsetForm from './owner-mindset-form';
import SourcePersonForm from './source-person-form';
import AgreementsForm from './agreements-form';
import PreviousTransactions from './previous-transactions';
import PendingLoansForm from './pending-loans-form';
import LocalLiabilitiesForm from './local-liabilities-form';
// -----------------------------------------------------------------
interface Props {
  farmlandId: number;
  documentsData: FarmlandDocumentsData | any;
  refreshDocumentSets: () => void;
}

function LocalIntelligence({ farmlandId, documentsData, refreshDocumentSets }: Props) {


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
  }, [documentsData.documentSetId, farmlandId, refreshDocumentSets, documentsData.documents]);

  const getActiveForm = () => {
    switch (activeStep) {
      case 51:
        return (
          <AnyIssuesForm
            farmlandId={farmlandId}
            documentIndex={documentIndex}
            documentDetails={documents[documentIndex]}
            onNext={fetchDocuments}
          />
        );

      case 52:
        return (
          <LocalLiabilitiesForm
            farmlandId={farmlandId}
            documentIndex={documentIndex}
            documentDetails={documents[documentIndex]}
            onNext={fetchDocuments}
          />
        );

      case 53:
        return (
          <PendingLoansForm
            farmlandId={farmlandId}
            documentIndex={documentIndex}
            documentDetails={documents[documentIndex]}
            onNext={fetchDocuments}
          />
        );

      case 54:
        return (
          <OwnerMindsetForm
            farmlandId={farmlandId}
            documentIndex={documentIndex}
            documentDetails={documents[documentIndex]}
            onNext={fetchDocuments}
          />
        );

      case 55:
        return (
          <SourcePersonForm
            farmlandId={farmlandId}
            documentIndex={documentIndex}
            documentDetails={documents[documentIndex]}
            onNext={fetchDocuments}
          />
        );

      case 56:
        return (
          <AgreementsForm
            farmlandId={farmlandId}
            documentIndex={documentIndex}
            documentDetails={documents[documentIndex]}
            onNext={fetchDocuments}
          />
        );

      case 57:
        return (
          <PreviousTransactions
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
      {getActiveForm()}
    </>
  );
}

export default LocalIntelligence;
