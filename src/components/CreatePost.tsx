"use client";
import { Post } from "@/utils/types/post.type";
import { Profile } from "@/utils/types/profile.type";

interface CreatePostProps {
  currUser: Profile;
  insertPost: (formData: Omit<Post, 'id' | 'clerkUser'>) => void;
}

export default function CreatePost({currUser, insertPost} : CreatePostProps) {

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formDataObj = Object.fromEntries(formData);
    const newPost: Omit<Post, 'id' | 'clerkUser'> = {
      userId: currUser.id,
      artist: formDataObj.artist as string,
      title: formDataObj.title as string,
      genreId: parseInt(formDataObj.genreId as string),
      link: formDataObj.link as string,
      content: formDataObj.content as string,
      dateCreated: new Date(),
      savedCount: 0,
      comments: {data:[], pagination:{totalComments:0, currentPage:0, totalPages:0, pageSize:0}},
    }
    insertPost(newPost);
  }

  return (
    <div>
      <img src={currUser.clerkUser.imageUrl}></img>
      <form onSubmit={handleSubmit}>

        <label htmlFor="artist">Artist</label>
        <input name="artist" type="text" />

        <label htmlFor="title">Title</label>
        <input name="title" type="text" />

        <label htmlFor="genreId">Genre ID</label>
        <input name="genreId" type="number" />

        <label htmlFor="content">Content</label>
        <input name="content" type="text" />

        <label htmlFor="link">Link</label>
        <input name="link" type="text" />

        <button type="submit">Create Post</button>
      </form>
    </div>
  )
}