import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth/jwt";
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

  const cookieStore = await cookies();
  const token = cookieStore.get("futrix_access_token")?.value;
  let userName = "User";
  if (token) {
    const payload = await verifyAccessToken(token);
    if (payload?.userId) {
      const user = await prisma.user.findUnique({ where: { id: payload.userId } });
      if (user) userName = user.name || user.email?.split("@")[0] || "User";
    }
  }

  const driversCount = await prisma.driver.count({
    where: { workspaceId: forecast.workspaceId }
  });

  const fData = (forecast.data as any) || {};
  const tabs = fData.tabs || {};
  const overrides = fData.overrides || {};
  const checklistOverrides = fData.checklistOverrides || {};

  const expensesSet = tabs.expenses?.summary?.netTotal?.some((v: number) => v > 0) || Object.keys(overrides).length > 0;
  const costsSet = tabs.costs?.summary?.netTotal?.some((v: number) => v > 0) || Object.keys(overrides).length > 0;
  
  let salesCoverOutgoings = false;
  const salesTotals = tabs.sales?.summary?.netTotal || [];
  const costsTotals = tabs.costs?.summary?.netTotal || [];
  const expensesTotals = tabs.expenses?.summary?.netTotal || [];
  
  if (salesTotals.length > 0) {
    salesCoverOutgoings = salesTotals.every((s: number, i: number) => {
      const c = costsTotals[i] || 0;
      const e = expensesTotals[i] || 0;
      return s >= (c + e);
    });
  }

  const checklistState = {
    driversAdded: driversCount > 0,
    expensesSet: !!expensesSet,
    costsSet: !!costsSet,
    salesCoverOutgoings: !!salesCoverOutgoings,
  };

  return (
    <ForecastProvider>
      <div className="flex flex-col flex-1 h-full w-full overflow-hidden bg-white dark:bg-[#111]">
        <ForecastDetailClientHeader 
          forecastId={forecast.id} 
          forecastName={forecast.name} 
          userName={userName}
          checklistState={checklistState}
          manualOverrides={checklistOverrides}
        />
        
        {/* Tab Content Area */}
        <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden bg-white dark:bg-[#111]">
          {props.children}
        </div>
      </div>
    </ForecastProvider>
  );
}
