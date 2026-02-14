"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { ExplanationResponse } from "@/lib/api";

interface ExplanationDisplayProps {
  explanation: ExplanationResponse;
  showAllFeatures?: boolean;
}

export default function ExplanationDisplay({
  explanation,
  showAllFeatures = false
}: ExplanationDisplayProps) {
  const { prediction, explanation: explanationData, disclaimer } = explanation;
  const { summary, topFeatures, allFeatures } = explanationData;

  const getContributionColor = (contribution: number) => {
    if (contribution > 5) return "text-red-600";
    if (contribution > 0) return "text-orange-500";
    if (contribution < -5) return "text-green-600";
    if (contribution < 0) return "text-green-500";
    return "text-gray-600";
  };

  const getContributionDirection = (contribution: number) => {
    if (contribution > 0) return "↑ Increases";
    if (contribution < 0) return "↓ Decreases";
    return "Neutral";
  };

  const featuresToDisplay = showAllFeatures ? allFeatures : topFeatures;

  return (
    <div className="space-y-6">
      {/* Explanation Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Prediction Explanation</CardTitle>
          <CardDescription>
            Understanding the factors contributing to this risk assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription className="text-sm leading-relaxed">
              {summary}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Feature Importance */}
      <Card>
        <CardHeader>
          <CardTitle>Contributing Factors</CardTitle>
          <CardDescription>
            Top factors influencing the readmission risk prediction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {featuresToDisplay.map((feature, index) => (
              <div
                key={feature.feature}
                className="flex items-start justify-between gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="font-semibold text-gray-900">
                      {feature.displayName}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Value:</span>{" "}
                    <span className="font-mono">{feature.value}</span>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-xs text-gray-500">Importance</span>
                    <Badge
                      variant={
                        feature.importancePercent > 5
                          ? "danger"
                          : feature.importancePercent > 2
                          ? "warning"
                          : "default"
                      }
                    >
                      {feature.importancePercent.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className={`text-sm font-medium ${getContributionColor(feature.contribution)}`}>
                    {getContributionDirection(feature.contribution)} risk
                  </div>
                  <div className="text-xs text-gray-500">
                    {feature.contribution > 0 ? "+" : ""}
                    {feature.contribution.toFixed(1)}pp
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!showAllFeatures && allFeatures.length > topFeatures.length && (
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Showing top {topFeatures.length} of {allFeatures.length} features
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feature Importance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Feature Importance Chart</CardTitle>
          <CardDescription>
            Visual representation of feature contributions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {featuresToDisplay.slice(0, 8).map((feature) => {
              const maxImportance = Math.max(...topFeatures.map(f => f.importancePercent));
              const widthPercent = (feature.importancePercent / maxImportance) * 100;
              const isPositive = feature.contribution > 0;

              return (
                <div key={feature.feature} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-gray-700">
                      {feature.displayName}
                    </span>
                    <span className="text-gray-500">
                      {feature.importancePercent.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full flex items-center px-2 text-xs font-medium text-white ${
                        isPositive ? "bg-red-500" : "bg-green-500"
                      }`}
                      style={{ width: `${Math.max(widthPercent, 10)}%` }}
                    >
                      {isPositive ? "↑" : "↓"} {Math.abs(feature.contribution).toFixed(1)}pp
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Alert variant="warning">
        <AlertDescription className="text-xs">
          {/* <strong>Important:</strong> {disclaimer} */}
        </AlertDescription>
      </Alert>
    </div>
  );
}
