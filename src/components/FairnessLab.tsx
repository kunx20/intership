import React, { useState } from 'react';
import { Scale, ToggleLeft, ToggleRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { TabId } from './Header';

interface FairnessLabProps {
  onNavigate: (tab: TabId) => void;
}

export const FairnessLab: React.FC<FairnessLabProps> = ({ onNavigate }) => {
  const [isRecalibrated, setIsRecalibrated] = useState<boolean>(true);

  const landholdingGroups = [
    {
      group: 'Marginal (< 1 Hectare)',
      farmerShare: '42.4%',
      rawMAE: 3.12,
      rawBias: +0.81,
      calibratedMAE: 2.48,
      calibratedBias: +0.06,
      coverage90Pct: isRecalibrated ? '90.4%' : '82.1%',
      riskFlag: !isRecalibrated ? 'Over-prediction Risk' : 'Fair Parity',
    },
    {
      group: 'Small (1–2 Hectares)',
      farmerShare: '31.8%',
      rawMAE: 2.68,
      rawBias: +0.32,
      calibratedMAE: 2.45,
      calibratedBias: +0.02,
      coverage90Pct: isRecalibrated ? '89.8%' : '86.4%',
      riskFlag: 'Fair Parity',
    },
    {
      group: 'Medium (2–5 Hectares)',
      farmerShare: '18.6%',
      rawMAE: 2.44,
      rawBias: -0.14,
      calibratedMAE: 2.42,
      calibratedBias: -0.03,
      coverage90Pct: isRecalibrated ? '91.2%' : '89.0%',
      riskFlag: 'Fair Parity',
    },
    {
      group: 'Large (> 5 Hectares)',
      farmerShare: '7.2%',
      rawMAE: 2.38,
      rawBias: -0.45,
      calibratedMAE: 2.44,
      calibratedBias: -0.04,
      coverage90Pct: isRecalibrated ? '90.1%' : '92.3%',
      riskFlag: !isRecalibrated ? 'Under-prediction' : 'Fair Parity',
    },
  ];

  const regionalStability = [
    {
      region: 'Northern & Eastern Vidarbha (Nagpur, Bhandara, Wardha)',
      description: 'Higher canal irrigation access & Wainganga/Wardha river basins',
      mae: isRecalibrated ? 2.41 : 2.52,
      stabilityScore: '96.4%',
      status: 'Optimal Stability',
    },
    {
      region: 'Southern & Western Vidarbha (Yavatmal, Amravati, Chandrapur)',
      description: 'Extensive rainfed acreage, high dry-spell vulnerability',
      mae: isRecalibrated ? 2.51 : 2.82,
      stabilityScore: '94.8%',
      status: 'Calibrated Stability',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <Scale className="w-4 h-4" />
            <span>Algorithmic Fairness & Subgroup Parity</span>
            <span aria-hidden="true">·</span>
            <span>Landholder Equity & Regional Calibration</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Fairness, Stability & Recalibration Lab
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit prediction parity across marginal vs large landholders, evaluate geographic stability across micro-climates, and inspect recalibration adjustments.
          </p>
        </div>

        {/* Interactive Recalibration Toggle */}
        <div className="flex items-center gap-3 p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Recalibration:
          </span>
          <button
            onClick={() => setIsRecalibrated(!isRecalibrated)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isRecalibrated
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200'
            }`}
          >
            {isRecalibrated ? (
              <>
                <ToggleRight className="w-4 h-4" />
                <span>Isotonic Recalibrated (Active)</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-4 h-4" />
                <span>Raw Gradient Boosting Output</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Recalibration Impact Summary Strip */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Why Algorithmic Recalibration Matters in Agri-Procurement
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Protecting smallholder farmers from contractual exclusion caused by unmeasured micro-irrigation disparities
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
            Status: {isRecalibrated ? 'Bias Corrected via Isotonic Quantiles' : 'Raw Model State'}
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          In raw machine learning models, algorithms trained on coarse satellite resolution systematically over-predict yields on marginal farms (&lt;1 ha) by <strong className="text-slate-900 dark:text-white font-mono">+0.81 Q/Ha</strong>. Why? Marginal farmers often lack borehole pump access during brief dry spells. If left uncorrected, agribusiness procurement contracts would overestimate smallholder deliveries, creating artificial contract default penalties. By applying <strong>Isotonic Quantile Recalibration</strong>, our error bias is eliminated across all farm size tiers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <div className="text-[11px] text-slate-500">Marginal Farm Bias</div>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
              {isRecalibrated ? '+0.06 Q/Ha' : '+0.81 Q/Ha'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {isRecalibrated ? 'Neutralized to zero bias' : 'Skewed by micro-climate lack'}
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <div className="text-[11px] text-slate-500">Subgroup Parity Ratio</div>
            <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
              {isRecalibrated ? '0.96 (Near Perfect)' : '0.88 (Disparate)'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Ratio of Marginal to Large farm accuracy
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <div className="text-[11px] text-slate-500">Empirical 90% CI Coverage</div>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
              {isRecalibrated ? '90.4%' : '84.8%'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              True harvest falls inside predicted range
            </div>
          </div>
        </div>
      </div>

      {/* Landholding Fairness Parity Table */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Subgroup Accuracy Audit Across Landholder Farm Size Tiers
        </h3>

        <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
              <tr>
                <th className="py-3 px-4">Landholding Segment</th>
                <th className="py-3 px-4">Farmer Base Share</th>
                <th className="py-3 px-4 text-right">Mean Absolute Error (MAE)</th>
                <th className="py-3 px-4 text-right">Prediction Bias</th>
                <th className="py-3 px-4 text-right">90% CI Empirical Coverage</th>
                <th className="py-3 px-4">Fairness Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {landholdingGroups.map((g) => {
                const mae = isRecalibrated ? g.calibratedMAE : g.rawMAE;
                const bias = isRecalibrated ? g.calibratedBias : g.rawBias;

                return (
                  <tr key={g.group} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {g.group}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-mono">
                      {g.farmerShare}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                      {mae.toFixed(2)} Q/Ha
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                      <span className={Math.abs(bias) < 0.1 ? 'text-emerald-600' : 'text-amber-600 font-bold'}>
                        {bias > 0 ? `+${bias.toFixed(2)}` : bias.toFixed(2)} Q/Ha
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums font-semibold text-slate-800 dark:text-slate-200">
                      {g.coverage90Pct}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          g.riskFlag === 'Fair Parity'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                      >
                        {g.riskFlag}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Regional Geographical Stability */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Regional Geographic Stability (Northern vs Southern Vidarbha)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {regionalStability.map((r, idx) => (
            <div
              key={idx}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {r.region}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{r.description}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {r.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block">Out-of-Time MAE</span>
                  <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                    {r.mae.toFixed(2)} Q/Ha
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Stability Index</span>
                  <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {r.stabilityScore}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
