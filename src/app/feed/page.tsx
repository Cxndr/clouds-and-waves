import {currentUser} from "@clerk/nextjs/server"
import { getUser } from "@/utils/userFunctions";
import { insertPost, getPostsAll, savePost, deletePost, updatePost, insertComment, deleteComment, likeComment, updateComment, getPostsCustom, getPostsGenre} from "@/utils/postFunctions";
import { Profile } from "@/utils/types/profile.type";
import { db } from "@/utils/dbConn";
import SignIn from "@/components/SignIn";
import Feed from "@/components/Feed";


export default async function FeedPage() {

  const clerkUser = await currentUser();
  if (!clerkUser) {
    console.log("no clerkUser found");
    return (
      <SignIn/>
    );
  }
  const currUser = await getUser(clerkUser) as Profile;
  const genreOptionsResponse = await db.query(`SELECT * FROM mus_genres`);
  const genreOptions = genreOptionsResponse.rows;

  const posts = await getPostsAll();

  return (
    <div className="flex flex-col gap-4 w-full items-center p-8 ">

      <Feed
        insertPost={insertPost}
        postsData={posts}
        currUser={currUser}
        savePost={savePost}
        deletePost={deletePost}
        updatePost={updatePost}
        insertComment={insertComment}
        deleteComment={deleteComment}
        likeComment={likeComment}
        updateComment={updateComment}
        getPostsAll={getPostsAll}
        getPostsCustom={getPostsCustom}
        getPostsGenre={getPostsGenre}
        genreOptions={genreOptions}
      />

    </div>
  )
}