import { redirect } from "next/navigation";

/** Old public add URL — send people away; real tool lives under /admin */
export default function LegacyAddPropertyRedirect() {
  redirect("/listings");
}
