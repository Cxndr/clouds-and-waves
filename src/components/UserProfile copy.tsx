"use client";

import type { Profile } from "@/utils/types/profile.type"
import { useState } from "react";
import PostWide from "./PostWide";
import type { Post } from "@/utils/types/post.type";
import * as ScrollArea from "@radix-ui/react-scroll-area";


interface UserProfileProps {
  user: Profile;
  updateUser: (formData: { username: string; bio: string }) => void;
  deleteUser: (userId: number) => void;
  posts: { data: Post[] };
}

export default function UserProfile({user,updateUser, deleteUser, posts}: UserProfileProps) {

  const [editingProfile, setEditingProfile] = useState(false);
  const [profile, setProfile] = useState(user);

  function updateProfile(formData: { username: string; bio: string }) {
    updateUser(formData);
    setEditingProfile(false);
  }

  async function handleEditProfile(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formDataObj = Object.fromEntries(formData) as { username: string; bio: string };
    updateProfile(formDataObj);
    setProfile({ ...profile, ...formDataObj });
  }

  function handleDeleteUser() {
    deleteUser(profile.id);
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {editingProfile ? (
        <div>
          <form onSubmit={handleEditProfile}>
            <label htmlFor="username">Username</label>
            <input name="username" type="text" defaultValue={profile.username} />
            <label htmlFor="bio">Bio</label>
            <input name="bio" type="text" defaultValue={profile.bio} />
            <button type="submit">Save</button>
            <button onClick={handleDeleteUser}>
              Delete Account
            </button>
          </form>
        </div>
      ) : (
        <div>
          <h1 className="bold text-4xl">{profile.username}</h1>
          <button onClick={() => setEditingProfile(true)}>Edit Profile</button>
          <p>
            {profile.bio ? 
            (
              <div>
                <h2>Bio: </h2>
                <p>
                {profile.bio}
                </p>
              </div>
            ) 
            : (
              <div><p>No bio set</p></div>
            )}
          </p>

          <div></div>

          <div>
            <h2>Posts: </h2>
            <ScrollArea.Root className=" ScrollAreaRoot h-60 w-full">
              <ScrollArea.Viewport className="ScrollAreaViewport bg-slate-800">
                {posts.data.map((postData) => (
                  <PostWide key={postData.id} postData={postData}/>
                ))}
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="vertical">
                <ScrollArea.Thumb className="ScrollAreaThumb"/>
              </ScrollArea.Scrollbar>
            </ScrollArea.Root>
          </div>
        </div>

      )}
    </div>
  );
}
