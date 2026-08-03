import { ForecastCreationCards } from "@/components/forecasting/ForecastCreationCards";
import { ForecastComparisonTool } from "@/components/forecasting/ForecastComparisonTool";

export const metadata = {
  title: "Forecasting — Futrix",
  description: "Create and compare forecasts, budgets, and scenarios.",
};

export default function ForecastingPage() {
  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 space-y-10 max-w-[1400px] mx-auto w-full">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Forecasting home</h1>
      </div>

      {/* Creation Cards Section */}
      <section>
        <ForecastCreationCards />
      </section>

      {/* Comparison Tool Section */}
      <section>
        <ForecastComparisonTool />
      </section>
      
    </div>
  );
}
