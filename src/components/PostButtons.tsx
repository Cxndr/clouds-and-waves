import {Post} from '@/utils/types/post.type';
import {Profile} from '@/utils/types/profile.type';
import { useState } from 'react';
import { useEffect } from 'react';
import * as Popover from "@radix-ui/react-popover";
import { FaHeart, FaRegHeart, FaComment, FaShare } from "react-icons/fa6";


interface PostButtonsProps {
  post: Post;
  currUser: Profile;
  savePost: (
    postId: number, 
    userId: number, 
    addOrRemove: boolean
  ) => void;
  updateSavedCount: () => void;
  commentsCount: number;
  commentsOpen: boolean;
  setCommentsOpen: (open: boolean) => void;
  savedCount: number;
}
export default function PostButtons({post, currUser, savePost, updateSavedCount, commentsCount, commentsOpen, setCommentsOpen, savedCount}:PostButtonsProps) {

  const [postSaved, setPostSaved] = useState(false);

  useEffect(() => {
    if (currUser.savedPosts && currUser.savedPosts.includes(post.id)) {
      setPostSaved(true);
    } else {
      setPostSaved(false);  
    }
}, [currUser.savedPosts, post.id]);

  function handleSave() {
    if (postSaved) {
      savePost(post.id, currUser.id, false);
      currUser.savedPosts = currUser.savedPosts.filter((postId) => postId !== post.id);
      post.savedCount--;
      setPostSaved(false);
      updateSavedCount();

    } else {
      savePost(post.id, currUser.id, true);
      post.savedCount++;
      currUser.savedPosts.push(post.id);
      setPostSaved(true);
      updateSavedCount();
    }
  }



  const [shareNotifOpen, setShareNotifOpen] = useState(false);

  useEffect(() => {
    if (shareNotifOpen) {
      const timeout = setTimeout(() => {
        setShareNotifOpen(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [shareNotifOpen]);

  function handleShare() {
    navigator.clipboard.writeText(post.link)
  }



  function handleComment() {
    setCommentsOpen(!commentsOpen);
  }



  return (
    <div className="flex items-center justify-evenly gap-8 ml-2">
      
      <a onClick={handleSave} className="text-2xl bold hover:scale-110 hover:shadow-2xl transition-all duration-300 cursor-pointer select-none">
        <span className="flex items-center gap-2">
          { postSaved 
            ? <FaHeart className="inline text-red-600 align-middle text-3xl"/> 
            : <FaRegHeart className="inline text-red-600  text-3xl"/> }
          {`${savedCount}`}
          </span>
      </a>

      <a onClick={handleComment} className="text-2xl bold hover:scale-110 transition-all duration-300 cursor-pointer select-none">
        <span className="flex items-center gap-2">
          <FaComment/> {`${commentsCount}`}
        </span>
      </a>

      <Popover.Root open={shareNotifOpen} onOpenChange={setShareNotifOpen}>
        <Popover.Trigger asChild>
          <a onClick={handleShare} className="text-2xl bold hover:scale-110 transition-all duration-300 cursor-pointer select-none">
            <FaShare/>
          </a>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="PopoverContent border-none p-2 bg-zinc-900 bg-opacity-60" sideOffset={5}>
            <p>📋 Link copied to clipboard!</p>
            <Popover.Arrow className="PopoverArrow" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    
    </div>
  );
}