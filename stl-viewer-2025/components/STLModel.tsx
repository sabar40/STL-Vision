"use client";

import React, { useRef, useEffect, useMemo } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { STLLoader } from 'three-stdlib';
import { Mesh, Box3, Vector3, Plane, DoubleSide } from 'three';

// Interface des données remontées au parent
export interface ModelStats {
  width: number;
  height: number;
  depth: number;
  volume: number;
  minY: number; // Nécessaire pour caler le Slicer au bon endroit
}

interface STLModelProps {
  url: string;
  color: string;
  materialType: 'standard' | 'wireframe' | 'glass';
  autoRotate: boolean;
  sliceValue: number; // Valeur du slider (0 à 100%)
  onLoaded?: (stats: ModelStats) => void;
}

export default function STLModel({ url, color, materialType, autoRotate, sliceValue, onLoaded }: STLModelProps) {
  const geometry = useLoader(STLLoader, url);
  const meshRef = useRef<Mesh>(null);
  
  // On stocke la hauteur de l'objet pour calculer la position du plan de coupe
  const statsRef = useRef<{ height: number; minY: number } | null>(null);

  // Création du plan de coupe (Axe Y vertical)
  // Vector3(0, -1, 0) coupe ce qui est au-dessus du plan.
  const clipPlane = useMemo(() => new Plane(new Vector3(0, -1, 0), 0), []);

  useEffect(() => {
    if (geometry) {
      // 1. Centrage et normalisation
      geometry.center();
      geometry.computeVertexNormals();

      // 2. Calcul des dimensions (Bounding Box)
      const box = new Box3().setFromObject(new Mesh(geometry));
      const size = new Vector3();
      box.getSize(size);
      
      statsRef.current = { height: size.y, minY: box.min.y };

      // 3. Calcul mathématique du Volume (Méthode des tétraèdres signés)
      let volume = 0;
      const pos = geometry.attributes.position;
      const p1 = new Vector3(), p2 = new Vector3(), p3 = new Vector3();
      
      // On itère sur chaque triangle du maillage
      for (let i = 0; i < pos.count; i += 3) {
        p1.fromBufferAttribute(pos, i);
        p2.fromBufferAttribute(pos, i + 1);
        p3.fromBufferAttribute(pos, i + 2);
        volume += p1.dot(p2.cross(p3)) / 6.0;
      }

      // 4. Envoi des données au parent (page.tsx)
      if (onLoaded) {
        onLoaded({
          width: size.x,
          height: size.y,
          depth: size.z,
          volume: Math.abs(volume), // En mm3
          minY: box.min.y
        });
      }
    }
  }, [geometry, onLoaded]);

  useFrame((state, delta) => {
    // Rotation automatique
    if (autoRotate && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }

    // Mise à jour dynamique du Slicer
    if (statsRef.current) {
      // Conversion du pourcentage (0-100) en position Y réelle
      const visibleHeight = (sliceValue / 100) * statsRef.current.height;
      clipPlane.constant = statsRef.current.minY + visibleHeight;
    }
  });

  // Props communes pour activer le Slicer sur tous les matériaux
  const materialProps = {
    color: color,
    clippingPlanes: [clipPlane], // Active la coupe
    clipShadows: true,
    side: DoubleSide, // DoubleSide : OBLIGATOIRE pour voir l'intérieur de l'objet coupé
  };

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      {materialType === 'standard' && (
        <meshStandardMaterial {...materialProps} roughness={0.3} metalness={0.4} />
      )}
      
      {materialType === 'wireframe' && (
        <meshStandardMaterial {...materialProps} wireframe emissive={color} emissiveIntensity={0.5} />
      )}
      
      {materialType === 'glass' && (
        <meshPhysicalMaterial {...materialProps} metalness={0.1} roughness={0.05} transmission={0.9} thickness={1} clearcoat={1} />
      )}
    </mesh>
  );
}