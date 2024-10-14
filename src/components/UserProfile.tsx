"use client";

import type { Profile } from "@/utils/types/profile.type"
import type { Comment } from "@/utils/types/comment.type"
import { useState, useEffect } from "react";
import type { Post } from "@/utils/types/post.type";
import * as Avatar from "@radix-ui/react-avatar";
import ProfileTabs from "./ProfileTabs";
import UserCard from "./UserCard";

interface UserProfileProps {
  user: Profile;
  posts: { data: Post[] };
  comments: { data: Comment[] }
  saved: { data: Post[] }
  liked: { data: Comment[] }
  followers: Profile[]
  following: Profile[]
  currUser: Profile
  updateUser: (formData: { bio: string }) => void;
  savePost: (postId: number, userId: number, addOrRemove: boolean) => void;
  deletePost: (postId: number) => void;
  updatePost: (postId: number, updateData: {artist: string, title: string, genreId: number, link: string, content: string}) => void;
  insertComment: (postId: number, userId: number, content: string) => void;
  deleteComment: (commentId: number) => void;
  likeComment: (commentId: number, userId: number, addOrRemove: boolean) => void;
  updateComment: (commentId: number, content: string) => void;
}

export default function UserProfile({user, posts, comments, saved, liked, followers, following, currUser, savePost, deletePost, updatePost, insertComment, deleteComment, likeComment, updateComment, updateUser}: UserProfileProps) {

  const [ownedProfile, setOwnedProfile] = useState(false);

  useEffect(() => {
    if (user.clerkUser.id === currUser.clerkUser.id) {
      setOwnedProfile(true);
    } else {
      setOwnedProfile(false);
    }
  }, [user.clerkUser.id, currUser.clerkUser.id]);

  const [editingBio, setEditingBio] = useState(false);

  function handleEditBio() {
    setEditingBio(true);
  }

  function handleBioUpdate(e: React.FormEvent) {
    e.preventDefault();
    const formData = e.target as HTMLFormElement;
    const formDataObj = Object.fromEntries(new FormData(formData));
    const updatedUser = {
      bio: formDataObj.bio as string
    }
    updateUser(updatedUser);
    setEditingBio(false);
    user.bio = formDataObj.bio as string;
  }

  return (
    <div className="h-svh w-full m-10 flex flex-row gap-12 items-start justify-start">

      <div className="w-1/4 flex flex-col items-center">

        <div>
          <Avatar.Root className="avatar">
            <Avatar.Image src={user.clerkUser.imageUrl} alt="avatar" className="rounded-full h-48"/>
          </Avatar.Root>
        </div>

        <div>
          <div>
            <h1 className="bold text-4xl">{user.clerkUser.username}</h1>
            {
              editingBio ?
                <form onSubmit={handleBioUpdate}>
                  <input type="text" name="bio" defaultValue={user.bio} />
                  <button>Save</button>
                  <button onClick={() => setEditingBio(false)}>
                    Cancel
                  </button>
                </form>
              :
              <>
                {user.bio ? 
                  <div>
                    <h2>Bio: </h2>
                    <p>{user.bio}</p>
                  </div>
                : <div><p>No bio set</p></div>
                }
                {
                  ownedProfile ?
                  <button onClick={handleEditBio}>Edit Bio</button>
                  : null
                }
              </>
            }

          </div>
          
          <div>
            <h2>Followers:</h2>
            {
              following.length > 0 ? 
                <div>
                  {following.map((followed) => (
                    <UserCard key={followed.id} user={followed}/>
                  ))}
                </div>
              : <div><p>Not following anyone yet</p></div>
            }
          </div>
          
          <div>
            <h2>Followers:</h2>
            {
              followers.length > 0 ? 
                <div>
                  {followers.map((follower) => (
                    <UserCard key={follower.id} user={follower}/>
                  ))}
                </div>
              : <div><p>No followers yet</p></div>
            }
          </div>
        </div>
        
      </div>
      

      <div className="flex-grow">
        <ProfileTabs 
          posts={posts} 
          comments={comments} 
          saved={saved} 
          liked={liked}
          currUser={currUser}
          savePost={savePost}
          deletePost={deletePost}
          updatePost={updatePost}
          insertComment={insertComment}
          deleteComment={deleteComment}
          likeComment={likeComment}
          updateComment={updateComment}
        />
      </div>

    </div>
  );
}
