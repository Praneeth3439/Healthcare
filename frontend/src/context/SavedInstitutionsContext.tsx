import React, { createContext, useContext, useState, useEffect } from 'react';
import { MedicalInstitution } from '../types/institution';
import { institutionsData, getSavedInstitutionIds, toggleSaveInstitution } from '../services/api';

interface SavedContextType {
  savedIds: string[];
  savedInstitutions: MedicalInstitution[];
  toggleSave: (id: string) => void;
  isSaved: (id: string) => boolean;
}

const SavedContext = createContext<SavedContextType | undefined>(undefined);

export const SavedInstitutionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    setSavedIds(getSavedInstitutionIds());
  }, []);

  const toggleSave = (id: string) => {
    const updated = toggleSaveInstitution(id);
    setSavedIds([...updated]);
  };

  const isSaved = (id: string) => savedIds.includes(id);

  const savedInstitutions = institutionsData.filter((i) => savedIds.includes(i.id));

  return (
    <SavedContext.Provider
      value={{
        savedIds,
        savedInstitutions,
        toggleSave,
        isSaved,
      }}
    >
      {children}
    </SavedContext.Provider>
  );
};

export const useSavedInstitutions = (): SavedContextType => {
  const context = useContext(SavedContext);
  if (!context) {
    throw new Error('useSavedInstitutions must be used within a SavedInstitutionsProvider');
  }
  return context;
};
