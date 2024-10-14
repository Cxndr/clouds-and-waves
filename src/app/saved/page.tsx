import { getPostsArray } from "@/utils/postFunctions";
import { getUser } from "@/utils/userFunctions";
import { currentUser } from "@clerk/nextjs/server";
import { Profile } from "@/utils/types/profile.type";
import PostWide from "@/components/PostWide";
import {savePost, deletePost, updatePost, insertComment, deleteComment, likeComment, updateComment} from "@/utils/postFunctions";


export default async function SavedPage() {

  const clerkUser = await currentUser();
  if (!clerkUser) {
    console.log("no clerkUser found");
    return (
      <p>User not found.</p>
    );
  }
  const currUser = await getUser(clerkUser) as Profile;
  const savedPosts = await getPostsArray(currUser.savedPosts);

  return (
    <div>
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
      />
      ))}
    </div>
  )
}