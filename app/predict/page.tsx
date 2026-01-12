"use client";

import { useState } from "react";
import PatientForm from "@/components/PatientForm";
import PredictionResult from "@/components/PredictionResult";
import ExplanationDisplay from "@/components/ExplanationDisplay";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { PredictionResponse, ExplanationResponse, PatientData } from "@/lib/api";
import { explainPrediction } from "@/lib/api";

export default function PredictPage() {
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);
  const [explanationResult, setExplanationResult] = useState<ExplanationResponse | null>(null);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [explanationError, setExplanationError] = useState<string | null>(null);

  const handlePredictionResult = (result: PredictionResponse, data: PatientData) => {
    setPredictionResult(result);
    setPatientData(data);
    setExplanationResult(null); // Reset explanation when new prediction is made
    setExplanationError(null);
    // Scroll to results
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleGetExplanation = async () => {
    if (!patientData) return;

    setIsLoadingExplanation(true);
    setExplanationError(null);

    try {
      const explanation = await explainPrediction(patientData);
      setExplanationResult(explanation);
      // Scroll to explanation
      setTimeout(() => {
        document.getElementById("explanation")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      setExplanationError(error instanceof Error ? error.message : "Failed to get explanation");
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  const handleNewPrediction = () => {
    setPredictionResult(null);
    setExplanationResult(null);
    setPatientData(null);
    setExplanationError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Readmission Risk Prediction
          </h1>
          <p className="text-gray-600">
            Enter patient information to assess the risk of hospital readmission within 30 days
          </p>
        </div>

        {/* Patient Form */}
        <PatientForm onPredictionResult={handlePredictionResult} />

        {/* Results Section */}
        {predictionResult && (
          <div id="results" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Results</h2>
              <Button variant="outline" onClick={handleNewPrediction}>
                New Prediction
              </Button>
            </div>
            <PredictionResult result={predictionResult} />

            {/* Explanation Button */}
            {!explanationResult && (
              <div className="flex justify-center">
                <Button
                  onClick={handleGetExplanation}
                  disabled={isLoadingExplanation}
                  size="lg"
                  className="gap-2"
                >
                  {isLoadingExplanation ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Generating Explanation...
                    </>
                  ) : (
                    <>
                      <span>🔍</span>
                      Explain This Prediction
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Explanation Error */}
            {explanationError && (
              <Alert variant="destructive">
                <AlertDescription>
                  <strong>Error:</strong> {explanationError}
                </AlertDescription>
              </Alert>
            )}

            {/* Explanation Display */}
            {explanationResult && (
              <div id="explanation">
                <ExplanationDisplay explanation={explanationResult} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
