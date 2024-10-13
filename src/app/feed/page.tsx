import CreatePost from "@/components/CreatePost"
import {currentUser} from "@clerk/nextjs/server"
import { getUser } from "@/utils/userFunctions";
import { insertPost, getPostsAll} from "@/utils/postFunctions";
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
  const userProfile = await getUser(clerkUser) as Profile;

  const posts = await getPostsAll();

  return (
    <div>
      <CreatePost userId={userProfile.id} insertPost={insertPost}/>
      {posts.data.map((postData) => (
        <PostWide key={postData.id} postData={postData}/>
      ))}
    </div>
  )
}