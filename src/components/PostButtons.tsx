import {Post} from '@/utils/types/post.type';
import {Profile} from '@/utils/types/profile.type';
import { useState } from 'react';
import { useEffect } from 'react';
import * as Popover from "@radix-ui/react-popover";

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
}
export default function PostButtons({post, currUser, savePost, updateSavedCount, commentsCount, commentsOpen, setCommentsOpen}:PostButtonsProps) {

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
    <div>
      <button onClick={handleSave}>
        { postSaved ? "Unsave" : "Save" }
      </button>

      <button onClick={handleComment}>Comment ({`${commentsCount}`})</button>

      <Popover.Root open={shareNotifOpen} onOpenChange={setShareNotifOpen}>
        <Popover.Trigger asChild>
          <button onClick={handleShare}>Share</button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="PopoverContent" sideOffset={5}>
            <p>📋 Link copied to clipboard!</p>
            <Popover.Arrow className="PopoverArrow" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    
    </div>
  );
}