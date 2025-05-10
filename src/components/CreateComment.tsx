import { Post } from "@/utils/types/post.type";
import { Profile } from "@/utils/types/profile.type";
import Image from "next/image";
import { FaPaperPlane } from "react-icons/fa6";
import { Comment } from "@/utils/types/comment.type";
import { useTransition, useState } from "react";

interface CreateCommentProps {
  post: Post;
  currUser: Profile;
  insertComment: (commentData: Omit<Comment, 'id' | 'clerkUser'>) => Promise<void>;
}

export default function CreateComment({post, currUser, insertComment}:CreateCommentProps) {
  const [isPending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState('');
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const content = inputValue;

    if (!content.trim()) {
      return;
    }
    
    const newComment: Omit<Comment, 'id' | 'clerkUser'> = {
      userId: currUser.id,
      postId: post.id,
      content: content,
      dateCreated: new Date(),
      likeCount: 0,
    };
    
    setInputValue('');
    
    startTransition(async () => {
      try {
        await insertComment(newComment);
      } catch (error) {
        console.error('Failed to insert comment:', error);
      }
    });
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

        <input 
          name="content" 
          type="text" 
          placeholder="type a comment..." 
          className="flex-grow h-10 p-4 !text-xl rounded-xl"
          disabled={isPending}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        <button 
          type="submit" 
          className="h-10 p-3 flex items-center gap-2 !text-lg rounded-xl"
          disabled={isPending}
        >
          <FaPaperPlane className="inline"/>
          {isPending ? 'Posting...' : 'Post'}
        </button>

      </form>

    </div>
  );
}