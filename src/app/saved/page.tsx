import { getPostsArray } from "@/utils/postFunctions";
import { getUser } from "@/utils/userFunctions";
import { currentUser } from "@clerk/nextjs/server";
import { Profile } from "@/utils/types/profile.type";
import PostWide from "@/components/PostWide";
import {savePost, deletePost, updatePost, insertComment, deleteComment, likeComment, updateComment} from "@/utils/postFunctions";
import { db } from "@/utils/dbConn";
import SignIn from "@/components/SignIn";


export default async function SavedPage() {

  const clerkUser = await currentUser();
  if (!clerkUser) {
    console.log("no clerkUser found");
    return (
      <SignIn/>
    );
  }
  const currUser = await getUser(clerkUser) as Profile;
  const savedPosts = await getPostsArray(currUser.savedPosts);

  const genreOptionsResponse = await db.query(`SELECT * FROM mus_genres`);
  const genreOptions = genreOptionsResponse.rows;



  return (
    <div className="w-full p-8">
      <div className="flex flex-col gap-4 items-center mx-auto rounded-3xl">
        {savedPosts.data.map((postData) => (
          <PostWide 
          key={postData.id} 
          postData={postData}
          currUser={currUser}
          savePost={savePost}
          deletePost={deletePost}
          updatePost={updatePost}
          insertComment={insertComment}
          deleteComment={deleteComment}
          likeComment={likeComment}
          updateComment={updateComment}
          genreOptions={genreOptions}
        />
        ))}
      </div>
    </div>
  )
}