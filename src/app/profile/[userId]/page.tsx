import { clerkClient } from "@clerk/nextjs/server";
import UserProfile from "@/components/UserProfile";
import { getUser, getUsers } from "@/utils/userFunctions";
import { Profile } from "@/utils/types/profile.type";
import { getPostsUser, getCommentsUser, getLikedComments, getPostsArray} from "@/utils/postFunctions";


export default async function ProfilePage({params}: {params: {userId: string}}) {

  const clerkUserObj = await clerkClient().users.getUser(params.userId);
  const clerkUser = JSON.parse(JSON.stringify(clerkUserObj));
  if (!clerkUser) {
    console.log("no clerkUser found");
    return (
      <p>User not found.</p>
    );
  }
  const user = await getUser(clerkUser) as Profile;
  const posts = await getPostsUser(user.id);
  const comments = await getCommentsUser(user.id);
  const liked = await getLikedComments(user.id);
  const saved = await getPostsArray(user.savedPosts);
  const followers = await getUsers(user.followers);
  const following = await getUsers(user.feedUsers);

  return (
    <UserProfile 
      user={user} 
      posts={posts} 
      comments={comments} 
      saved={saved}
      liked={liked} 
      followers={followers}
      following={following}
    />
  );
}