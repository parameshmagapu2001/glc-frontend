import { FarmlandDocuments } from 'src/types/farmlands';
import FamilyTree from './family-tree';


interface Props {
  documentIndex: number;
  document: FarmlandDocuments;
  farmlandId: number;
  onNext: (index: number) => void;
}

function FamilyTreeForm({ document, documentIndex, farmlandId, onNext }: Props) {
  return (
    <FamilyTree
      documentIndex={documentIndex}
      document={document}
      farmlandId={farmlandId}
      onNext={onNext}
    />
  );
}

export default FamilyTreeForm;
