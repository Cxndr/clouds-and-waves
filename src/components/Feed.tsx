import { Post } from "@/utils/types/post.type";
import { Profile } from "@/utils/types/profile.type";
import { Comment } from "@/utils/types/comment.type";
import CreatePost from "./CreatePost";
import FeedPosts from "./FeedPosts";

interface FeedProps {

  currUser: Profile;
  insertPost: (formData: Omit<Post, 'id' | 'clerkUser' | 'genreName'>) => void;
  genreOptions: {id: number, name: string}[];
  
  postsData: { 
    data: Post[], 
    pagination: {
      totalPosts: number, 
      currentPage: number, 
      totalPages: number, 
      pageSize: number
    }
  };
  savePost: (postId: number, userId: number, addOrRemove: boolean) => void;
  deletePost: (postId: number) => void;
  updatePost: (postId: number, updateData: {artist: string, title: string, genreId: number, link: string, content: string}) => void;
  insertComment: (commentData: Omit<Comment, 'id' | 'clerkUser'>) => void;
  deleteComment: (commentId: number) => void;
  likeComment: (commentId: number, userId: number, addOrRemove: boolean) => void;
  updateComment: (commentId: number, content: string) => void;
  getPostsAll: () => Promise<{     
    data: Post[], 
    pagination: {
      totalPosts: number, 
      currentPage: number, 
      totalPages: number, 
      pageSize: number
    }
  }>;
  getPostsCustom: (userId: number[], genreIds: number[]) => Promise<{     
    data: Post[], 
    pagination: {
      totalPosts: number, 
      currentPage: number, 
      totalPages: number, 
      pageSize: number
    }
  }>;
  getPostsGenre: (genreId: number) => Promise<{     
    data: Post[], 
    pagination: {
      totalPosts: number, 
      currentPage: number, 
      totalPages: number, 
      pageSize: number
    }
  }>;

}

export default function Feed({
  currUser,
  insertPost,
  genreOptions,
  postsData,
  savePost,
  deletePost,
  updatePost,
  insertComment,
  deleteComment,
  likeComment,
  updateComment,
  getPostsAll,
  getPostsCustom,
  getPostsGenre,
}: FeedProps) {

  return (
    <div className="flex flex-col gap-4 w-full items-center p-8 ">

      <CreatePost 
        currUser={currUser}
        insertPost={insertPost}
        genreOptions={genreOptions}
      />

      <FeedPosts
        postsData={postsData}
        currUser={currUser}
        savePost={savePost}
        deletePost={deletePost}
        updatePost={updatePost}
        insertComment={insertComment}
        deleteComment={deleteComment}
        likeComment={likeComment}
        updateComment={updateComment}
        getPostsAll={getPostsAll}
        getPostsCustom={getPostsCustom}
        getPostsGenre={getPostsGenre}
        genreOptions={genreOptions}
      />

    </div>
  );
}