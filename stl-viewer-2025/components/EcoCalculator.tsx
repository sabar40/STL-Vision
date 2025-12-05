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
      group relative overflow-hidden
      bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl 
      flex flex-col gap-3 
      w-full md:w-64 p-4 
      max-h-[60vh] md:max-h-[85vh] overflow-y-auto scrollbar-hide
      transition-all duration-300 hover:border-green-500/30
      animate-in slide-in-from-bottom-10 fade-in duration-700
      print:w-full print:max-h-none print:bg-white print:text-black print:border-black
    ">
      
      {/* Lueur supérieure */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity print:hidden" />

      {/* HEADER PRINT (Caché écran) */}
      <div className="hidden print:block border-b-2 border-black mb-4 pb-2">
          <h1 className="text-2xl font-bold uppercase font-tech">NIRD Vision 2025</h1>
      </div>

      {/* HEADER ÉCRAN */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2 print:border-gray-300">
        <div>
            <h3 className="text-xs font-bold text-green-400 uppercase tracking-widest font-tech print:text-green-700">Analyse NIRD</h3>
            <p className="text-[9px] text-slate-400 font-medium uppercase print:text-slate-600">Données Utopie3D</p>
        </div>
        <div className="text-xl animate-pulse">🌱</div>
      </div>

      {/* BLOC DONNÉES (Plus compact) */}
      <div className="bg-black/20 p-2 rounded-lg border border-white/5 text-[10px] print:bg-gray-100">
         <div className="grid grid-cols-2 gap-y-2 gap-x-2">
            <div className="col-span-2 border-b border-white/5 pb-1 mb-1">
                <span className="block text-slate-500 uppercase font-bold text-[9px] tracking-wider print:text-black">Dimensions</span>
                <span className="font-tech text-white text-sm tracking-wide print:text-black">
                    {dimensions.width.toFixed(0)} <span className="text-slate-600">x</span> {dimensions.height.toFixed(0)} <span className="text-slate-600">x</span> {dimensions.depth.toFixed(0)} <span className="text-[9px] text-slate-500">mm</span>
                </span>
            </div>
            <div>
                <span className="block text-slate-500 uppercase font-bold text-[9px] print:text-black">Volume</span>
                <span className="font-tech text-white text-sm print:text-black">{volumeCm3.toFixed(2)} <span className="text-[9px] text-slate-500">cm³</span></span>
            </div>
            <div className="text-right">
                <span className="block text-slate-500 uppercase font-bold text-[9px] print:text-black">Poids</span>
                <span className="font-tech text-white text-sm print:text-black">{weightGrams.toFixed(1)} <span className="text-[9px] text-slate-500">g</span></span>
            </div>
         </div>
      </div>

      {/* SÉLECTEUR MATÉRIAU */}
      <div className="bg-blue-500/5 p-2 rounded-lg border border-blue-500/20 print:border-gray-300 hover:bg-blue-500/10 transition-colors">
        <div className="flex justify-between items-center mb-1 print:hidden">
            <label className="text-[9px] uppercase font-bold text-blue-300 tracking-wider">Matériau</label>
        </div>
        
        <select 
            value={selectedMat}
            onChange={(e) => setSelectedMat(e.target.value as MaterialKey)}
            className="w-full bg-slate-900 text-white text-[10px] border border-slate-700 rounded p-1.5 mb-2 outline-none focus:ring-1 focus:ring-blue-500 font-medium print:hidden cursor-pointer hover:border-blue-400"
        >
            {Object.entries(MATERIALS).map(([key, data]) => (
                <option key={key} value={key}>{data.name}</option>
            ))}
        </select>
        
        <div className="hidden print:block text-sm mb-2"><strong>Matériau :</strong> {MATERIALS[selectedMat].name}</div>

        <div className="flex justify-between items-center text-[10px] border-b border-blue-500/10 pb-1 mb-1">
            <span className="text-slate-400 print:text-black">Coût Fab.</span>
            <span className="font-tech font-bold text-blue-300 text-sm print:text-black">{printCost.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between items-center text-[10px]">
            <span className="text-slate-400 print:text-black">Empreinte CO2</span>
            <span className="font-tech font-bold text-green-400 text-sm print:text-black">{carbonFootprint.toFixed(3)} kg</span>
        </div>
      </div>

      {/* COMPARATEUR (Simplifié visuellement) */}
      <div className="bg-white/5 p-2 rounded-lg border border-white/10 print:border-gray-300">
        <div className="flex gap-2 mb-2 print:hidden items-center">
            <span className="text-[9px] uppercase font-bold text-slate-400 whitespace-nowrap tracking-wider">Prix Neuf</span>
            <div className="relative w-full group/input">
                <input 
                    type="number" 
                    placeholder="Ex: 50" 
                    value={marketPrice}
                    onChange={(e) => setMarketPrice(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-green-500 transition-colors font-tech tracking-wide placeholder-slate-600"
                />
                <span className="absolute right-2 top-1 text-slate-500 text-[10px]">€</span>
            </div>
        </div>

        {!isNaN(marketPriceNum) && marketPriceNum > 0 ? (
            <div className="p-2 bg-gradient-to-br from-green-500/10 to-emerald-500/5 rounded border border-green-500/30 print:bg-green-100 animate-in zoom-in duration-300">
                <div className="flex items-center justify-between">
                    <span className="text-[9px] text-green-300/80 uppercase tracking-widest font-bold print:text-black">Économie</span>
                    <span className="bg-green-500 text-black text-[9px] px-1 rounded font-bold print:text-green-900 font-tech">-{savingsPercent}%</span>
                </div>
                <div className="text-lg font-bold text-green-400 text-center print:text-green-800 font-tech mt-1">
                    {savings.toFixed(2)} €
                </div>
            </div>
        ) : (
            <p className="text-[9px] text-slate-500 text-center italic print:hidden">Entrez un prix pour comparer</p>
        )}
      </div>

      <button 
        onClick={() => window.print()}
        className="w-full py-2 bg-white hover:bg-slate-200 text-black font-bold text-[10px] uppercase tracking-widest rounded-lg transition-all transform active:scale-95 flex justify-center items-center gap-2 print:hidden shadow-lg shadow-white/10 mt-1"
      >
        <span>🖨️</span> Fiche PDF
      </button>

    </div>
  );
}