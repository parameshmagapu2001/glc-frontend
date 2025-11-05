import FarmlandDocumentTemplate from "src/sections/farmland-documents/farmland-document-template";

export const metadata = {
  title: 'GLC: FarmLand',
};

type Props = {
  params: {
    id: number;
  };
};

export default function DocumentsViewPage({ params }: Props) {
  const { id } = params;

  return <FarmlandDocumentTemplate
  farmlandId={id}
  />;
}
