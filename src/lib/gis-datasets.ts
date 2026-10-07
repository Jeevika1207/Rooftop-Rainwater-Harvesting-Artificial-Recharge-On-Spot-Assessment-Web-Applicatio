export type ImdRainfallData = {
  region: string;
  state: string;
  annualRainfallMm: number;
  monsoonMonths: string;
  averageRainyDays: number;
  maxDailyRainfallMm: number;
  source: string;
};

export type CgwbAquiferData = {
  aquiferType: string;
  lithology: string;
  preMonsoonDepthM: number;
  postMonsoonDepthM: number;
  waterTableCategory: 'Safe' | 'Semi-Critical' | 'Critical' | 'Over-Exploited';
  rechargeMethod: string;
  specificYieldPercent: number;
  source: string;
};

export type GisCatchmentData = {
  soilType: string;
  infiltrationRateMmHr: number;
  topographicalSlopePercent: number;
  elevationMeters: number;
  satelliteProvider: string;
};

export type RegionalGisProfile = {
  regionName: string;
  imd: ImdRainfallData;
  cgwb: CgwbAquiferData;
  gis: GisCatchmentData;
};

// Official Tamil Nadu IMD, CGWB & GIS Dataset Profile
export const TAMILNADU_DATASET: RegionalGisProfile = {
  regionName: 'Tamil Nadu State (IMD & CGWB Official Data)',
  imd: {
    region: 'Tamil Nadu & Puducherry',
    state: 'Tamil Nadu',
    annualRainfallMm: 1382,
    monsoonMonths: 'October - December (NE Monsoon) & June - September (SW Monsoon)',
    averageRainyDays: 52,
    maxDailyRainfallMm: 240,
    source: 'IMD Regional Meteorological Centre (RMC Chennai) / Climatological Normals',
  },
  cgwb: {
    aquiferType: 'Weathered & Fractured Charnockite / Crystalline Complex',
    lithology: 'Hard Rock Charnockite, Gneiss & Coastal Sedimentary Alluvium',
    preMonsoonDepthM: 8.2,
    postMonsoonDepthM: 2.8,
    waterTableCategory: 'Semi-Critical',
    rechargeMethod: 'Recharge Pit with Injection Shaft (Tamil Nadu RWH Spec)',
    specificYieldPercent: 3.0,
    source: 'CGWB State Ground Water Report - Tamil Nadu (NAQUIM)',
  },
  gis: {
    soilType: 'Red Loam, Black Soil & Coastal Alluvium',
    infiltrationRateMmHr: 35,
    topographicalSlopePercent: 1.2,
    elevationMeters: 10,
    satelliteProvider: 'ISRO BHUVAN Tamil Nadu Portal & Sentinel-2 GIS',
  },
};

export const REGIONAL_DATASETS: Record<string, RegionalGisProfile> = {
  tamilnadu: TAMILNADU_DATASET,
  chennai: TAMILNADU_DATASET,
};

/**
 * Returns Tamil Nadu IMD, CGWB & GIS dataset profile for the application
 */
export function getRegionalGisData(_lat?: number, _lon?: number): RegionalGisProfile {
  return TAMILNADU_DATASET;
}

/**
 * Format currency strictly in Indian Rupees (₹)
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
