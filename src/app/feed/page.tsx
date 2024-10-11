import CreatePost from "@/components/CreatePost"
import {currentUser} from "@clerk/nextjs/server"
import { Post } from "./post.type"
import {getProfile, userProfileData} from "@/utils/getUser";
import { db } from "@/utils/dbConn";

export default async function Feed() {

  const clerkUser = await currentUser();
  if (!clerkUser) {
    console.log("no clerkUser found");
    return;
  }
  await getProfile(clerkUser);

  async function insertPost(postData: Post) {
    "use server";
    await db.query(`
      INSERT INTO cw_posts 
      (user_id, artist, title, genre_id, link, content)
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        postData.userId,
        postData.artist,
        postData.title,
        postData.genreId,
        postData.link,
        postData.content,
      ]
    );
  }

  return (
    <div>
      <CreatePost userId={userProfileData.id} insertPost={insertPost}/>
    </div>
  )
}