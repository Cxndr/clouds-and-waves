import { Post } from "@/utils/types/post.type";
import { Profile } from "@/utils/types/profile.type";
import Image from "next/image";
import { FaPaperPlane } from "react-icons/fa6";
import { Comment } from "@/utils/types/comment.type";

interface CreateCommentProps {
  post: Post;
  currUser: Profile;
  insertComment: (commentData: Omit<Comment, 'id' | 'clerkUser'>) => void;
}

export default function CreateComment({post, currUser, insertComment}:CreateCommentProps) {

  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formDataObj = Object.fromEntries(formData);
    const newComment: Omit<Comment, 'id' | 'clerkUser'> = {
      userId: currUser.id,
      postId: post.id,
      content: formDataObj.content as string,
      dateCreated: new Date(),
      likeCount: 0,
    }
    insertComment(newComment);
  
  }

  return (
    <div className="w-full flex gap-4 items-center mb-6">
      
      <Image 
        src={currUser.clerkUser.imageUrl}
        alt={`Profile picture for ${currUser.clerkUser.username}`}
        width={40}
        height={40}
        className="rounded-full h-10 w-10"
      />

      <form onSubmit={handleSubmit} className="flex w-full">

        <input name="content" type="text" placeholder="type a comment..." className="flex-grow h-10 p-4 !text-xl rounded-xl"/>

        <button type="submit" className="h-10 p-3 flex items-center gap-2 !text-lg rounded-xl">
          <FaPaperPlane className="inline"/>
          Post
        </button>

      </form>

    </div>
  );
}