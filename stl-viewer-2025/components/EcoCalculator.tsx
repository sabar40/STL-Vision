"use client";

import React, { useState } from 'react';

const MATERIALS = {
  PLA:  { name: 'PLA (Standard)',   density: 1.24, cost: 25, co2: 6,   desc: "Biodégradable." },
  PETG: { name: 'PETG (Résistant)', density: 1.27, cost: 30, co2: 8,   desc: "Solide & Durable." },
  ABS:  { name: 'ABS (Industriel)', density: 1.04, cost: 28, co2: 10,  desc: "Résistant chocs." },
  TPU:  { name: 'TPU (Flexible)',   density: 1.21, cost: 45, co2: 9,   desc: "Souple." },
};

type MaterialKey = keyof typeof MATERIALS;

interface EcoCalculatorProps {
  volumeMm3: number;
  dimensions: { width: number; height: number; depth: number };
}

export default function EcoCalculator({ volumeMm3, dimensions }: EcoCalculatorProps) {
  const [selectedMat, setSelectedMat] = useState<MaterialKey>('PLA');
  const [marketPrice, setMarketPrice] = useState<string>("");

  const mat = MATERIALS[selectedMat];
  const volumeCm3 = volumeMm3 / 1000;
  const weightGrams = volumeCm3 * mat.density;
  const printCost = (weightGrams / 1000) * mat.cost;
  const carbonFootprint = (weightGrams / 1000) * mat.co2;

  const marketPriceNum = parseFloat(marketPrice);
  const savings = !isNaN(marketPriceNum) ? marketPriceNum - printCost : 0;
  const savingsPercent = !isNaN(marketPriceNum) && marketPriceNum > 0 
    ? ((savings / marketPriceNum) * 100).toFixed(0) : 0;

  return (
    <div id="fiche-technique" className="
      bg-slate-900/90 backdrop-blur-md border border-green-500/30 rounded-xl shadow-2xl 
      flex flex-col gap-3 
      w-full md:w-72 p-4 
      max-h-[60vh] md:max-h-[85vh] overflow-y-auto scrollbar-hide
      animate-in slide-in-from-bottom duration-500
      print:w-full print:max-h-none print:bg-white print:text-black print:border-black
    ">
      
      {/* HEADER IMPRESSION */}
      <div className="hidden print:block border-b-2 border-black mb-4 pb-2">
          <h1 className="text-xl font-bold uppercase">NIRD Vision 2025</h1>
      </div>

      {/* HEADER ÉCRAN */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2 print:border-gray-300">
        <div>
            <h3 className="text-[10px] font-black text-green-400 uppercase tracking-widest print:text-green-700">Fiche Technique</h3>
            <p className="text-[9px] text-slate-400 print:text-slate-600">Données Utopie3D</p>
        </div>
        <div className="text-xl">🌱</div>
      </div>

      {/* BLOC DONNÉES COMPACT */}
      <div className="bg-white/5 p-2 rounded-lg border border-white/10 text-[10px] print:bg-gray-100">
         <div className="grid grid-cols-2 gap-y-2 gap-x-1">
            <div className="col-span-2 border-b border-white/5 pb-1 mb-1">
                <span className="block text-slate-500 uppercase font-bold print:text-black">Dimensions</span>
                <span className="font-mono text-white text-xs print:text-black">
                    {dimensions.width.toFixed(0)}x{dimensions.height.toFixed(0)}x{dimensions.depth.toFixed(0)} mm
                </span>
            </div>
            <div>
                <span className="block text-slate-500 uppercase font-bold print:text-black">Volume</span>
                <span className="font-mono text-white print:text-black">{volumeCm3.toFixed(2)} cm³</span>
            </div>
            <div className="text-right">
                <span className="block text-slate-500 uppercase font-bold print:text-black">Poids ({selectedMat})</span>
                <span className="font-mono text-white print:text-black">{weightGrams.toFixed(1)} g</span>
            </div>
         </div>
      </div>

      {/* SÉLECTEUR MATÉRIAU */}
      <div className="bg-blue-900/20 p-2 rounded-lg border border-blue-500/30 print:border-gray-300">
        <label className="block text-[9px] uppercase font-bold text-blue-300 mb-1 print:hidden">Matériau</label>
        <select 
            value={selectedMat}
            onChange={(e) => setSelectedMat(e.target.value as MaterialKey)}
            className="w-full bg-slate-800 text-white text-xs border border-slate-600 rounded p-1 mb-2 outline-none print:hidden"
        >
            {Object.entries(MATERIALS).map(([key, data]) => (
                <option key={key} value={key}>{data.name}</option>
            ))}
        </select>
        
        {/* Affichage pour impression */}
        <div className="hidden print:block text-xs mb-2"><strong>Matériau :</strong> {MATERIALS[selectedMat].name}</div>

        <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 print:text-black">Coût est.</span>
            <span className="font-bold text-blue-300 print:text-black">{printCost.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between items-center text-xs mt-1">
            <span className="text-slate-400 print:text-black">Impact CO2</span>
            <span className="font-bold text-green-400 print:text-black">{carbonFootprint.toFixed(3)} kg</span>
        </div>
      </div>

      {/* COMPARATEUR */}
      <div className="bg-white/5 p-2 rounded-lg border border-white/10 print:border-gray-300">
        <div className="flex gap-2 mb-2 print:hidden items-center">
            <span className="text-[9px] uppercase font-bold text-slate-400 whitespace-nowrap">Prix Neuf :</span>
            <div className="relative w-full">
                <input 
                    type="number" 
                    placeholder="Ex: 20" 
                    value={marketPrice}
                    onChange={(e) => setMarketPrice(e.target.value)}
                    className="w-full bg-black/50 border border-white/20 rounded px-2 py-1 text-xs text-white"
                />
                <span className="absolute right-2 top-1 text-slate-400 text-xs">€</span>
            </div>
        </div>

        {!isNaN(marketPriceNum) && marketPriceNum > 0 && (
            <div className="p-2 bg-green-500/10 rounded border border-green-500/30 print:bg-green-100">
                <div className="flex items-center justify-between">
                    <span className="text-[9px] text-slate-400 uppercase print:text-black">Économie</span>
                    <span className="bg-green-500/20 text-green-300 text-[10px] px-1 rounded font-bold print:text-green-800">-{savingsPercent}%</span>
                </div>
                <div className="text-xl font-black text-green-400 text-center mt-1 print:text-green-800">
                    {savings.toFixed(2)} €
                </div>
            </div>
        )}
      </div>

      <button 
        onClick={() => window.print()}
        className="w-full py-2 bg-white text-black font-bold text-[10px] uppercase tracking-wide rounded hover:bg-slate-200 transition-colors flex justify-center items-center gap-2 print:hidden"
      >
        <span>🖨️</span> Imprimer Fiche
      </button>

    </div>
  );
}