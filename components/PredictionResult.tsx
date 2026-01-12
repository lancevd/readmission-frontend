"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { PredictionResponse } from "@/lib/api";

interface PredictionResultProps {
  result: PredictionResponse;
}

export default function PredictionResult({ result }: PredictionResultProps) {
  const { prediction, metadata, disclaimer, improvements } = result;
  const {
    probability,
    probabilityPercent,
    rawProbability,
    riskLevel,
    riskCategory,
    confidence,
    requiresReview,
    threshold
  } = prediction;

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "success";
      case "medium":
        return "warning";
      case "high":
        return "danger";
      default:
        return "default";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "low":
        return "✓";
      case "medium":
        return "⚠";
      case "high":
        return "⚠";
      default:
        return "•";
    }
  };

  const getRiskDescription = (level: string) => {
    switch (level) {
      case "low":
        return "This patient has a low probability of readmission within 30 days. Standard discharge protocols may be appropriate.";
      case "medium":
        return "This patient has a moderate probability of readmission within 30 days. Consider enhanced discharge planning and follow-up care.";
      case "high":
        return "This patient has a high probability of readmission within 30 days. Intensive discharge planning, patient education, and close follow-up are recommended.";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Prediction Results</CardTitle>
          <CardDescription>
            Generated on {new Date(metadata.timestamp).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Review Alert */}
          {requiresReview && (
            <Alert variant="warning">
              <AlertDescription>
                <strong>Human Review Recommended:</strong> This prediction has low confidence
                (probability near threshold boundary). Clinical judgment should be prioritized
                over model prediction for this case.
              </AlertDescription>
            </Alert>
          )}

          {/* Risk Level Badge */}
          <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
            <div className="text-center space-y-4">
              <div className="text-6xl">{getRiskIcon(riskLevel)}</div>
              <div>
                <Badge
                  variant={getRiskColor(riskLevel) as any}
                  className="text-lg px-6 py-2"
                >
                  {riskCategory}
                </Badge>
              </div>
              <div className="text-4xl font-bold text-gray-900">
                {probabilityPercent.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">
                Probability of Readmission within 30 Days
              </div>
            </div>
          </div>

          {/* Risk Description */}
          <Alert>
            <AlertDescription className="text-sm">
              {getRiskDescription(riskLevel)}
            </AlertDescription>
          </Alert>

          {/* Technical Details */}
          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <div className="text-sm font-medium text-gray-500">Raw Probability</div>
              <div className="text-lg font-semibold">
                {(rawProbability * 100).toFixed(2)}%
              </div>
              <div className="text-xs text-gray-500">Before adjustments</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Adjusted Probability</div>
              <div className="text-lg font-semibold">
                {probabilityPercent.toFixed(2)}%
              </div>
              <div className="text-xs text-gray-500">
                {improvements.adjustmentMade > 0 && `+${(improvements.adjustmentMade * 100).toFixed(1)}%`}
                {improvements.adjustmentMade < 0 && `${(improvements.adjustmentMade * 100).toFixed(1)}%`}
                {improvements.adjustmentMade === 0 && 'No adjustment'}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Confidence Level</div>
              <div className="text-lg font-semibold">
                <Badge variant={confidence === 'high' ? 'success' : 'warning'}>
                  {confidence.toUpperCase()}
                </Badge>
              </div>
              <div className="text-xs text-gray-500">
                {confidence === 'high' ? 'Far from threshold' : 'Near threshold boundary'}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Age-Specific Threshold</div>
              <div className="text-lg font-semibold">{threshold.toFixed(2)}</div>
              <div className="text-xs text-gray-500">
                {threshold !== 0.5 ? 'Adjusted for age group' : 'Standard threshold'}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Model Version</div>
              <div className="text-lg font-semibold">{metadata.modelVersion}</div>
              <div className="text-xs text-gray-500">
                {metadata.fairnessImprovements || 'Standard model'}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Risk Classification</div>
              <div className="text-lg font-semibold capitalize">{riskLevel}</div>
              <div className="text-xs text-gray-500">
                {requiresReview ? 'Review recommended' : 'Standard classification'}
              </div>
            </div>
          </div>

          {/* Visual Risk Bar */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">Risk Meter</div>
            <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden flex">
              <div
                className="bg-green-500 flex items-center justify-center text-xs text-white font-medium"
                style={{ width: "30%" }}
              >
                Low
              </div>
              <div
                className="bg-yellow-500 flex items-center justify-center text-xs text-white font-medium"
                style={{ width: "20%" }}
              >
                Med
              </div>
              <div
                className="bg-red-500 flex items-center justify-center text-xs text-white font-medium"
                style={{ width: "50%" }}
              >
                High
              </div>
            </div>
            <div className="relative w-full h-2">
              <div
                className="absolute top-0 h-2 w-1 bg-gray-900"
                style={{ left: `${probabilityPercent}%` }}
              >
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gray-900 rounded-full" />
              </div>
            </div>
          </div>

          {/* Clinical Disclaimer */}
          <Alert variant="warning">
            <AlertDescription className="text-xs">
              <strong>Important:</strong> {disclaimer}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Interpretation Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Understanding the Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Badge variant="success" className="mt-0.5">Low</Badge>
              <div className="flex-1">
                <div className="font-medium">Low Risk (&lt;30%)</div>
                <div className="text-gray-600">
                  Patient has a low likelihood of readmission. Standard discharge protocols are typically appropriate.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="warning" className="mt-0.5">Med</Badge>
              <div className="flex-1">
                <div className="font-medium">Medium Risk (30-50%)</div>
                <div className="text-gray-600">
                  Patient has moderate readmission risk. Consider enhanced discharge planning and follow-up care.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="danger" className="mt-0.5">High</Badge>
              <div className="flex-1">
                <div className="font-medium">High Risk (≥50%)</div>
                <div className="text-gray-600">
                  Patient has elevated readmission risk. Intensive discharge planning, patient education, and close follow-up recommended.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
