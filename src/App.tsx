/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header, TabId } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { DistrictAnalysis } from './components/DistrictAnalysis';
import { YieldSimulator } from './components/YieldSimulator';
import { ProcurementMatrix } from './components/ProcurementMatrix';
import { ExplainableAI } from './components/ExplainableAI';
import { ModelTournament } from './components/ModelTournament';
import { FairnessLab } from './components/FairnessLab';
import { ForensicErrorCase } from './components/ForensicErrorCase';
import { FindingsDeck } from './components/FindingsDeck';
import { ModelCardView } from './components/ModelCardView';
import { District, Crop } from './types/agri';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [selectedDistrict, setSelectedDistrict] = useState<District>('Nagpur');
  const [selectedCrop, setSelectedCrop] = useState<Crop>('Soybean');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Sync dark mode class with root HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleNavigate = (tab: TabId, district?: District, crop?: Crop) => {
    if (district) setSelectedDistrict(district);
    if (crop) setSelectedCrop(crop);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors flex flex-col font-sans">
      {/* Universal 3-Zone Top Bar */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => handleNavigate(tab)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <DashboardOverview onNavigate={handleNavigate} />
        )}

        {activeTab === 'districts' && (
          <DistrictAnalysis
            initialDistrict={selectedDistrict}
            initialCrop={selectedCrop}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'simulator' && (
          <YieldSimulator
            initialDistrict={selectedDistrict}
            initialCrop={selectedCrop}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'procurement' && (
          <ProcurementMatrix
            initialCrop={selectedCrop}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'explainability' && (
          <ExplainableAI onNavigate={handleNavigate} />
        )}

        {activeTab === 'tournament' && (
          <ModelTournament onNavigate={handleNavigate} />
        )}

        {activeTab === 'fairness' && (
          <FairnessLab onNavigate={handleNavigate} />
        )}

        {activeTab === 'case-study' && (
          <ForensicErrorCase onNavigate={handleNavigate} />
        )}

        {activeTab === 'deck' && (
          <FindingsDeck onNavigate={handleNavigate} />
        )}

        {activeTab === 'model-card' && (
          <ModelCardView onNavigate={handleNavigate} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 mt-12 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 dark:text-white">KisanDrishti</span>
            <span aria-hidden="true">·</span>
            <span>Nagpur Agritech Predictive Analytics Platform</span>
            <span aria-hidden="true">·</span>
            <span>Vidarbha Zone</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>350,000 Records Evaluated</span>
            <span aria-hidden="true">·</span>
            <span>Tuned LightGBM Regressor (MAE: 2.46 Q/Ha)</span>
            <span aria-hidden="true">·</span>
            <span>Zero Forward Leakage</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
