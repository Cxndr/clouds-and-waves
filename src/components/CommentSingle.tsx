import { Comment } from "@/utils/types/comment.type";
// import timeAgo from "@/utils/timeAgo";
import { useState, useEffect } from "react";
import { Profile } from "@/utils/types/profile.type";
import { FaRegThumbsUp, FaThumbsUp, FaPenToSquare, FaTrash } from "react-icons/fa6";
import Image from "next/image";

interface CommentProps {
  commentData: Comment;
  currUser: Profile;
  likeComment: (commentId: number, userId: number, addOrRemove: boolean) => void;
  deleteComment: (commentId: number) => void;
  updateComment: (commentId: number, content: string) => void;
}

export default function CommentSingle({commentData, currUser, likeComment, deleteComment, updateComment}:CommentProps) {

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
      likeComment(comment.id, currUser.id, false);
      comment.likeCount--;
      currUser.likedComments = currUser.likedComments.filter((commentId) => commentId !== comment.id);
      setCommentLiked(false);
      setLikedCount(comment.likeCount)
    } else {
      likeComment(comment.id, currUser.id, true);
      comment.likeCount++;
      currUser.likedComments.push(comment.id);
      setCommentLiked(true);
      setLikedCount(comment.likeCount)
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
        deleteComment(comment.id);
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
      updateComment(comment.id, formDataObj.content as string);
      setEditing(false);
      comment.content = formDataObj.content as string;
    }

  return (
    <div className="my-4 p-4 text-zinc-900 bg-zinc-50 bg-opacity-80 rounded-3xl w-11/12 mx-auto">

      <div className="float-right flex gap-5 align-start text-xl mr-1">
        <span className="text-base opacity-60">{}</span>
        {ownedComment && 
        <>
          <a onClick={handleEdit} className="cursor-pointer hover:scale-110 transition-all duration-300">
            <FaPenToSquare/>
          </a>
          <a onClick={handleDelete} className="cursor-pointer hover:scale-110 transition-all duration-300">
            <FaTrash/>
          </a>
        </>
        }
      </div>
      
      <div className="flex gap-3 items-center mb-0">
        <a href={`/profile/${comment.clerkUser.id}`}>
          <Image
            src={comment.clerkUser.imageUrl}
            alt={`Profile picture for ${comment.clerkUser.username}`}
            width={40}
            height={40}
            className="rounded-full hover:scale-105 hover:shadow hover:shadow-zinc-700 transition-all duration-300"
          />
        </a>
        <h4 className="text-2xl font-bold">
          {comment.clerkUser.username}
        </h4>
      </div>
      

      <div className="ml-12 pl-1">
        {editing ?
          <form onSubmit={handleUpdate} className="flex flex-col gap-3 mt-2">
            <input name="content" type="text" defaultValue={comment.content} />
            <div className="flex justify-start gap-2">
              <button type="submit" className="!m-0">Save</button>
              <button onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </form>
          : 
          <>
            <p className="mt-1 mb-3 text-xl">
              {comment.content}
            </p>
            <a onClick={handleLike} className="text-2xl flex items-center gap-2 mt-1">
            { commentLiked 
              ? <FaThumbsUp className="text-blue-600 inline cursor-pointer hover:shadow-2xl hover:scale-110 transition-all duration-300"/> 
              : <FaRegThumbsUp className="text-blue-600 inline cursor-pointer hover:shadow-2xl hover:scale-110 transition-all duration-300"/> 
            }
            <span className="text-xl">{likedCount}</span>
          </a>
        </>
        }
      </div>



    </div>
  )
}