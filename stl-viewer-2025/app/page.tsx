"use client";

import { useState, ChangeEvent } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import STLModel, { ModelStats } from '@/components/STLModel'; 
import EcoCalculator from '@/components/EcoCalculator'; 

// Presets de couleurs pour l'UI
const COLORS = [
  { name: 'Blanc', value: '#ffffff' },
  { name: 'Bleu Tech', value: '#00f3ff' },
  { name: 'Orange', value: '#ff7b00' },
  { name: 'Rouge', value: '#ff004c' },
  { name: 'Vert NIRD', value: '#22c55e' }, // Vert pour le thème écolo
];

export default function Home() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  
  // États de l'application
  const [color, setColor] = useState('#ffffff');
  const [materialType, setMaterialType] = useState<'standard' | 'wireframe' | 'glass'>('standard');
  const [autoRotate, setAutoRotate] = useState(false);
  
  // Gestion du Slider de coupe (100% = objet entier)
  const [sliceValue, setSliceValue] = useState(100); 
  
  // Stockage des stats calculées (Volume, Dimensions)
  const [stats, setStats] = useState<ModelStats | null>(null);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Nettoyage de l'ancienne URL mémoire
      if (fileUrl) URL.revokeObjectURL(fileUrl);
      
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      
      // Reset des états au chargement d'un nouveau fichier
      setStats(null);
      setSliceValue(100); 
    }
  };

  return (
    <main className="h-screen w-screen bg-gradient-to-br from-slate-900 to-black text-white flex flex-col overflow-hidden font-sans">
      
      {/* HEADER */}
      <div className="absolute top-0 left-0 p-6 z-20 pointer-events-none">
        <h1 className="text-4xl font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500 drop-shadow-sm">
          NIRD VISION <span className="text-white text-base font-normal not-italic opacity-50">v2.0</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">Outil d'Analyse Éco-Responsable // Utopie 3D</p>
      </div>

      {/* --- UI DROITE : CONTRÔLES --- */}
      {fileUrl && (
        <div className="absolute top-6 right-6 z-20 w-72 bg-slate-900/80 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-2xl animate-in slide-in-from-right">
          
          {/* Section 1 : Rendu */}
          <div className="mb-6">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Matériau</h3>
            <div className="grid grid-cols-3 gap-2">
              {(['standard', 'wireframe', 'glass'] as const).map((type) => (
                <button 
                  key={type}
                  onClick={() => setMaterialType(type)}
                  className={`p-2 text-xs capitalize rounded-lg border transition-all ${materialType === type ? 'bg-blue-600 border-blue-500 text-white' : 'border-white/10 text-slate-400 hover:bg-white/5'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2 : Slicer (L'effet WOW technique) */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
                 <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inspection (Slicer)</h3>
                 <span className="text-[10px] font-mono text-blue-400">{sliceValue}%</span>
            </div>
            <input 
                type="range" 
                min="0" 
                max="100" 
                value={sliceValue} 
                onChange={(e) => setSliceValue(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">Coupez l'objet pour voir l'intérieur</p>
          </div>

          {/* Section 3 : Couleurs */}
          <div className="mb-6">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Filament</h3>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 shadow-lg ${color === c.value ? 'border-white scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c.value, boxShadow: `0 0 10px ${c.value}40` }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Section 4 : Rotation */}
          <div className="mb-4">
             <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={autoRotate} onChange={(e) => setAutoRotate(e.target.checked)} className="accent-blue-500" />
                <span className="text-xs text-slate-300">Rotation Automatique</span>
             </label>
          </div>

          {/* Upload Bouton secondaire */}
          <label className="w-full flex justify-center items-center py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl cursor-pointer transition-all text-sm font-medium">
             <span>Charger un autre STL</span>
             <input type="file" accept=".stl" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      )}

      {/* --- UI GAUCHE : ÉCO-CALCULATEUR --- */}
      {stats && (
        <div className="absolute bottom-6 left-6 z-20">
           {/* On passe maintenant le volume ET les dimensions au composant */}
           <EcoCalculator 
             volumeMm3={stats.volume} 
             dimensions={{ width: stats.width, height: stats.height, depth: stats.depth }} 
           />
        </div>
      )}

      {/* --- ZONE 3D --- */}
      <div className="flex-1 relative w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-black">
        {!fileUrl ? (
          // ÉCRAN D'ACCUEIL
          <div className="h-full flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
             <div className="text-center p-8 bg-slate-900/50 rounded-3xl border border-white/5 backdrop-blur-sm">
                <div className="text-5xl mb-4">🛠️</div>
                <h2 className="text-3xl font-bold text-white mb-2">Atelier de Résistance</h2>
                <p className="text-slate-400 mb-6 max-w-xs mx-auto">Importez une pièce détachée pour analyser sa réparabilité et son empreinte.</p>
                <label className="inline-flex bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-full cursor-pointer transition-all font-bold shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:scale-105">
                    Ouvrir un fichier STL
                    <input type="file" accept=".stl" onChange={handleFileUpload} className="hidden" />
                </label>
             </div>
          </div>
        ) : (
          // CANVAS 3D
          // CORRECTION ICI : "localClippingEnabled" doit être dans la prop "gl"
          <Canvas 
            shadows 
            dpr={[1, 2]} 
            camera={{ position: [0, 0, 150], fov: 50 }} 
            gl={{ localClippingEnabled: true }}
          >
            <Stage environment="city" intensity={0.6} adjustCamera={true}>
               <STLModel 
                 url={fileUrl} 
                 color={color} 
                 materialType={materialType}
                 autoRotate={autoRotate}
                 sliceValue={sliceValue} // On passe la valeur du slider
                 onLoaded={setStats}     // Callback pour récupérer les stats
               />
            </Stage>
            <OrbitControls makeDefault autoRotate={autoRotate} autoRotateSpeed={2} />
          </Canvas>
        )}
      </div>
    </main>
  );
}