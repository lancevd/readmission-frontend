"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { predictReadmission, type PredictionResponse, type PatientData } from "@/lib/api";

const AGE_RANGES = [
  "[0-10)",
  "[10-20)",
  "[20-30)",
  "[30-40)",
  "[40-50)",
  "[50-60)",
  "[60-70)",
  "[70-80)",
  "[80-90)",
  "[90-100)",
];

const GENDERS = ["Female", "Male", "Unknown/Invalid"];

const patientSchema = z.object({
  time_in_hospital: z.string().min(1, "Required").refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 14,
    "Must be between 0-14 days"
  ),
  num_lab_procedures: z.string().min(1, "Required").refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0,
    "Must be a positive number"
  ),
  num_medications: z.string().min(1, "Required").refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0,
    "Must be a positive number"
  ),
  num_procedures: z.string().min(1, "Required").refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0,
    "Must be a positive number"
  ),
  number_inpatient: z.string().min(1, "Required").refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0,
    "Must be a positive number"
  ),
  number_outpatient: z.string().min(1, "Required").refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0,
    "Must be a positive number"
  ),
  number_emergency: z.string().min(1, "Required").refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0,
    "Must be a positive number"
  ),
  number_diagnoses: z.string().min(1, "Required").refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0,
    "Must be a positive number"
  ),
  age: z.string().min(1, "Please select an age range"),
  gender: z.string().min(1, "Please select a gender"),
});

type PatientFormData = z.infer<typeof patientSchema>;

interface PatientFormProps {
  onPredictionResult: (result: PredictionResponse, data: PatientData) => void;
}

export default function PatientForm({ onPredictionResult }: PatientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
  });

  const onSubmit = async (data: PatientFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await predictReadmission(data);
      onPredictionResult(result, data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Information</CardTitle>
        <CardDescription>
          Enter patient data to predict readmission risk within 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Alert variant="warning">
            {/* <AlertTitle>Disclaimer</AlertTitle>
            <AlertDescription>
              This tool is for research and educational purposes only. Do not use for clinical
              decision-making.
            </AlertDescription> */}
          </Alert>

          {/* Demographics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Demographics</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age Range *</Label>
                <Select id="age" {...register("age")}>
                  <option value="">Select age range</option>
                  {AGE_RANGES.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </Select>
                {errors.age && (
                  <p className="text-sm text-red-600">{errors.age.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select id="gender" {...register("gender")}>
                  <option value="">Select gender</option>
                  {GENDERS.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </Select>
                {errors.gender && (
                  <p className="text-sm text-red-600">{errors.gender.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Clinical Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Clinical Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time_in_hospital">Time in Hospital (days) *</Label>
                <Input
                  id="time_in_hospital"
                  type="number"
                  min="0"
                  max="14"
                  placeholder="e.g., 3"
                  {...register("time_in_hospital")}
                />
                {errors.time_in_hospital && (
                  <p className="text-sm text-red-600">{errors.time_in_hospital.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="num_lab_procedures">Number of Lab Procedures *</Label>
                <Input
                  id="num_lab_procedures"
                  type="number"
                  min="0"
                  placeholder="e.g., 44"
                  {...register("num_lab_procedures")}
                />
                {errors.num_lab_procedures && (
                  <p className="text-sm text-red-600">{errors.num_lab_procedures.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="num_medications">Number of Medications *</Label>
                <Input
                  id="num_medications"
                  type="number"
                  min="0"
                  placeholder="e.g., 15"
                  {...register("num_medications")}
                />
                {errors.num_medications && (
                  <p className="text-sm text-red-600">{errors.num_medications.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="num_procedures">Number of Procedures *</Label>
                <Input
                  id="num_procedures"
                  type="number"
                  min="0"
                  placeholder="e.g., 1"
                  {...register("num_procedures")}
                />
                {errors.num_procedures && (
                  <p className="text-sm text-red-600">{errors.num_procedures.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="number_diagnoses">Number of Diagnoses *</Label>
                <Input
                  id="number_diagnoses"
                  type="number"
                  min="0"
                  placeholder="e.g., 8"
                  {...register("number_diagnoses")}
                />
                {errors.number_diagnoses && (
                  <p className="text-sm text-red-600">{errors.number_diagnoses.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Prior Visit History */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Prior Visit History</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="number_inpatient">Inpatient Visits (prior year) *</Label>
                <Input
                  id="number_inpatient"
                  type="number"
                  min="0"
                  placeholder="e.g., 0"
                  {...register("number_inpatient")}
                />
                {errors.number_inpatient && (
                  <p className="text-sm text-red-600">{errors.number_inpatient.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="number_outpatient">Outpatient Visits (prior year) *</Label>
                <Input
                  id="number_outpatient"
                  type="number"
                  min="0"
                  placeholder="e.g., 0"
                  {...register("number_outpatient")}
                />
                {errors.number_outpatient && (
                  <p className="text-sm text-red-600">{errors.number_outpatient.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="number_emergency">Emergency Visits (prior year) *</Label>
                <Input
                  id="number_emergency"
                  type="number"
                  min="0"
                  placeholder="e.g., 0"
                  {...register("number_emergency")}
                />
                {errors.number_emergency && (
                  <p className="text-sm text-red-600">{errors.number_emergency.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Predicting..." : "Predict Risk"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setError(null);
              }}
              disabled={isSubmitting}
            >
              Clear Form
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
