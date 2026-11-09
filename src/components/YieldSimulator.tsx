import React, { useState } from 'react';
import { District, Crop } from '../types/agri';
import { DISTRICTS, CROPS } from '../data/agriData';
import { calculateYieldPrediction, SimulatorInputs } from '../utils/predictor';
import { Sliders, RefreshCw, AlertCircle, ArrowRight } from 'lucide-react';
import { TabId } from './Header';

interface YieldSimulatorProps {
  initialDistrict?: District;
  initialCrop?: Crop;
  onNavigate: (tab: TabId, district?: District, crop?: Crop) => void;
}

export const YieldSimulator: React.FC<YieldSimulatorProps> = ({
  initialDistrict = 'Nagpur',
  initialCrop = 'Soybean',
  onNavigate,
}) => {
  const [district, setDistrict] = useState<District>(initialDistrict);
  const [crop, setCrop] = useState<Crop>(initialCrop);

  const [rainfallDev, setRainfallDev] = useState<number>(0);
  const [drySpell, setDrySpell] = useState<number>(8);
  const [soilNPK, setSoilNPK] = useState<number>(0.5);
  const [soilOC, setSoilOC] = useState<number>(0.68);
  const [mandiPriceDev, setMandiPriceDev] = useState<number>(4);
  const [irrigationBonus, setIrrigationBonus] = useState<number>(0);

  const districtList: District[] = ['Nagpur', 'Wardha', 'Amravati', 'Chandrapur', 'Yavatmal', 'Bhandara'];
  const cropList: Crop[] = ['Soybean', 'Cotton', 'Paddy', 'Wheat', 'Tur'];

  const inputs: SimulatorInputs = {
    district,
    crop,
    rainfallDeviationPct: rainfallDev,
    drySpellDays: drySpell,
    soilNPKDeviation: soilNPK,
    soilOrganicCarbon: soilOC,
    mandiPriceDeviationPct: mandiPriceDev,
    irrigationBonusPct: irrigationBonus,
  };

  const prediction = calculateYieldPrediction(inputs);
  const cropInfo = CROPS[crop];
  const districtInfo = DISTRICTS[district];

  // Presets
  const applyPreset = (preset: 'normal' | 'drought' | 'bumper' | 'waterlog') => {
    if (preset === 'normal') {
      setRainfallDev(0);
      setDrySpell(8);
      setSoilNPK(0.5);
      setSoilOC(0.68);
      setMandiPriceDev(2);
      setIrrigationBonus(0);
    } else if (preset === 'drought') {
      setRainfallDev(-25);
      setDrySpell(18);
      setSoilNPK(1.2);
      setSoilOC(0.55);
      setMandiPriceDev(12);
      setIrrigationBonus(0);
    } else if (preset === 'bumper') {
      setRainfallDev(12);
      setDrySpell(5);
      setSoilNPK(0.2);
      setSoilOC(0.82);
      setMandiPriceDev(-2);
      setIrrigationBonus(10);
    } else if (preset === 'waterlog') {
      setRainfallDev(35);
      setDrySpell(3);
      setSoilNPK(0.8);
      setSoilOC(0.70);
      setMandiPriceDev(8);
      setIrrigationBonus(0);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <Sliders className="w-4 h-4" />
            <span>Interactive Multi-Model Sandbox</span>
            <span aria-hidden="true">·</span>
            <span>Non-Linear Weather, Soil & Market Inference</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            What-If Crop Yield Simulator
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Adjust agro-climatic stress vectors and market dynamics to simulate real-time harvest yields, model divergences, and procurement risk triggers.
          </p>
        </div>

        {/* Preset Triggers */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-xs text-slate-500 mr-1 hidden sm:inline">Presets:</span>
          <button
            onClick={() => applyPreset('normal')}
            className="px-2.5 py-1 text-xs font-medium rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 whitespace-nowrap"
          >
            Normal Season
          </button>
          <button
            onClick={() => applyPreset('drought')}
            className="px-2.5 py-1 text-xs font-medium rounded-md bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900 whitespace-nowrap"
          >
            Drought Shock
          </button>
          <button
            onClick={() => applyPreset('bumper')}
            className="px-2.5 py-1 text-xs font-medium rounded-md bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 whitespace-nowrap"
          >
            Bumper Harvest
          </button>
          <button
            onClick={() => applyPreset('waterlog')}
            className="px-2.5 py-1 text-xs font-medium rounded-md bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900 whitespace-nowrap"
          >
            Waterlogging
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Parameters (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Simulation Parameters
            </h2>
            <button
              onClick={() => applyPreset('normal')}
              className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* District & Crop Selectors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                District
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value as District)}
                className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {districtList.map((d) => (
                  <option key={d} value={d}>
                    {d} ({DISTRICTS[d].irrigationPct}% Irrigated)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Target Crop
              </label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value as Crop)}
                className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {cropList.map((c) => (
                  <option key={c} value={c}>
                    {c} (Benchmark {CROPS[c].benchmarkYieldQHa} Q/Ha)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4 pt-2">
            {/* 1. Rainfall Deviation */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Monsoon Rainfall Deviation
                </span>
                <span
                  className={`font-mono font-bold ${
                    rainfallDev < -10
                      ? 'text-rose-600'
                      : rainfallDev > 20
                      ? 'text-blue-600'
                      : 'text-emerald-600'
                  }`}
                >
                  {rainfallDev > 0 ? `+${rainfallDev}%` : `${rainfallDev}%`}
                </span>
              </div>
              <input
                type="range"
                min="-40"
                max="40"
                step="2"
                value={rainfallDev}
                onChange={(e) => setRainfallDev(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>-40% (Severe Drought)</span>
                <span>0% (Normal)</span>
                <span>+40% (Waterlogging)</span>
              </div>
            </div>

            {/* 2. Dry Spell Days */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Max Dry Spell during Flowering
                </span>
                <span
                  className={`font-mono font-bold ${
                    drySpell > 14 ? 'text-rose-600' : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {drySpell} Days
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="26"
                step="1"
                value={drySpell}
                onChange={(e) => setDrySpell(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>0d (Continuous rain)</span>
                <span>8d (Tolerable)</span>
                <span>26d (Severe wilt)</span>
              </div>
            </div>

            {/* 3. Soil NPK Imbalance */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Soil N-P-K Imbalance Index
                </span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {soilNPK.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="2.5"
                step="0.1"
                value={soilNPK}
                onChange={(e) => setSoilNPK(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>0.0 (Balanced 4:2:1)</span>
                <span>1.0 (Mild Urea bias)</span>
                <span>2.5 (Severe imbalance)</span>
              </div>
            </div>

            {/* 4. Soil Organic Carbon */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Soil Organic Carbon (SOC)
                </span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {soilOC.toFixed(2)}%
                </span>
              </div>
              <input
                type="range"
                min="0.30"
                max="1.10"
                step="0.02"
                value={soilOC}
                onChange={(e) => setSoilOC(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>0.30% (Depleted)</span>
                <span>0.65% (Vidarbha Mean)</span>
                <span>1.10% (High humus)</span>
              </div>
            </div>

            {/* 5. Mandi Price Deviation */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Mandi Price vs MSP Trend
                </span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {mandiPriceDev > 0 ? `+${mandiPriceDev}%` : `${mandiPriceDev}%`}
                </span>
              </div>
              <input
                type="range"
                min="-20"
                max="30"
                step="1"
                value={mandiPriceDev}
                onChange={(e) => setMandiPriceDev(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>-20% (Low farmer inputs)</span>
                <span>0% (MSP Parity)</span>
                <span>+30% (Aggressive inputs)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Prediction Results & Local SHAP (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Yield Hero Card */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  Tuned Gradient Boosting (LightGBM) Forecast
                </div>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums tracking-tight">
                    {prediction.gbmYieldQHa}
                  </span>
                  <div>
                    <span className="text-base font-bold text-slate-700 dark:text-slate-300">
                      Quintals / Ha
                    </span>
                    <div className="text-xs text-slate-500 font-mono">
                      90% CI: [{prediction.confidenceInterval[0]} - {prediction.confidenceInterval[1]}] Q/Ha
                    </div>
                  </div>
                </div>
              </div>

              <div className="sm:text-right">
                <span
                  className={`inline-block px-3 py-1 rounded-md text-xs font-bold ${
                    prediction.riskLevel === 'Critical'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                      : prediction.riskLevel === 'High'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                  }`}
                >
                  {prediction.riskLevel} Shortfall Risk
                </span>
                <div className="text-xs font-mono mt-1 text-slate-600 dark:text-slate-400">
                  {prediction.yieldDeltaVsBenchmarkPct >= 0 ? '+' : ''}
                  {prediction.yieldDeltaVsBenchmarkPct}% vs {cropInfo.name} benchmark ({cropInfo.benchmarkYieldQHa} Q/Ha)
                </div>
              </div>
            </div>

            {/* Procurement Sourcing Directive */}
            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <AlertCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Procurement Directive: {prediction.sourcingPriority}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {prediction.procurementAdvice}
              </p>
            </div>
          </div>

          {/* 4-Model Benchmark Comparison */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Model Comparison for this Simulated State
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="text-[11px] text-slate-500">Baseline (Rolling)</div>
                <div className="text-lg font-bold font-mono text-slate-700 dark:text-slate-300 tabular-nums">
                  {prediction.baselineYieldQHa} <span className="text-[10px] font-normal">Q/Ha</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Historical fixed mean</div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="text-[11px] text-slate-500">Ridge Linear</div>
                <div className="text-lg font-bold font-mono text-slate-700 dark:text-slate-300 tabular-nums">
                  {prediction.ridgeYieldQHa} <span className="text-[10px] font-normal">Q/Ha</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Linear shrinkage</div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="text-[11px] text-slate-500">Random Forest</div>
                <div className="text-lg font-bold font-mono text-slate-700 dark:text-slate-300 tabular-nums">
                  {prediction.rfYieldQHa} <span className="text-[10px] font-normal">Q/Ha</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Tree ensemble</div>
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                <div className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">Tuned GBM (Best)</div>
                <div className="text-lg font-bold font-mono text-emerald-700 dark:text-emerald-300 tabular-nums">
                  {prediction.gbmYieldQHa} <span className="text-[10px] font-normal">Q/Ha</span>
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">Non-linear interactions</div>
              </div>
            </div>
          </div>

          {/* Local SHAP Waterfall Attribution */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Local SHAP Waterfall Attribution
                </h3>
                <p className="text-xs text-slate-500">
                  Explaining how each input shifted the prediction from benchmark ({cropInfo.benchmarkYieldQHa} Q/Ha)
                </p>
              </div>
              <button
                onClick={() => onNavigate('explainability')}
                className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Global Drivers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 pt-1">
              {prediction.localSHAPContributions.map((contrib, idx) => {
                const isPositive = contrib.impactQHa >= 0;
                const widthPct = Math.min(100, (Math.abs(contrib.impactQHa) / 4.0) * 100);

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {contrib.featureName}
                      </span>
                      <span
                        className={`font-mono font-bold ${
                          isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {isPositive ? `+${contrib.impactQHa}` : `${contrib.impactQHa}`} Q/Ha
                      </span>
                    </div>

                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                      <div
                        className={`h-full rounded-full ${
                          isPositive ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.max(5, widthPct)}%` }}
                      />
                    </div>

                    <div className="text-[11px] text-slate-500">
                      {contrib.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
