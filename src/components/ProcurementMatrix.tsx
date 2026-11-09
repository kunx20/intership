import React, { useState } from 'react';
import { Crop, District } from '../types/agri';
import { CROPS } from '../data/agriData';
import { generateProcurementMatrix } from '../utils/predictor';
import { ShoppingCart, Download, CheckCircle, ShieldAlert } from 'lucide-react';
import { TabId } from './Header';

interface ProcurementMatrixProps {
  initialCrop?: Crop;
  onNavigate: (tab: TabId, district?: District, crop?: Crop) => void;
}

export const ProcurementMatrix: React.FC<ProcurementMatrixProps> = ({
  initialCrop = 'Soybean',
  onNavigate,
}) => {
  const [selectedCrop, setSelectedCrop] = useState<Crop>(initialCrop);

  const cropList: Crop[] = ['Soybean', 'Cotton', 'Paddy', 'Wheat', 'Tur'];
  const matrix = generateProcurementMatrix(selectedCrop);
  const cropInfo = CROPS[selectedCrop];

  // Aggregate Metrics
  const totalProcurementDemand = matrix.reduce((acc, row) => acc + row.procurementDemandTonnes, 0);
  const totalExpectedSupply = matrix.reduce((acc, row) => acc + row.expectedProductionTonnes, 0);
  const highRiskRows = matrix.filter((row) => row.riskLevel === 'Critical' || row.riskLevel === 'High');

  // Hedging recommendations
  const forwardContractVolume = matrix
    .filter((r) => r.actionCode === 'FORWARD_CONTRACT')
    .reduce((acc, r) => acc + r.procurementDemandTonnes, 0);
  const forwardContractPct = totalProcurementDemand > 0 ? Math.round((forwardContractVolume / totalProcurementDemand) * 100) : 0;

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'District',
      'Crop',
      'Predicted_Yield_Q_Ha',
      'Historical_Yield_Q_Ha',
      'Yield_Delta_Pct',
      'Expected_Production_Tonnes',
      'Procurement_Demand_Tonnes',
      'Supply_Surplus_Deficit_Tonnes',
      'Risk_Level',
      'Mandi_Price_Rs_Q',
      'MSP_Rs_Q',
      'Price_vs_MSP_Pct',
      'Priority_Score',
      'Action_Code',
      'Action_Details',
    ];

    const rows = matrix.map((r) => [
      r.district,
      r.crop,
      r.predictedYieldQHa,
      r.historicalYieldQHa,
      r.yieldChangePct,
      r.expectedProductionTonnes,
      r.procurementDemandTonnes,
      r.supplyDeficitSurplusTonnes,
      r.riskLevel,
      r.mandiPriceRsQ,
      r.mspRsQ,
      r.priceVsMspPct,
      r.priorityScore,
      r.actionCode,
      `"${r.actionDetails}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KisanDrishti_Procurement_Plan_${selectedCrop}_2024.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <ShoppingCart className="w-4 h-4" />
            <span>Agribusiness Procurement Optimization Engine</span>
            <span aria-hidden="true">·</span>
            <span>Supply vs Demand Prioritization</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Procurement Action Matrix & Sourcing Priorities
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Identify which districts to contract early, which to buy at spot, and where to divert sourcing to minimize procurement cost volatility.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Sourcing Schedule (CSV)</span>
        </button>
      </div>

      {/* Crop Selector Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl overflow-x-auto no-scrollbar">
        {cropList.map((c) => {
          const isSelected = selectedCrop === c;
          return (
            <button
              key={c}
              onClick={() => setSelectedCrop(c)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {CROPS[c].name} ({CROPS[c].season})
            </button>
          );
        })}
      </div>

      {/* Aggregate KPI Strip for this Crop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400">Total Sourcing Demand</div>
          <div className="mt-1 text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {(totalProcurementDemand / 1000).toFixed(1)}k <span className="text-xs font-normal text-slate-500">MT</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">Target volume across 6 Vidarbha plants</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400">Total Expected Supply</div>
          <div className="mt-1 text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
            {(totalExpectedSupply / 1000).toFixed(1)}k <span className="text-xs font-normal text-slate-500">MT</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Coverage Ratio: <strong className="font-mono text-slate-700 dark:text-slate-300">{(totalExpectedSupply / (totalProcurementDemand || 1)).toFixed(1)}x</strong> of demand
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400">Recommended Forward Hedge</div>
          <div className="mt-1 text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 tabular-nums">
            {forwardContractPct}% <span className="text-xs font-normal text-slate-500">Volume</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            {(forwardContractVolume / 1000).toFixed(1)}k MT locked 60d pre-harvest
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400">Govt MSP Anchor</div>
          <div className="mt-1 text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            ₹{cropInfo.mspPriceRsQ.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">Base floor price for Kharif/Rabi contracts</div>
        </div>
      </div>

      {/* Main Sourcing Priority Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              District Prioritization & Action Directives ({selectedCrop})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ranked by Sourcing Priority Score (combining shortfall risk, expected mandi spike, and volume availability)
            </p>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {highRiskRows.length > 0 ? (
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{highRiskRows.length} district(s) require immediate forward hedging</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Supply security nominal across all districts</span>
              </span>
            )}
          </div>
        </div>

        <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
              <tr>
                <th className="py-3 px-4">Priority & District</th>
                <th className="py-3 px-4 text-right">Predicted Yield</th>
                <th className="py-3 px-4 text-right">Expected Supply</th>
                <th className="py-3 px-4 text-right">Target Demand</th>
                <th className="py-3 px-4 text-right">Mandi Spot vs MSP</th>
                <th className="py-3 px-4">Shortfall Risk</th>
                <th className="py-3 px-4">Strategic Sourcing Action</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {matrix.map((row, idx) => {
                const isShortfall = row.yieldChangePct < 0;
                const isCritical = row.riskLevel === 'Critical';
                const isHigh = row.riskLevel === 'High';

                return (
                  <tr
                    key={row.district}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-4 px-4 font-medium text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-mono font-bold text-[10px]">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="font-bold text-sm">{row.district}</span>
                          <div className="text-[10px] text-slate-500 font-mono">
                            Priority Score: {row.priorityScore}/100
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right font-mono tabular-nums">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {row.predictedYieldQHa} Q/Ha
                      </div>
                      <div
                        className={`text-[10px] font-semibold ${
                          isShortfall ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {isShortfall ? '' : '+'}
                        {row.yieldChangePct}% vs bench
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right font-mono text-slate-800 dark:text-slate-200 tabular-nums">
                      {(row.expectedProductionTonnes / 1000).toFixed(1)}k MT
                    </td>

                    <td className="py-4 px-4 text-right font-mono text-slate-800 dark:text-slate-200 tabular-nums">
                      {(row.procurementDemandTonnes / 1000).toFixed(1)}k MT
                    </td>

                    <td className="py-4 px-4 text-right font-mono tabular-nums">
                      <div className="font-bold text-slate-900 dark:text-white">
                        ₹{row.mandiPriceRsQ.toLocaleString()}
                      </div>
                      <div
                        className={`text-[10px] ${
                          row.priceVsMspPct > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {row.priceVsMspPct > 0 ? `+${row.priceVsMspPct}%` : `${row.priceVsMspPct}%`} vs MSP
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                          isCritical
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                            : isHigh
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                        }`}
                      >
                        {row.riskLevel}
                      </span>
                    </td>

                    <td className="py-4 px-4 max-w-xs">
                      <div className="font-semibold text-slate-900 dark:text-white text-xs">
                        {row.actionTitle}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                        {row.actionDetails}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onNavigate('simulator', row.district, selectedCrop)}
                        className="px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded transition-colors"
                      >
                        Simulate
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic Hedging Playbook */}
      <div className="p-6 bg-slate-900 text-white dark:bg-slate-800/90 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold">
          Nagpur Procurement Strategy Playbook: Operational Execution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
          <div className="space-y-1.5 p-4 bg-slate-800/80 dark:bg-slate-900/80 rounded-xl border border-slate-700/60">
            <span className="font-semibold text-emerald-400 text-sm block">
              1. Lock Forward Contracts Early
            </span>
            <p className="leading-relaxed">
              In high-risk shortfall districts (e.g. Yavatmal / Amravati during dry spells), issue pre-harvest contracts with FPOs at <strong>MSP + 3% to 5%</strong>. This guarantees factory inventory before local arrivals dry up and APMC spot rates surge 15-20%.
            </p>
          </div>

          <div className="space-y-1.5 p-4 bg-slate-800/80 dark:bg-slate-900/80 rounded-xl border border-slate-700/60">
            <span className="font-semibold text-amber-400 text-sm block">
              2. Exploit Peak Spot Discount
            </span>
            <p className="leading-relaxed">
              In bumper districts (e.g. Bhandara paddy / Wardha cotton), delay forward contracting. Wait for November peak arrivals when farmgate distress selling pushes spot prices down near MSP, saving up to ₹240/quintal.
            </p>
          </div>

          <div className="space-y-1.5 p-4 bg-slate-800/80 dark:bg-slate-900/80 rounded-xl border border-slate-700/60">
            <span className="font-semibold text-blue-400 text-sm block">
              3. Geographic Risk Arbitrage
            </span>
            <p className="leading-relaxed">
              When western Vidarbha suffers moisture stress, re-route supply intake to canal-irrigated eastern clusters (Bhandara & Chandrapur) to preserve factory throughput without paying interstate import duties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
