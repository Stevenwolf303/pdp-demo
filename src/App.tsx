import { useState } from "react";
import Index from "./pages/Index";
import IndexV2 from "./pages/IndexV2";

function App() {
  const [version, setVersion] = useState<1 | 2>(1);

  return (
    <div>
      {/* ── Version switcher bar ── */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-10 bg-gray-100 border-b border-gray-300 flex items-center justify-center gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 select-none">
          A/B
        </span>
        <div className="flex items-center rounded-md border border-gray-300 bg-gray-200/80 p-0.5 gap-0.5">
          {([1, 2] as const).map((v) => (
            <button
              key={v}
              onClick={() => setVersion(v)}
              className={`px-4 py-1 rounded text-xs font-semibold transition-all ${
                version === v
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Version {v}
            </button>
          ))}
        </div>
      </div>

      {/* Push content below fixed bar */}
      <div className="pt-10">
        {version === 1 ? <Index /> : <IndexV2 />}
      </div>
    </div>
  );
}

export default App;
