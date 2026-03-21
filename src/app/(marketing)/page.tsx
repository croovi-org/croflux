import { redirect } from "next/navigation";
import { LandingPage } from "@/features/marketing/components/LandingPage";

type MarketingPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MarketingPage({
  searchParams,
}: MarketingPageProps) {
  const params = searchParams ? await searchParams : {};
  const normalized = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => normalized.append(key, item));
      return;
    }

    if (typeof value === "string") {
      normalized.set(key, value);
    }
  });

  if (normalized.has("code")) {
    redirect(`/auth/callback?${normalized.toString()}`);
  }

  if (
    normalized.has("error") ||
    normalized.has("error_code") ||
    normalized.has("error_description")
  ) {
    redirect(`/reset-password?${normalized.toString()}`);
  }

  return <LandingPage />;
}
