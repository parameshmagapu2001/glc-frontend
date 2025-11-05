
// sections
// ----------------------------------------------------------------------

import RoleUserEditNavigationPage from "src/sections/role-manager/roles/view/role-user-edit-navigation-page";

export const metadata = {
  title: 'AK: Consumer Details',
};

type Props = {
  params: {
    id: number;
    userId: number;
  };
};

export default function RoleUsersPage({ params }: Props) {
  const { id, userId } = params;

  return <RoleUserEditNavigationPage

    id={id.toString()}
    userId={userId}
  />;
}
