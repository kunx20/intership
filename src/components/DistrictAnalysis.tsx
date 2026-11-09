import React, { useState } from 'react';
import { District, Crop } from '../types/agri';
import { DISTRICTS, CROPS, HISTORICAL_RECORDS_SAMPLE } from '../data/agriData';
import { calculateYieldPrediction } from '../utils/predictor';
import { MapPin, Droplets, Mountain, ShoppingBag, ArrowRight } from 'lucide-react';
import { TabId } from './Header';

interface DistrictAnalysisProps {
  initialDistrict?: District;
  initialCrop?: Crop;
  onNavigate: (tab: TabId, district?: District, crop?: Crop) => void;
}

export const DistrictAnalysis: React.FC<DistrictAnalysisProps> = ({
  initialDistrict = 'Nagpur',
  initialCrop = 'Soybean',
  onNavigate,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<District>(initialDistrict);
  const [selectedCrop, setSelectedCrop] = useState<Crop>(initialCrop);

  const districtList: District[] = ['Nagpur', 'Wardha', 'Amravati', 'Chandrapur', 'Yavatmal', 'Bhandara'];
  const cropList: Crop[] = ['Soybean', 'Cotton', 'Paddy', 'Wheat', 'Tur'];

  const districtInfo = DISTRICTS[selectedDistrict];

  // Weather scenario defaults for this district
  const sc = {
    Nagpur: { rain: 4, dry: 9, npk: 0.4, oc: 0.72, price: 3 },
    Wardha: { rain: -3, dry: 11, npk: 0.6, oc: 0.68, price: 5 },
    Amravati: { rain: -12, dry: 16, npk: 1.1, oc: 0.62, price: 8 },
    Chandrapur: { rain: 8, dry: 7, npk: 0.5, oc: 0.78, price: 2 },
    Yavatmal: { rain: -18, dry: 19, npk: 1.4, oc: 0.54, price: 10 },
    Bhandara: { rain: 14, dry: 5, npk: 0.3, oc: 0.84, price: -1 },
  }[selectedDistrict];

  const currentPrediction = calculateYieldPrediction({
    district: selectedDistrict,
    crop: selectedCrop,
    rainfallDeviationPct: sc.rain,
    drySpellDays: sc.dry,
    soilNPKDeviation: sc.npk,
    soilOrganicCarbon: sc.oc,
    mandiPriceDeviationPct: sc.price,
    irrigationBonusPct: 0,
  });

  // Calculate across all crops in this district
  const allCropPredictions = cropList.map((c) => {
    return calculateYieldPrediction({
      district: selectedDistrict,
      crop: c,
      rainfallDeviationPct: sc.rain,
      drySpellDays: sc.dry,
      soilNPKDeviation: sc.npk,
      soilOrganicCarbon: sc.oc,
      mandiPriceDeviationPct: sc.price,
      irrigationBonusPct: 0,
    });
  });

  // Filter historical records for this district
  const historicalDistrictData = HISTORICAL_RECORDS_SAMPLE.filter(
    (r) => r.district === selectedDistrict && r.crop === selectedCrop
  );

  return (
    <div className="space-y-8">
      {/* District Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            District Agronomic & Market Intelligence
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Compare localized soil chemistry, rainfall sensitivity, and crop portfolios across Vidarbha
          </p>
        </div>

        {/* District selection buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {districtList.map((d) => {
            const isSelected = selectedDistrict === d;
            return (
              <button
                key={d}
                onClick={() => setSelectedDistrict(d)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>

      {/* District Dossier Header */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <MapPin className="w-4 h-4" />
              <span>District Profile & Sourcing Logistics</span>
              <span aria-hidden="true">·</span>
              <span>HQ: {districtInfo.headquarters}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">Lat: {districtInfo.latitude}°N, Long: {districtInfo.longitude}°E</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {districtInfo.name} District Sourcing Hub
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {districtInfo.description}
            </p>
          </div>

          <button
            onClick={() => onNavigate('simulator', selectedDistrict, selectedCrop)}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <span>Launch What-If Simulator for {selectedDistrict}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Core Agro Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Mountain className="w-3.5 h-3.5" />
              <span>Cultivable Area</span>
            </div>
            <div className="mt-1 text-lg font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {(districtInfo.totalCultivableAreaHa / 1000).toLocaleString()}k <span className="text-xs font-normal text-slate-500">Ha</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">{districtInfo.primarySoil}</div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Droplets className="w-3.5 h-3.5" />
              <span>Irrigation Access</span>
            </div>
            <div className="mt-1 text-lg font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {districtInfo.irrigationPct}%
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {districtInfo.irrigationPct > 35 ? 'Canal & Well Protected' : 'Severely Rainfed Dependent'}
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Major APMC Mandi</span>
            </div>
            <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white truncate">
              {districtInfo.majorMandi}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Daily spot trading volume & arrival hub</div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Droplets className="w-3.5 h-3.5" />
              <span>Annual Normal Rain</span>
            </div>
            <div className="mt-1 text-lg font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {districtInfo.avgRainfallMm} <span className="text-xs font-normal text-slate-500">mm</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">85% delivered June–September</div>
          </div>
        </div>
      </div>

      {/* Multi-Crop Portfolio Performance in this District */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Crop Performance & Yield Forecasts in {selectedDistrict} (2024-25)
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Tuned Gradient Boosting predictions vs Benchmark
          </span>
        </div>

        <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
              <tr>
                <th className="py-3 px-4">Crop</th>
                <th className="py-3 px-4">Season</th>
                <th className="py-3 px-4 text-right">Predicted Yield</th>
                <th className="py-3 px-4 text-right">Historical Benchmark</th>
                <th className="py-3 px-4 text-right">Variance</th>
                <th className="py-3 px-4 text-right">Est. Production</th>
                <th className="py-3 px-4">Shortfall Risk</th>
                <th className="py-3 px-4">Procurement Sourcing Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {allCropPredictions.map((pred) => {
                const cropInfo = CROPS[pred.crop];
                const isSelected = selectedCrop === pred.crop;
                const isNegative = pred.yieldDeltaVsBenchmarkPct < 0;

                return (
                  <tr
                    key={pred.crop}
                    onClick={() => setSelectedCrop(pred.crop)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/30'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{cropInfo.name}</span>
                        {isSelected && (
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-semibold">
                            (Selected)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {cropInfo.season} ({cropInfo.durationDays}d)
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      {pred.gbmYieldQHa} Q/Ha
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-500 tabular-nums">
                      {cropInfo.benchmarkYieldQHa} Q/Ha
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums font-semibold">
                      <span className={isNegative ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>
                        {isNegative ? '' : '+'}
                        {pred.yieldDeltaVsBenchmarkPct}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-800 dark:text-slate-200 tabular-nums">
                      {(pred.expectedProductionTonnes / 1000).toFixed(1)}k MT
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          pred.riskLevel === 'Critical'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                            : pred.riskLevel === 'High'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        }`}
                      >
                        {pred.riskLevel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                      {pred.sourcingPriority}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Yield & Monsoon Rainfall Tracking */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Historical Yield Realization: {selectedDistrict} ({selectedCrop})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Examining actual past harvest yields alongside monsoon precipitation trends
            </p>
          </div>
          <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
            Selected: <strong className="text-slate-900 dark:text-white">{selectedDistrict} - {selectedCrop}</strong>
          </div>
        </div>

        {historicalDistrictData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            {historicalDistrictData.map((rec) => (
              <div
                key={rec.year}
                className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800"
              >
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Year {rec.year}</span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {rec.year === 2024 ? 'Test Split' : rec.year >= 2022 ? 'Val Split' : 'Train Split'}
                  </span>
                </div>

                <div className="mt-2 text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  {rec.yieldQHa}{' '}
                  <span className="text-xs font-normal text-slate-500">Q/Ha</span>
                </div>

                <div className="mt-3 space-y-1 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700/60 pt-2">
                  <div className="flex justify-between">
                    <span>Monsoon Rain:</span>
                    <span className="font-mono font-medium text-slate-700 dark:text-slate-200">{rec.monsoonRainfallMm} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dry Spell:</span>
                    <span className="font-mono font-medium text-slate-700 dark:text-slate-200">{rec.drySpellDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mandi Spot:</span>
                    <span className="font-mono font-medium text-slate-700 dark:text-slate-200">₹{rec.mandiPriceRsQ}/q</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-500">
            No sampled historical records for this specific combination.
          </div>
        )}
      </div>
    </div>
  );
};
