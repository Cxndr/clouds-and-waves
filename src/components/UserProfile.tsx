"use client";

import type { Profile } from "@/app/profile/profile.type"
import { useState } from "react";

interface UserProfileProps {
  userProfileData: Profile;
  updateProfile: (formData: { username: string; bio: string }) => void;
}

export default function UserProfile({userProfileData,updateProfile}: UserProfileProps) {

  const [editingProfile, setEditingProfile] = useState(false);
  const [profile, setProfile] = useState(userProfileData);

  function updateUser(formData: { username: string; bio: string }) {
    console.log("FORM DATA FOR UPDATE", formData);
    updateProfile(formData);
    setEditingProfile(false);
  }

  async function handleEditProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formDataObj = Object.fromEntries(formData) as { username: string; bio: string };
    updateUser(formDataObj);
    setProfile({ ...profile, ...formDataObj });
  }

  if (!profile) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      {editingProfile ? (
        <div>
          <form onSubmit={handleEditProfileSubmit}>
            <label htmlFor="username">Username</label>
            <input name="username" type="text" defaultValue={profile.username} />
            <label htmlFor="bio">Bio</label>
            <input name="bio" type="text" defaultValue={profile.bio} />
            <button type="submit">Save</button>
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
