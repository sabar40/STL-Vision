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
    // LAYOUT GLOBAL : Flex Column sur mobile (empilement), Block sur Desktop
    <main className="min-h-screen w-full bg-black text-white flex flex-col md:block overflow-x-hidden relative selection:bg-green-500/30">
      
      {/* FOND DE GRILLE (Visible partout) */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none z-0"></div>
      
      {/* HEADER */}
      {/* Mobile: Padding normal. Desktop: Absolu en haut à gauche */}
      <div className="p-6 md:absolute md:top-0 md:left-0 md:z-30 pointer-events-none bg-gradient-to-b from-black/80 to-transparent md:bg-none z-20">
        <h1 className="text-3xl md:text-5xl font-bold italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-blue-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)] animate-in slide-in-from-left duration-700">
          NIRD VISION <span className="text-white/40 text-sm md:text-lg font-normal not-italic ml-2 font-mono">v2.0</span>
        </h1>
        <div className="flex items-center gap-2 mt-2 animate-in fade-in duration-1000 delay-300">
            <div className="h-[1px] w-8 md:w-12 bg-green-500/50"></div>
            <p className="text-slate-400 text-[10px] md:text-xs font-medium tracking-widest uppercase">Analyseur de Réparabilité &bull; Utopie3D</p>
        </div>
      </div>

      {/* --- UI DROITE : CONTRÔLES --- */}
      {/* Mobile: Ordre 3 (après la 3D), Relatif. Desktop: Absolu à droite */}
      {fileUrl && (
        <div className="order-3 p-4 md:absolute md:top-6 md:right-6 md:z-30 md:p-0 flex justify-center animate-in slide-in-from-right duration-700 z-20">
          <div className="w-full max-w-sm md:w-64 bg-slate-900/70 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl transition-all hover:border-blue-500/30 group">
            
            {/* Rendu */}
            <div className="mb-6">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 group-hover:text-blue-400 transition-colors">Mode de Vue</h3>
              <div className="grid grid-cols-3 gap-1 bg-black/20 p-1 rounded-lg">
                {(['standard', 'wireframe', 'glass'] as const).map((type) => (
                  <button 
                    key={type} 
                    onClick={() => setMaterialType(type)} 
                    className={`py-1.5 px-1 text-[9px] font-bold uppercase rounded-md transition-all truncate ${materialType === type ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Slicer */}
            <div className="mb-6">
               <div className="flex justify-between mb-2 items-end">
                 <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-blue-400 transition-colors">Inspection (Slicer)</h3>
                 <span className="text-sm font-tech font-bold text-blue-400">{sliceValue}%</span>
               </div>
               <div className="relative h-4 flex items-center">
                  <input type="range" min="0" max="100" value={sliceValue} onChange={(e) => setSliceValue(parseInt(e.target.value))} 
                    className="absolute w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 z-10"
                  />
                  <div className="absolute top-1/2 -translate-y-1/2 w-full h-0.5 bg-blue-500/20 rounded-full blur-[1px]"></div>
               </div>
            </div>

            {/* Couleurs */}
            <div className="mb-6">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 group-hover:text-blue-400 transition-colors">Filament</h3>
              <div className="flex gap-3 justify-center">
                {COLORS.map((c) => (
                  <button 
                    key={c.name} 
                    onClick={() => setColor(c.value)} 
                    className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${color === c.value ? 'border-white scale-110 shadow-[0_0_10px_currentColor]' : 'border-transparent opacity-70 hover:opacity-100'}`} 
                    style={{ backgroundColor: c.value, color: c.value }} 
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
                 <label className="flex items-center justify-between cursor-pointer bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors group/check">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400 group-hover/check:text-white transition-colors">Rotation Auto</span>
                    <div className={`w-8 h-4 rounded-full relative transition-colors ${autoRotate ? 'bg-green-500' : 'bg-slate-700'}`}>
                        <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all shadow-sm ${autoRotate ? 'left-5' : 'left-1'}`} />
                    </div>
                    <input type="checkbox" checked={autoRotate} onChange={(e) => setAutoRotate(e.target.checked)} className="hidden"/>
                 </label>

                 <label className="flex w-full items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl cursor-pointer text-[10px] font-bold uppercase tracking-widest transition-all transform active:scale-95 shadow-lg shadow-blue-900/20">
                    <span>📂</span> Charger un autre STL
                    <input type="file" accept=".stl" onChange={handleFileUpload} className="hidden" />
                 </label>
            </div>
          </div>
        </div>
      )}

      {/* --- UI GAUCHE : ÉCO-CALCULATEUR --- */}
      {/* Mobile: Ordre 4 (Tout en bas), Relatif. Desktop: Absolu en bas à gauche */}
      {stats && (
        <div className="order-4 p-4 md:absolute md:bottom-6 md:left-6 md:z-30 md:p-0 flex justify-center z-20 pb-10 md:pb-0">
           <EcoCalculator volumeMm3={stats.volume} dimensions={{ width: stats.width, height: stats.height, depth: stats.depth }} />
        </div>
      )}

      {/* --- ZONE 3D --- */}
      {/* Mobile: Hauteur fixe (50% écran), Ordre 2. Desktop: Plein écran, fond absolu */}
      <div className={`
        order-2 md:order-1 
        h-[50vh] md:h-full md:absolute md:inset-0 
        w-full 
        bg-gradient-to-b from-slate-900 via-black to-slate-950 
        z-0 md:z-0
      `}>
        {!fileUrl ? (
          <div className="h-full flex flex-col items-center justify-center p-6 animate-in zoom-in duration-500">
             <div className="text-center p-6 md:p-10 bg-slate-900/40 backdrop-blur-sm rounded-3xl border border-white/5 shadow-2xl hover:border-green-500/30 transition-all group max-w-md mx-auto">
                <div className="text-5xl md:text-6xl mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">🛠️</div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight font-tech">Atelier NIRD</h2>
                <p className="text-slate-400 mb-6 md:mb-8 text-xs md:text-sm leading-relaxed">Importez une pièce détachée pour analyser sa réparabilité, son coût et son empreinte écologique.</p>
                
                <label className="inline-flex bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl cursor-pointer text-xs md:text-sm font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all transform hover:-translate-y-1">
                    Importer un fichier STL
                    <input type="file" accept=".stl" onChange={handleFileUpload} className="hidden" />
                </label>
             </div>
          </div>
        ) : (
          <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 150], fov: 50 }} gl={{ localClippingEnabled: true }}>
            <fog attach="fog" args={['#000000', 50, 400]} /> 
            <Stage environment="city" intensity={0.7} adjustCamera={true}>
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