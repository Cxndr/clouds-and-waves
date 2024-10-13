import * as Tabs from "@radix-ui/react-tabs";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import PostWide from "./PostWide";
import type { Post } from "@/utils/types/post.type";

interface UserProfileProps {
  // updateUser: (formData: { username: string; bio: string }) => void;
  // deleteUser: (userId: number) => void;
  posts: { data: Post[] };
  comments: { data: Comment[]}
  saved: Post[]
  liked: { data: Comment[]}
}

export default function ProfileTabs({posts, comments, saved, liked}: UserProfileProps) {
  return (
    <div>
      <Tabs.Root>

        <Tabs.List>
          <Tabs.Trigger value="posts-tab">Posts</Tabs.Trigger>
          <Tabs.Trigger value="comments-tab">Comments</Tabs.Trigger>
          <Tabs.Trigger value="saved-tab">Saved</Tabs.Trigger>
          <Tabs.Trigger value="liked-tab">Liked Comments</Tabs.Trigger>
        </Tabs.List>
        
        <Tabs.Content value="posts-tab">
          <ScrollArea.Root className=" ScrollAreaRoot h-60 w-full">
            <ScrollArea.Viewport className="ScrollAreaViewport bg-slate-800">
              {posts.data.map((postData) => (
                <PostWide key={postData.id} postData={postData}/>
              ))}
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="vertical">
              <ScrollArea.Thumb className="ScrollAreaThumb"/>
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </Tabs.Content>

        <Tabs.Content value="comments-tab">
          <ScrollArea.Root className=" ScrollAreaRoot h-60 w-full">
            <ScrollArea.Viewport className="ScrollAreaViewport bg-slate-800">
              {/* {comments.data.map((commentData) => (
                <></> // todo: comment component
              ))} */}
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="vertical">
              <ScrollArea.Thumb className="ScrollAreaThumb"/>
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </Tabs.Content>

        <Tabs.Content value="saved-tab">
          <ScrollArea.Root className=" ScrollAreaRoot h-60 w-full">
            <ScrollArea.Viewport className="ScrollAreaViewport bg-slate-800">
              {saved.map((postData) => (
                <PostWide key={postData.id} postData={postData}/>
              ))}
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="vertical">
              <ScrollArea.Thumb className="ScrollAreaThumb"/>
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </Tabs.Content>

        <Tabs.Content value="liked-tab">
          <ScrollArea.Root className=" ScrollAreaRoot h-60 w-full">
            <ScrollArea.Viewport className="ScrollAreaViewport bg-slate-800">
              {/* {liked.data.map((commentData) => (
                <></>// todo comment component
              ))} */}
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="vertical">
              <ScrollArea.Thumb className="ScrollAreaThumb"/>
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </Tabs.Content>

      </Tabs.Root>



  </div>
  )
}