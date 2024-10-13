"use client";

import type { Profile } from "@/utils/types/profile.type"
// import { useState } from "react";
import type { Post } from "@/utils/types/post.type";
import * as Avatar from "@radix-ui/react-avatar";
import ProfileTabs from "./ProfileTabs";
import UserCard from "./UserCard";

interface UserProfileProps {
  user: Profile;
  posts: { data: Post[] };
  comments: { data: Comment[]}
  saved: Post[]
  liked: { data: Comment[]}
  followers: Profile[]
  following: Profile[]

    // updateUser: (formData: { username: string; bio: string }) => void;
  // deleteUser: (userId: number) => void;
}

export default function UserProfile({user, posts, comments, saved, liked, followers, following}: UserProfileProps) {

  // const [profile, setProfile] = useState(user);

  // function updateProfile(formData: { username: string; bio: string }) {
  //   updateUser(formData);
  // }

  // if (!profile) {
  //   return <div>Loading...</div>;
  // }

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
            {user.bio ? 
              <div>
                <h2>Bio: </h2>
                <p>{user.bio}</p>
              </div>
            : <div><p>No bio set</p></div>
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
        <ProfileTabs posts={posts} comments={comments} saved={saved} liked={liked}/>
      </div>

    </div>
  );
}
