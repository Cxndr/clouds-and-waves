import { Comment } from "./comment.type"
import { User } from "@clerk/nextjs/server";

export type Post = {
  id: number,
  userId: number,
  clerkUser: User;
  artist: string,
  title: string,
  genreId: number,
  link: string,
  content: string,
  dateCreated: Date,
  savedCount: number,
  comments: { 
    data: Comment[], 
    pagination: {
      totalComments: number, 
      currentPage: number, 
      totalPages: number,
      pageSize: number
    }
  }
}