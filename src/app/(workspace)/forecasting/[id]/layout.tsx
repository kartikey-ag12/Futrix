import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ForecastProvider } from "./ForecastContext";
import { ForecastDetailClientHeader } from "./ForecastDetailClientHeader";

export default async function ForecastDetailLayout(
  props: { children: React.ReactNode; params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const forecast = await prisma.forecast.findUnique({
    where: { id: params.id },
  });

  if (!forecast) {
    notFound();
  }

  return (
    <ForecastProvider>
      <div className="flex flex-col flex-1 h-full w-full overflow-hidden bg-white dark:bg-[#111]">
        <ForecastDetailClientHeader forecastId={forecast.id} forecastName={forecast.name} />
        
        {/* Tab Content Area */}
        <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden bg-white dark:bg-[#111]">
          {props.children}
        </div>
      </div>
    </ForecastProvider>
  );
}
