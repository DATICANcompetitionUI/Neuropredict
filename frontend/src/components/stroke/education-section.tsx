"use client";

import { motion } from "framer-motion";
import { BookOpen, Heart, AlertTriangle, Phone, Shield, Brain, FlaskConical, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const fastSigns = [
  {
    letter: "F",
    title: "Face Drooping",
    description: "One side of the face may droop or become numb. Ask the person to smile is it uneven or lopsided?",
    color: "bg-stroke-danger",
  },
  {
    letter: "A",
    title: "Arm Weakness",
    description: "Sudden numbness or weakness in one arm. Ask the person to raise both arms does one drift downward?",
    color: "bg-stroke-warning",
  },
  {
    letter: "S",
    title: "Speech Difficulty",
    description: "Slurred speech or inability to repeat a simple sentence correctly. Is the person's speech confused or garbled?",
    color: "bg-primary",
  },
  {
    letter: "T",
    title: "Time to Call Emergency",
    description: "If any of these signs are present, call emergency services immediately. Every minute counts time is brain tissue.",
    color: "bg-stroke-danger",
  },
];

const riskFactors = [
  { icon: Heart, title: "High Blood Pressure", desc: "The leading cause of stroke. Manage with medication, diet, and exercise." },
  { icon: Brain, title: "Heart Disease", desc: "Atrial fibrillation and other heart conditions can cause blood clots that lead to stroke." },
  { icon: FlaskConical, title: "Diabetes", desc: "Diabetics have 1.5x higher stroke risk. Blood sugar control is critical." },
  { icon: Shield, title: "Smoking", desc: "Damages blood vessels and raises blood pressure. Quitting reduces risk by 50% within a year." },
];

const prevention = [
  "Maintain a healthy blood pressure through regular monitoring and medication",
  "Exercise at least 150 minutes per week  brisk walking counts",
  "Follow a balanced diet rich in fruits, vegetables, and whole grains",
  "Quit smoking and limit alcohol consumption",
  "Manage diabetes and maintain healthy cholesterol levels",
  "Get regular health check-ups, especially after age 45",
];

const methodology = [
  { step: "1", title: "Data Collection", desc: "Kaggle Stroke Prediction Dataset 5,110 patient records with 10 clinical features" },
  { step: "2", title: "Preprocessing", desc: "BMI imputation (median), one-hot encoding, SMOTE for class balancing (5% → 50% positive)" },
  { step: "3", title: "Model Training", desc: "4 models trained: Random Forest, XGBoost, Logistic Regression, Neural Network" },
  { step: "4", title: "Evaluation", desc: "Stratified 5-fold cross-validation, optimized for F1-score and ROC-AUC on imbalanced data" },
  { step: "5", title: "Explainability", desc: "SHAP values computed for model transparency every prediction is explainable" },
  { step: "6", title: "Deployment", desc: "FastAPI backend serving the model, Next.js frontend for real-time predictions" },
];

export function EducationSection() {
  return (
    <section id="education" className="py-20 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] rounded-full bg-chart-2/3 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-chart-2/10 border border-chart-2/20 mb-4">
            <BookOpen className="w-3.5 h-3.5 text-chart-2" />
            <span className="text-xs font-semibold text-chart-2 uppercase tracking-wider">
              Knowledge Hub
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Understanding <span className="text-chart-2">Stroke</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Knowledge is the first line of defense. Learn the warning signs, risk factors, and prevention strategies.
          </p>
        </motion.div>

        {/* FAST Signs */}
        <div className="mb-16">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xl font-bold mb-6 flex items-center gap-2"
          >
            <AlertTriangle className="w-5 h-5 text-stroke-danger" />
            The FAST Warning Signs
          </motion.h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {fastSigns.map((sign, i) => (
              <motion.div
                key={sign.letter}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <Card className="border-border/60 h-full hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="pt-6">
                    <div
                      className={`w-14 h-14 ${sign.color} rounded-2xl flex items-center justify-center mb-4 text-white text-2xl font-bold group-hover:scale-105 transition-transform`}
                    >
                      {sign.letter}
                    </div>
                    <h4 className="font-semibold mb-2">{sign.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{sign.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-6 p-4 rounded-xl bg-stroke-danger/5 border border-stroke-danger/20 flex items-start gap-3"
          >
            <Phone className="w-5 h-5 text-stroke-danger shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-stroke-danger">Emergency: Call 112 (Nigeria)</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                If you or someone around you shows any FAST signs, do not wait. Call emergency services immediately.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Risk Factors & Prevention */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-6">Key Risk Factors</h3>
            <div className="space-y-3">
              {riskFactors.map((rf, i) => (
                <motion.div
                  key={rf.title}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card className="border-border/60 hover:shadow-sm transition-shadow">
                    <CardContent className="py-4 flex gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <rf.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{rf.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{rf.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-6">Prevention Strategies</h3>
            <div className="space-y-3">
              {prevention.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-card/50 border border-border/50"
                >
                  <div className="w-6 h-6 rounded-full bg-stroke-safe/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-stroke-safe">{i + 1}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Methodology */}
        <motion.div
          id="about"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-chart-5/10 border border-chart-5/20 mb-4">
              <Database className="w-3.5 h-3.5 text-chart-5" />
              <span className="text-xs font-semibold text-chart-5 uppercase tracking-wider">
                Technical Details
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Model <span className="text-chart-5">Methodology</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our approach from raw data to a deployable clinical tool.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {methodology.map((m, i) => (
              <motion.div
                key={m.step}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group"
              >
                <Card className="border-border/60 h-full hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <CardContent className="pt-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-chart-5/10 flex items-center justify-center text-sm font-bold text-chart-5 group-hover:bg-chart-5/20 transition-colors">
                        {m.step}
                      </div>
                      <h4 className="font-semibold text-sm">{m.title}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}