# WeVis Datathon: Political Party Analysis

This repository contains an interactive Political Party Analysis dashboard originally developed for a datathon context. It features data visualizations detailing party characteristics, 3D PCA clustering, and longitudinal performance over 4 years.

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Data Visualization (2D):** D3.js (e.g., Radar/Spider Charts, Stacked Bar Charts)
- **Data Visualization (3D):** React Three Fiber (`@react-three/fiber`), `@react-three/drei`, Three.js (Rendered for 3D Party Clustering and PCA spatial mappings)

### Backend
- **Framework:** Express.js (Node.js)
- **Language:** TypeScript
- **Data Runtime Loading:** Custom CSV parsing logic utilizing built-in modules (`fs`, `csv-parse`) acting as an in-memory datastore upon startup.

## 📊 Data Mapping
The application relies on several static `.csv` files stored in `backend/data/` that are parsed into memory via `dataStore.ts` and piped to the frontend using REST APIs. 

**Core Datasets:**
1. `viz_result.csv`: Contains the Principal Component Analysis (PCA) outputs (PC1, PC2, PC3) mapping each party's geographical X,Y,Z layout for the 3D Clustering component.
2. `bills_cleaned_and_labeled2.csv`: Contains historical records of political bills, their proposal timestamps, categories, mapping party data, and final statuses (`ENACTED`, `REJECTED`, `IN_PROGRESS`, etc.). Used dynamically to track "Success Rates" and "Passed Laws".
3. `trend_vote.csv`: Stores raw historical voting metadata.
4. `vote_absence.csv`: Stores attendance records reflecting party absenteeism and physical legislative representation.
5. `unity.csv`: Tracks the calculated internal Unity (`avg_unity_score`) metric of a specific political party's voting alignment.
6. `entropy.csv`: Contains variance metrics supporting internal data clustering measurements.
