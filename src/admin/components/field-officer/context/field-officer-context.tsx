import { createContext, useContext } from 'react';
import { FieldOfficerContextValue } from 'src/types/field-officer';

export const FieldOfficerContext = createContext({} as FieldOfficerContextValue);

export const useFieldOfficerContext = () => useContext(FieldOfficerContext);
