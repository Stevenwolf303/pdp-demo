const navTabs = [
  "Overview",
  "Performance",
  "Pricing & Availability",
  "Forecasts",
  "Rent Roll",
  "Rent Comps",
  "New Supply",
  "Demographics",
  "Financials",
  "Taxes",
  "Deed",
  "Mortgage",
  "Transactions",
];

const StickyHeader = () => {
  return (
    <header className="sticky top-11 z-50 bg-white border-b border-gray-200">
      {/* Row 1: Back + Logo */}
      <div className="relative flex items-center justify-center h-11 px-6">
        <button className="absolute left-6 flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
            <path d="M8.5 2.5L4 7l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to search
        </button>

        {/* Center: Logo */}
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
            <path fillRule="evenodd" clipRule="evenodd" d="M8 4.57143V16H1V5.89011C1 5.16182 1.6268 4.57143 2.4 4.57143H8ZM5.66667 11.6044H3.33333V13.8022H5.66667V11.6044ZM5.66667 7.20879H3.33333V9.40659H5.66667V7.20879Z" fill="#6366F1"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M13.6 0C14.3732 0 15 0.614009 15 1.37143V16H8V1.37143C8 0.614009 8.6268 0 9.4 0H13.6ZM12.6667 11.4286H10.3333V13.7143H12.6667V11.4286ZM12.6667 6.85714H10.3333V9.14286H12.6667V6.85714ZM12.6667 2.28571H10.3333V4.57143H12.6667V2.28571Z" fill="#4338CA"/>
          </svg>
          <span className="text-[15px] font-semibold text-gray-900 tracking-tight">ApartmentIQ</span>
        </div>
      </div>

      {/* Row 2: Nav Tabs */}
      <div className="border-t border-gray-100 overflow-x-auto scrollbar-none">
        <div className="flex min-w-max px-4">
          {navTabs.map((tab, i) => (
            <button
              key={tab}
              className={`px-4 py-2.5 text-sm whitespace-nowrap border-b-2 transition-colors ${
                i === 0
                  ? "border-indigo-600 text-indigo-600 font-medium"
                  : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default StickyHeader;
