import { deleteComment } from "@/utils/postFunctions";
import { Post } from "@/utils/types/post.type";
import { Profile } from "@/utils/types/profile.type";

interface CreateCommentProps {
  post: Post;
  currUser: Profile;
  insertComment: (postId: number, userId: number, content: string) => void;
}

export default function CreateComment({post, currUser, insertComment}:CreateCommentProps) {

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formDataObj = Object.fromEntries(formData);
    insertComment(post.id, currUser.id, formDataObj.content as string);
  }

  return (
    <div>
      <img src={currUser.clerkUser.imageUrl}></img>
      <form onSubmit={handleSubmit}>

        <label htmlFor="content">Content</label>
        <input name="content" type="text" />
        
        <button type="submit">Create Comment</button>
      </form>
    </div>
  );
}