import { useState, useRef, useEffect } from "react";

type Scenario = "downside" | "base" | "upside";
type ChartMetric = "growth" | "rent";

// ─── Line chart (Asking Rent Growth) ───────────────────────────────
const historicalQuarters = ["Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025"];
const forecastQuarters = [
  "Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026",
  "Q1 2027", "Q2 2027", "Q3 2027", "Q4 2027",
  "Q1 2028", "Q2 2028", "Q3 2028", "Q4 2028", "Q1 2029",
];
const totalPoints = historicalQuarters.length + forecastQuarters.length;
const forecastStartIdx = historicalQuarters.length;

const growthYLabels = ["4%", "2%", "0%", "-2%", "-4%"];
const growthYMax = 4;
const growthYRange = 8; // 4 - (-4)
const chartW = 1000;
const chartH = 200;

const toGrowthY = (pct: number) => ((growthYMax - pct) / growthYRange) * chartH;
const toGrowthX = (i: number) => (i / (totalPoints - 1)) * chartW;

const historical = {
  property:  [2.4, 1.8, 1.2, 0.6],
  submarket: [2.0, 1.4, 0.8, 0.3],
  market:    [1.5, 1.0, 0.4, -0.1],
};

const forecastByScenario: Record<Scenario, { property: number[]; submarket: number[]; market: number[] }> = {
  base: {
    property:  [ 0.2, -0.3, -0.6, -0.4,  0.0,  0.3,  0.5,  0.8,  1.1,  0.9,  1.2,  1.0,  1.3],
    submarket: [-0.2, -0.7, -1.0, -0.8, -0.4, -0.1,  0.1,  0.4,  0.6,  0.5,  0.7,  0.5,  0.8],
    market:    [-0.5, -0.9, -1.2, -1.0, -0.7, -0.4, -0.2,  0.1,  0.3,  0.2,  0.4,  0.2,  0.5],
  },
  upside: {
    property:  [ 0.5,  0.1, -0.1,  0.3,  0.8,  1.2,  1.5,  1.8,  2.1,  1.9,  2.2,  2.0,  2.3],
    submarket: [ 0.1, -0.3, -0.4,  0.0,  0.4,  0.8,  1.0,  1.3,  1.5,  1.4,  1.6,  1.4,  1.7],
    market:    [-0.2, -0.5, -0.7, -0.3,  0.1,  0.4,  0.7,  0.9,  1.1,  1.0,  1.2,  1.0,  1.3],
  },
  downside: {
    property:  [-0.2, -0.8, -1.3, -1.5, -1.2, -0.9, -0.7, -0.5, -0.2, -0.4,  0.0, -0.2,  0.1],
    submarket: [-0.6, -1.2, -1.6, -1.9, -1.6, -1.3, -1.1, -0.9, -0.6, -0.8, -0.4, -0.6, -0.3],
    market:    [-0.9, -1.5, -1.9, -2.2, -1.9, -1.6, -1.4, -1.2, -0.9, -1.1, -0.7, -0.9, -0.6],
  },
};

const smoothPath = (points: { x: number; y: number }[]) => {
  if (points.length < 2) return "";
  let d = `M${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev.x + curr.x) / 2;
    d += ` C${cpx.toFixed(1)},${prev.y.toFixed(1)} ${cpx.toFixed(1)},${curr.y.toFixed(1)} ${curr.x.toFixed(1)},${curr.y.toFixed(1)}`;
  }
  return d;
};

const formatPct = (v: number) => {
  if (v === 0) return "0.0%";
  return `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;
};

const forecastDividerX = (toGrowthX(forecastStartIdx - 1) + toGrowthX(forecastStartIdx)) / 2;
const dividerPct = forecastDividerX / chartW * 100;

// ─── Bar chart (Forecasted Asking Rent) ────────────────────────────
const rentForecastData = [
  { quarter: "Q1 2026", rent: 1390 },
  { quarter: "Q2 2026", rent: 1377 },
  { quarter: "Q3 2026", rent: 1369 },
  { quarter: "Q4 2026", rent: 1367 },
  { quarter: "Q1 2027", rent: 1366 },
  { quarter: "Q2 2027", rent: 1366 },
  { quarter: "Q3 2027", rent: 1367 },
  { quarter: "Q4 2027", rent: 1369 },
  { quarter: "Q1 2028", rent: 1372 },
  { quarter: "Q2 2028", rent: 1374 },
  { quarter: "Q3 2028", rent: 1377 },
  { quarter: "Q4 2028", rent: 1383 },
  { quarter: "Q1 2029", rent: 1388 },
  { quarter: "Q2 2029", rent: 1393 },
  { quarter: "Q3 2029", rent: 1400 },
  { quarter: "Q4 2029", rent: 1403 },
  { quarter: "Q1 2030", rent: 1406 },
  { quarter: "Q2 2030", rent: 1410 },
  { quarter: "Q3 2030", rent: 1416 },
];

const rentYLabels = ["$1,420", "$1,400", "$1,380", "$1,360", "$1,340"];
const rentYMax = 1420;
const rentYMin = 1340;
const rentYRange = rentYMax - rentYMin;

const metricOptions: { key: ChartMetric; label: string }[] = [
  { key: "growth", label: "Rent Growth" },
  { key: "rent",   label: "Asking Rent" },
];

// ─── Component ─────────────────────────────────────────────────────
const ForecastsV2 = () => {
  const [showTable, setShowTable]     = useState(true);
  const [scenario, setScenario]       = useState<Scenario>("base");
  const [chartMetric, setChartMetric] = useState<ChartMetric>("growth");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const forecast = forecastByScenario[scenario];
  const fullData = {
    property:  [...historical.property,  ...forecast.property],
    submarket: [...historical.submarket, ...forecast.submarket],
    market:    [...historical.market,    ...forecast.market],
  };

  const buildHistPath = (data: number[]) => {
    const pts = data.slice(0, forecastStartIdx).map((v, i) => ({ x: toGrowthX(i), y: toGrowthY(v) }));
    return smoothPath(pts);
  };

  const buildFcstPath = (data: number[]) => {
    const pts = data.slice(forecastStartIdx - 1).map((v, i) => ({
      x: toGrowthX(forecastStartIdx - 1 + i),
      y: toGrowthY(v),
    }));
    return smoothPath(pts);
  };

  const growthTableRows = [
    { label: "Property",  values: forecast.property },
    { label: "Submarket", values: forecast.submarket },
    { label: "Market",    values: forecast.market },
  ];

  const isGrowth = chartMetric === "growth";
  const currentLabel = metricOptions.find((o) => o.key === chartMetric)!.label;

  return (
    <section className="max-w-screen-xl mx-auto px-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="sparkleGradV2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" stroke="url(#sparkleGradV2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">Forecasts</h2>
      </div>

      {/* Chart Card Container */}
      <div className="border border-gray-200 rounded-lg">
        {/* Chart Header */}
        <div className="relative z-10 flex items-center justify-between px-5 pt-4 pb-3 bg-white">
          <p className="text-sm font-medium text-gray-700">
            {isGrowth ? "Asking Rent Growth" : "Forecasted Asking Rent"}
          </p>
          <div className="flex items-center gap-3">
            {/* Scenario Toggle — only for growth chart */}
            {isGrowth && (
              <div className="flex items-center rounded-md border border-gray-200 bg-gray-50 p-0.5">
                {(["downside", "base", "upside"] as Scenario[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setScenario(s)}
                    className={`px-2.5 py-1 text-xs font-medium rounded capitalize transition-all ${
                      scenario === s
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            )}

            {/* ── Metric Dropdown (V2 change) ── */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors min-w-[110px] justify-between cursor-pointer"
              >
                <span>{currentLabel}</span>
                <svg
                  width="14" height="14" viewBox="0 0 16 16" fill="none"
                  className={`shrink-0 transition-transform duration-150 ${dropdownOpen ? "rotate-180" : ""}`}
                >
                  <path d="M4.5 6l3.5 3.5L11.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden">
                  {metricOptions.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => { setChartMetric(key); setDropdownOpen(false); }}
                      className={`w-full flex items-center gap-4 px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                        chartMetric === key
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="whitespace-nowrap">{label}</span>
                      {chartMetric === key && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white">
              Quarterly
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M4.5 6l3.5 3.5L11.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* ═══ Chart Area ═══ */}
        <div className="px-5 pb-2">
          {isGrowth ? (
            /* ── Asking Rent Growth (line chart) ── */
            <>
              <div className="relative mt-5">
                {/* Forecast label */}
                <div className="absolute left-14 right-0 -top-5 pointer-events-none z-10">
                  <span
                    className="absolute text-[10px] font-medium text-gray-400 -translate-x-1/2"
                    style={{ left: `${dividerPct}%` }}
                  >
                    Forecast
                  </span>
                </div>

                {/* Y axis + grid lines */}
                <div className="flex flex-col gap-6">
                  {growthYLabels.map((label) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="w-11 text-right text-xs font-medium text-gray-500 shrink-0">{label}</span>
                      <div className="flex-1 h-px" style={{ backgroundImage: label === "0%" ? "repeating-linear-gradient(to right, #d1d5db 0 4px, transparent 4px 6px, #d1d5db 6px 7px, transparent 7px 10px)" : "repeating-linear-gradient(to right, #e5e7eb 0 4px, transparent 4px 6px, #e5e7eb 6px 7px, transparent 7px 10px)" }} />
                    </div>
                  ))}
                </div>

                {/* SVG line chart */}
                <svg
                  className="absolute left-14 top-2 right-0 bottom-2"
                  width="calc(100% - 56px)"
                  height="170"
                  viewBox={`0 0 ${chartW} ${chartH}`}
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <line x1={forecastDividerX} y1="0" x2={forecastDividerX} y2={chartH} stroke="#d1d5db" strokeWidth="1" strokeDasharray="6 4" vectorEffect="non-scaling-stroke" />

                  {/* Historical (solid) */}
                  <path d={buildHistPath(fullData.market)}    stroke="#f472b6" strokeWidth="2"   vectorEffect="non-scaling-stroke" fill="none" />
                  <path d={buildHistPath(fullData.submarket)} stroke="#38bdf8" strokeWidth="2"   vectorEffect="non-scaling-stroke" fill="none" />
                  <path d={buildHistPath(fullData.property)}  stroke="#4f46e5" strokeWidth="2.5" vectorEffect="non-scaling-stroke" fill="none" />

                  {/* Forecast (50% opacity dashed) */}
                  <path d={buildFcstPath(fullData.market)}    stroke="#f472b6" strokeWidth="1.5" strokeDasharray="6 3" vectorEffect="non-scaling-stroke" fill="none" opacity="0.5" />
                  <path d={buildFcstPath(fullData.submarket)} stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="6 3" vectorEffect="non-scaling-stroke" fill="none" opacity="0.5" />
                  <path d={buildFcstPath(fullData.property)}  stroke="#4f46e5" strokeWidth="2.5" vectorEffect="non-scaling-stroke" fill="none" opacity="0.5" />
                </svg>
              </div>

              {/* X axis */}
              <div className="flex mt-2">
                <div className="w-14 shrink-0" />
                <div className="flex-1 flex justify-between text-xs font-medium text-gray-500">
                  <span>Q1 '25</span>
                  <span>Q1 '26</span>
                  <span>Q1 '27</span>
                  <span>Q1 '28</span>
                  <span>Q1 '29</span>
                </div>
              </div>
            </>
          ) : (
            /* ── Forecasted Asking Rent (bar chart) ── */
            <>
              <div className="relative mt-2">
                {/* Y axis + grid lines */}
                <div className="flex flex-col gap-6">
                  {rentYLabels.map((label) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="w-14 text-right text-xs font-medium text-gray-500 shrink-0">{label}</span>
                      <div className="flex-1 h-px" style={{ backgroundImage: "repeating-linear-gradient(to right, #e5e7eb 0 4px, transparent 4px 6px, #e5e7eb 6px 7px, transparent 7px 10px)" }} />
                    </div>
                  ))}
                </div>

                {/* Bar overlay */}
                <div className="absolute top-1 bottom-1 flex items-end gap-[3px]" style={{ left: "3.75rem", right: 0 }}>
                  {rentForecastData.map((item, i) => {
                    const heightPct = Math.max(((item.rent - rentYMin) / rentYRange) * 100, 1);
                    const isQ1 = item.quarter.startsWith("Q1");
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center justify-end h-full min-w-0">
                        {isQ1 && (
                          <span className="text-[8px] font-medium text-gray-500 mb-0.5 leading-none">
                            ${item.rent.toLocaleString()}
                          </span>
                        )}
                        <div
                          className="w-[80%] rounded-t-sm transition-all duration-300"
                          style={{ height: `${heightPct}%`, backgroundColor: "#6366f1" }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* X axis */}
              <div className="flex mt-2">
                <div className="w-14 shrink-0" />
                <div className="flex-1 flex justify-between text-xs font-medium text-gray-500">
                  <span>Q1 '26</span>
                  <span>Q1 '27</span>
                  <span>Q1 '28</span>
                  <span>Q1 '29</span>
                  <span>Q1 '30</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 px-5 pt-3 pb-4">
          {isGrowth ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-indigo-600" />
                <span className="text-xs font-medium text-gray-500">The Crescent Residences at Kingsbury Park</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-sky-400" />
                <span className="text-xs font-medium text-gray-500">North Chicago</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-pink-400" />
                <span className="text-xs font-medium text-gray-500">Chicago-Naperville-Elgin, IL-IN-WI</span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-indigo-500" />
              <span className="text-xs font-medium text-gray-500">The Crescent Residences at Kingsbury Park — Forecasted Asking Rent</span>
            </div>
          )}
        </div>

        {/* Divider + Toggle Table CTA */}
        <div className="flex items-center gap-4 px-5 pb-4">
          <div className="flex-1 border-t border-gray-200" />
          <button
            onClick={() => setShowTable(!showTable)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="3" width="14" height="10" rx="1" stroke="currentColor" strokeWidth="1.2" />
              <line x1="1" y1="6.5" x2="15" y2="6.5" stroke="currentColor" strokeWidth="1.2" />
              <line x1="1" y1="9.5" x2="15" y2="9.5" stroke="currentColor" strokeWidth="1.2" />
              <line x1="5.5" y1="3" x2="5.5" y2="13" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            {showTable ? "Hide Table" : "Show Table"}
          </button>
          <div className="flex-1 border-t border-gray-200" />
        </div>

        {/* Data Table */}
        {showTable && (
          <div className="border-t border-gray-200 overflow-x-auto">
            {isGrowth ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 sticky left-0 bg-gray-50" />
                    {forecastQuarters.map((q) => (
                      <th key={q} className="px-3 py-2.5 text-center text-xs font-semibold text-gray-600 whitespace-nowrap">
                        {q}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {growthTableRows.map((row) => (
                    <tr key={row.label} className="border-b border-gray-200 last:border-b-0">
                      <td className="px-4 py-2.5 text-sm font-medium text-gray-800 whitespace-nowrap sticky left-0 bg-white">
                        {row.label}
                      </td>
                      {row.values.map((val, i) => (
                        <td key={i} className="px-3 py-2.5 text-center text-sm text-gray-600 whitespace-nowrap">
                          {formatPct(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 sticky left-0 bg-gray-50" />
                    {rentForecastData.map((d) => (
                      <th key={d.quarter} className="px-3 py-2.5 text-center text-xs font-semibold text-gray-600 whitespace-nowrap">
                        {d.quarter}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-2.5 text-sm font-medium text-gray-800 whitespace-nowrap sticky left-0 bg-white">
                      Asking Rent
                    </td>
                    {rentForecastData.map((d, i) => (
                      <td key={i} className="px-3 py-2.5 text-center text-sm text-gray-600 whitespace-nowrap">
                        ${d.rent.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ForecastsV2;
