// sections

import AlertToFarmlandCreate from "src/sections/field-officer/alert-to-farmland-create/alert-to-farmland-create";

// ----------------------------------------------------------------------

export const metadata = {
  title: 'GLC: FarmLand',
};

export default function ConsumerCreatePage() {
  return <AlertToFarmlandCreate
    alertId='0'
  />;
}
