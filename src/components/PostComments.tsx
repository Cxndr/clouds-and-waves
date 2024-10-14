import CreateComment from "./CreateComment";
import { Post } from "@/utils/types/post.type";
import timeAgo from "@/utils/timeAgo";
import { Profile } from "@/utils/types/profile.type";
import CommentSingle from "./CommentSingle";

interface PostCommentsProps {
  post: Post;
  currUser: Profile;
  insertComment: (postId: number, userId: number, content: string) => void;
  deleteComment: (commentId: number) => void;
  likeComment: (commentId: number, userId: number, addOrRemove: boolean) => void;
  updateComment: (commentId: number, content: string) => void;
}  
export default function PostComments({post, currUser, insertComment, deleteComment, likeComment, updateComment}:PostCommentsProps) {

  return (
    <>
      <CreateComment post={post} currUser={currUser} insertComment={insertComment}/>

      {
        post.comments &&
        post.comments.data.map((comment, index) => (
          <CommentSingle 
            key={index} 
            comment={comment}
            currUser={currUser}
            likeComment={likeComment} 
            deleteComment={deleteComment}
            updateComment={updateComment}
          />
        ))
      }
    </>
  )
}