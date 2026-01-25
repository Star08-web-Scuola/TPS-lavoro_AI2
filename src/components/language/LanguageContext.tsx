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
    'Compared to road transport': 'Compared to road transport',
    'Active shipments': 'Active shipments',
    'Ready for last-mile': 'Ready for last-mile',
    'Needs attention': 'Needs attention',
    'Shipment Status Distribution': 'Shipment Status Distribution',
    'Rail vs Road': 'Rail vs Road',
    'Electric Last-Mile': 'Electric Last-Mile',
    'Rail Transport': 'Rail Transport',
    'Capacity': 'Capacity',
    'Charging Stations': 'Charging Stations',
    'No shipments found': 'No shipments found',
    'Delivered': 'Delivered',
    'ETA': 'ETA',
    'saved': 'saved',

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
    'Calculate the most energy-efficient routes for electric delivery vehicles': 'Calculate the most energy-efficient routes for electric delivery vehicles',
    'Real-time traffic data integration to avoid congestion': 'Real-time traffic data integration to avoid congestion',
    'Optimal charging stop planning based on vehicle range': 'Optimal charging stop planning based on vehicle range',
    'Compliance with ZTL regulations and restrictions': 'Compliance with ZTL regulations and restrictions',
    'Time-sensitive delivery scheduling': 'Time-sensitive delivery scheduling',
    'Optimization Preferences': 'Optimization Preferences',
    'Avoid Tolls': 'Avoid Tolls',
    'Prefer Charging Stations': 'Prefer Charging Stations',
    'Avoid Low Emission Zones': 'Avoid Low Emission Zones',
    'Max Distance (km)': 'Max Distance (km)',
    'Distance': 'Distance',
    'Estimated Time': 'Estimated Time',
    'Vehicle': 'Vehicle',
    'Energy Consumption': 'Energy Consumption',
    'Charging Stops': 'Charging Stops',
    'ZTL Compliance': 'ZTL Compliance',
    'Compliant': 'Compliant',
    'Not Compliant': 'Not Compliant',
    'This optimized route contributes to your sustainability goals by:': 'This optimized route contributes to your sustainability goals by:',
    'Reducing carbon emissions through modal shift from road to rail': 'Reducing carbon emissions through modal shift from road to rail',
    'Using zero-emission electric vehicles for last-mile delivery': 'Using zero-emission electric vehicles for last-mile delivery',
    'Minimizing urban congestion through efficient routing': 'Minimizing urban congestion through efficient routing',
    'Ensuring compliance with low-emission zone regulations': 'Ensuring compliance with low-emission zone regulations',
    'Optimized Route Results': 'Optimized Route Results',
    'Traffic Conditions': 'Traffic Conditions',
    'Charging Infrastructure': 'Charging Infrastructure',
    'Low Emission Zones': 'Low Emission Zones',
    'Delivery Windows': 'Delivery Windows',
    'Electric Van': 'Electric Van',
    'Cargo Bike': 'Cargo Bike',
    'mapView': 'Map View',
    'Origin': 'Origin',
    'Destination': 'Destination',

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
    'Create certified sustainability reports for your intermodal logistics operations': 'Create certified sustainability reports for your intermodal logistics operations',
    'Select report period': 'Select report period',
    'Monthly': 'Monthly',
    'Quarterly': 'Quarterly',
    'Annual': 'Annual',
    'Generating Report': 'Generating Report',
    'generateReport': 'Generate Report',
    'Total Shipments': 'Total Shipments',
    'Delivered Shipments': 'Delivered Shipments',
    'Delivery Success Rate': 'Delivery Success Rate',
    'Road Equivalent CO₂': 'Road Equivalent CO₂',
    'CO₂ per Shipment': 'CO₂ per Shipment',
    'CO₂ Reduction': 'CO₂ Reduction',
    'CO₂ Reduction Percentage': 'CO₂ Reduction Percentage',
    'Rail Shipments': 'Rail Shipments',
    'Road Shipments Avoided': 'Road Shipments Avoided',
    'Congestion Reduction': 'Congestion Reduction',
    'Modal Shift Efficiency': 'Modal Shift Efficiency',
    'Compliance Standard': 'Compliance Standard',
    'Verification Date': 'Verification Date',
    'Verified By': 'Verified By',
    'Carbon Intensity': 'Carbon Intensity',
    'Sustainability Report Summary': 'Sustainability Report Summary',
    'Sustainability Metrics': 'Sustainability Metrics',
    'Sustainability Insights': 'Sustainability Insights',
    'Carbon Emission Reduction': 'Carbon Emission Reduction',
    'Modal Shift Success': 'Modal Shift Success',
    'Urban Congestion Relief': 'Urban Congestion Relief',
    'Continuous Improvement': 'Continuous Improvement',
    'By utilizing rail transport for long-haul freight and electric vehicles for last-mile delivery, you have significantly reduced carbon emissions compared to traditional road transport.': 'By utilizing rail transport for long-haul freight and electric vehicles for last-mile delivery, you have significantly reduced carbon emissions compared to traditional road transport.',
    'The shift from road to rail transport has reduced highway congestion and lowered the environmental impact of your logistics operations.': 'The shift from road to rail transport has reduced highway congestion and lowered the environmental impact of your logistics operations.',
    'Electric cargo bikes and vans for last-mile delivery have reduced urban traffic congestion and improved air quality in city centers.': 'Electric cargo bikes and vans for last-mile delivery have reduced urban traffic congestion and improved air quality in city centers.',
    'GreenPath Analytics provides ongoing optimization and reporting to help you continuously improve your sustainability performance and meet ESG goals.': 'GreenPath Analytics provides ongoing optimization and reporting to help you continuously improve your sustainability performance and meet ESG goals.',
    'This report certifies your sustainability achievements and can be used for ESG compliance reporting.': 'This report certifies your sustainability achievements and can be used for ESG compliance reporting.',
    'Report downloaded successfully!': 'Report downloaded successfully!',
    'Sustainability report generated successfully!': 'Sustainability report generated successfully!',
    'Failed to load sustainability data': 'Failed to load sustainability data',
    'Failed to generate sustainability report': 'Failed to generate sustainability report',

    // General
    'Failed to load dashboard data': 'Failed to load dashboard data',
    'Failed to load route optimizer data': 'Failed to load route optimizer data',
    'Failed to optimize route': 'Failed to optimize route',
    'Please select shipment, origin hub, and destination hub': 'Please select shipment, origin hub, and destination hub',
    'Invalid selection': 'Invalid selection',
    'Refresh Data': 'Refresh Data',
    'Refreshing...': 'Refreshing...',
    'Failed to sign in': 'Failed to sign in',
    'Failed to sign up': 'Failed to sign up',
    'Failed to sign out': 'Failed to sign out',
    'Welcome back!': 'Welcome back!',
    'You have been signed out': 'You have been signed out',
    'Sign up successful! Please check your email for verification.': 'Sign up successful! Please check your email for verification.',
    'Shipment data updated in real-time': 'Shipment data updated in real-time'
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
    'Compared to road transport': 'Rispetto al trasporto su strada',
    'Active shipments': 'Spedizioni attive',
    'Ready for last-mile': 'Pronto per l\'ultimo miglio',
    'Needs attention': 'Richiede attenzione',
    'Shipment Status Distribution': 'Distribuzione Stato Spedizioni',
    'Rail vs Road': 'Ferrovia vs Strada',
    'Electric Last-Mile': 'Elettrico Ultimo Miglio',
    'Rail Transport': 'Trasporto Ferroviario',
    'Capacity': 'Capacità',
    'Charging Stations': 'Stazioni di Ricarica',
    'No shipments found': 'Nessuna spedizione trovata',
    'Delivered': 'Consegnato',
    'ETA': 'ETA',
    'saved': 'risparmiato',

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
    'Calculate the most energy-efficient routes for electric delivery vehicles': 'Calcola i percorsi più efficienti dal punto di vista energetico per i veicoli di consegna elettrici',
    'Real-time traffic data integration to avoid congestion': 'Integrazione dei dati sul traffico in tempo reale per evitare la congestione',
    'Optimal charging stop planning based on vehicle range': 'Pianificazione ottimale delle soste di ricarica in base all\'autonomia del veicolo',
    'Compliance with ZTL regulations and restrictions': 'Conformità alle normative e restrizioni ZTL',
    'Time-sensitive delivery scheduling': 'Pianificazione delle consegne sensibili al tempo',
    'Optimization Preferences': 'Preferenze di Ottimizzazione',
    'Avoid Tolls': 'Evita Pedaggi',
    'Prefer Charging Stations': 'Preferisci Stazioni di Ricarica',
    'Avoid Low Emission Zones': 'Evita Zone a Basse Emissioni',
    'Max Distance (km)': 'Distanza Massima (km)',
    'Distance': 'Distanza',
    'Estimated Time': 'Tempo Stimato',
    'Vehicle': 'Veicolo',
    'Energy Consumption': 'Consumo Energetico',
    'Charging Stops': 'Soste di Ricarica',
    'ZTL Compliance': 'Conformità ZTL',
    'Compliant': 'Conforme',
    'Not Compliant': 'Non Conforme',
    'This optimized route contributes to your sustainability goals by:': 'Questo percorso ottimizzato contribuisce ai tuoi obiettivi di sostenibilità:',
    'Reducing carbon emissions through modal shift from road to rail': 'Riducendo le emissioni di carbonio attraverso il passaggio dal trasporto su strada a quello ferroviario',
    'Using zero-emission electric vehicles for last-mile delivery': 'Utilizzando veicoli elettrici a zero emissioni per la consegna dell\'ultimo miglio',
    'Minimizing urban congestion through efficient routing': 'Minimizzando la congestione urbana attraverso un routing efficiente',
    'Ensuring compliance with low-emission zone regulations': 'Garantendo la conformità alle normative sulle zone a basse emissioni',
    'Optimized Route Results': 'Risultati del Percorso Ottimizzato',
    'Traffic Conditions': 'Condizioni del Traffico',
    'Charging Infrastructure': 'Infrastruttura di Ricarica',
    'Low Emission Zones': 'Zone a Basse Emissioni',
    'Delivery Windows': 'Finestre di Consegna',
    'Electric Van': 'Furgone Elettrico',
    'Cargo Bike': 'Bicicletta da Carico',
    'mapView': 'Visualizzazione Mappa',
    'Origin': 'Origine',
    'Destination': 'Destinazione',

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
    'Create certified sustainability reports for your intermodal logistics operations': 'Crea report di sostenibilità certificati per le tue operazioni logistiche intermodali',
    'Select report period': 'Seleziona periodo del report',
    'Monthly': 'Mensile',
    'Quarterly': 'Trimestrale',
    'Annual': 'Annuale',
    'Generating Report': 'Generazione Report',
    'generateReport': 'Genera Report',
    'Total Shipments': 'Spedizioni Total',
    'Delivered Shipments': 'Spedizioni Consegnate',
    'Delivery Success Rate': 'Tasso di Successo Consegne',
    'Road Equivalent CO₂': 'CO₂ Equivalente Strada',
    'CO₂ per Shipment': 'CO₂ per Spedizione',
    'CO₂ Reduction': 'Riduzione CO₂',
    'CO₂ Reduction Percentage': 'Percentuale di Riduzione CO₂',
    'Rail Shipments': 'Spedizioni Ferroviarie',
    'Road Shipments Avoided': 'Spedizioni su Strada Evitate',
    'Congestion Reduction': 'Riduzione Congestione',
    'Modal Shift Efficiency': 'Efficienza Cambio Modale',
    'Compliance Standard': 'Standard di Conformità',
    'Verification Date': 'Data di Verifica',
    'Verified By': 'Verificato Da',
    'Carbon Intensity': 'Intensità di Carbonio',
    'Sustainability Report Summary': 'Riepilogo Report di Sostenibilità',
    'Sustainability Metrics': 'Metriche di Sostenibilità',
    'Sustainability Insights': 'Insight di Sostenibilità',
    'Carbon Emission Reduction': 'Riduzione Emissioni di Carbonio',
    'Modal Shift Success': 'Successo Cambio Modale',
    'Urban Congestion Relief': 'Riduzione Congestione Urbana',
    'Continuous Improvement': 'Miglioramento Continuo',
    'By utilizing rail transport for long-haul freight and electric vehicles for last-mile delivery, you have significantly reduced carbon emissions compared to traditional road transport.': 'Utilizzando il trasporto ferroviario per il trasporto merci a lungo raggio e veicoli elettrici per la consegna dell\'ultimo miglio, hai significativamente ridotto le emissioni di carbonio rispetto al trasporto su strada tradizionale.',
    'The shift from road to rail transport has reduced highway congestion and lowered the environmental impact of your logistics operations.': 'Il passaggio dal trasporto su strada a quello ferroviario ha ridotto la congestione delle autostrade e diminuito l\'impatto ambientale delle tue operazioni logistiche.',
    'Electric cargo bikes and vans for last-mile delivery have reduced urban traffic congestion and improved air quality in city centers.': 'Le biciclette da carico e i furgoni elettrici per la consegna dell\'ultimo miglio hanno ridotto la congestione del traffico urbano e migliorato la qualità dell\'aria nei centri città.',
    'GreenPath Analytics provides ongoing optimization and reporting to help you continuously improve your sustainability performance and meet ESG goals.': 'GreenPath Analytics fornisce ottimizzazione e reporting continui per aiutarti a migliorare costantemente le tue prestazioni di sostenibilità e raggiungere gli obiettivi ESG.',
    'This report certifies your sustainability achievements and can be used for ESG compliance reporting.': 'Questo report certifica i tuoi risultati di sostenibilità e può essere utilizzato per la reportistica di conformità ESG.',
    'Report downloaded successfully!': 'Report scaricato con successo!',
    'Sustainability report generated successfully!': 'Report di sostenibilità generato con successo!',
    'Failed to load sustainability data': 'Impossibile caricare i dati di sostenibilità',
    'Failed to generate sustainability report': 'Impossibile generare il report di sostenibilità',

    // General
    'Failed to load dashboard data': 'Impossibile caricare i dati della dashboard',
    'Failed to load route optimizer data': 'Impossibile caricare i dati dell\'ottimizzatore di percorsi',
    'Failed to optimize route': 'Impossibile ottimizzare il percorso',
    'Please select shipment, origin hub, and destination hub': 'Seleziona spedizione, hub di origine e hub di destinazione',
    'Invalid selection': 'Selezione non valida',
    'Refresh Data': 'Aggiorna Dati',
    'Refreshing...': 'Aggiornamento in corso...',
    'Failed to sign in': 'Accesso fallito',
    'Failed to sign up': 'Registrazione fallita',
    'Failed to sign out': 'Disconnessione fallita',
    'Welcome back!': 'Bentornato!',
    'You have been signed out': 'Sei stato disconnesso',
    'Sign up successful! Please check your email for verification.': 'Registrazione avvenuta con successo! Controlla la tua email per la verifica.',
    'Shipment data updated in real-time': 'Dati spedizione aggiornati in tempo reale'
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