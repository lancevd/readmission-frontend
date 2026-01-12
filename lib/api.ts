const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface PatientData {
  time_in_hospital: string;
  num_lab_procedures: string;
  num_medications: string;
  num_procedures: string;
  number_inpatient: string;
  number_outpatient: string;
  number_emergency: string;
  number_diagnoses: string;
  age: string;
  gender: string;
}

export interface PredictionResponse {
  success: boolean;
  prediction: {
    probability: number;
    probabilityPercent: number;
    rawProbability: number;
    riskLevel: 'low' | 'medium' | 'high';
    riskCategory: string;
    threshold: number;
    confidence: 'high' | 'low';
    requiresReview: boolean;
  };
  improvements: {
    ageSpecificThreshold: boolean;
    ruleBasedAdjustments: boolean;
    adjustmentMade: number;
  };
  metadata: {
    modelVersion: string;
    timestamp: string;
    fairnessImprovements: string;
  };
  disclaimer: string;
}

export interface ErrorResponse {
  error: string;
  message?: string;
  missingFields?: string[];
}

export interface FeatureImportance {
  feature: string;
  displayName: string;
  importance: number;
  importancePercent: number;
  contribution: number;
  value: string;
}

export interface ExplanationResponse {
  success: boolean;
  prediction: {
    probability: number;
    probabilityPercent: number;
    riskLevel: 'low' | 'medium' | 'high';
    riskCategory: string;
    threshold: number;
  };
  explanation: {
    summary: string;
    topFeatures: FeatureImportance[];
    allFeatures: FeatureImportance[];
  };
  metadata: {
    modelVersion: string;
    timestamp: string;
  };
  disclaimer: string;
}

export async function predictReadmission(
  patientData: PatientData
): Promise<PredictionResponse> {
  const response = await fetch(`${API_URL}/api/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patientData),
  });

  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.message || errorData.error || 'Prediction failed');
  }

  return response.json();
}

export async function explainPrediction(
  patientData: PatientData
): Promise<ExplanationResponse> {
  const response = await fetch(`${API_URL}/api/explain`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patientData),
  });

  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.message || errorData.error || 'Explanation failed');
  }

  return response.json();
}

export async function checkAPIHealth(): Promise<{
  status: string;
  timestamp: string;
  model: string;
  database: string;
}> {
  const response = await fetch(`${API_URL}/api/health`);

  if (!response.ok) {
    throw new Error('API health check failed');
  }

  return response.json();
}
