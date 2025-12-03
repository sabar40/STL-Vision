"use client";

import { useState, ChangeEvent } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import STLModel from '@/components/STLModel'; 

// Quelques presets de couleurs sympas pour aller vite
const COLORS = [
  { name: 'Blanc', value: '#ffffff' },
  { name: 'Néon Bleu', value: '#00f3ff' },
  { name: 'Orange', value: '#ff7b00' },
  { name: 'Rouge', value: '#ff004c' },
  { name: 'Vert Matrix', value: '#00ff41' },
];

export default function Home() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  
  // --- ÉTATS DE PERSONNALISATION ---
  const [color, setColor] = useState('#ffffff');
  const [materialType, setMaterialType] = useState<'standard' | 'wireframe' | 'glass'>('standard');
  const [autoRotate, setAutoRotate] = useState(false);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Nettoyer l'ancienne URL pour éviter les fuites de mémoire
      if (fileUrl) URL.revokeObjectURL(fileUrl);
      const url = URL.createObjectURL(file);
      setFileUrl(url);
    }
  };

  return (
    <main className="h-screen w-screen bg-gradient-to-br from-slate-900 to-black text-white flex flex-col overflow-hidden">
      
      {/* HEADER SIMPLE */}
      <div className="absolute top-0 left-0 p-6 z-20 pointer-events-none">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-sm">
          NDI Viewer 2025
        </h1>
        <p className="text-slate-400 text-sm">Interactive 3D Preview</p>
      </div>

      {/* --- PANNEAU DE CONTRÔLE DROIT (UI Flottante) --- */}
      {fileUrl && (
        <div className="absolute top-6 right-6 z-20 w-72 bg-slate-900/60 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-2xl animate-fade-in-up">
          
          {/* Section 1 : Apparence */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Matériau</h3>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setMaterialType('standard')}
                className={`p-2 text-xs rounded-lg border transition-all ${materialType === 'standard' ? 'bg-blue-600 border-blue-500' : 'border-white/10 hover:bg-white/5'}`}
              >
                Solide
              </button>
              <button 
                onClick={() => setMaterialType('wireframe')}
                className={`p-2 text-xs rounded-lg border transition-all ${materialType === 'wireframe' ? 'bg-blue-600 border-blue-500' : 'border-white/10 hover:bg-white/5'}`}
              >
                Tech
              </button>
              <button 
                onClick={() => setMaterialType('glass')}
                className={`p-2 text-xs rounded-lg border transition-all ${materialType === 'glass' ? 'bg-blue-600 border-blue-500' : 'border-white/10 hover:bg-white/5'}`}
              >
                Verre
              </button>
            </div>
          </div>

          {/* Section 2 : Couleurs */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Couleur</h3>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${color === c.value ? 'border-white' : 'border-transparent'}`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
              {/* Sélecteur libre */}
              <input 
                type="color" 
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 rounded-full cursor-pointer bg-transparent border-0 p-0"
              />
            </div>
          </div>

          {/* Section 3 : Actions */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Scène</h3>
            <label className="flex items-center space-x-2 cursor-pointer mb-4">
              <input 
                type="checkbox" 
                checked={autoRotate}
                onChange={(e) => setAutoRotate(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 bg-slate-700 border-transparent" 
              />
              <span className="text-sm">Rotation Automatique</span>
            </label>

            <label className="w-full flex justify-center items-center py-2 px-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg cursor-pointer transition-colors text-sm">
              <span>Changer de fichier</span>
              <input 
                type="file" 
                accept=".stl" 
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}

      {/* --- ZONE 3D --- */}
      <div className="flex-1 relative w-full h-full">
        {!fileUrl ? (
          // Écran d'accueil vide
          <div className="h-full flex flex-col items-center justify-center">
            <div className="p-10 border-2 border-dashed border-slate-700 rounded-2xl bg-slate-800/50 text-center">
              <p className="text-2xl font-bold mb-2">Déposez votre STL ici</p>
              <label className="mt-4 inline-block bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-full cursor-pointer transition-transform hover:-translate-y-1">
                Parcourir mes fichiers
                <input type="file" accept=".stl" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>
        ) : (
          // Le Canvas 3D
          <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 45 }}>
            <color attach="background" args={['#0f172a']} /> {/* Couleur de fond du canvas (fallback) */}
            
            <Stage environment="city" intensity={0.5} adjustCamera={false}>
               <STLModel 
                  url={fileUrl} 
                  color={color} 
                  materialType={materialType}
                  autoRotate={autoRotate}
               />
            </Stage>
            
            <OrbitControls makeDefault autoRotate={autoRotate} autoRotateSpeed={2} />
          </Canvas>
        )}
      </div>
    </main>
  );
}