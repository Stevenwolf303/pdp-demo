import { useState } from "react";

const timeFilters = ["1D", "7D", "30D", "90D", "6M", "1Y", "3Y", "MAX"];

type UnitRow = {
  bedBath: string;
  sf: number;
  estUnits: number;
  avail: number;
  leased: number;
  askingRent: string;
  askingPSF: string;
  concessPct: string;
  ner: string;
  nerPSF: string;
  daysOnMkt: number;
  cancelPct: string;
  nerTrend: string;
  trendPositive: boolean;
};

const unitRows: UnitRow[] = [
  { bedBath: "0Bd / 1Ba", sf: 658, estUnits: 20, avail: 39, leased: 20, askingRent: "$1,128", askingPSF: "$1.81", concessPct: "1.0%", ner: "$1,128", nerPSF: "$1.81", daysOnMkt: 28, cancelPct: "0%", nerTrend: "+3.5%", trendPositive: true },
  { bedBath: "1Bd / 1Ba", sf: 624, estUnits: 32, avail: 24, leased: 8, askingRent: "$1,128", askingPSF: "$1.81", concessPct: "1.0%", ner: "$1,128", nerPSF: "$1.81", daysOnMkt: 32, cancelPct: "5%", nerTrend: "+3.5%", trendPositive: true },
  { bedBath: "2Bd / 1Ba", sf: 873, estUnits: 40, avail: 60, leased: 60, askingRent: "$1,349", askingPSF: "$1.39", concessPct: "1.0%", ner: "$1,349", nerPSF: "$1.54", daysOnMkt: 40, cancelPct: "0%", nerTrend: "+3.5%", trendPositive: true },
  { bedBath: "2Bd / 2Ba", sf: 873, estUnits: 40, avail: 40, leased: 40, askingRent: "$1,349", askingPSF: "$1.39", concessPct: "1.0%", ner: "$1,349", nerPSF: "$1.54", daysOnMkt: 40, cancelPct: "0%", nerTrend: "+2.5%", trendPositive: true },
];

const totals = {
  bedBath: "Property",
  sf: 795,
  estUnits: 200,
  avail: 100,
  leased: 100,
  askingRent: "$1,272",
  askingPSF: "$1.61",
  concessPct: "1.0%",
  ner: "$1,272",
  nerPSF: "$1.61",
  daysOnMkt: 80,
  cancelPct: "1.25%",
  nerTrend: "+3.5%",
  trendPositive: true,
};

const columns = [
  { key: "bedBath", label: "Bed / Bath", align: "left" as const },
  { key: "sf", label: "SF", align: "right" as const },
  { key: "estUnits", label: "Est Units", align: "right" as const },
  { key: "avail", label: "# Avail", align: "right" as const },
  { key: "leased", label: "# Leased", align: "right" as const },
  { key: "askingRent", label: "Asking Rent", align: "right" as const },
  { key: "askingPSF", label: "Asking PSF", align: "right" as const },
  { key: "concessPct", label: "Concess %", align: "right" as const },
  { key: "ner", label: "NER", align: "right" as const },
  { key: "nerPSF", label: "NER PSF", align: "right" as const },
  { key: "daysOnMkt", label: "Days on Mkt", align: "right" as const },
  { key: "cancelPct", label: "Cancel %", align: "right" as const },
  { key: "nerTrend", label: "NER Trend", align: "right" as const },
];

const PricingAvailability = () => {
  const [activeFilter, setActiveFilter] = useState(2); // 30D

  return (
    <section className="max-w-screen-xl mx-auto px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Pricing & Availability</h2>
        <div className="flex items-center gap-1">
          {timeFilters.map((f, i) => (
            <button
              key={f}
              onClick={() => setActiveFilter(i)}
              className={`px-2 py-1 text-xs font-medium tracking-wide rounded ${
                i === activeFilter
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-2.5 text-[13px] font-semibold text-gray-800 capitalize whitespace-nowrap ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {unitRows.map((row) => (
              <tr key={row.bedBath} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2.5 text-left">
                  <div className="flex items-center gap-1">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-400 shrink-0">
                      <path d="M8 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="font-medium text-gray-800 tracking-wide">{row.bedBath}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-right text-gray-600">{row.sf}</td>
                <td className="px-4 py-2.5 text-right text-gray-600">{row.estUnits}</td>
                <td className="px-4 py-2.5 text-right text-gray-600">{row.avail}</td>
                <td className="px-4 py-2.5 text-right text-gray-600">{row.leased}</td>
                <td className="px-4 py-2.5 text-right font-medium text-red-600">{row.askingRent}</td>
                <td className="px-4 py-2.5 text-right text-gray-600">{row.askingPSF}</td>
                <td className="px-4 py-2.5 text-right text-gray-600">{row.concessPct}</td>
                <td className="px-4 py-2.5 text-right text-gray-600">{row.ner}</td>
                <td className="px-4 py-2.5 text-right text-gray-600">{row.nerPSF}</td>
                <td className="px-4 py-2.5 text-right text-gray-600">{row.daysOnMkt}</td>
                <td className="px-4 py-2.5 text-right text-gray-600">{row.cancelPct}</td>
                <td className="px-4 py-2.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                      <path d="M1,12 Q6,10 12,8 T23,4" stroke="#10b981" strokeWidth="1.5" fill="none" />
                    </svg>
                    <span className="text-emerald-600 font-medium">{row.nerTrend}</span>
                  </div>
                </td>
              </tr>
            ))}
            {/* Totals row */}
            <tr className="bg-gray-50 font-semibold">
              <td className="px-4 py-2.5 text-left text-gray-800">{totals.bedBath}</td>
              <td className="px-4 py-2.5 text-right text-gray-800">{totals.sf}</td>
              <td className="px-4 py-2.5 text-right text-gray-800">{totals.estUnits}</td>
              <td className="px-4 py-2.5 text-right text-gray-800">{totals.avail}</td>
              <td className="px-4 py-2.5 text-right text-gray-800">{totals.leased}</td>
              <td className="px-4 py-2.5 text-right text-gray-800">{totals.askingRent}</td>
              <td className="px-4 py-2.5 text-right text-gray-800">{totals.askingPSF}</td>
              <td className="px-4 py-2.5 text-right text-gray-800">{totals.concessPct}</td>
              <td className="px-4 py-2.5 text-right text-gray-800">{totals.ner}</td>
              <td className="px-4 py-2.5 text-right text-gray-800">{totals.nerPSF}</td>
              <td className="px-4 py-2.5 text-right text-gray-800">{totals.daysOnMkt}</td>
              <td className="px-4 py-2.5 text-right text-gray-800">{totals.cancelPct}</td>
              <td className="px-4 py-2.5 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                    <path d="M1,12 Q6,10 12,8 T23,4" stroke="#10b981" strokeWidth="1.5" fill="none" />
                  </svg>
                  <span className="text-emerald-600 font-semibold">{totals.nerTrend}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default PricingAvailability;
