// sections

import RegionsListView from "src/sections/role-manager/regions/view/regions-list-view";

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Trice: Regions',
};

type Props = {
  params: {
    id: number;
  };
};

export default function RegionsListPage({ params }: Props) {
  const { id } = params;

  return <RegionsListView id={id} />;
}
