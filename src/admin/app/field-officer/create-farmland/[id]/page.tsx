import AlertToFarmlandCreate from "src/sections/field-officer/alert-to-farmland-create/alert-to-farmland-create";

export const metadata = {
  title: 'GLC: FarmLand',
};

type Props = {
  params: {
    id: string;
  };
};

export default function IndividualCreatePage({ params }: Props) {
  const { id } = params;

  return <AlertToFarmlandCreate
    alertId={id}
  />;
}
