import StickyHeader from "@/components/StickyHeader";
import PropertyHero from "@/components/PropertyHero";
import PerformanceTrends from "@/components/PerformanceTrends";
import PricingAvailability from "@/components/PricingAvailability";
import ForecastsV2 from "@/components/ForecastsV2";

const IndexV2 = () => {
  return (
    <div className="min-h-screen bg-white">
      <StickyHeader />

      {/* Property hero */}
      <div className="border-b border-gray-100">
        <PropertyHero />
      </div>

      {/* Performance Trends */}
      <div className="border-b border-gray-200 py-8">
        <PerformanceTrends />
      </div>

      {/* Pricing & Availability */}
      <div className="border-b border-gray-200 py-8">
        <PricingAvailability />
      </div>

      {/* Forecasts V2 */}
      <div className="py-8 pb-16">
        <ForecastsV2 />
      </div>
    </div>
  );
};

export default IndexV2;
