import React from "react";

export default function NoiseCard({
  width = "w-full",
  height = "h-auto",
  className = "",
  animated = false,
  noiseOpacity = 0.15,
  grainSize = 1,
  bgColor = "bg-slate-900",
  children
}) {
  // Create an SVG turbulence noise pattern
  const noiseSvg = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${grainSize * 0.65}' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E`;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl flex flex-col ${bgColor} ${width} ${height} ${className}`}
    >
      {/* Static noise overlay */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("${noiseSvg}")`,
          opacity: noiseOpacity,
        }}
      />
      
      {/* Content wrapper */}
      <div className="relative z-10 p-6 flex flex-col flex-grow h-full w-full">
        {children}
      </div>
    </div>
  );
}
