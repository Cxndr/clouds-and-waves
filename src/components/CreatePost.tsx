import { Post } from "@/app/feed/post.type";

interface CreatePostProps {
  userId: number;
  insertPost: (formData: Post) => void;

}

export default function CreatePost({userId, insertPost} : CreatePostProps) {

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formDataObj = Object.fromEntries(formData);
    const newPost: Post = {
      userId: userId, //todo: get userId from auth
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
        <input name="artist" type="text" />
        <input name="title" type="text" />
        <input name="genreId" type="number" />
        <input name="content" type="text" />
        <input name="link" type="text" />
        <button type="submit">Create Post</button>
      </form>
    </div>
  )
}