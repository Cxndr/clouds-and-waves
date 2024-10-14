import * as Tabs from "@radix-ui/react-tabs";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import PostWide from "./PostWide";
import type { Post } from "@/utils/types/post.type";
import type { Comment } from "@/utils/types/comment.type";
import { Profile } from "@/utils/types/profile.type";
import CommentSingle from "./CommentSingle";

interface UserProfileProps {
  // updateUser: (formData: { username: string; bio: string }) => void;
  // deleteUser: (userId: number) => void;
  posts: { data: Post[] };
  comments: { data: Comment[]};
  saved: {data: Post[];}
  liked: { data: Comment[]};
  currUser: Profile;
  savePost: (postId: number, userId: number, addOrRemove: boolean) => void;
  deletePost: (postId: number) => void;
  updatePost: (postId: number, updateData: {artist: string, title: string, genreId: number, link: string, content: string}) => void;
  insertComment: (postId: number, userId: number, content: string) => void;
  deleteComment: (commentId: number) => void;
  likeComment: (commentId: number, userId: number, addOrRemove: boolean) => void;
  updateComment: (commentId: number, content: string) => void;
}

export default function ProfileTabs({posts, comments, saved, liked, currUser, savePost, deletePost, updatePost, insertComment, deleteComment, likeComment, updateComment}: UserProfileProps) {
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
                />
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
              {comments.data.map((comment) => (
                <CommentSingle 
                  comment={comment} 
                  currUser={currUser} 
                  likeComment={likeComment} 
                  deleteComment={deleteComment} 
                  updateComment={updateComment}
                />
              ))}
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="vertical">
              <ScrollArea.Thumb className="ScrollAreaThumb"/>
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </Tabs.Content>

        <Tabs.Content value="saved-tab">
          <ScrollArea.Root className=" ScrollAreaRoot h-60 w-full">
            <ScrollArea.Viewport className="ScrollAreaViewport bg-slate-800">
              {saved.data.map((postData) => (
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
              />
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
              {liked.data.map((comment) => (
                  <CommentSingle 
                  comment={comment} 
                  currUser={currUser} 
                  likeComment={likeComment} 
                  deleteComment={deleteComment} 
                  updateComment={updateComment}
                />
              ))}
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