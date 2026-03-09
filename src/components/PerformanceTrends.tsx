import { useState } from "react";

const kpiCards = [
  { label: "Rent", value: "$1,272", change: "-0.1% YoY", positive: false },
  { label: "Exposure", value: "8.6%", change: "+0.1% YoY", positive: true },
  { label: "Concessions", value: "1.0%", change: "+0.1% YoY", positive: true },
  { label: "Leased Signed", value: "12", change: "-0.1% YoY", positive: false },
];

const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan '25", "Feb '25"];
const yAxisLabels = ["$6000", "$4500", "$3000", "$1500", "$0"];

const PerformanceTrends = () => {
  const [activeKpi, setActiveKpi] = useState(0);

  return (
    <section className="max-w-screen-xl mx-auto px-8">
      {/* Header */}
      <div className="flex items-baseline gap-2 mb-5">
        <h2 className="text-2xl font-semibold text-gray-900">Performance Trends:</h2>
        <button className="flex items-center gap-1 text-2xl font-semibold text-gray-500">
          30d
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="mt-1">
            <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="flex border-b border-gray-200">
        {kpiCards.map((kpi, i) => (
          <button
            key={kpi.label}
            onClick={() => setActiveKpi(i)}
            className={`flex-1 p-4 text-left transition-colors ${
              i === activeKpi
                ? "border-t-[3px] border-l border-r border-t-indigo-700 border-l-gray-200 border-r-gray-200 border-b-white -mb-px bg-white"
                : ""
            }`}
          >
            <p className={`text-sm font-medium tracking-wide mb-3 ${
              i === activeKpi ? "text-indigo-700" : "text-gray-500"
            }`}>
              {kpi.label}
            </p>
            <p className="text-[28px] font-medium text-gray-900 leading-none mb-2">{kpi.value}</p>
            <span className={`text-sm font-medium ${kpi.positive ? "text-teal-700" : "text-red-700"}`}>
              {kpi.change}
            </span>
          </button>
        ))}
      </div>

      {/* Chart Area */}
      <div className="pt-5 pb-4">
        {/* Filter Row */}
        <div className="flex items-center justify-between mb-5">
          <button className="flex items-center gap-2 px-3.5 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white">
            Asking Rent
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4.5 6l3.5 3.5L11.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Chart */}
        <div className="relative">
          {/* Y axis + grid lines */}
          <div className="flex flex-col gap-6">
            {yAxisLabels.map((label) => (
              <div key={label} className="flex items-center gap-2">
                <span className="w-11 text-right text-sm font-medium text-gray-500 shrink-0">{label}</span>
                <div className="flex-1 border-t border-gray-200" />
              </div>
            ))}
          </div>

          {/* SVG chart lines overlaid */}
          <svg
            className="absolute left-14 top-2 right-0 bottom-6"
            width="calc(100% - 56px)"
            height="160"
            viewBox="0 0 1260 160"
            preserveAspectRatio="none"
            fill="none"
          >
            {/* Property line (indigo) */}
            <path
              d="M0,80 Q100,75 200,70 T400,65 T600,60 T800,55 T1000,50 T1260,45"
              stroke="#4f46e5"
              strokeWidth="2"
              fill="none"
            />
            {/* Comps line (teal) */}
            <path
              d="M0,90 Q100,85 200,82 T400,78 T600,72 T800,68 T1000,62 T1260,55"
              stroke="#14b8a6"
              strokeWidth="2"
              fill="none"
            />
            {/* Submarket line (pink) */}
            <path
              d="M0,100 Q100,95 200,92 T400,88 T600,85 T800,80 T1000,75 T1260,70"
              stroke="#f472b6"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>

        {/* X axis labels */}
        <div className="flex mt-2">
          <div className="w-14 shrink-0" />
          <div className="flex-1 flex justify-between px-4 text-sm font-medium text-gray-500">
            {months.map((m, i) => (
              <span key={i}>{m}</span>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 pt-5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-indigo-600" />
            <span className="text-sm font-medium text-gray-500">The Crescent Residences at Kingsbury Park</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-teal-500" />
            <span className="text-sm font-medium text-gray-500">Comps</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-pink-400" />
            <span className="text-sm font-medium text-gray-500">North Chicago</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerformanceTrends;
