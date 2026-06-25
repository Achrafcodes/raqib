import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

interface RefreshContextType {
  tick: number;
  refresh: () => void;
}

const RefreshContext = createContext<RefreshContextType>({ tick: 0, refresh: () => {} });

export const RefreshProvider = ({ children }: { children: ReactNode }) => {
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((t) => t + 1), []);
  return <RefreshContext.Provider value={{ tick, refresh }}>{children}</RefreshContext.Provider>;
};

export const useRefresh = () => useContext(RefreshContext);
