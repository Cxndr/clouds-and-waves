import {User} from "@clerk/nextjs/server";

export type Profile = {
  id: number,
  clerkId: string,
  bio: string,
  posts: object[],
  feedUsers: number[],
  feedGenres: number[],
  savedPosts: number[],
  followers: number[],
  clerkUser: User,
}