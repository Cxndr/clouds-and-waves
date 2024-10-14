"use client";

import { Post } from '../utils/types/post.type';
import timeAgo from '@/utils/timeAgo';
import React, { useState, useEffect} from 'react';
import { Profile } from '../utils/types/profile.type';
import PostButtons from './PostButtons';
import * as Collapsible from "@radix-ui/react-collapsible";
import PostComments from './PostComments';

interface PostWideProps {
  postData: Post;
  currUser: Profile;
  savePost: (
    postId: number,   
    userId: number, 
    addOrRemove: boolean
  ) => void;
  deletePost: (postId: number) => void;
  updatePost: (postId: number, updateData: {artist: string, title: string, genreId: number, link: string, content: string}) => void;
  insertComment: (postId: number, userId: number, content: string) => void;
  deleteComment: (commentId: number) => void;
  likeComment: (commentId: number, userId: number, addOrRemove: boolean) => void;
  updateComment: (commentId: number, content: string) => void;
}

export default function PostWide({postData, currUser, savePost, deletePost, updatePost, insertComment, deleteComment, likeComment, updateComment}: PostWideProps) {

  const [post] = useState(postData);
  const [savedCount, setSavedCount] = useState(post.savedCount);
  const [commentsOpen, setCommentsOpen] = useState(false);

  function updateSavedCount() {
    setSavedCount(post.savedCount);
  }

  const [ownedPost, setOwnedPost] = useState(false);

  useEffect(() => {
    if (post.userId === currUser.id) {
      setOwnedPost(true);
    } else {
      setOwnedPost(false);
    }
  }, [post.userId, currUser.id]);

  function handleDelete() {
    deletePost(post.id);
  }

  const [editing, setEditing] = useState(false);

  function handleEdit() {
    setEditing(true);
  }
  
  function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    const formData = e.target as HTMLFormElement;
    const formDataObj = Object.fromEntries(new FormData(formData));
    const updatedPost = {
      artist: formDataObj.artist as string,
      title: formDataObj.title as string,
      genreId: Number(formDataObj.genreId as string),
      link: formDataObj.link as string,
      content: formDataObj.content as string,
    };
    updatePost(post.id, updatedPost);
    setEditing(false);
    post.artist = formDataObj.artist as string;
    post.title = formDataObj.title as string;
    post.genreId = Number(formDataObj.genreId as string),
    post.link = formDataObj.link as string;
    post.content = formDataObj.content as string;

    
  }

  return (
    <div>
      <img src={postData.clerkUser.imageUrl}/>
      <p>{postData.clerkUser.username}</p>
      {ownedPost &&
        <div>
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      }
      {editing ? 
        <form onSubmit={handleUpdate}>
          <label htmlFor="artist">Artist</label>
          <input name="artist" type="text" defaultValue={post.artist}/>
          <label htmlFor="title">Title</label>
          <input name="title" type="text" defaultValue={post.title}/>
          <label htmlFor="genreId">Genre ID</label>
          <input name="genreId" type="number" defaultValue={post.genreId}/>
          <label htmlFor="content">Content</label>
          <input name="content" type="text" defaultValue={post.content}/>
          <label htmlFor="link">Link</label>
          <input name="link" type="text" defaultValue={post.link}/>
          <button type="submit">Update Post</button>
        </form>
      :
        <>
          <p>{post.genreId}</p>
          <h3>{post.artist} - {post.title}</h3>
          <span>{timeAgo(post.dateCreated)}</span>
          <p>{post.content}</p>
          <p>{post.link}</p>
        </>
      }
      <p>Saved: {savedCount}</p>
      <hr/>

      <PostButtons 
        post={post} 
        currUser={currUser} 
        savePost={savePost}
        updateSavedCount={updateSavedCount} 
        commentsCount={post.comments.pagination.totalComments}
        commentsOpen={commentsOpen}
        setCommentsOpen={setCommentsOpen}
      />

    <Collapsible.Root 
      defaultOpen={false} 
      open={commentsOpen} 
      onOpenChange={setCommentsOpen}
    >
      <Collapsible.Content>
        <PostComments 
          post={post} 
          currUser={currUser} 
          insertComment={insertComment} 
          deleteComment={deleteComment} 
          likeComment={likeComment} 
          updateComment={updateComment}
        />
      </Collapsible.Content>
    </Collapsible.Root>


    </div>
  )
}