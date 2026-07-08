"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ChevronRight,
  Loader2,
  RotateCcw,
  ArrowDown,
  Info,
  ServerCrash,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  predictStroke,
  type PatientInput,
  type PredictionResult,
} from "@/lib/stroke-prediction";
import { RiskGauge } from "./risk-gauge";
import { ResultsDashboard } from "./results-dashboard";

export function PredictSection() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [liveRisk, setLiveRisk] = useState<number | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<PatientInput>({
    gender: "Male",
    age: 45,
    hypertension: false,
    heart_disease: false,
    ever_married: "No",
    work_type: "Private",
    residence_type: "Urban",
    avg_glucose_level: 100,
    bmi: 25,
    smoking_status: "never_smoked",
  });

  const updateField = useCallback(
    <K extends keyof PatientInput>(key: K, value: PatientInput[K]) => {
      setForm((prev) => {
        const updated = { ...prev, [key]: value };
        try {
          const pred = predictStroke(updated);
          setLiveRisk(pred.risk_score);
        } catch {
          // ignore
        }
        return updated;
      });
    },
    []
  );

  useEffect(() => {
    const pred = predictStroke(form);
    setLiveRisk(pred.risk_score);
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (json.success && json.data) {
        const d = json.data;
        const prediction: PredictionResult = {
          risk_score: d.risk_score,
          risk_level: d.risk_level,
          confidence: d.confidence || 90,
          shap_values: d.shap_values || [],
          model_results: (d.model_results || []).map((mr: { model_name: string; prediction: number; confidence: string }) => ({
            model_name: mr.model_name,
            prediction: mr.prediction,
            confidence: mr.confidence as "Strong" | "Moderate" | "Weak",
          })),
          recommendations: d.recommendations || [],
        };
        setResult(prediction);
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      } else {
        setError(json.error || "An unknown error occurred.");
      }
    } catch (err) {
      setError("Network error  could not reach the server. Please check your connection.");
    }

    setLoading(false);
  };

  const handleReset = () => {
    const fresh: PatientInput = {
      gender: "Male",
      age: 45,
      hypertension: false,
      heart_disease: false,
      ever_married: "No",
      work_type: "Private",
      residence_type: "Urban",
      avg_glucose_level: 100,
      bmi: 25,
      smoking_status: "never_smoked",
    };
    setForm(fresh);
    setResult(null);
    setError(null);
    const pred = predictStroke(fresh);
    setLiveRisk(pred.risk_score);
  };

  const riskColor =
    liveRisk === null
      ? "text-muted-foreground"
      : liveRisk < 15
        ? "text-stroke-safe"
        : liveRisk < 50
          ? "text-stroke-warning"
          : "text-stroke-danger";

  const riskLabel =
    liveRisk === null
      ? "--"
      : liveRisk < 15
        ? "Low Risk"
        : liveRisk < 50
          ? "Moderate Risk"
          : "High Risk";

  return (
    <section id="predict" className="py-20 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-primary/3 blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] rounded-full bg-stroke-warning/3 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Stroke Risk <span className="text-primary">Assessment</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Enter patient health data below. The risk gauge updates in real-time
            as you type. Hit &quot;Analyze&quot; for a full explainable report.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Patient Health Profile</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      Fill in all fields for the most accurate prediction
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Gender</Label>
                    <Select
                      value={form.gender}
                      onValueChange={(v) => updateField("gender", v as PatientInput["gender"])}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Age</Label>
                    <Input
                      type="number"
                      min={0}
                      max={120}
                      value={form.age}
                      onChange={(e) => updateField("age", Number(e.target.value))}
                      className="h-11"
                    />
                  </div>
                </div>

                <Separator className="opacity-50" />

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30">
                    <div>
                      <Label className="text-sm font-medium">Hypertension</Label>
                      <p className="text-[11px] text-muted-foreground">High blood pressure</p>
                    </div>
                    <Switch
                      checked={form.hypertension}
                      onCheckedChange={(v) => updateField("hypertension", v)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30">
                    <div>
                      <Label className="text-sm font-medium">Heart Disease</Label>
                      <p className="text-[11px] text-muted-foreground">Pre-existing condition</p>
                    </div>
                    <Switch
                      checked={form.heart_disease}
                      onCheckedChange={(v) => updateField("heart_disease", v)}
                    />
                  </div>
                </div>

                <Separator className="opacity-50" />

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Marital Status</Label>
                    <Select
                      value={form.ever_married}
                      onValueChange={(v) => updateField("ever_married", v as "Yes" | "No")}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Married</SelectItem>
                        <SelectItem value="No">Not Married</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Work Type</Label>
                    <Select
                      value={form.work_type}
                      onValueChange={(v) => updateField("work_type", v as PatientInput["work_type"])}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Private">Private Sector</SelectItem>
                        <SelectItem value="Self-employed">Self-Employed</SelectItem>
                        <SelectItem value="Govt_job">Government Job</SelectItem>
                        <SelectItem value="Children">Children</SelectItem>
                        <SelectItem value="Never_worked">Never Worked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator className="opacity-50" />

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Residence Type</Label>
                    <Select
                      value={form.residence_type}
                      onValueChange={(v) => updateField("residence_type", v as "Urban" | "Rural")}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Urban">Urban</SelectItem>
                        <SelectItem value="Rural">Rural</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Smoking Status</Label>
                    <Select
                      value={form.smoking_status}
                      onValueChange={(v) => updateField("smoking_status", v as PatientInput["smoking_status"])}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never_smoked">Never Smoked</SelectItem>
                        <SelectItem value="formerly_smoked">Formerly Smoked</SelectItem>
                        <SelectItem value="smokes">Currently Smokes</SelectItem>
                        <SelectItem value="Unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator className="opacity-50" />

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Average Glucose Level (mg/dL)</Label>
                    <Input
                      type="number"
                      min={50}
                      max={400}
                      step={0.1}
                      value={form.avg_glucose_level}
                      onChange={(e) => updateField("avg_glucose_level", Number(e.target.value))}
                      className="h-11"
                    />
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      Normal: 70-100 mg/dL
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Body Mass Index (BMI)</Label>
                    <Input
                      type="number"
                      min={10}
                      max={80}
                      step={0.1}
                      value={form.bmi}
                      onChange={(e) => updateField("bmi", Number(e.target.value))}
                      className="h-11"
                    />
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      Normal: 18.5-24.9
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={loading || form.age <= 0 || form.avg_glucose_level <= 0 || form.bmi <= 0}
                  className="w-full h-12 text-base font-semibold rounded-xl mt-4 gap-2"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Running Ensemble Analysis...
                    </>
                  ) : (
                    <>
                      Run Full Analysis
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 lg:sticky lg:top-24"
          >
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Live Risk Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center pb-6">
                <RiskGauge
                  value={liveRisk ?? 0}
                  size={200}
                  strokeWidth={14}
                  label={riskLabel}
                  color={riskColor}
                />
                <p className="text-xs text-muted-foreground text-center mt-4 max-w-[220px]">
                  Updates as you type. Click &quot;Run Full Analysis&quot; for detailed SHAP explanations.
                </p>
                {!result && !error && (
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="mt-6 text-muted-foreground"
                  >
                    <ArrowDown className="w-5 h-5 mx-auto" />
                    <p className="text-[10px] mt-1">Fill the form</p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="mt-12 max-w-2xl mx-auto"
            >
              <Card className="border-destructive/50 bg-destructive/5 shadow-sm">
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-destructive/10 p-3 mt-0.5">
                      <ServerCrash className="w-6 h-6 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-destructive mb-2 flex items-center gap-2">
                        <WifiOff className="w-4 h-4" />
                        Server Connection Error
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {error}
                      </p>
                      <div className="mt-4 p-3 rounded-lg bg-muted/50 border">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          How to fix:
                        </p>
                        <ol className="text-xs text-muted-foreground list-decimal list-inside space-y-1">
                          <li>Make sure the Python backend is running: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">uvicorn main:app --port 8000</code></li>
                          <li>Check that port 8000 is not in use by another application</li>
                          <li>Verify the <code className="bg-muted px-1.5 py-0.5 rounded text-xs">BACKEND_URL</code> in your API route matches the backend address</li>
                          <li>Try again after confirming the backend is running</li>
                        </ol>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSubmit}
                        className="mt-4 gap-2"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Retry Analysis
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              ref={resultRef}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="mt-12"
            >
              <ResultsDashboard result={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}