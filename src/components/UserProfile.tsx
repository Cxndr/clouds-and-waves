"use client";

import type { Profile } from "@/app/profile/profile.type"
import { useState } from "react";

interface UserProfileProps {
  user: Profile;
  updateUser: (formData: { username: string; bio: string }) => void;
  deleteUser: (userId: number) => void;
}

export default function UserProfile({user,updateUser, deleteUser}: UserProfileProps) {

  const [editingProfile, setEditingProfile] = useState(false);
  const [profile, setProfile] = useState(user);

  function updateProfile(formData: { username: string; bio: string }) {
    console.log("FORM DATA FOR UPDATE", formData);
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
              Delete
            </button>
          </form>
        </div>
      ) : (
        <div>
          <h1 className="bold text-4xl">{profile.username}</h1>
          <button onClick={() => setEditingProfile(true)}>Edit Profile</button>
          <p>
            {profile.bio ? (
              <span>
                <b>Bio: </b>
                {profile.bio}
              </span>
            ) : (
              <span>No bio set</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
