"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { type Team } from '@/utils/teams';

interface TeamsData {
  teamA: Team;
  teamB: Team;
}

interface TeamsContextType {
  teamsData: TeamsData | null;
  setTeamsData: (data: TeamsData) => void;
  clearTeamsData: () => void;
}

const TeamsContext = createContext<TeamsContextType | undefined>(undefined);

export function TeamsProvider({ children }: { children: ReactNode }) {
  const [teamsData, setTeamsDataState] = useState<TeamsData | null>(null);

  const setTeamsData = (data: TeamsData) => {
    setTeamsDataState(data);
  };

  const clearTeamsData = () => {
    setTeamsDataState(null);
  };

  return (
    <TeamsContext.Provider value={{ teamsData, setTeamsData, clearTeamsData }}>
      {children}
    </TeamsContext.Provider>
  );
}

export function useTeams() {
  const context = useContext(TeamsContext);
  if (context === undefined) {
    throw new Error('useTeams must be used within a TeamsProvider');
  }
  return context;
}