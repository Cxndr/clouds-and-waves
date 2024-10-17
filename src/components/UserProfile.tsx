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
  insertComment: (commentData: Omit<Comment, 'id' | 'clerkUser'>) => void;
  deleteComment: (commentId: number) => void;
  likeComment: (commentId: number, userId: number, addOrRemove: boolean) => void;
  updateComment: (commentId: number, content: string) => void;
  genreOptions: {id: number, name: string}[];
}

export default function UserProfile({user, posts, comments, saved, liked, followers, following, currUser, savePost, deletePost, updatePost, insertComment, deleteComment, likeComment, updateComment, updateUser, genreOptions}: UserProfileProps) {

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

    <div className="w-full h-[75svh] px-4">
      <div className="text-xl h-full p-8 w-full max-w-7xl mx-auto my-10 rounded-3xl flex flex-row gap-8 items-start justify-start bg-zinc-200 bg-opacity-60 text-zinc-900 shadowed">

        <div className="w-72 p-6 shadow-lg shadow-zinc-800 flex flex-col items-start bg-zinc-800 bg-opacity-70 rounded-2xl text-zinc-100">

          <div className="self-center">
            <Avatar.Root className="avatar">
              <Avatar.Image src={user.clerkUser.imageUrl} alt="avatar" className="rounded-full h-48 shadow-md shadow-zinc-800"/>
            </Avatar.Root>
            <h1 className="bold text-4xl text-center mt-3">{user.clerkUser.username}</h1>
          </div>

          <div className="">

            <div>
              <h3 className="font-bold mt-3 text-zinc-400">Bio </h3>
              {
                editingBio ?
                  <form onSubmit={handleBioUpdate} className="text-base">
                    <input type="text" name="bio" defaultValue={user.bio} className="mb-2 mt-1"/>
                    <button className="mr-2">Save</button>
                    <button onClick={() => setEditingBio(false)}>
                      Cancel
                    </button>
                  </form>
                :
                <>
                  {user.bio ? 
                    <div className="">
                      
                      <p>{user.bio}</p>
                    </div>
                  : <div><p>No bio set</p></div>
                  }
                  {
                    ownedProfile ?
                    <button onClick={handleEditBio} className="text-base mt-2">Edit Bio</button>
                    : null
                  }
                </>
              }

            </div>
            
            <div>
              <h3 className="font-bold mt-3 text-zinc-400">Following</h3>
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
              <h3 className="font-bold mt-3 text-zinc-400">Followers</h3>
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

        <div className="h-full flex-grow p-6 shadow-lg shadow-zinc-800 flex flex-col items-start bg-zinc-800 bg-opacity-70 rounded-2xl text-zinc-100">
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
            genreOptions={genreOptions}
          />
        </div>

      </div>
    </div>
  );
}
