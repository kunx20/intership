import React from 'react';
import { FORENSIC_CASE_DATA } from '../data/agriData';
import { AlertOctagon, Clock, ShieldCheck, HelpCircle, ArrowRight } from 'lucide-react';
import { TabId } from './Header';
import { District, Crop } from '../types/agri';

interface ForensicErrorCaseProps {
  onNavigate: (tab: TabId, district?: District, crop?: Crop) => void;
}

export const ForensicErrorCase: React.FC<ForensicErrorCaseProps> = ({ onNavigate }) => {
  const caseData = FORENSIC_CASE_DATA;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 dark:text-rose-400">
            <AlertOctagon className="w-4 h-4" />
            <span>Forensic ML Incident Deep-Dive</span>
            <span aria-hidden="true">·</span>
            <span>Historical Outlier Autopsy & Operational Safeguards</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Forensic Case Study: The 2023 Yavatmal Cotton Anomaly
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            A transparent post-mortem of our largest historical residual (-39.3% prediction error), detailing root causes, optical masking, and newly instituted automated guardrails.
          </p>
        </div>

        <button
          onClick={() => onNavigate('simulator', 'Yavatmal', 'Cotton')}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-lg transition-colors whitespace-nowrap shrink-0"
        >
          <span>Simulate Yavatmal Cotton</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Incident Summary Card */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-semibold text-slate-500">
              {caseData.season} · {caseData.district}
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {caseData.caseTitle}
            </h2>
            <div className="text-xs text-rose-600 dark:text-rose-400 font-semibold mt-1">
              Estimated Business Risk: {caseData.financialImpact}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 block font-medium">Model Forecast (Aug 31)</span>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {caseData.predictedYield} Q/Ha
              </span>
            </div>

            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900 text-center">
              <span className="text-[10px] text-rose-500 block font-medium">Actual Realized (Dec)</span>
              <span className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums">
                {caseData.actualYield} Q/Ha
              </span>
            </div>

            <div className="p-3 bg-slate-900 text-white rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block font-medium">Residual Error</span>
              <span className="text-xl font-bold font-mono text-rose-400 tabular-nums">
                {caseData.errorMagnitude} Q/Ha
              </span>
            </div>
          </div>
        </div>

        {/* Timeline of Events */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Forensic Chronology: How the Harvest Collapsed
            </h3>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {caseData.timeline.map((event, idx) => (
              <div key={idx} className="relative">
                <div
                  className={`absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                    event.status === 'Critical Outlier Event'
                      ? 'bg-rose-500'
                      : event.status === 'Secondary Damage'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                />
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {event.stage}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({event.date})
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      event.status === 'Critical Outlier Event'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        : event.status === 'Secondary Damage'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {event.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {event.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Root Causes vs Implemented Guardrails Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Why Model Missed It */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Why the Model Failed to Anticipate the Shortfall
            </h3>
          </div>

          <div className="space-y-3 pt-1">
            {caseData.whyModelMissed.map((reason, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/60 text-xs text-amber-950 dark:text-amber-200 leading-relaxed"
              >
                {reason}
              </div>
            ))}
          </div>
        </div>

        {/* Guardrails Instituted */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Automated Guardrails Engineered Since Incident
            </h3>
          </div>

          <div className="space-y-3 pt-1">
            {caseData.guardrailsImplemented.map((guardrail, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-950 dark:text-emerald-200 leading-relaxed flex items-start gap-2.5"
              >
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                  0{idx + 1}.
                </span>
                <span>{guardrail}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
