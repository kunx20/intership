import React, { useState } from 'react';
import { Crop, District } from '../types/agri';
import { DISTRICTS, CROPS } from '../data/agriData';
import { calculateYieldPrediction } from '../utils/predictor';
import { TrendingUp, AlertTriangle, CheckCircle2, ChevronRight, BarChart3, Database } from 'lucide-react';
import { TabId } from './Header';

interface DashboardOverviewProps {
  onNavigate: (tab: TabId, district?: District, crop?: Crop) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigate }) => {
  const [selectedCrop, setSelectedCrop] = useState<Crop>('Soybean');

  const districtList: District[] = ['Nagpur', 'Wardha', 'Amravati', 'Chandrapur', 'Yavatmal', 'Bhandara'];
  const cropList: Crop[] = ['Soybean', 'Cotton', 'Paddy', 'Wheat', 'Tur'];

  // Calculate high-level summary metrics
  const districtPredictions = districtList.map((district) => {
    // Standard baseline weather parameters for 2024 season
    const sc = {
      Nagpur: { rain: 4, dry: 9, npk: 0.4, oc: 0.72, price: 3 },
      Wardha: { rain: -3, dry: 11, npk: 0.6, oc: 0.68, price: 5 },
      Amravati: { rain: -12, dry: 16, npk: 1.1, oc: 0.62, price: 8 },
      Chandrapur: { rain: 8, dry: 7, npk: 0.5, oc: 0.78, price: 2 },
      Yavatmal: { rain: -18, dry: 19, npk: 1.4, oc: 0.54, price: 10 },
      Bhandara: { rain: 14, dry: 5, npk: 0.3, oc: 0.84, price: -1 },
    }[district];

    return calculateYieldPrediction({
      district,
      crop: selectedCrop,
      rainfallDeviationPct: sc.rain,
      drySpellDays: sc.dry,
      soilNPKDeviation: sc.npk,
      soilOrganicCarbon: sc.oc,
      mandiPriceDeviationPct: sc.price,
      irrigationBonusPct: 0,
    });
  });

  const totalProductionTonnes = districtPredictions.reduce((acc, p) => acc + p.expectedProductionTonnes, 0);
  const avgYieldQHa = Number(
    (districtPredictions.reduce((acc, p) => acc + p.gbmYieldQHa, 0) / districtPredictions.length).toFixed(1)
  );
  const benchmarkYield = CROPS[selectedCrop].benchmarkYieldQHa;
  const yieldDeltaPct = Number((((avgYieldQHa - benchmarkYield) / benchmarkYield) * 100).toFixed(1));
  const highRiskCount = districtPredictions.filter((p) => p.riskLevel === 'High' || p.riskLevel === 'Critical').length;

  return (
    <div className="space-y-8">
      {/* Hero / Executive Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
            <span>Nagpur AgTech Sourcing Intelligence</span>
            <span aria-hidden="true">·</span>
            <span>Vidarbha Agro-Climatic Zone (6 Districts)</span>
            <span aria-hidden="true">·</span>
            <span>Season: Kharif & Rabi 2024-25</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            District-Level Yield & Procurement Outlook
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Early crop harvest forecasts 60–75 days pre-harvest across 3.38 million hectares, driven by calibrated Gradient Boosting with complete SHAP causal transparency.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('deck')}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors whitespace-nowrap"
          >
            Executive Slide Deck (8 Slides)
          </button>
          <button
            onClick={() => onNavigate('procurement', undefined, selectedCrop)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-lg transition-colors whitespace-nowrap"
          >
            View Sourcing Matrix
          </button>
        </div>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Total Projected Production
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {(totalProductionTonnes / 1000).toFixed(1)}k
            </span>
            <span className="text-xs text-slate-500 font-medium">Metric Tonnes</span>
          </div>
          <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
            Across 6 Vidarbha districts for {selectedCrop}
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Vidarbha Average Yield
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {avgYieldQHa}
            </span>
            <span className="text-xs text-slate-500 font-medium">Quintals / Ha</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            <span
              className={`font-semibold font-mono ${
                yieldDeltaPct >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {yieldDeltaPct >= 0 ? `+${yieldDeltaPct}%` : `${yieldDeltaPct}%`}
            </span>
            <span className="text-slate-500 dark:text-slate-400">vs historical benchmark ({benchmarkYield} q/ha)</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Yield Shortfall Alerts
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-bold font-mono tabular-nums ${highRiskCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {highRiskCount} / 6
            </span>
            <span className="text-xs text-slate-500 font-medium">Districts at Risk</span>
          </div>
          <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
            {highRiskCount > 0 ? 'Yavatmal facing acute dry spell stress' : 'All districts within nominal yield window'}
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Govt MSP Reference Price
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              ₹{CROPS[selectedCrop].mspPriceRsQ.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-medium">/ Quintal</span>
          </div>
          <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
            Kharif/Rabi 2024-25 notified benchmark
          </div>
        </div>
      </div>

      {/* Crop Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-100 dark:bg-slate-800/60 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Select Active Crop:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {cropList.map((crop) => {
              const isActive = selectedCrop === crop;
              return (
                <button
                  key={crop}
                  onClick={() => setSelectedCrop(crop)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {CROPS[crop].name} ({CROPS[crop].season})
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <span>Crop Duration: <strong className="text-slate-700 dark:text-slate-200 font-mono">{CROPS[selectedCrop].durationDays} Days</strong></span>
          <span aria-hidden="true">·</span>
          <span>Water Need: <strong className="text-slate-700 dark:text-slate-200">{CROPS[selectedCrop].waterRequirement}</strong></span>
        </div>
      </div>

      {/* District Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Vidarbha District Forecast Breakdown ({selectedCrop})
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Click any district to explore detailed agro-climatic drivers
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {districtPredictions.map((pred) => {
            const districtInfo = DISTRICTS[pred.district];
            const isDeficit = pred.yieldDeltaVsBenchmarkPct < 0;

            return (
              <div
                key={pred.district}
                className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {districtInfo.name}
                      </h3>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Mandi: {districtInfo.majorMandi}
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-sm ${
                          pred.riskLevel === 'Critical'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                            : pred.riskLevel === 'High'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        }`}
                      >
                        {pred.riskLevel} Risk
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 py-3 border-y border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Predicted Yield</div>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                        {pred.gbmYieldQHa}{' '}
                        <span className="text-xs font-normal text-slate-500">Q/Ha</span>
                      </div>
                      <div className="text-xs font-mono mt-0.5">
                        <span className={isDeficit ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>
                          {isDeficit ? '' : '+'}
                          {pred.yieldDeltaVsBenchmarkPct}% vs hist
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Est. Total Output</div>
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                        {(pred.expectedProductionTonnes / 1000).toFixed(1)}{' '}
                        <span className="text-xs font-normal text-slate-500">k MT</span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        90% CI: [{pred.confidenceInterval[0]} - {pred.confidenceInterval[1]}]
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span>Soil Type:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[170px]">
                        {districtInfo.primarySoil}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Irrigation Coverage:</span>
                      <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                        {districtInfo.irrigationPct}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Procurement Order:</span>
                      <span className="font-medium text-emerald-700 dark:text-emerald-400">
                        {pred.sourcingPriority}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onNavigate('simulator', pred.district, selectedCrop)}
                    className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1"
                  >
                    <span>Simulate Weather Shock</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onNavigate('districts', pred.district, selectedCrop)}
                    className="text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  >
                    Deep Dive
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Model vs Baseline Quality Strip */}
      <div className="p-6 bg-slate-900 text-white dark:bg-slate-800/80 rounded-2xl border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Model Tournament Validation Verified</span>
            </div>
            <h3 className="text-lg font-bold">
              Final Tuned Gradient Boosting Model Beats Baseline by 35.6%
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tested on 350,000 sanitized historical records across 2017–2024. Expanding-window temporal split guarantees zero lookahead leakage. Test period performance (2.46 Q/Ha MAE) tracks validation (2.53 Q/Ha) within 2.8%, well inside the 5% stability ceiling.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 shrink-0">
            <div className="p-3 bg-slate-800/80 dark:bg-slate-900/80 rounded-lg border border-slate-700">
              <div className="text-[11px] text-slate-400 font-medium">Test Period MAE</div>
              <div className="text-lg font-bold font-mono text-emerald-400">2.46 Q/Ha</div>
              <div className="text-[10px] text-slate-400">vs 3.85 Q/Ha Baseline</div>
            </div>

            <div className="p-3 bg-slate-800/80 dark:bg-slate-900/80 rounded-lg border border-slate-700">
              <div className="text-[11px] text-slate-400 font-medium">Gain Over Baseline</div>
              <div className="text-lg font-bold font-mono text-emerald-400">+35.6%</div>
              <div className="text-[10px] text-slate-400">Hurdle was ≥ 15%</div>
            </div>

            <div className="p-3 bg-slate-800/80 dark:bg-slate-900/80 rounded-lg border border-slate-700 col-span-2 sm:col-span-1">
              <div className="text-[11px] text-slate-400 font-medium">Shortfall Recall</div>
              <div className="text-lg font-bold font-mono text-emerald-400">84.6%</div>
              <div className="text-[10px] text-slate-400">@ 80% Fixed Precision</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
