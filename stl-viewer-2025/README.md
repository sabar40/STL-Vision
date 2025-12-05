# 🛡️ NIRD Vision 2025 - L'Atelier de Réparation Numérique

![License](https://img.shields.io/badge/License-MIT-green.svg)
![Event](https://img.shields.io/badge/Event-Nuit_de_l'Info_2025-blueviolet)
![Challenge](https://img.shields.io/badge/Défi-Utopie3D-orange)

> **"Face à l'obsolescence programmée, la résistance commence par la réparation."**

## 📖 Le Projet

**NIRD Vision** est une application web développée durant la **Nuit de l'Info 2025**. [cite_start]Elle répond au défi **UTOPIE 3D** tout en s'inscrivant pleinement dans le thème national du **Village Numérique Résistant (NIRD)**[cite: 8, 12].

### Le Problème
[cite_start]Les établissements scolaires sont souvent contraints de jeter du matériel informatique fonctionnel à cause d'une simple pièce plastique cassée (charnière, bouton, support), faute de pièces détachées fournies par les fabricants ("Goliath")[cite: 10].

### Notre Solution
Une application d'aide à la décision qui permet de **visualiser**, **analyser** et **chiffrer** l'impression 3D de pièces de rechange. Elle prouve mathématiquement qu'imprimer une pièce de quelques grammes est plus rentable et écologique que le rachat de matériel neuf.

---

## 🚀 Fonctionnalités Clés

### 1. Visualisation 3D Avancée (Défi Utopie 3D)
* **Support STL :** Importation rapide de fichiers `.stl`.
* **Contrôles :** Zoom, Rotation orbitale, Panoramique fluides.
* **Modes de Vue :**
    * *Standard :* Rendu réaliste.
    * *Wireframe :* Analyse du maillage (polygones).
    * *Glass :* Transparence esthétique.
* **Inspection (Slicer) :** Outil de coupe transversal pour vérifier la structure interne de la pièce avant impression.

### 2. Analyse Technique & Métrologie
* **Dimensions (Bounding Box) :** Calcul automatique des dimensions maximales (X, Y, Z) en mm.
* **Volumétrie Précise :** Algorithme basé sur le calcul de volume signé des tétraèdres du maillage 3D.

### 3. L'Éco-Calculateur NIRD (Approche Responsable)
Transforme les données techniques en impact réel :
* **Multi-Matériaux :** Sélection dynamique (PLA, ABS, PETG, TPU) avec densités réelles.
* **Poids :** Estimation du grammage nécessaire.
* **Coût de Fabrication :** Estimation du prix (matière + énergie).
* **Empreinte Carbone :** Calcul des émissions CO2 (kgCO2e) basées sur les ACV standard.

### 4. Comparateur "David contre Goliath"
* L'utilisateur saisit le prix de l'objet neuf à remplacer.
* L'application calcule instantanément l'économie réalisée en % et en €.
* *Exemple : "Réparer cette charnière coûte 0.10€ vs 50€ pour un boîtier neuf."*

### 5. Export de Fiche Technique
* Génération d'un rapport PDF propre et épuré (mode impression spécifique) pour archivage ou validation par l'administration de l'établissement.

---

## 🛠️ Stack Technique

Ce projet a été construit avec des technologies modernes et performantes :

| Technologie | Usage |
| :--- | :--- |
| **Next.js 14** | Framework React & Rendu Serveur/Client |
| **React Three Fiber** | Moteur de rendu 3D (basé sur Three.js) |
| **Drei** | Utilitaires 3D (Stage, OrbitControls) |
| **Tailwind CSS** | Design System & Responsive |
| **TypeScript** | Typage strict et robustesse du code |

---

## 📐 Méthodologie de Calcul

Pour garantir la précision requise par le défi Utopie3D, nous n'utilisons pas d'approximations grossières.

* **Volume :** Calculé en itérant sur chaque triangle de la géométrie et en calculant le produit mixte (volume signé) par rapport à l'origine.
    $$V = \left| \sum \frac{P_1 \cdot (P_2 \times P_3)}{6} \right|$$
* **Dimensions :** Calculées via la `Box3` (Axis-Aligned Bounding Box) de Three.js.

---

## 💻 Installation et Démarrage

Pour tester l'application localement :

1.  **Cloner le dépôt :**
    ```bash
    git clone [VOTRE_LIEN_GIT_ICI]
    cd nird-vision-2025
    ```

2.  **Installer les dépendances :**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Lancer le serveur de développement :**
    ```bash
    npm run dev
    ```

4.  **Accéder à l'application :**
    Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 👥 L'Équipe

Projet réalisé pour la Nuit de l'Info 2025.

* **Développeur :** [TON_NOM_OU_PSEUDO]
* **Design & Concept :** [TON_NOM_OU_PSEUDO]

---

*Fait avec ❤️, du code et beaucoup de café pour un numérique plus durable.*