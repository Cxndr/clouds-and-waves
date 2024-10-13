"use client";
import { Post } from "@/utils/types/post.type";

interface CreatePostProps {
  userId: number;
  insertPost: (formData: Omit<Post, 'id'>) => void;
}

export default function CreatePost({userId, insertPost} : CreatePostProps) {

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formDataObj = Object.fromEntries(formData);
    const newPost: Omit<Post, 'id'> = {
      userId: userId,
      artist: formDataObj.artist as string,
      title: formDataObj.title as string,
      genreId: parseInt(formDataObj.genreId as string),
      link: formDataObj.link as string,
      content: formDataObj.content as string,
      dateCreated: new Date(),
      savedCount: 0,
      comments: [],
    }
    insertPost(newPost);
  }

  return (
    <div>
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