import { Comment } from "@/utils/types/comment.type";
// import timeAgo from "@/utils/timeAgo";
import { useState, useEffect } from "react";
import { Profile } from "@/utils/types/profile.type";
import { FaRegThumbsUp, FaThumbsUp, FaPenToSquare, FaTrash } from "react-icons/fa6";
import Image from "next/image";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

interface CommentProps {
  commentData: Comment;
  currUser: Profile;
  likeComment: (commentId: number, userId: number, addOrRemove: boolean) => void;
  deleteComment: (commentId: number) => void;
  updateComment: (commentId: number, content: string) => void;
}

export default function CommentSingle({commentData, currUser, likeComment, deleteComment, updateComment}:CommentProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [comment] = useState(commentData);
  const [commentLiked, setCommentLiked] = useState(false);
  const [likedCount, setLikedCount] = useState(comment.likeCount);

  useEffect(() => {
    if (currUser.likedComments && currUser.likedComments.includes(comment.id)) {
      setCommentLiked(true);
    } else {
      setCommentLiked(false);
    }
  }, [currUser.likedComments, comment.id]);

  function handleLike() {
    if (commentLiked) {
      // Optimistic update
      comment.likeCount--;
      currUser.likedComments = currUser.likedComments.filter((commentId) => commentId !== comment.id);
      setCommentLiked(false);
      setLikedCount(comment.likeCount);
      
      startTransition(async () => {
        await likeComment(comment.id, currUser.id, false);
        router.refresh();
      });
    } else {
      // Optimistic update
      comment.likeCount++;
      currUser.likedComments.push(comment.id);
      setCommentLiked(true);
      setLikedCount(comment.likeCount);
      
      startTransition(async () => {
        await likeComment(comment.id, currUser.id, true);
        router.refresh();
      });
    }
  }

  const [ownedComment, setOwnedComment] = useState(false);

  useEffect(() => {
    if (comment.userId === currUser.id) {
      setOwnedComment(true);
    } else {
      setOwnedComment(false);
    }
  }, [comment.userId, currUser.id]);

  function handleDelete() {
    if (comment.userId === currUser.id) {
      // Optimistic update
      const commentElement = document.getElementById(`comment-${comment.id}`);
      if (commentElement) {
        commentElement.style.display = 'none';
      }
      
      startTransition(async () => {
        await deleteComment(comment.id);
        router.refresh();
      });
    }
  }
  
  const [editing, setEditing] = useState(false);
  
  function handleEdit() {
    setEditing(true);
  }

  function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    const formData = e.target as HTMLFormElement;
    const formDataObj = Object.fromEntries(new FormData(formData));
    const newContent = formDataObj.content as string;
    
    // Optimistic update
    comment.content = newContent;
    setEditing(false);
    
    startTransition(async () => {
      await updateComment(comment.id, newContent);
      router.refresh();
    });
  }

  return (
    <div id={`comment-${comment.id}`} className="flex gap-4 items-start mb-6">
      <Image 
        src={comment.clerkUser.imageUrl}
        alt={`Profile picture for ${comment.clerkUser.username}`}
        width={40}
        height={40}
        className="rounded-full h-10 w-10"
      />

      <div className="ml-12 pl-1">
        {editing ?
          <form onSubmit={handleUpdate} className="flex flex-col gap-3 mt-2">
            <input 
              name="content" 
              type="text" 
              defaultValue={comment.content}
              disabled={isPending}
            />
            <div className="flex justify-start gap-2">
              <button 
                type="submit" 
                className="!m-0"
                disabled={isPending}
              >
                {isPending ? 'Saving...' : 'Save'}
              </button>
              <button 
                onClick={() => setEditing(false)}
                disabled={isPending}
              >
                Cancel
              </button>
            </div>
          </form>
          : 
          <>
            <p className="mt-1 mb-3 text-xl">
              {comment.content}
            </p>
            <div className="flex items-center gap-4">
              <a onClick={handleLike} className="text-2xl flex items-center gap-2 mt-1">
                { commentLiked 
                  ? <FaThumbsUp className="text-blue-600 inline cursor-pointer hover:shadow-2xl hover:scale-110 transition-all duration-300"/> 
                  : <FaRegThumbsUp className="text-blue-600 inline cursor-pointer hover:shadow-2xl hover:scale-110 transition-all duration-300"/> 
                }
                <span className="text-xl">{likedCount}</span>
              </a>
              
              {ownedComment && (
                <div className="flex gap-3 text-base">
                  <button 
                    onClick={handleEdit} 
                    className="flex items-center gap-1"
                    disabled={isPending}
                  >
                    <FaPenToSquare className="inline"/>
                    <span>Edit</span>
                  </button>
                  <button 
                    onClick={handleDelete} 
                    className="flex items-center gap-1"
                    disabled={isPending}
                  >
                    <FaTrash className="inline"/>
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </>
        }
      </div>
    </div>
  );
}