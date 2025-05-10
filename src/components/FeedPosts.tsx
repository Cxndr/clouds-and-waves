"use client";

import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { Post } from "@/utils/types/post.type";
import { Profile } from "@/utils/types/profile.type";
import { Comment } from "@/utils/types/comment.type";
import PostWide from "./PostWide";
import { useState } from "react";
import DotLoader from "react-spinners/DotLoader";

interface FeedPostsProps {
  postsData: { 
    data: Post[], 
    pagination: {
      totalPosts: number, 
      currentPage: number, 
      totalPages: number, 
      pageSize: number
    }
  };
  currUser: Profile;
  genreOptions: {id: number, name: string}[];
  savePost: (postId: number, userId: number, addOrRemove: boolean) => void;
  deletePost: (postId: number) => void;
  updatePost: (postId: number, updateData: {artist: string, title: string, genreId: number, link: string, content: string}) => void;
  insertComment: (commentData: Omit<Comment, 'id' | 'clerkUser'>) => Promise<void>;
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

export default function FeedPosts({postsData, currUser, savePost, deletePost, updatePost, insertComment, deleteComment, likeComment, updateComment, getPostsAll, getPostsCustom, getPostsGenre, genreOptions}: FeedPostsProps) {

  const [posts, setPosts] = useState(postsData);
  const [loading, setLoading] = useState(false);

  function handleFilterChange(postType:string) {
    getPosts(parseInt(postType));
  }

  function getPosts(type: number) {

    if (type > 9) return;

    if (type === -1) { // get all posts
      setLoading(true);
      getPostsAll().then((newPosts) => {
        setPosts(newPosts);
        setLoading(false);
      });
    }
    else if (type === 0) { // get personal feed
      setLoading(true);
      getPostsCustom(currUser.feedUsers, currUser.feedGenres).then((newPosts) => {
        setPosts(newPosts);
        setLoading(false);
      });
    }
    else if (type > 0) { // get genre feed
      setLoading(true);
      getPostsGenre(type).then((newPosts) => {
        setPosts(newPosts);
        setLoading(false);
      });
    }
  }

  return (
    <>
      <ToggleGroup.Root
        type="single"
        defaultValue="-1"
        className="flex gap-2"
        onValueChange={handleFilterChange}
      >
        <ToggleGroup.Item value="-1" className="shadowed">
          All Posts
        </ToggleGroup.Item>
        
        <ToggleGroup.Item value="0" className="shadowed">
          My Feed
        </ToggleGroup.Item>
        <span className="text-4xl text-zinc-50 inline">~</span>
        <ToggleGroup.Item value="1" className="text-zinc-950 px-4 py-2 shadowed hover:brightness-105 bg-gcloud hover:bg-gcloud">
          cloud
        </ToggleGroup.Item>

        <ToggleGroup.Item value="2" className="text-zinc-950 px-4 py-2 shadowed hover:brightness-105 bg-gdnb hover:bg-gdnb">
          DnB
        </ToggleGroup.Item>

        <ToggleGroup.Item value="3" className="text-zinc-950 px-4 py-2 shadowed hover:brightness-105 bg-gtrap hover:bg-gtrap">
          trap
        </ToggleGroup.Item>

        <ToggleGroup.Item value="4" className="text-zinc-950 px-4 py-2 shadowed hover:brightness-105 bg-ghouse hover:bg-ghouse">
          house
        </ToggleGroup.Item>

        <ToggleGroup.Item value="5" className="text-zinc-950 px-4 py-2 shadowed hover:brightness-105 bg-gphonk hover:bg-gphonk">
          phonk
        </ToggleGroup.Item>

        <ToggleGroup.Item value="6" className="text-zinc-950 px-4 py-2 shadowed hover:brightness-105 bg-gvaporwave hover:bg-gvaporwave">
          vaporwave
        </ToggleGroup.Item>

        <ToggleGroup.Item value="7" className="text-zinc-950 px-4 py-2 shadowed hover:brightness-105 bg-gfuturefunk hover:bg-gfuturefunk">
          future funk
        </ToggleGroup.Item>

        <ToggleGroup.Item value="8" className="text-zinc-950 px-4 py-2 shadowed hover:brightness-105 bg-gsynthwave hover:bg-gsynthwave">
          synthwave
        </ToggleGroup.Item>

        <ToggleGroup.Item value="9" className="text-zinc-950 px-4 py-2 shadowed hover:brightness-105 bg-glofi hover:bg-glofi">
          lofi
        </ToggleGroup.Item>

      </ToggleGroup.Root>

      {loading && 
        <div className="text-4xl p-8 pb-12 mt-12 flex flex-col gap-8 items-center justify-center text-zinc-900 bg-zinc-200 bg-opacity-60 rounded-3xl">
          <p>Loading</p>
          <DotLoader color="#252121"/>
        </div>}
      {posts.data.length === 0 && !loading &&
        <div className="text-4xl p-8 mt-12 flex flex-col gap-8 items-center justify-center text-zinc-900 bg-zinc-200 bg-opacity-60 rounded-3xl">
          <span>Nothing here 😔</span>
        </div>}
      {!loading && posts.data.map((postData) => (
        <PostWide 
          key={postData.id} 
          postData={postData} 
          currUser={currUser} 
          savePost={savePost}
          deletePost={deletePost}
          updatePost={updatePost}
          insertComment={insertComment}
          deleteComment={deleteComment}
          likeComment={likeComment}
          updateComment={updateComment}
          genreOptions={genreOptions}
        />
      ))}
    </>
  )
}
