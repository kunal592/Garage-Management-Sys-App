import { useContext } from 'react';
import { GarageContext } from '../contexts/GarageContext';

export const useGarage = () => {
  const context = useContext(GarageContext);
  if (context === undefined) {
    throw new Error('useGarage must be used within a GarageProvider');
  }
  return context;
};
