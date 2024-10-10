import CreatePost from "@/components/CreatePost"
import {auth, currentUser} from "@clerk/nextjs/server"
import { Post } from "./post.type"
import { db } from "@/utils/dbConn";

export default async function Feed() {

  const clerkUserId = auth();
  const clerkUser = await currentUser();

  async function getUser() {
    const response = db.query(`
      SELECT * FROM cw_users
      WHERE clerk_user_id = $1`,
      [clerkUserId.userId]);

    if (response.rowCount === 0) {
    }

    function insertPost(postData: Post) {
    }
  }

  return (
    <div>
      <CreatePost userId={userId} insertPost={insertPost}/>
    </div>
  )
}