"use client";

import React, { useRef } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { STLLoader } from 'three-stdlib';
import { Mesh } from 'three';

interface STLModelProps {
  url: string;
  color: string;
  materialType: 'standard' | 'wireframe' | 'glass';
  autoRotate: boolean;
}

export default function STLModel({ url, color, materialType, autoRotate }: STLModelProps) {
  const geometry = useLoader(STLLoader, url);
  const meshRef = useRef<Mesh>(null);

  // Animation frame par frame pour l'auto-rotation manuelle (si besoin de plus de contrôle)
  useFrame((state, delta) => {
    if (autoRotate && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5; // Vitesse de rotation
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      
      {/* 1. Mode STANDARD (Plastique/Métal selon config) */}
      {materialType === 'standard' && (
        <meshStandardMaterial 
          color={color} 
          roughness={0.3} 
          metalness={0.4} 
        />
      )}

      {/* 2. Mode WIREFRAME (Effet Tron/Tech) */}
      {materialType === 'wireframe' && (
        <meshStandardMaterial 
          color={color} 
          wireframe={true}
          emissive={color} // Brille un peu
          emissiveIntensity={0.5}
        />
      )}

      {/* 3. Mode GLASS (Verre/Glace - Idéal pour thèmes eau/espace) */}
      {materialType === 'glass' && (
        <meshPhysicalMaterial 
          color={color}
          metalness={0.1}
          roughness={0.05}
          transmission={0.9} // Transparence
          thickness={1} // Épaisseur du verre
          clearcoat={1}
        />
      )}
    </mesh>
  );
}