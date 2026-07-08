"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, BarChart3 } from "lucide-react";

// Simulated analytics data (mirrors the Kaggle stroke dataset distribution)
const genderData = [
  { name: "Female", value: 2994, fill: "var(--chart-1)" },
  { name: "Male", value: 2115, fill: "var(--chart-3)" },
  { name: "Other", value: 1, fill: "var(--chart-5)" },
];

const ageStrokeData = [
  { range: "0-20", stroke: 0, noStroke: 587, rate: 0 },
  { range: "21-40", stroke: 14, noStroke: 1150, rate: 1.2 },
  { range: "41-60", stroke: 110, noStroke: 1680, rate: 6.1 },
  { range: "61-80", stroke: 120, noStroke: 1480, rate: 7.5 },
  { range: "80+", stroke: 5, noStroke: 74, rate: 6.3 },
];

const featureImportance = [
  { name: "Age", importance: 28.5 },
  { name: "Glucose", importance: 24.2 },
  { name: "BMI", importance: 15.8 },
  { name: "Hypertension", importance: 11.3 },
  { name: "Heart Disease", importance: 9.7 },
  { name: "Smoking", importance: 6.2 },
  { name: "Gender", importance: 2.8 },
  { name: "Work Type", importance: 1.5 },
];

const smokingData = [
  { name: "Never", value: 1892, stroke: 90 },
  { name: "Formerly", value: 885, stroke: 70 },
  { name: "Smokes", value: 789, stroke: 42 },
  { name: "Unknown", value: 1544, stroke: 47 },
];

const COLORS = ["var(--chart-1)", "var(--chart-3)", "var(--chart-5)", "var(--chart-2)"];

export function AnalyticsDashboard() {
  return (
    <section id="analytics" className="py-20 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-chart-5/3 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Database className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Dataset Insights
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Data <span className="text-primary">Analytics</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Explore the stroke prediction dataset with interactive visualizations. Understanding the data is key to trusting the model.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Total Patients", value: "5,110", sub: "records analyzed" },
            { label: "Stroke Cases", value: "249", sub: "4.9% of dataset" },
            { label: "No Stroke", value: "4,861", sub: "95.1% of dataset" },
            { label: "Features", value: "10", sub: "clinical attributes" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-4 rounded-xl border border-border bg-card/50 text-center"
            >
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs font-medium mt-0.5">{s.label}</p>
              <p className="text-[10px] text-muted-foreground">{s.sub}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Age Distribution & Stroke Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="border-border/60 h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Stroke Rate by Age Group
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Stroke incidence increases dramatically with age
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ageStrokeData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="range" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                      <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="stroke" name="Stroke Cases" fill="var(--stroke-danger)" radius={[4, 4, 0, 0]} barSize={30} />
                      <Bar dataKey="noStroke" name="No Stroke" fill="var(--primary)" opacity={0.5} radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Gender Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-border/60 h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Global Feature Importance
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Which features the model relies on most (SHAP global values)
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={featureImportance}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "var(--foreground)" }} width={55} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                        formatter={(v: number) => [`${v}%`, "Importance"]}
                      />
                      <Bar dataKey="importance" radius={[0, 4, 4, 0]} barSize={16}>
                        {featureImportance.map((_, i) => (
                          <Cell
                            key={i}
                            fill={["var(--chart-1)", "var(--chart-3)", "var(--chart-2)", "var(--chart-4)", "var(--chart-5)", "var(--chart-1)", "var(--chart-3)", "var(--chart-2)"][i]}
                            fillOpacity={0.85}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Gender Pie */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Gender Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genderData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {genderData.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                        formatter={(v: number) => [`${v.toLocaleString()} patients`, "Count"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-2">
                  {genderData.map((d) => (
                    <div key={d.name} className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-full" style={{ background: d.fill }} />
                      {d.name} ({d.value.toLocaleString()})
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Smoking Pie */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Smoking Status & Stroke Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={smokingData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                        nameKey="name"
                      >
                        {smokingData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 flex-wrap mt-2">
                  {smokingData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-1.5 text-xs">
                      <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                      {d.name}: {d.stroke} strokes
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}