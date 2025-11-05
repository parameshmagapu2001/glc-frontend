'use client';

import { useEffect, useState, useCallback } from 'react';
import { getFarmlandDocuments } from 'src/api/farmlands';
import { FarmlandDocumentsData } from 'src/types/farmlands';
import CustomerInformation from './customer-information';
import LegalDocuments from './legal-documents';
import AgricultureReport from './agriculture-report';
import LandBoundaries from './land-boundaries';
import Validation from './valuation';
import LocalIntelligence from './local-intelligence';
// -----------------------------------------------------------------

interface Props {
  documentSetId: number;
  farmlandId: number;
  areaId: number;
  fetchDocumentSets: () => void;
}

function DocumentSetView({ documentSetId, farmlandId, fetchDocumentSets, areaId }: Props) {

  const [documentsData, setDocumentsData] = useState<FarmlandDocumentsData>();

  const [loading, setLoading] = useState(true);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getFarmlandDocuments(farmlandId, documentSetId);
      setDocumentsData(res.data?.documents?.length > 0 ? res.data : null);
   
    } catch (err) {
      console.log('ERROR: ', err);
    } finally {
      setLoading(false);
    }
  }, [farmlandId, documentSetId]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments, documentSetId]);
  

  const getActiveForm = () => {
    switch (documentSetId) {
      case 1:
        return (
          <CustomerInformation
            farmlandId={farmlandId}
            documentsData={documentsData}
            refreshDocumentSets={fetchDocumentSets}
            areaId={areaId}
          />
        );
      case 2:
        return <LegalDocuments
          farmlandId={farmlandId}
          documentsData={documentsData}
          refreshDocumentSets={fetchDocumentSets} />;
      case 3:
        return <AgricultureReport
          farmlandId={farmlandId}
          documentsData={documentsData}
          refreshDocumentSets={fetchDocumentSets} />;
      case 4:
        return <LandBoundaries
          farmlandId={farmlandId}
          documentsData={documentsData}
          refreshDocumentSets={fetchDocumentSets} />;
      case 5:
        return <Validation
          farmlandId={farmlandId}
          documentsData={documentsData}
          refreshDocumentSets={fetchDocumentSets} />;
      case 6:
        return <LocalIntelligence
          farmlandId={farmlandId}
          documentsData={documentsData}
          refreshDocumentSets={fetchDocumentSets}
        />;
      default:
        return null;
    }
  }

  return (
    <>
      {loading ? <p>Loading...</p> : documentsData && getActiveForm()}
    </>
  );
}

export default DocumentSetView;
