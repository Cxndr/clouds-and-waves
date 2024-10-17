"use client";

import { Post } from '../utils/types/post.type';
// import timeAgo from '@/utils/timeAgo';
import React, { useState, useEffect} from 'react';
import { Profile } from '../utils/types/profile.type';
import PostButtons from './PostButtons';
import * as Collapsible from "@radix-ui/react-collapsible";
import PostComments from './PostComments';
import Image from 'next/image';
import '@/app/styles/post.css';
import { Comment } from '@/utils/types/comment.type';
import { FaPenToSquare, FaTrashCan } from 'react-icons/fa6';

interface PostWideProps {
  postData: Post;
  currUser: Profile;
  genreOptions: {id: number, name: string}[];
  savePost: (
    postId: number,   
    userId: number, 
    addOrRemove: boolean
  ) => void;
  deletePost: (postId: number) => void;
  updatePost: (postId: number, updateData: {artist: string, title: string, genreId: number, link: string, content: string}) => void;
  insertComment: (commentData: Omit<Comment, 'id' | 'clerkUser'>) => void;
  deleteComment: (commentId: number) => void;
  likeComment: (commentId: number, userId: number, addOrRemove: boolean) => void;
  updateComment: (commentId: number, content: string) => void;
}

export default function PostWide({postData, currUser, genreOptions, savePost, deletePost, updatePost, insertComment, deleteComment, likeComment, updateComment,}: PostWideProps) {

  const [post] = useState(postData);
  const [savedCount, setSavedCount] = useState(post.savedCount);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(post.genreId);

  function updateSavedCount() {
    setSavedCount(post.savedCount);
  }

  const handleGenreSelect = (e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedGenre(parseInt(e.target.value));
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
    post.genreId = Number(formDataObj.genreId as string);
    post.link = formDataObj.link as string;
    post.content = formDataObj.content as string;
  }

  return (
    <>
      <div className={`p-4 max-w-5xl w-full rounded-3xl shadowed 
      bg-[url('/img/genre-bg/${post.genreName.toLowerCase().replace(/ /g,'')}.jpg')] 
      bg-cover bg-center`}
      >
        <div className="bg-zinc-700 bg-opacity-80 rounded-2xl p-4 w-full relative flex flex-col justify-between gap-4">

          <div className="flex">

            <div className="w-20 flex flex-col justify-center items-center">
              <a href={`/profile/${post.clerkUser.id}`}>
                <Image 
                  src={postData.clerkUser.imageUrl} 
                  alt="users profile image"
                  width="64"
                  height="64"
                  className="rounded-full hover:scale-105 hover:shadow hover:shadow-zinc-900 transition-all duration-300"
                />
              </a>
              <h3 className="font-bold text-xl text-zinc-300">{postData.clerkUser.username}</h3>
            </div>

            <div className='flex flex-col ml-4'>
              {editing ? 
                <form onSubmit={handleUpdate} className="flex flex-col gap-1 items-start">
                  <div>
                    <label htmlFor="artist">Artist</label>
                    <input name="artist" type="text" defaultValue={post.artist}/>
                  </div>
                  <div>
                    <label htmlFor="title">Title</label>
                    <input name="title" type="text" defaultValue={post.title}/>
                  </div>
                  <div className="text-left">
                    <label htmlFor="genreId">Genre</label>
                    <select 
                      name="genreId" 
                      defaultValue={post.genreId} 
                      value={selectedGenre} 
                      onChange={handleGenreSelect}
                    >
                      {genreOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="content">Content</label>
                    <input name="content" type="text" defaultValue={post.content}/>
                  </div>
                  <div>
                  <label htmlFor="link">Link</label>
                  <input name="link" type="text" defaultValue={post.link}/>
                  </div>
                  <div className="flex gap-2 mt-2 justify-center mx-auto">
                    <button 
                      type="submit" 
                      className=""
                    >
                      Save
                    </button>
                    <button 
                      onClick={()=>setEditing(false)}
                      className=""
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              :
              <>
                <div>
                  <h2 className="font-bold text-4xl">
                    <span>{post.title}</span>
                    <span className="text-2xl ml-2 font-normal">{post.artist}</span>
                  </h2>
                  <p className="text-zinc-300 opacity-90 text-sm mt-2">{}</p>
                  <p className="text-gray-200 text-lg">{post.content}</p>
                </div>

                <div className="absolute top-4 right-4 flex flex-col items-end gap-4">
                  <span className={`px-3 py-1 font-bold text-xl text-zinc-900 rounded-xl bg-g${post.genreName.toLowerCase().replace(/ /g,'')}`}>
                    {post.genreName}
                  </span>
                  {ownedPost &&
                    <div className="flex gap-3 text-base">
                      <button onClick={handleEdit} className="flex items-center gap-1">
                        <FaPenToSquare className="inline"/>
                        <span>Edit</span>
                      </button>
                      <button onClick={handleDelete} className="flex items-center gap-1">
                        <FaTrashCan className="inline"/>
                        <span>Delete</span>
                      </button>
                    </div>
                  }
                </div>
              </>
              }
              
            </div>

          </div>
          <iframe
            className="relative bottom-0 w-90% rounded-xl"
            width="100%"
            src={`https://w.soundcloud.com/player/?url=${post.link}&amp;color=ff0000&amp;inverse=true&amp;auto_play=false&amp;show_user=true" style="background:black;`}
          ></iframe>

          <PostButtons 
            post={post} 
            currUser={currUser} 
            savePost={savePost}
            savedCount={savedCount}
            updateSavedCount={updateSavedCount} 
            commentsCount={post.comments.pagination.totalComments}
            commentsOpen={commentsOpen}
            setCommentsOpen={setCommentsOpen}
          />
        {commentsOpen &&
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
        }



        </div>
      </div>
    </>
    
  )
}