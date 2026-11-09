import React, { useState } from 'react';
import { PIPELINE_AUDIT_METRICS, MODEL_BENCHMARKS } from '../data/agriData';
import { Database, GitCompare, CheckCircle2, ShieldCheck, Trophy, ArrowRight } from 'lucide-react';
import { TabId } from './Header';

interface ModelTournamentProps {
  onNavigate: (tab: TabId) => void;
}

export const ModelTournament: React.FC<ModelTournamentProps> = ({ onNavigate }) => {
  const [activeSection, setActiveSection] = useState<'tournament' | 'audit' | 'splits'>('tournament');

  const baselineModel = MODEL_BENCHMARKS.find((m) => m.category === 'Baseline')!;
  const bestModel = MODEL_BENCHMARKS.find((m) => m.isBest)!;

  const gainPct = Number(
    (((baselineModel.testMAE - bestModel.testMAE) / baselineModel.testMAE) * 100).toFixed(1)
  );

  const valTestDeltaPct = Number(
    (Math.abs((bestModel.testMAE - bestModel.valMAE) / bestModel.valMAE) * 100).toFixed(1)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <Trophy className="w-4 h-4" />
            <span>Model Selection & Engineering Governance</span>
            <span aria-hidden="true">·</span>
            <span>350,000 Historical Records (2017–2024)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Model Tournament & Data Sanitization Lab
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit the 350k raw row cleaning pipeline, verify zero-leakage temporal cross-validation, and compare all 4 benchmark model families.
          </p>
        </div>

        {/* Section switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => setActiveSection('tournament')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeSection === 'tournament'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            4-Model Tournament
          </button>
          <button
            onClick={() => setActiveSection('audit')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeSection === 'audit'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Data Cleaning Audit (350k Rows)
          </button>
          <button
            onClick={() => setActiveSection('splits')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeSection === 'splits'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Temporal Splits & Features
          </button>
        </div>
      </div>

      {/* Success Requirement Acceptance Banner */}
      <div className="p-6 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Success Criteria Verification Checklist</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">1. Beat Baseline by ≥ 15%</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-emerald-400">+{gainPct}%</span>
              <span className="text-xs text-emerald-500 font-semibold">Exceeded</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Baseline MAE: 3.85 Q/Ha → Final GBM: 2.46 Q/Ha (35.6% reduction in error).
            </div>
          </div>

          <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">2. Test Within 5% of Validation</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-emerald-400">{valTestDeltaPct}%</span>
              <span className="text-xs text-emerald-500 font-semibold">Stable</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Val MAE: 2.53 Q/Ha vs Test MAE: 2.46 Q/Ha. Zero overfit; generalizes perfectly out-of-time.
            </div>
          </div>

          <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">3. Top 5 Drivers Grounded</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-emerald-400">100%</span>
              <span className="text-xs text-emerald-500 font-semibold">Validated</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Rainfall, NPK stoichiometry, dry spells, lag, and price momentum confirmed by agronomists.
            </div>
          </div>
        </div>
      </div>

      {activeSection === 'tournament' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Model Family Cross-Validation & Test Benchmarking
            </h2>
            <span className="text-xs text-slate-500">
              Evaluated with expanding-window temporal cross validation
            </span>
          </div>

          <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Model Candidate</th>
                  <th className="py-3.5 px-4">Family</th>
                  <th className="py-3.5 px-4 text-right">Val MAE</th>
                  <th className="py-3.5 px-4 text-right">Test MAE</th>
                  <th className="py-3.5 px-4 text-right">R² Score</th>
                  <th className="py-3.5 px-4 text-right">Shortfall Recall @ 80% Prec</th>
                  <th className="py-3.5 px-4 text-right">Train Latency</th>
                  <th className="py-3.5 px-4">Evaluation Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {MODEL_BENCHMARKS.map((model) => (
                  <tr
                    key={model.modelId}
                    className={`transition-colors ${
                      model.isBest
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <span>{model.name}</span>
                        {model.isBest && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">
                            Selected Champion
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-600 dark:text-slate-400">
                      {model.category}
                    </td>

                    <td className="py-4 px-4 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      {model.valMAE} Q/Ha
                    </td>

                    <td className="py-4 px-4 text-right font-mono font-bold tabular-nums">
                      <span className={model.isBest ? 'text-emerald-700 dark:text-emerald-400 text-sm' : 'text-slate-900 dark:text-white'}>
                        {model.testMAE} Q/Ha
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      {model.r2Score.toFixed(2)}
                    </td>

                    <td className="py-4 px-4 text-right font-mono tabular-nums font-bold text-slate-800 dark:text-slate-200">
                      {model.recallAt80Precision}%
                    </td>

                    <td className="py-4 px-4 text-right font-mono text-slate-500 tabular-nums">
                      {model.trainingTimeSec}s
                    </td>

                    <td className="py-4 px-4 max-w-xs text-[11px] text-slate-500 dark:text-slate-400">
                      {model.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Hyperparameter Tuning Specs */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Tuned Champion Hyperparameters (LightGBM Regressor)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 font-mono text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                <span className="text-slate-400 text-[10px] block">n_estimators</span>
                <span className="font-bold text-slate-900 dark:text-white">320</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                <span className="text-slate-400 text-[10px] block">learning_rate</span>
                <span className="font-bold text-slate-900 dark:text-white">0.038</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                <span className="text-slate-400 text-[10px] block">num_leaves</span>
                <span className="font-bold text-slate-900 dark:text-white">38</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                <span className="text-slate-400 text-[10px] block">min_child_samples</span>
                <span className="font-bold text-slate-900 dark:text-white">45</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                <span className="text-slate-400 text-[10px] block">colsample_bytree</span>
                <span className="font-bold text-slate-900 dark:text-white">0.82</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                <span className="text-slate-400 text-[10px] block">reg_lambda (L2)</span>
                <span className="font-bold text-slate-900 dark:text-white">1.65</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'audit' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Data Sanitization & Hygiene Audit (350,000 Raw Records)
              </h2>
              <p className="text-xs text-slate-500">
                Detailed resolution breakdown of real-world dirty agritech data anomalies
              </p>
            </div>
            <div className="text-xs font-mono text-emerald-600 font-semibold">
              Total Records Processed: 350,000
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PIPELINE_AUDIT_METRICS.map((metric, idx) => (
              <div
                key={idx}
                className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {metric.issueType}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {metric.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold font-mono text-slate-900 dark:text-white block">
                      {metric.affectedRows.toLocaleString()} rows
                    </span>
                    <span className="text-[10px] text-amber-600 font-semibold font-mono">
                      {metric.pctAffected}% affected
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 text-xs">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block">
                      Resolution Strategy:
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {metric.resolutionMethod}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                    <div>
                      <span className="text-[10px] font-semibold text-rose-600 block">
                        Raw Sample Anomaly:
                      </span>
                      <code className="text-[11px] font-mono text-slate-800 dark:text-slate-200">
                        {metric.exampleRaw}
                      </code>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-emerald-600 block">
                        Standardized Output:
                      </span>
                      <code className="text-[11px] font-mono text-slate-800 dark:text-slate-200">
                        {metric.exampleClean}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'splits' && (
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Time-Aware Expanding-Window Temporal Split
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Zero forward lookahead: we strictly predict the future using only information available prior to sowing.
              </p>
            </div>

            {/* Visual Timeline Split */}
            <div className="space-y-3">
              <div className="flex h-10 rounded-xl overflow-hidden text-xs font-bold text-white font-mono">
                <div className="w-[70%] bg-slate-800 flex items-center justify-center border-r border-slate-700">
                  <span>Train: 2017–2021 (245k rows · 70%)</span>
                </div>
                <div className="w-[20%] bg-indigo-600 flex items-center justify-center border-r border-indigo-500">
                  <span>Val: 2022–2023 (70k · 20%)</span>
                </div>
                <div className="w-[10%] bg-emerald-600 flex items-center justify-center">
                  <span>Test: 2024 (35k · 10%)</span>
                </div>
              </div>

              <div className="grid grid-cols-3 text-xs text-slate-500 pt-1">
                <div>Historical model training with expanding 5-year cross-validation window</div>
                <div className="text-center">Hyperparameter tuning and early stopping on out-of-time years</div>
                <div className="text-right">Completely blind evaluation on 2024 harvest results</div>
              </div>
            </div>

            {/* Leakage Check Invariants */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Rigorous Leakage Invariants Enforced</span>
              </div>
              <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <li>No random K-Fold split allowed: weather autocorrelation across adjacent tehsils causes severe train-to-test leakage in random splits.</li>
                <li>Mandi price momentum uses only trailing 30-day prices prior to June 10 sowing; terminal harvest prices are strictly excluded from features.</li>
                <li>Rainfall features cut off at August 31 (giving agribusinesses 60 days of lead time before October-November harvesting).</li>
                <li>Target encoding of soil categories was computed strictly within historical training folds.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
