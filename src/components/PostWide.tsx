"use client";

import { Post } from '../utils/types/post.type';
import timeAgo from '@/utils/timeAgo';
import { useState } from 'react';

export default function PostWide({postData}: {postData: Post}) {

  const [post] = useState(postData);

  return (
    <div>
      <span>{post.userId}</span>
      <span>{post.genreId}</span>
      <h3>{post.artist} - {post.title}</h3>
      <span>{timeAgo(post.dateCreated)}</span>
      <p>{post.content}</p>
      <p>{post.link}</p>
      <i>{post.savedCount}</i>

      {/* {post.comments.map((comment, index) => (
        <div key={index}>
          <h4>comment user</h4>
          <p>comment content</p>
        </div>
      ))} */}
      <br/>

    </div>
  )
}