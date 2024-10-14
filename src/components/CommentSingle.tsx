import { Comment } from "@/utils/types/comment.type";
import timeAgo from "@/utils/timeAgo";
import { useState, useEffect } from "react";
import { Profile } from "@/utils/types/profile.type";

interface CommentProps {
  comment: Comment;
  currUser: Profile;
  likeComment: (commentId: number, userId: number, addOrRemove: boolean) => void;
  deleteComment: (commentId: number) => void;
  updateComment: (commentId: number, content: string) => void;
}

export default function CommentSingle({comment, currUser, likeComment, deleteComment, updateComment}:CommentProps) {

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
    <div>
      <h4>{comment.userId}</h4>

      <span>{timeAgo(comment.dateCreated)}</span>

      {ownedComment && 
        <div>
          <button onClick={handleEdit}>
            Edit
          </button>
          <button onClick={handleDelete}>
            Delete
          </button>
        </div>
      }

      {editing ?
        <form onSubmit={handleUpdate}>
          <label htmlFor="content">Content</label>
          <input name="content" type="text" defaultValue={comment.content} />
          <button type="submit">Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </form>
        : <p>{comment.content}</p>
      }
      
      <p>Likes: {likedCount}</p>

      <button onClick={handleLike}>
        { commentLiked ? "Unlike" : "Like" }
      </button>

      <hr/>

    </div>
  )
}