"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface RiskGaugeProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  label: string;
  color: string;
}

export function RiskGauge({ value, size = 200, strokeWidth = 14, label, color }: RiskGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const displayValue = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const radius = (size - strokeWidth) / 2 - 8;
    const startAngle = 0.75 * Math.PI;
    const endAngle = 2.25 * Math.PI;
    const totalAngle = endAngle - startAngle;

    function draw(currentVal: number) {
      ctx.clearRect(0, 0, size, size);

      // Background arc
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.strokeStyle = getComputedStyle(document.documentElement)
        .getPropertyValue("--border")
        .trim();
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = "round";
      ctx.stroke();

      // Value arc
      const valueAngle = startAngle + (Math.min(currentVal, 100) / 100) * totalAngle;

      const gradient = ctx.createConicGradient(startAngle, cx, cy);
      gradient.addColorStop(0, "#16a34a");
      gradient.addColorStop(0.3, "#eab308");
      gradient.addColorStop(0.7, "#f97316");
      gradient.addColorStop(1, "#ef4444");

      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, valueAngle);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = "round";
      ctx.stroke();

      // Glow effect
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, valueAngle);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = strokeWidth + 8;
      ctx.lineCap = "round";
      ctx.globalAlpha = 0.15;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Center text
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const isDark = document.documentElement.classList.contains("dark");
      const textColor = isDark ? "#f5f5f5" : "#171717";
      const mutedColor = isDark ? "#a3a3a3" : "#737373";

      ctx.font = `bold ${size * 0.18}px var(--font-geist-sans), system-ui, sans-serif`;
      ctx.fillStyle = textColor;
      ctx.fillText(`${Math.round(currentVal)}%`, cx, cy - 8);

      ctx.font = `500 ${size * 0.06}px var(--font-geist-sans), system-ui, sans-serif`;
      ctx.fillStyle = mutedColor;
      ctx.fillText(label, cx, cy + size * 0.12);
    }

    // Animate
    const startVal = displayValue.current;
    const diff = value - startVal;
    const duration = 600;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = startVal + diff * eased;
      draw(current);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        displayValue.current = value;
      }
    }

    requestAnimationFrame(animate);
  }, [value, size, strokeWidth, label]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="mx-auto"
      />
    </motion.div>
  );
}