"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Shield,
  Zap,
  BarChart3,
  Users,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function AnimatedCounter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="tabular-nums"
    >
      {prefix}{target.toLocaleString()}{suffix}
    </motion.span>
  );
}

const stats = [
  { value: 130000, suffix: "+", label: "Annual stroke deaths in Nigeria", icon: Activity, color: "text-stroke-danger" },
  { value: 95, suffix: "%", label: "Model accuracy achieved", icon: Shield, color: "text-stroke-safe" },
  { value: 5110, suffix: "", label: "Patients analyzed in dataset", icon: Users, color: "text-primary" },
  { value: 4, suffix: "", label: "ML models ensembled", icon: BarChart3, color: "text-stroke-warning" },
];

const features = [
  {
    icon: Zap,
    title: "Real-Time Analysis",
    description: "Get instant stroke risk predictions as you input patient data. No waiting, no delays results in milliseconds.",
  },
  {
    icon: Shield,
    title: "Explainable AI (SHAP)",
    description: "Every prediction comes with transparent explanations. See exactly which factors contribute to risk and by how much.",
  },
  {
    icon: TrendingUp,
    title: "What-If Simulator",
    description: "Adjust risk factors with interactive sliders and watch how lifestyle changes impact stroke risk in real-time.",
  },
  {
    icon: BarChart3,
    title: "Multi-Model Ensemble",
    description: "Four machine learning models Random Forest, XGBoost, Logistic Regression, and Neural Network working together for reliable predictions.",
  },
];

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-stroke-safe/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/3 blur-3xl" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:60px_60px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Hero Content */}
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                AI-Powered Clinical Tool
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            Predict Stroke Risk
            <br />
            <span className="text-primary">Before It Happens</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8"
          >
            Leveraging explainable machine learning on clinical data to provide
            transparent, real-time stroke risk assessments. Not just a prediction 
            a <strong className="text-foreground">clinical decision support tool</strong>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="flex flex-wrap gap-3"
          >
            <a
              href="#predict"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              Start Assessment
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#analytics"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-xl border border-border bg-card font-semibold hover:bg-accent transition-all duration-200 hover:-translate-y-0.5"
            >
              View Analytics
            </a>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative group p-5 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
              <div className="text-2xl sm:text-3xl font-bold tracking-tight">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              className="p-5 rounded-2xl border border-border bg-card/50 hover:border-primary/20 hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-sm mb-1.5">{feature.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}