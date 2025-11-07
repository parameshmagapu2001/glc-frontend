// sections
// ----------------------------------------------------------------------

import AgentDetailsView from "src/app/admin/role-manager/sections/role-manager/agents/view/agent-details-view";

export const metadata = {
  title: 'GLC: Agent Details',
};

type Props = {
  params: {
    id: number;
  };
};

export default function StoreDetailsPage({ params }: Props) {
  const { id } = params;
  return <AgentDetailsView
    id={id}
  />;
}
