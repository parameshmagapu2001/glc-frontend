import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { FarmlandDocuments, FarmlandDocumentsData } from 'src/types/farmlands';
import { getFarmlandDocuments } from 'src/api/farmlands';

import FarmlandDocumentsView from '../farmland-documents-view';
import VillageMapNakshaForm from './village-map-naksha-form';
import RoadAproachForm from './road-approach-form';
import WaterFacilityForm from './water-facility-form';
import ElectricityFacilityForm from './electricity-facility-form';
import RecentTransactionForm from './recent-transaction-form';
import ExistingTreesForm from './existing-trees-form';
import GeologicalAdvantagesForm from './geological-advantages-form';
import FuturePlansForm from './future-plans-form';
import DisadvantagesForm from './disadvantages-form';
import UpcomingInfrastructureForm from './upcoming-infrastructure-form';
import RailwayTrackConnectivityForm from './railway-track-connectivity-form';
import AirportConnectivityForm from './airport-connectivity-form';

// ----------------------------------------------------------------------
interface Props {
  farmlandId: number;
  documentsData: FarmlandDocumentsData | any;
  refreshDocumentSets: () => void;
}

function Validation({ farmlandId, documentsData, refreshDocumentSets }: Props) {


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
      case 36:
      case 37:
      case 38:
      case 39:
        return (
          <VillageMapNakshaForm
            farmlandId={farmlandId}
            documentIndex={documentIndex}
            documentDetails={documents[documentIndex]}
            onNext={fetchDocuments}
          />
        );

      case 40:
        return (
          <RoadAproachForm
            farmlandId={farmlandId}
            documentIndex={documentIndex}
            documentDetails={documents[documentIndex]}
            onNext={fetchDocuments}
          />
        );

      case 41:
        return (
          <WaterFacilityForm
            farmlandId={farmlandId}
            documentIndex={documentIndex}
            documentDetails={documents[documentIndex]}
            onNext={fetchDocuments}
          />
        );

      case 42:
        return (
          <ElectricityFacilityForm
            farmlandId={farmlandId}
            documentIndex={documentIndex}
            documentDetails={documents[documentIndex]}
            onNext={fetchDocuments}
          />
        );

      case 43:
        return (
          <RecentTransactionForm
            farmlandId={farmlandId}
            documentIndex={documentIndex}
            documentDetails={documents[documentIndex]}
            onNext={fetchDocuments}
          />
        );

      case 44:
        return (
          <ExistingTreesForm
            farmlandId={farmlandId}
            documentIndex={documentIndex}
            documentDetails={documents[documentIndex]}
            onNext={fetchDocuments}
          />
        );
      case 45:
        return (
          <GeologicalAdvantagesForm
            farmlandId={farmlandId}
            documentIndex={documentIndex}
            documentDetails={documents[documentIndex]}
            onNext={fetchDocuments}
          />
        );

      case 46:
        return (
          <FuturePlansForm
            farmlandId={farmlandId}
            documentIndex={documentIndex}
            documentDetails={documents[documentIndex]}
            onNext={fetchDocuments}
          />
        );

      case 47:
        return (
          <DisadvantagesForm
            farmlandId={farmlandId}
            documentIndex={documentIndex}
            documentDetails={documents[documentIndex]}
            onNext={fetchDocuments}
          />
        );

      case 48:
        return (
          <UpcomingInfrastructureForm
            farmlandId={farmlandId}
            documentIndex={documentIndex}
            documentDetails={documents[documentIndex]}
            onNext={fetchDocuments}
          />
        );

      case 49:
        return (
          <RailwayTrackConnectivityForm
            farmlandId={farmlandId}
            documentIndex={documentIndex}
            documentDetails={documents[documentIndex]}
            onNext={fetchDocuments}
          />
        );

      case 50:
        return (
          <AirportConnectivityForm
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

export default Validation;
