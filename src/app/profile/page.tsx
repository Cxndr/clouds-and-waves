import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {

  const currClerkUser = await currentUser();
  if (!currClerkUser) {
    console.log("not logged in");
    // todo:  return login form
    return;
  }

  redirect("/profile/" + currClerkUser.id);

  return (
    <p>Loading...</p>
  );
}