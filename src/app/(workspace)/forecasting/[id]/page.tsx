import { redirect } from "next/navigation";

export default async function ForecastDetailDefaultPage(
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  redirect(`/forecasting/${params.id}/invoices`);
}
