import { db } from "../../utils/dbConn";
import { auth, currentUser } from "@clerk/nextjs/server";
import type { Profile } from "./profile.type";
import UserProfile from "@/components/UserProfile";
import { QueryResult } from "pg";

export default async function ProfilePage() {

//todo can we move all this into a utils funcrion? so we can use it in other pages.

  const clerkUserId = auth();
  const clerkUser = await currentUser();
  let userProfileData = {} as Profile;

  function setProfileData(response: QueryResult) {
    userProfileData = {
      username: response.rows[0].user_name,
      bio: response.rows[0].bio,
      posts: response.rows[0].user_posts,
      feedUsers: response.rows[0].feed_users,
      feedGenres: response.rows[0].feed_genres,
      savedPosts: response.rows[0].saved_posts,
    };
  }

  interface FormDataObject {
    username: string;
    bio: string;
  }

  async function updateProfile(formData: FormDataObject) {
    "use server";
    await db.query(`
      UPDATE cw_users
      SET user_name = $1, bio = $2
      WHERE clerk_user_id = $3`,
      [formData.username, formData.bio, clerkUserId.userId]
    );
  }

  async function getProfile() {

    if (!clerkUser) {
      console.log("no clerkUser found");
      return;
    }

    const response = await db.query(
      `
      SELECT * FROM cw_users
      WHERE clerk_user_id = $1`,
      [clerkUserId.userId]
    );
    
    if (response.rowCount === 0) {
      console.log("no database entry found for profile - creating one now");
      await db.query(
        `
        INSERT INTO cw_users (clerk_user_id, user_name)
        VALUES ($1, $2)
        `,
        [clerkUserId.userId, clerkUser.username]
      );
    }
    else {
      setProfileData(response);
    }
  }
  await getProfile();


  return (
    <UserProfile userProfileData={userProfileData} updateProfile={updateProfile}/>
  );
}
