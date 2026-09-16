import { NotFoundPage } from "@/components/ui/404-page-not-found";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return <NotFoundPage />;
}
