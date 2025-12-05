"use client";

import { useState, ChangeEvent } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import STLModel, { ModelStats } from '@/components/STLModel'; 
import EcoCalculator from '@/components/EcoCalculator'; 

const COLORS = [
  { name: 'Blanc', value: '#ffffff' },
  { name: 'Bleu', value: '#00f3ff' },
  { name: 'Orange', value: '#ff7b00' },
  { name: 'Rouge', value: '#ff004c' },
  { name: 'Vert', value: '#22c55e' },
];

export default function Home() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [color, setColor] = useState('#ffffff');
  const [materialType, setMaterialType] = useState<'standard' | 'wireframe' | 'glass'>('standard');
  const [autoRotate, setAutoRotate] = useState(false);
  const [sliceValue, setSliceValue] = useState(100); 
  const [stats, setStats] = useState<ModelStats | null>(null);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      setStats(null);
      setSliceValue(100); 
    }
  };

  return (
    // LAYOUT RESPONSIVE : Flex column sur mobile, Block sur desktop
    <main className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-black text-white flex flex-col md:block overflow-x-hidden font-sans">
      
      {/* HEADER */}
      <div className="p-4 md:absolute md:top-0 md:left-0 md:p-6 md:z-20 pointer-events-none bg-slate-900/50 md:bg-transparent">
        <h1 className="text-2xl md:text-4xl font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
          NIRD VISION <span className="text-white text-sm md:text-base font-normal not-italic opacity-50">v2.0</span>
        </h1>
        <p className="text-slate-400 text-xs md:text-sm">Outil d'Analyse Éco-Responsable</p>
      </div>

      {/* --- UI DROITE : CONTRÔLES --- */}
      {/* Sur mobile : ordre 2, relatif. Sur Desktop : absolute top-right */}
      {fileUrl && (
        <div className="order-2 p-4 md:absolute md:top-6 md:right-6 md:z-20 md:p-0 flex justify-center">
          <div className="w-full max-w-sm md:w-64 bg-slate-900/80 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-xl">
            
            {/* Rendu */}
            <div className="mb-4">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Mode</h3>
              <div className="grid grid-cols-3 gap-1">
                {(['standard', 'wireframe', 'glass'] as const).map((type) => (
                  <button key={type} onClick={() => setMaterialType(type)} className={`py-1 px-2 text-[10px] capitalize rounded border ${materialType === type ? 'bg-blue-600 border-blue-500' : 'border-white/10 hover:bg-white/5'}`}>{type}</button>
                ))}
              </div>
            </div>

            {/* Slicer */}
            <div className="mb-4">
               <div className="flex justify-between mb-1">
                 <h3 className="text-[10px] font-bold text-slate-400 uppercase">Slicer</h3>
                 <span className="text-[10px] text-blue-400">{sliceValue}%</span>
               </div>
               <input type="range" min="0" max="100" value={sliceValue} onChange={(e) => setSliceValue(parseInt(e.target.value))} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"/>
            </div>

            {/* Couleurs */}
            <div className="mb-4">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Couleur</h3>
              <div className="flex gap-2 justify-center">
                {COLORS.map((c) => (
                  <button key={c.name} onClick={() => setColor(c.value)} className={`w-6 h-6 rounded-full border ${color === c.value ? 'border-white scale-110' : 'border-transparent'}`} style={{ backgroundColor: c.value }} />
                ))}
              </div>
            </div>

            {/* Boutons */}
            <div className="flex items-center justify-between gap-2">
                 <label className="flex items-center gap-2 cursor-pointer bg-white/5 p-2 rounded text-[10px]">
                    <input type="checkbox" checked={autoRotate} onChange={(e) => setAutoRotate(e.target.checked)} />
                    Rotation
                 </label>
                 <label className="flex-1 text-center py-2 bg-blue-600 hover:bg-blue-500 rounded cursor-pointer text-[10px] font-bold">
                    Nouveau Fichier
                    <input type="file" accept=".stl" onChange={handleFileUpload} className="hidden" />
                 </label>
            </div>
          </div>
        </div>
      )}

      {/* --- UI GAUCHE : ÉCO-CALCULATEUR --- */}
      {/* Sur mobile : ordre 3 (en bas). Sur Desktop : absolute bottom-left */}
      {stats && (
        <div className="order-3 p-4 md:absolute md:bottom-6 md:left-6 md:z-20 md:p-0 flex justify-center">
           <EcoCalculator volumeMm3={stats.volume} dimensions={{ width: stats.width, height: stats.height, depth: stats.depth }} />
        </div>
      )}

      {/* --- ZONE 3D --- */}
      {/* Sur mobile : Hauteur fixe (50vh) ou flex-1. Sur Desktop : Full screen */}
      <div className="order-1 h-[50vh] md:absolute md:inset-0 md:h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-black z-0">
        {!fileUrl ? (
          <div className="h-full flex flex-col items-center justify-center p-4">
             <div className="text-center p-6 bg-slate-900/50 rounded-2xl border border-white/5">
                <div className="text-4xl mb-2">🛠️</div>
                <h2 className="text-xl font-bold text-white mb-2">Atelier NIRD</h2>
                <label className="inline-block bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-full cursor-pointer text-sm font-bold shadow-lg shadow-green-900/50">
                    Ouvrir STL
                    <input type="file" accept=".stl" onChange={handleFileUpload} className="hidden" />
                </label>
             </div>
          </div>
        ) : (
          <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 150], fov: 50 }} gl={{ localClippingEnabled: true }}>
            <Stage environment="city" intensity={0.6} adjustCamera={true}>
               <STLModel 
                 url={fileUrl} color={color} materialType={materialType} autoRotate={autoRotate} sliceValue={sliceValue} onLoaded={setStats}
               />
            </Stage>
            <OrbitControls makeDefault autoRotate={autoRotate} autoRotateSpeed={2} />
          </Canvas>
        )}
      </div>
    </main>
  );
}