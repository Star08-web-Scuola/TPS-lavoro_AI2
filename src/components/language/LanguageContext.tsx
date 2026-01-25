"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'it';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Common
    welcome: 'Welcome',
    dashboard: 'Dashboard',
    routeOptimizer: 'Route Optimizer',
    sustainability: 'Sustainability',
    login: 'Login',
    logout: 'Logout',
    settings: 'Settings',
    save: 'Save',
    cancel: 'Cancel',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',

    // Auth
    signIn: 'Sign In',
    signUp: 'Sign Up',
    email: 'Email',
    password: 'Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    forgotPassword: 'Forgot Password?',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",

    // Dashboard
    intermodalDashboard: 'Intermodal Dashboard',
    totalCO2Savings: 'Total CO₂ Savings',
    inTransit: 'In Transit',
    atHubs: 'At Hubs',
    delayed: 'Delayed',
    shipmentTracking: 'Shipment Tracking',
    intermodalHubs: 'Intermodal Hubs',
    sustainabilityAnalytics: 'Sustainability Analytics',
    modalShiftImpact: 'Modal Shift Impact',
    co2SavingsBreakdown: 'CO₂ Savings Breakdown',
    operationalEfficiency: 'Operational Efficiency',
    onTimeDeliveryRate: 'On-time Delivery Rate',
    hubUtilization: 'Hub Utilization',

    // Route Optimizer
    aiRouteOptimizer: 'AI Route Optimizer',
    routeOptimization: 'Route Optimization',
    selectShipment: 'Select Shipment',
    selectOriginHub: 'Select Origin Hub',
    selectDestinationHub: 'Select Destination Hub',
    selectVehicleType: 'Select Vehicle Type',
    optimizeRoute: 'Optimize Route',
    routeSummary: 'Route Summary',
    energyEfficiency: 'Energy Efficiency',
    sustainabilityImpact: 'Sustainability Impact',
    viewOnMap: 'View on Map',
    assignToDriver: 'Assign to Driver',

    // Sustainability Reporting
    sustainabilityReporting: 'Sustainability Reporting',
    generateESGReport: 'Generate ESG Report',
    reportPeriod: 'Report Period',
    dateRange: 'Date Range',
    operationalSummary: 'Operational Summary',
    environmentalImpact: 'Environmental Impact',
    modalShift: 'Modal Shift',
    esgCertification: 'ESG Certification',
    downloadReport: 'Download Report',

    // Map
    mapView: 'Map View',
    origin: 'Origin',
    destination: 'Destination',
    chargingStations: 'Charging Stations',
    lowEmissionZone: 'Low Emission Zone',
  },
  it: {
    // Common
    welcome: 'Benvenuto',
    dashboard: 'Dashboard',
    routeOptimizer: 'Ottimizzatore di Percorsi',
    sustainability: 'Sostenibilità',
    login: 'Accedi',
    logout: 'Esci',
    settings: 'Impostazioni',
    save: 'Salva',
    cancel: 'Annulla',
    loading: 'Caricamento...',
    error: 'Errore',
    success: 'Successo',

    // Auth
    signIn: 'Accedi',
    signUp: 'Registrati',
    email: 'Email',
    password: 'Password',
    firstName: 'Nome',
    lastName: 'Cognome',
    forgotPassword: 'Password dimenticata?',
    alreadyHaveAccount: 'Hai già un account?',
    dontHaveAccount: 'Non hai un account?',

    // Dashboard
    intermodalDashboard: 'Dashboard Intermodale',
    totalCO2Savings: 'Risparmio Totale CO₂',
    inTransit: 'In Transito',
    atHubs: 'Nei Hub',
    delayed: 'Ritardati',
    shipmentTracking: 'Tracciamento Spedizioni',
    intermodalHubs: 'Hub Intermodali',
    sustainabilityAnalytics: 'Analisi di Sostenibilità',
    modalShiftImpact: 'Impatto del Cambio Modale',
    co2SavingsBreakdown: 'Suddivisione Risparmio CO₂',
    operationalEfficiency: 'Efficienza Operativa',
    onTimeDeliveryRate: 'Tasso di Consegne Puntuali',
    hubUtilization: 'Utilizzo Hub',

    // Route Optimizer
    aiRouteOptimizer: 'Ottimizzatore di Percorsi AI',
    routeOptimization: 'Ottimizzazione Percorso',
    selectShipment: 'Seleziona Spedizione',
    selectOriginHub: 'Seleziona Hub di Origine',
    selectDestinationHub: 'Seleziona Hub di Destinazione',
    selectVehicleType: 'Seleziona Tipo di Veicolo',
    optimizeRoute: 'Ottimizza Percorso',
    routeSummary: 'Riepilogo Percorso',
    energyEfficiency: 'Efficienza Energetica',
    sustainabilityImpact: 'Impatto di Sostenibilità',
    viewOnMap: 'Visualizza sulla Mappa',
    assignToDriver: 'Assegna al Conducente',

    // Sustainability Reporting
    sustainabilityReporting: 'Reporting di Sostenibilità',
    generateESGReport: 'Genera Report ESG',
    reportPeriod: 'Periodo del Report',
    dateRange: 'Intervallo di Date',
    operationalSummary: 'Riepilogo Operativo',
    environmentalImpact: 'Impatto Ambientale',
    modalShift: 'Cambio Modale',
    esgCertification: 'Certificazione ESG',
    downloadReport: 'Scarica Report',

    // Map
    mapView: 'Visualizzazione Mappa',
    origin: 'Origine',
    destination: 'Destinazione',
    chargingStations: 'Stazioni di Ricarica',
    lowEmissionZone: 'Zona a Basse Emissioni',
  }
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Check for saved language preference
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'it')) {
      setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    // Save language preference
    if (language) {
      localStorage.setItem('language', language);
    }
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};