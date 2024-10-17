import CreateComment from "./CreateComment";
import { Post } from "@/utils/types/post.type";
import { Profile } from "@/utils/types/profile.type";
import CommentSingle from "./CommentSingle";
import { Comment } from "@/utils/types/comment.type";
import { useState } from "react";

interface PostCommentsProps {
  post: Post;
  currUser: Profile;
  insertComment: (commentData: Omit<Comment, 'id' | 'clerkUser'>) => void;
  deleteComment: (commentId: number) => void;
  likeComment: (commentId: number, userId: number, addOrRemove: boolean) => void;
  updateComment: (commentId: number, content: string) => void;
}


export default function PostComments({post, currUser, insertComment, deleteComment, likeComment, updateComment}:PostCommentsProps) {

  const [postData] = useState(post);
  

  return (
    <div className="w-11/12 mx-auto">
      <CreateComment 
        post={postData} 
        currUser={currUser} 
        insertComment={insertComment}
      />

      {
        post.comments &&
        post.comments.data.map((comment, index) => (
          <CommentSingle 
            key={index} 
            commentData={comment}
            currUser={currUser}
            likeComment={likeComment} 
            deleteComment={deleteComment}
            updateComment={updateComment}
          />
        ))
      }
    </div>
  )
}