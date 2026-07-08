"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Shield,
  Lightbulb,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { PredictionResult } from "@/lib/stroke-prediction";

const riskConfig = {
  Low: {
    color: "bg-stroke-safe",
    textColor: "text-stroke-safe",
    borderColor: "border-stroke-safe/30",
    bgLight: "bg-stroke-safe/10",
    icon: CheckCircle,
    label: "Low Risk",
  },
  Moderate: {
    color: "bg-stroke-warning",
    textColor: "text-stroke-warning",
    borderColor: "border-stroke-warning/30",
    bgLight: "bg-stroke-warning/10",
    icon: AlertTriangle,
    label: "Moderate Risk",
  },
  High: {
    color: "bg-stroke-danger",
    textColor: "text-stroke-danger",
    borderColor: "border-stroke-danger/30",
    bgLight: "bg-stroke-danger/10",
    icon: AlertTriangle,
    label: "High Risk",
  },
};

export function ResultsDashboard({ result }: { result: PredictionResult }) {
  const config = riskConfig[result.risk_level];
  const RiskIcon = config.icon;

  const shapChartData = result.shap_values
    .filter((v) => v.feature !== "Base Risk (Population)")
    .map((v) => ({
      name: v.feature,
      contribution: v.direction === "increases" ? v.contribution : -v.contribution,
      fill: v.direction === "increases" ? "#ef4444" : "#22c55e",
    }))
    .reverse();

  return (
    <div className="space-y-6">
      {/* Risk Summary Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl border ${config.borderColor} ${config.bgLight}`}
      >
        <div className="flex items-center gap-3 flex-1">
          <div className={`w-12 h-12 rounded-xl ${config.bgLight} flex items-center justify-center`}>
            <RiskIcon className={`w-6 h-6 ${config.textColor}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-xl font-bold ${config.textColor}`}>
                {result.risk_score}%
              </h3>
              <Badge variant="outline" className={config.borderColor}>
                {config.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Ensemble confidence: {result.confidence.toFixed(1)}%
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Models agree</p>
          <p className="text-lg font-bold">
            {result.model_results.filter(
              (m) =>
                (result.risk_score < 15 && m.prediction < 30) ||
                (result.risk_score >= 15 &&
                  result.risk_score < 50 &&
                  m.prediction >= 10 &&
                  m.prediction < 70) ||
                (result.risk_score >= 50 && m.prediction >= 35)
            ).length}
            /{result.model_results.length}
          </p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* SHAP Explainability */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="border-border/60 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                SHAP Feature Contributions
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                How each factor contributed to this prediction. Red = increases risk, Green = decreases risk.
              </p>
            </CardHeader>
            <CardContent>
              {/* SHAP Bar Chart */}
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={shapChartData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                  >
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      axisLine={{ stroke: "var(--border)" }}
                      tickLine={false}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fontSize: 11, fill: "var(--foreground)" }}
                      width={75}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      formatter={(value: number) => [`${value.toFixed(1)}%`, "Contribution"]}
                    />
                    <Bar dataKey="contribution" radius={[0, 4, 4, 0]} barSize={18}>
                      {shapChartData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} fillOpacity={0.85} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <Separator className="my-4 opacity-50" />

              {/* Feature Detail List */}
              <div className="space-y-2.5">
                {result.shap_values
                  .filter((v) => v.feature !== "Base Risk (Population)")
                  .slice(0, 6)
                  .map((sv, i) => (
                    <motion.div
                      key={sv.feature}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.05 }}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {sv.direction === "increases" ? (
                          <TrendingUp className="w-4 h-4 text-stroke-danger" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-stroke-safe" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{sv.feature}</p>
                          <p className="text-[11px] text-muted-foreground">{sv.value}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-semibold ${
                            sv.direction === "increases"
                              ? "text-stroke-danger"
                              : "text-stroke-safe"
                          }`}
                        >
                          {sv.direction === "increases" ? "+" : ""}
                          {sv.contribution.toFixed(1)}%
                        </span>
                        <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              sv.direction === "increases" ? "bg-stroke-danger" : "bg-stroke-safe"
                            }`}
                            style={{
                              width: `${Math.min(sv.contribution * 3, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Model Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  Model Ensemble
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.model_results.map((model, i) => (
                  <motion.div
                    key={model.model_name}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.08 }}
                    className="space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-xs">{model.model_name}</span>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            model.confidence === "Strong"
                              ? "border-stroke-safe/40 text-stroke-safe"
                              : model.confidence === "Moderate"
                                ? "border-stroke-warning/40 text-stroke-warning"
                                : "border-stroke-danger/40 text-stroke-danger"
                          }`}
                        >
                          {model.confidence}
                        </Badge>
                        <span className="text-xs font-semibold tabular-nums w-12 text-right">
                          {model.prediction.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={model.prediction}
                      className="h-1.5"
                    />
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.recommendations.map((rec, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + i * 0.06 }}
                    className="flex gap-2.5 text-xs leading-relaxed"
                  >
                    <Info className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{rec}</span>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}