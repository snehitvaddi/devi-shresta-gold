import type { Metadata } from "next";
import BookingForm from "@/components/BookingForm";
import { getOrgData, getCurrentOrgId } from "@/lib/data/org";

export async function generateMetadata(): Promise<Metadata> {
  const orgData = await getOrgData(getCurrentOrgId());
  return {
    title: `Book an Appointment | ${orgData.name}`,
    description: `Schedule a private consultation with the jewelry experts at ${orgData.name}.`,
  };
}

export default async function BookingPage() {
  return (
    <div className="pt-20">
      <BookingForm />
    </div>
  );
}
