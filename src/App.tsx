import { useState } from "react";
import Index from "./pages/Index";
import IndexV2 from "./pages/IndexV2";

function App() {
  const [version, setVersion] = useState<1 | 2>(1);

  return (
    <div>
      {/* ── Version switcher bar ── */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-11 bg-white border-b border-gray-100 flex items-center justify-center gap-4">

        {/* Static label */}
        <span className="text-xs font-medium text-gray-400 select-none">
          Version
        </span>

        {/* Sliding segmented control — grid ensures both cells are exactly 50% */}
        <div className="relative grid grid-cols-2 bg-gray-100/70 rounded-full p-0.5">

          {/* Sliding pill: inset-y matches the p-0.5 container padding */}
          <div
            className="absolute inset-y-0.5 rounded-full bg-white shadow-sm pointer-events-none"
            style={{
              width: "calc(50% - 2px)",
              left: version === 1 ? "2px" : "calc(50%)",
              transition: "left 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />

          {(["Toggle", "Dropdown"] as const).map((label, i) => {
            const v = (i + 1) as 1 | 2;
            const active = version === v;
            return (
              <button
                key={label}
                onClick={() => setVersion(v)}
                className={`relative z-10 px-5 py-1.5 text-xs font-medium text-center whitespace-nowrap rounded-full transition-colors duration-200 ${
                  active ? "text-indigo-600" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {label}
              </button>
            );
          })}
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
