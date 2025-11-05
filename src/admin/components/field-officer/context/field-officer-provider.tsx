import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { listTopPerformers } from 'src/api/agents';
import { getAreas } from 'src/api/areas';
import { getFarmlandsAnalytics } from 'src/api/farmlands';
import { Agent } from 'src/types/agent';
import { IAreaItem } from 'src/types/area';
import { FarmlandAnalytics, IFarmlandAlert } from 'src/types/farmlands';
import { FieldOfficerContext } from './field-officer-context';

interface Props {
  children: React.ReactNode;
}

const FieldOfficerProvider: React.FC<Props> = ({ children }) => {
  const [farmlandAnalytics, setFarmlandAnalytics] = useState<FarmlandAnalytics[]>([]);
  const [topPerformers, setTopPerformers] = useState<Agent[]>([]);
  const [farmlandAlerts, setFarmlandAlerts] = useState<IFarmlandAlert[]>([]);
  const [areas, setAreas] = useState<IAreaItem[]>([]);

  const fetchTopPerformers = async () => {
    try {
      const res = await listTopPerformers();
      setTopPerformers(res.data?.topAgents || []);
    } catch (err) {
      console.log('ERROR: ', err);
    }
  };

  const fetchFarmlandAnalytics = async () => {
    try {
      const res = await getFarmlandsAnalytics();
      if (res.data) {
        setFarmlandAnalytics(res.data);
      }
    } catch (err) {
      console.log('ERROR: ', err);
    }
  };

  const fetchAreas = async () => {
    try {
      const res = await getAreas();

      if (res.data?.length > 0) {
        setAreas(res.data);
      }
    } catch (err) {
      console.log('ERROR: ', err);
    }
  };

  const memoizedValues = useMemo(
    () => ({
      farmlandAlerts,
      farmlandAnalytics,
      topPerformers,
      areas,
    }),
    [farmlandAlerts, farmlandAnalytics, topPerformers, areas]
  );

  useEffect(() => {
    fetchFarmlandAnalytics();
    fetchTopPerformers();
    fetchAreas();
  }, []);

  return (
    <FieldOfficerContext.Provider value={memoizedValues}>{children}</FieldOfficerContext.Provider>
  );
};

export default FieldOfficerProvider;
