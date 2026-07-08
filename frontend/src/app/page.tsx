"use client";

import { Navbar } from "@/components/stroke/navbar";
import { Hero } from "@/components/stroke/hero";
import { PredictSection } from "@/components/stroke/predict-section";
import { AnalyticsDashboard } from "@/components/stroke/analytics-dashboard";
import { WhatIfSimulator } from "@/components/stroke/what-if-simulator";
import { EducationSection } from "@/components/stroke/education-section";
import { Footer } from "@/components/stroke/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <PredictSection />
        <AnalyticsDashboard />
        <WhatIfSimulator />
        <EducationSection />
      </main>
      <Footer />
    </div>
  );
}