import { clerkClient, currentUser } from "@clerk/nextjs/server";
import UserProfile from "@/components/UserProfile";
import { getUser, getUsers, updateUser } from "@/utils/userFunctions";
import { Profile } from "@/utils/types/profile.type";
import { getPostsUser, getCommentsUser, getLikedComments, getPostsArray, savePost, deletePost, updatePost, insertComment, deleteComment, likeComment, updateComment} from "@/utils/postFunctions";


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

  let currUser = {} as Profile;
  const currClerkUser = await currentUser();
  if (currClerkUser) {
    currUser = await getUser(currClerkUser) as Profile;
  }
  else {
    return (
      <p>You must be logged in to proceed.</p>
      // todo - return login/register form
    )
  }

  return (
    <UserProfile 
      user={user} 
      posts={posts} 
      comments={comments} 
      saved={saved}
      liked={liked}
      followers={followers}
      following={following}
      currUser={currUser}
      updateUser={updateUser}
      savePost={savePost}
      deletePost={deletePost}
      updatePost={updatePost}
      insertComment={insertComment}
      deleteComment={deleteComment}
      likeComment={likeComment}
      updateComment={updateComment}
    />
  );
}