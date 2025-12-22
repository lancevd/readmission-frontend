"use client";

import { useState } from "react";
import PatientForm from "@/components/PatientForm";
import PredictionResult from "@/components/PredictionResult";
import { Button } from "@/components/ui/button";
import type { PredictionResponse } from "@/lib/api";

export default function PredictPage() {
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);

  const handlePredictionResult = (result: PredictionResponse) => {
    setPredictionResult(result);
    // Scroll to results
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleNewPrediction = () => {
    setPredictionResult(null);
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
          <div id="results" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Results</h2>
              <Button variant="outline" onClick={handleNewPrediction}>
                New Prediction
              </Button>
            </div>
            <PredictionResult result={predictionResult} />
          </div>
        )}
      </div>
    </div>
  );
}
