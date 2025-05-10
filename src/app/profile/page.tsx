import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SignIn from "@/components/SignIn";

export default async function ProfilePage() {

  const currClerkUser = await currentUser();
  if (!currClerkUser) {
    return (
      <SignIn/>
    );
  }

  redirect("/profile/" + currClerkUser.id);

  return (
    <p>Loading...</p>
  );
}