import * as Yup from 'yup';

export const OwnerSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .min(3, 'Minimum 3 characters')
    .max(150, 'Maximum 150 characters')
    .matches(/^[A-Za-z]+$/, 'First name must contain only letters'),

  lastName: Yup.string()
    .required('Last name is required')
    .max(150, 'Maximum 150 characters')
    .matches(/^[A-Za-z]+$/, 'Last name must contain only letters'),

  phoneNumber: Yup.string().required('Contact Number is required')
    .matches(/^[1-9][0-9]*$/, 'Please Enter only numbers and the first digit should not be zero')
    .max(10, 'Please enter a valid number ').min(10, 'Please enter a valid number'),
  email: Yup.string()
    .required('Email is required')
    .matches(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please enter a valid email address'
    ),
  religion: Yup.string().required('Religion is required'),
  gender: Yup.string().required('Gender is required'),
  latitude: Yup.string()
    .required('Latitude is required')
    .matches(
      /^[-+]?(90(\.0+)?|[1-8]?\d(\.\d+)?)$/,
      'Invalid latitude format.'
    ).transform((value) => (value ? value.trim() : value)),
  longitude: Yup.string()
    .required('Longitude is required')
    .matches(
      /^[-+]?(180(\.0+)?|1[0-7]?\d(\.\d+)?|\d{1,2}(\.\d+)?)$/,
      'Invalid longitude format.'
    )
    .transform((value) => (value ? value.trim() : value)),
});

export const LandDetailsSchema = Yup.object().shape({
  acquisitionCategory: Yup.string().required('Acquisition category is required'),
  agentLocation: Yup.string().required('Agent location is required'),
  agentName: Yup.string().required('Agent name is required'),
  cityId: Yup.string().required('city id is required is required'),
  cityName: Yup.string().required('city name is required'),
  districtId: Yup.string().required('district id is required'),
  districtName: Yup.string().required('district name is required'),
  landConversion: Yup.string().required('land conversion is required'),
  stateId: Yup.string().required('state id is required'),
  stateName: Yup.string().required('state name is required'),
  valuePerArea: Yup.string().required('value per area is required'),
  agentId: Yup.string().required('Please enter agent id'),
});

export const ConsumerSchema = Yup.object().shape({
  contact_name: Yup.string()
    .required('Consumer Name is required')
    .min(3, 'Mininum 3 characters')
    .max(150, 'Maximum 150 characters'),
  contact_number: Yup.string()
    .required('Consumer Number is required')
    .matches(/^[1-9][0-9]*$/, 'Please Enter only numbers and the first digit should not be zero')
    .max(10, 'Max 10 digits'),
  latitude: Yup.string()
    .required('Latitude is required')
    .matches(/^[-+]?(90(\.0+)?|[1-8]?\d(\.\d+)?)$/, 'Invalid latitude format.')
    .transform((value) => (value ? value.trim() : value)),
  longitude: Yup.string()
    .required('Longitude is required')
    .matches(/^[-+]?(180(\.0+)?|1[0-7]?\d(\.\d+)?|\d{1,2}(\.\d+)?)$/, 'Invalid longitude format.')
    .transform((value) => (value ? value.trim() : value)),
  pin_code: Yup.string()
    .required('Pincode is required')
    .matches(/^[0-9]+$/, 'Pincode must contain only numbers')
    .min(6, 'Pincode must be 6 digits')
    .max(6, 'Pincode must be 6 digits'),
  address_type: Yup.string()
    .required('Address Type is required')
    .test('not-zero', 'Address Type is required', (value) => value !== '0'),
  apartment_society: Yup.string()
    .required('Apartment/Society is required')
    .matches(
      /^(?! )[a-zA-Z0-9\s-,:#/.]*[^ ]$/,
      'Apartment/Society should not start and end with a space'
    ),
  tower_block: Yup.string()
    .required('Tower/Block is required')
    .matches(
      /^(?! )[a-zA-Z0-9\s-,:#/.]*[^ ]$/,
      'Tower/Block should not start and end with a space'
    ),
  street_area: Yup.string()
    .required('Street/Area is required')
    .matches(/^(?! )[a-zA-Z0-9\s-,:#/.]*[^ ]$/, 'Street/Area should not start and end with a space')
    .max(250, 'Maximum 250 characters'),
  flat_villa_no: Yup.string()
    .required('Flat/Villa is required')
    .matches(/^(?! )[a-zA-Z0-9\s-,:#/.]*[^ ]$/, 'Flat/Villa should not start and end with a space'),
  default_address: Yup.boolean().required(),
  location_id: Yup.number().required(' Location is required').moreThan(0, 'Location is required'),
  region_id: Yup.number().required('Region is required').moreThan(0, 'Region is required'),
  hub_id: Yup.number().required('Hub is required').moreThan(0, 'Hub is required'),
  house_type: Yup.string()
    .required('House Type is required')
    .test('not-zero', 'House Type is required', (value) => value !== '0'),
  gender: Yup.string()
    .required('Gender is required')
    .test('not-zero', 'Gender is required', (value) => value !== '0'),
  landmark: Yup.string().optional().max(250, 'Maximum 250 characters'),
  contact_email: Yup.string()
    .optional()
    .email('Email must be a valid email')
    .max(250, 'Maximum 250 characters'),
  other_address_type: Yup.string().optional(),
  date_of_birth: Yup.mixed<any>().optional(),
  family_members: Yup.number().optional(),
  consumer_class: Yup.string().optional(),
  find_us_from: Yup.string().optional(),
  floor: Yup.string().optional(),
});
