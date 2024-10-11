import { currentUser } from "@clerk/nextjs/server";
import UserProfile from "@/components/UserProfile";
import {getUser, updateUser, deleteUser} from "@/utils/getUser";
import { Profile } from "@/app/profile/profile.type";

export default async function ProfilePage() {

  const clerkUser = await currentUser();
  if (!clerkUser) {
    console.log("no clerkUser found");
    return;
  }
  const user = await getUser(clerkUser)as Profile;

  return (
    <UserProfile user={user} updateUser={updateUser} deleteUser={deleteUser}/>
  );
}
