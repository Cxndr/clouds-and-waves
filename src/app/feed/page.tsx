import CreatePost from "@/components/CreatePost"
import {currentUser} from "@clerk/nextjs/server"
import { getUser } from "@/utils/userFunctions";
import { insertPost, getPostsAll, savePost, deletePost, updatePost, insertComment, deleteComment, likeComment, updateComment} from "@/utils/postFunctions";
import { Profile } from "@/utils/types/profile.type";
import PostWide from "@/components/PostWide";


export default async function Feed() {

  const clerkUser = await currentUser();
  if (!clerkUser) {
    console.log("no clerkUser found");
    return (
      <div>
        <h1>Not logged in</h1>
      </div>
    );
  }
  const currUser = await getUser(clerkUser) as Profile;

  const posts = await getPostsAll();

  return (
    <div>
      <CreatePost currUser={currUser} insertPost={insertPost}/>
      {posts.data.map((postData) => (
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