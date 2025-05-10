import { User } from "@clerk/nextjs/server";

export type Comment = {
  id: number,
  userId: number,
  postId: number,
  clerkUser: User,
  content: string,
  dateCreated: Date,
  likeCount: number,
}