"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, ArrowRightLeft, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { predictStroke, type PatientInput } from "@/lib/stroke-prediction";
import { RiskGauge } from "./risk-gauge";

export function WhatIfSimulator() {
  const baseForm: PatientInput = {
    gender: "Male",
    age: 65,
    hypertension: true,
    heart_disease: false,
    ever_married: "Yes",
    work_type: "Private",
    residence_type: "Urban",
    avg_glucose_level: 220,
    bmi: 32,
    smoking_status: "smokes",
  };

  const [current, setCurrent] = useState(baseForm);
  const [originalRisk, setOriginalRisk] = useState(0);
  const [newRisk, setNewRisk] = useState(0);

  useEffect(() => {
    const r = predictStroke(baseForm);
    setOriginalRisk(r.risk_score);
    setNewRisk(r.risk_score);
  }, []);

  const updateAndPredict = useCallback((updated: PatientInput) => {
    setCurrent(updated);
    const r = predictStroke(updated);
    setNewRisk(r.risk_score);
  }, []);

  const handleReset = () => {
    setCurrent(baseForm);
    const r = predictStroke(baseForm);
    setNewRisk(r.risk_score);
  };

  const improvement = originalRisk - newRisk;
  const improvementColor =
    improvement > 10 ? "text-stroke-safe" : improvement > 0 ? "text-stroke-warning" : "text-muted-foreground";

  const riskColor =
    newRisk < 15
      ? "text-stroke-safe"
      : newRisk < 50
        ? "text-stroke-warning"
        : "text-stroke-danger";
  const riskLabel =
    newRisk < 15 ? "Low Risk" : newRisk < 50 ? "Moderate Risk" : "High Risk";

  return (
    <section id="whatif" className="py-20 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-stroke-safe/3 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stroke-safe/10 border border-stroke-safe/20 mb-4">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stroke-safe" />
            <span className="text-xs font-semibold text-stroke-safe uppercase tracking-wider">
              Interactive Simulator
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            What-If <span className="text-stroke-safe">Risk Reduction</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Adjust modifiable risk factors and watch how lifestyle changes impact stroke risk in real-time.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Left: Sliders */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4 text-primary" />
                    Adjust Risk Factors
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs">
                    Reset All
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Scenario: A 65-year-old male smoker with hypertension and elevated glucose
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Glucose */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Avg Glucose Level</Label>
                    <span className="text-sm font-semibold tabular-nums">{current.avg_glucose_level} mg/dL</span>
                  </div>
                  <Slider
                    value={[current.avg_glucose_level]}
                    onValueChange={([v]) =>
                      updateAndPredict({ ...current, avg_glucose_level: v })
                    }
                    min={50}
                    max={350}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>50</span>
                    <span className="text-stroke-safe">Normal (&lt;120)</span>
                    <span className="text-stroke-danger">High (&gt;200)</span>
                    <span>350</span>
                  </div>
                </div>

                {/* BMI */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">BMI</Label>
                    <span className="text-sm font-semibold tabular-nums">{current.bmi}</span>
                  </div>
                  <Slider
                    value={[current.bmi]}
                    onValueChange={([v]) =>
                      updateAndPredict({ ...current, bmi: v })
                    }
                    min={12}
                    max={60}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>12</span>
                    <span className="text-stroke-safe">Normal (18.5-24.9)</span>
                    <span className="text-stroke-danger">Obese (&gt;30)</span>
                    <span>60</span>
                  </div>
                </div>

                {/* Age */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Age</Label>
                    <span className="text-sm font-semibold tabular-nums">{current.age} years</span>
                  </div>
                  <Slider
                    value={[current.age]}
                    onValueChange={([v]) =>
                      updateAndPredict({ ...current, age: v })
                    }
                    min={1}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>1</span>
                    <span>30</span>
                    <span className="text-stroke-warning">55+</span>
                    <span className="text-stroke-danger">65+</span>
                    <span>100</span>
                  </div>
                </div>

                {/* Toggles */}
                <div className="grid sm:grid-cols-3 gap-4 pt-2">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30">
                    <Label className="text-sm font-medium">Hypertension</Label>
                    <Switch
                      checked={current.hypertension}
                      onCheckedChange={(v) =>
                        updateAndPredict({ ...current, hypertension: v })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30">
                    <Label className="text-sm font-medium">Heart Disease</Label>
                    <Switch
                      checked={current.heart_disease}
                      onCheckedChange={(v) =>
                        updateAndPredict({ ...current, heart_disease: v })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30">
                    <Label className="text-sm font-medium">Smoking</Label>
                    <Switch
                      checked={current.smoking_status === "smokes"}
                      onCheckedChange={(v) =>
                        updateAndPredict({
                          ...current,
                          smoking_status: v ? "smokes" : "never_smoked",
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right: Result */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1 lg:sticky lg:top-24 space-y-4"
          >
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground text-center">
                  Adjusted Risk Level
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center pb-6">
                <RiskGauge
                  value={newRisk}
                  size={180}
                  strokeWidth={12}
                  label={riskLabel}
                  color={riskColor}
                />
              </CardContent>
            </Card>

            {/* Improvement Card */}
            <motion.div
              key={newRisk}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="p-5 rounded-2xl border border-stroke-safe/30 bg-stroke-safe/5 text-center"
            >
              <TrendingDown className="w-6 h-6 text-stroke-safe mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-1">Risk Reduction</p>
              <p className={`text-3xl font-bold ${improvementColor}`}>
                {improvement > 0 ? `-${improvement.toFixed(1)}%` : `${Math.abs(improvement).toFixed(1)}%`}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                {originalRisk.toFixed(1)}% → {newRisk.toFixed(1)}%
              </p>
              <Badge
                variant="outline"
                className={`mt-3 ${
                  improvement > 20
                    ? "border-stroke-safe/40 text-stroke-safe"
                    : improvement > 5
                      ? "border-stroke-warning/40 text-stroke-warning"
                      : "border-border text-muted-foreground"
                }`}
              >
                {improvement > 20
                  ? "Significant Improvement"
                  : improvement > 5
                    ? "Moderate Improvement"
                    : improvement > 0
                      ? "Slight Improvement"
                      : "No Change"}
              </Badge>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}