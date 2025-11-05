import { Agent } from './agent';
import { IAreaItem } from './area';
import { FarmlandAnalytics, IFarmlandAlert } from './farmlands';

export type FieldOfficerContextValue = {
  farmlandAnalytics: FarmlandAnalytics[];
  topPerformers: Agent[];
  farmlandAlerts: IFarmlandAlert[];
  areas: IAreaItem[];
};
