import { notFound } from "next/navigation";
import { ForecastTabClient } from "./ForecastTabClient";

const TAB_TITLES: Record<string, string> = {
  "invoices": "Invoices",
  "sales": "Sales",
  "costs": "Costs",
  "expenses": "Expenses",
  "other-pl": "Other P&L",
  "assets": "Assets",
  "liabilities": "Liabilities",
  "profit-loss": "Profit & Loss",
  "balance-sheet": "Balance Sheet",
  "cash-flow-statement": "Cash Flow Statement",
};

export default async function ForecastDetailTabPage(
  props: { params: Promise<{ id: string, tab: string }> }
) {
  const params = await props.params;
  const tab = params.tab;

  const title = TAB_TITLES[tab];

  if (!title) {
    notFound();
  }

  return (
    <ForecastTabClient forecastId={params.id} tabId={tab} title={title} />
  );
}
