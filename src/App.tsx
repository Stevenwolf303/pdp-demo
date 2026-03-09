import { useState } from "react";
import Index from "./pages/Index";
import IndexV2 from "./pages/IndexV2";

const versions = [
  { v: 1, pattern: "Toggle"   },
  { v: 2, pattern: "Dropdown" },
] as { v: 1 | 2; pattern: string }[];

function App() {
  const [version, setVersion] = useState<1 | 2>(1);

  return (
    <div>
      {/* ── Version switcher bar ── */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-11 bg-white border-b border-gray-100 flex items-center justify-center">
        <div className="flex items-center bg-gray-100/70 rounded-full p-0.5 gap-px">
          {versions.map(({ v, pattern }) => (
            <button
              key={v}
              onClick={() => setVersion(v)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                version === v
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <span className={`font-semibold ${version === v ? "text-indigo-600" : "text-gray-400"}`}>
                Version {v}
              </span>
              <span className="text-gray-300 select-none">·</span>
              <span>{pattern}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Push content below fixed bar */}
      <div className="pt-11">
        {version === 1 ? <Index /> : <IndexV2 />}
      </div>
    </div>
  );
}

export default App;
