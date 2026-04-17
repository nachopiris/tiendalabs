import { getStoreBySlug } from "@/lib/store-context";
import { notFound } from "next/navigation";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await getStoreBySlug();

  if (!store) {
    notFound();
  }

  return <>{children}</>;
}
