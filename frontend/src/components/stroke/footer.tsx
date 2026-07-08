"use client";

import { motion } from "framer-motion";
import { Brain, Github, ExternalLink, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <Brain className="w-4 h-4 text-primary" />
              </div>
              <span className="text-lg font-bold">
                Stroke<span className="text-primary">Predict</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[260px]">
              An AI-powered clinical decision support tool for stroke risk assessment,
              built for the NACOS AI in Medicine Competition.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Predict", href: "#predict" },
                { label: "Analytics", href: "#analytics" },
                { label: "What-If Simulator", href: "#whatif" },
                { label: "Learn About Stroke", href: "#education" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.kaggle.com/datasets/fedesoriano/stroke-prediction-dataset"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  Kaggle Dataset <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/DATICANCompetitionUI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  Competition Repo <Github className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://datican.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  DATICAN <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Disclaimer</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              This tool is for educational and research purposes only. It does not
              replace professional medical advice. Always consult a qualified
              healthcare provider for clinical decisions.
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Built for NACOS University of Ibadan AI in Medicine Competition 2026
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-stroke-danger fill-stroke-danger" /> using Next.js, Python & Explainable AI
          </p>
        </div>
      </div>
    </footer>
  );
}