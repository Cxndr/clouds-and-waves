"use client";

import { Post } from "@/utils/types/post.type";
import { Profile } from "@/utils/types/profile.type";
import * as Collapsible from "@radix-ui/react-collapsible";
import { useState } from "react";   
import { FaPaperPlane, FaXmark } from "react-icons/fa6";

interface CreatePostProps {
  currUser: Profile;
  insertPost: (formData: Omit<Post, 'id' | 'clerkUser' | 'genreName'>) => void;
  genreOptions: {id: number, name: string}[];
}

export default function CreatePost({currUser, insertPost, genreOptions} : CreatePostProps) {

  const [open, setOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(1);

  const handleGenreSelect = (e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedGenre(parseInt(e.target.value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formDataObj = Object.fromEntries(formData);
    const newPost: Omit<Post, 'id' | 'clerkUser' | 'genreName'> = {
      userId: currUser.id,
      artist: formDataObj.artist as string,
      title: formDataObj.title as string,
      genreId: parseInt(formDataObj.genreId as string),
      link: formDataObj.link as string,
      content: formDataObj.content as string,
      dateCreated: new Date(),
      savedCount: 0,
      comments: {data:[], pagination:{totalComments:0, currentPage:0, totalPages:0, pageSize:0}},
    }
    insertPost(newPost);
  }

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      className="flex flex-col mt-2 mb-6"
    >

      <Collapsible.Trigger asChild>
        <div className="select-none mx-auto text-xl font-bold cursor-pointer bg-[indianred] transition-all duration-300 hover:scale-[1.03] hover:bg-[#e07070] py-2 px-3 rounded-2xl shadowed">
          {open 
            ?
            <span className="flex gap-2 items-center">
              <FaXmark className="inline"/>
              <span>Close</span>
            </span>
            : 
            <span className="flex gap-2 items-center">
              <FaPaperPlane className="inline"/>
              <span>Post Something</span>
            </span>
          }
        </div>
      </Collapsible.Trigger>

      <Collapsible.Content>
        <div className="w-full max-w-2xl bg-zinc-800 bg-opacity-60 rounded-3xl p-4 my-4 mx-auto shadow-md shadow-zinc-700">

          <form onSubmit={handleSubmit} className="grid grid-cols-4 grid-rows-3 gap-4">

            <div className="flex flex-col items-start col-span-2 ">
              <label htmlFor="artist" className="pl-1 mb-1">
                Artist
              </label>
              <input name="artist" type="text" placeholder="Chuck Person" className="flex-grow" />
            </div>

            <div className="flex flex-col items-start col-span-2 col-start-3">
              <label htmlFor="title" className="pl-1 mb-1">
                Title
              </label>
              <input name="title" type="text" placeholder="Eccojam A3" className="flex-grow"/>
            </div>

            <div className="flex flex-col items-start row-start-2">
              <label htmlFor="genreId" className="pl-1 mb-1">
                Genre
              </label>
              <select 
                name="genreId" 
                value={selectedGenre} 
                onChange={handleGenreSelect} 
                className="w-full flex-grow" 
              >
                {genreOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col items-start col-span-3 row-start-2">
              <label htmlFor="link" className="pl-1 mb-1">
                Soundcloud Link
              </label>
              <input name="link" type="text" placeholder="https://soundcloud.com/jon-janel/eccojam-a3" className="flex-grow"/>
            </div>

            <div className="flex flex-col items-start col-span-4 row-start-3">
              <label htmlFor="content" className="pl-1 mb-1">
                Message
              </label>
              <input name="content" type="text" placeholder="type a message here... (optional)" className="flex-grow" />
            </div>

            <button type="submit" className="col-span-4 row-start-4 flex gap-2 items-center h-8">
              <FaPaperPlane className="inline"/>
              <span>Create Post</span>
            </button>

          
          </form>
        </div>
      </Collapsible.Content>

    </Collapsible.Root>
    
  )
}