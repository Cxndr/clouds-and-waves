import { db } from "./dbConn";
import { auth} from "@clerk/nextjs/server";
import { QueryResult } from "pg";
import { Profile } from "@/app/profile/profile.type";
import type { User } from '@clerk/nextjs/server'

/*
  userFunctions.ts

  if no clerkUser found, return not logged in.

  3 variables output:
    - clerkAuth: auth() : ClerkAuth? type.
    - clerkUser: currentUser() : User type.
    - User: {} as Profile type.
  
  3 functions output:
    - getUser(clerkUser): sets dbUser from database. if none found, creates one.
    - updateUser(formData): updates database user entry.
    - deleteUser(): deletes database and clerk users.

*/

const clerkAuthUser = auth();

export function setProfileData(response: QueryResult) {
  const userProfileData: Profile = {
    id: response.rows[0].id,
    username: response.rows[0].user_name,
    bio: response.rows[0].bio,
    posts: response.rows[0].user_posts,
    feedUsers: response.rows[0].feed_users,
    feedGenres: response.rows[0].feed_genres,
    savedPosts: response.rows[0].saved_posts,
  };
  return userProfileData
}

/// CREATE / READ
export async function getUser(clerkUser: User) {
  if (!clerkUser) {
    console.log("no clerkUser found");
    return;
  }

  const response = await db.query(`
    SELECT * FROM cw_users
    WHERE clerk_user_id = $1`,
    [clerkAuthUser.userId]
  );
  
  if (response.rowCount === 0) {
    console.log("no database entry found for profile - creating one now");
    await db.query(`
      INSERT INTO cw_users (clerk_user_id, user_name)
      VALUES ($1, $2)`,
      [clerkAuthUser.userId, clerkUser.username]
    );
  }
  else {
    return setProfileData(response); 
  }
}

/// UPDATE
interface FormDataObject {
  username: string;
  bio: string;
}
export async function updateUser(formData: FormDataObject) {
  "use server";
  await db.query(`
    UPDATE cw_users
    SET user_name = $1, bio = $2
    WHERE clerk_user_id = $3`,
    [formData.username, formData.bio, clerkAuthUser.userId]
  );
}

/// DELETE
export async function deleteUser(userId: number) {
  "use server";
  await db.query(`
    DELETE FROM cw_users
    WHERE user_id = $1`,
    [userId]
  );
}

