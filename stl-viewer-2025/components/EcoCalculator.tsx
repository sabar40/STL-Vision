"use client";

import React from 'react';

const DENSITY_PLA = 1.24; // g/cm3
const COST_PER_KG = 30;
const CO2_PER_KG = 6;

interface EcoCalculatorProps {
  volumeMm3: number;
  dimensions: { width: number; height: number; depth: number }; // Ajout des dimensions
}

export default function EcoCalculator({ volumeMm3, dimensions }: EcoCalculatorProps) {
  const volumeCm3 = volumeMm3 / 1000;
  const weightGrams = volumeCm3 * DENSITY_PLA;
  const cost = (weightGrams / 1000) * COST_PER_KG;
  const carbonFootprint = (weightGrams / 1000) * CO2_PER_KG;

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-green-500/30 p-5 rounded-2xl shadow-2xl w-72 animate-in slide-in-from-bottom duration-700">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
        <div>
            <h3 className="text-xs font-black text-green-400 uppercase tracking-widest">Analyse NIRD</h3>
            <p className="text-[10px] text-slate-400">Impact & Technique</p>
        </div>
        <div className="text-2xl">🌱</div>
      </div>
      
      <div className="space-y-3">
        {/* Dimensions (Requis Utopie3D) */}
        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
           <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Dimensions (XYZ)</span>
           <div className="font-mono text-white text-sm">
             {dimensions.width.toFixed(0)} x {dimensions.height.toFixed(0)} x {dimensions.depth.toFixed(0)} <span className="text-slate-500">mm</span>
           </div>
        </div>

        {/* Volume & Poids */}
        <div className="grid grid-cols-2 gap-2">
            <div>
                <span className="text-slate-400 text-[10px]">Volume</span>
                <p className="text-white font-mono font-bold text-sm">
                    {volumeCm3.toFixed(2)} <span className="text-[10px] text-slate-500">cm³</span>
                </p>
            </div>
            <div className="text-right">
                <span className="text-slate-400 text-[10px]">Poids (PLA)</span>
                <p className="text-white font-mono font-bold text-sm">
                    {weightGrams.toFixed(1)} <span className="text-[10px] text-slate-500">g</span>
                </p>
            </div>
        </div>

        {/* Coût */}
        <div className="flex justify-between items-end border-t border-white/5 pt-2">
          <span className="text-slate-400 text-xs">Coût matière</span>
          <span className="text-blue-300 font-mono font-bold text-lg">
            {cost.toFixed(2)} <span className="text-xs font-normal text-slate-500">€</span>
          </span>
        </div>

        {/* Impact Carbone */}
        <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/20 mt-2">
          <span className="text-green-400 text-[10px] uppercase font-bold block mb-1">Empreinte Carbone</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-mono text-white font-bold">{carbonFootprint.toFixed(3)}</span>
            <span className="text-xs text-green-300 leading-tight">kg CO2e</span>
          </div>
        </div>
      </div>
    </div>
  );
}