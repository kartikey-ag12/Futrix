import { redirect } from "next/navigation";

// Root performance page redirects to the first sub-tab
export default function PerformancePage() {
  redirect("/performance/customers-suppliers");
}
