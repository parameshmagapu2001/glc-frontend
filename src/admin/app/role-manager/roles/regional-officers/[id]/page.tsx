// sections
// ----------------------------------------------------------------------

import RegionalOfficerDetailsView from "src/sections/role-manager/regional-officers/view/regional-officers-details-view";

export const metadata = {
  title: 'GLC: Regional Officer Details',
};

type Props = {
  params: {
    id: number;
  };
};

export default function RegionalOfficerDetailsPage({ params }: Props) {
  const { id } = params;
  return <RegionalOfficerDetailsView
  />;
}
