export type District = 'Nagpur' | 'Wardha' | 'Amravati' | 'Chandrapur' | 'Yavatmal' | 'Bhandara';

export type Crop = 'Soybean' | 'Cotton' | 'Paddy' | 'Wheat' | 'Tur';

export type Season = 'Kharif' | 'Rabi';

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface DistrictInfo {
  id: District;
  name: string;
  headquarters: string;
  totalCultivableAreaHa: number; // in hectares
  primarySoil: string;
  majorMandi: string;
  avgRainfallMm: number;
  irrigationPct: number;
  latitude: number;
  longitude: number;
  description: string;
}

export interface CropInfo {
  id: Crop;
  name: string;
  hindiName: string;
  season: Season;
  durationDays: number;
  benchmarkYieldQHa: number; // Quintals per Hectare
  mspPriceRsQ: number; // Minimum Support Price in INR per Quintal
  criticalRainfallRangeMm: [number, number];
  waterRequirement: 'Low' | 'Medium' | 'High';
  soilSuitability: string;
  iconName: string;
}

export interface HistoricalRecord {
  year: number;
  district: District;
  crop: Crop;
  yieldQHa: number;
  productionTonnes: number;
  monsoonRainfallMm: number;
  drySpellDays: number;
  soilNPKRatio: string;
  soilOrganicCarbon: number;
  mandiPriceRsQ: number;
  predictedYieldQHa?: number;
}

export interface PipelineAuditMetric {
  issueType: string;
  description: string;
  affectedRows: number;
  totalRows: number;
  pctAffected: number;
  resolutionMethod: string;
  exampleRaw: string;
  exampleClean: string;
}

export interface ModelBenchmark {
  modelId: string;
  name: string;
  category: 'Baseline' | 'Linear' | 'Ensemble Tree' | 'Gradient Boosting';
  valMAE: number; // Quintals / Ha
  testMAE: number;
  valRMSE: number;
  testRMSE: number;
  r2Score: number;
  recallAt80Precision: number; // %
  trainingTimeSec: number;
  isBest?: boolean;
  notes: string;
}

export interface SHAPFeatureDriver {
  featureKey: string;
  featureName: string;
  category: 'Climate' | 'Soil' | 'Market' | 'Agronomy';
  meanAbsSHAP: number; // in Quintals / Ha impact
  direction: 'positive' | 'negative' | 'bidirectional';
  explanation: string;
}

export interface ProcurementRecommendation {
  district: District;
  crop: Crop;
  predictedYieldQHa: number;
  historicalYieldQHa: number;
  yieldChangePct: number;
  expectedProductionTonnes: number;
  procurementDemandTonnes: number;
  supplyDeficitSurplusTonnes: number;
  riskLevel: RiskLevel;
  mandiPriceRsQ: number;
  mspRsQ: number;
  priceVsMspPct: number;
  priorityScore: number; // 0 to 100
  actionCode: 'FORWARD_CONTRACT' | 'SPOT_HARVEST' | 'DIVERT_SOURCING' | 'MONITOR_CLOSELY';
  actionTitle: string;
  actionDetails: string;
}

export interface SlideContent {
  slideNumber: number;
  title: string;
  kicker: string;
  summary: string;
  keyPoints: string[];
  metrics: { label: string; value: string; context: string }[];
  strategicTakeaway: string;
}
