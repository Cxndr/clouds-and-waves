import { db } from "./dbConn";
import { auth} from "@clerk/nextjs/server";
import { QueryResult } from "pg";
import { Profile } from "@/utils/types/profile.type";
import type { User } from '@clerk/nextjs/server'
import { clerkClient } from "@clerk/nextjs/server";

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



export async function setProfileData(response: QueryResult) {
  const userProfileData: Profile = {
    id: response.rows[0].id,
    clerkId: response.rows[0].clerk_user_id,
    bio: response.rows[0].bio,
    posts: response.rows[0].user_posts,
    feedUsers: response.rows[0].feed_users,
    feedGenres: response.rows[0].feed_genres,
    savedPosts: response.rows[0].saved_posts,
    likedComments: response.rows[0].liked_comments,
    followers: response.rows[0].followers,
    clerkUser: JSON.parse(JSON.stringify(await clerkClient().users.getUser(response.rows[0].clerk_user_id)))
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
    [clerkUser.id]
  );
  
  if (response.rowCount === 0) {
    console.log("no database entry found for profile - creating one now");
    await db.query(`
      INSERT INTO cw_users (clerk_user_id)
      VALUES ($1)`,
      [clerkUser.id]
    );
  }
  else {
    return await setProfileData(response); 
  }
}

export async function getUsers(userIds: number[]) {
  const response = await db.query(`
    SELECT * FROM cw_users
    WHERE id = ANY($1)`,
    [userIds]
  );
  const returnArray: Profile[] = [];
  response.rows.map(async (row) => {
    returnArray.push(await setProfileData(row));
  });
  return returnArray as Profile[];
}

/// UPDATE
// interface FormDataObject {
//   username: string;
//   bio: string;
// }
export async function updateUser(formData: {bio: string}) {
  "use server";
  const clerkAuthUser = auth();
  await db.query(`
    UPDATE cw_users
    SET bio = $1
    WHERE clerk_user_id = $2`,
    [formData.bio, clerkAuthUser.userId]
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

