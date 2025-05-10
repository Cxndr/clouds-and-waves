import CreateComment from "./CreateComment";
import { Post } from "@/utils/types/post.type";
import { Profile } from "@/utils/types/profile.type";
import CommentSingle from "./CommentSingle";
import { Comment } from "@/utils/types/comment.type";
import { useState, useEffect } from "react";

interface PostCommentsProps {
  post: Post;
  currUser: Profile;
  insertComment: (commentData: Omit<Comment, 'id' | 'clerkUser'>) => Promise<void>;
  deleteComment: (commentId: number) => void;
  likeComment: (commentId: number, userId: number, addOrRemove: boolean) => void;
  updateComment: (commentId: number, content: string) => void;
}

export default function PostComments({post, currUser, insertComment, deleteComment, likeComment, updateComment}:PostCommentsProps) {
  const [postData, setPostData] = useState(post);

  // Update local state when post prop changes
  useEffect(() => {
    setPostData(post);
  }, [post]);

  const handleInsertComment = async (commentData: Omit<Comment, 'id' | 'clerkUser'>) => {
    // Create optimistic comment with exact data from commentData
    const optimisticComment: Comment = {
      ...commentData,
      id: Date.now(), // Temporary ID
      clerkUser: currUser.clerkUser
    };

    // Update state with new comment
    setPostData(prevPost => {
      const newComments = {
        ...prevPost.comments,
        data: [optimisticComment, ...(prevPost.comments?.data || [])],
        pagination: {
          ...prevPost.comments?.pagination,
          totalComments: (prevPost.comments?.pagination?.totalComments || 0) + 1
        }
      };
      return {
        ...prevPost,
        comments: newComments
      };
    });

    try {
      // Call server update
      await insertComment(commentData);
    } catch (error) {
      console.error('Failed to insert comment:', error);
      // Revert optimistic update on error
      setPostData(prevPost => {
        const newComments = {
          ...prevPost.comments,
          data: prevPost.comments?.data.filter(c => c.id !== optimisticComment.id) || [],
          pagination: {
            ...prevPost.comments?.pagination,
            totalComments: (prevPost.comments?.pagination?.totalComments || 1) - 1
          }
        };
        return {
          ...prevPost,
          comments: newComments
        };
      });
    }
  };

  return (
    <div className="w-11/12 mx-auto">
      <CreateComment 
        post={postData} 
        currUser={currUser} 
        insertComment={handleInsertComment}
      />

      {
        postData.comments &&
        postData.comments.data.map((comment) => (
          <CommentSingle 
            key={comment.id}
            commentData={comment}
            currUser={currUser}
            likeComment={likeComment} 
            deleteComment={deleteComment}
            updateComment={updateComment}
          />
        ))
      }
    </div>
  );
}