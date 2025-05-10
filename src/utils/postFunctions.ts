/*
postFunctions.ts

Variables output:
  - none needed?

Functions output:

  *** GETS *** 
    (these should also get comments as array of objects in the object returned???)
  - getPostsAll([skipUserIds]=null, [skipGenreIds=null]): gets all posts from database.
  - getPostsUser(userId, [skipGenreIds]=null): gets all posts from a specific user, except optional skips.
  - getPostsGenre(genreId, [skipUserIds]=null): gets all posts from a specific genre.
  - getPostsCustom([userDbId, genreId]): gets all posts from specific users and genres.
  - getPostsArray(postIds): gets all posts from an array of post ids.


  *** INSERTS ***
  - insertPost(postData): inserts a post into the database.
  - insertComment(commentData): inserts a comment into the database.

  *** UPDATES ***
  - updatePost(postId, postData): updates a post in the database.
  - updateComment(commentId, commentData): updates a comment in the database.
  - savePost(postId, userId, addOrRemove=true): adds or removes a post to the user's saved posts and increments/decrements the saved count in the post.
  - likeComment(commentId, userId, addOrRemove=true): adds or removes a like to a comment and increments/decrements the like count in the comment.

  *** DELETES ***
  - deletePost(postId): deletes a post from the database.
  - deleteComment(commentId): deletes a comment from the database.

*/

import { db } from "./dbConn";
import { Post } from "@/utils/types/post.type";
import { Comment } from "./types/comment.type";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { clerkClient } from "@clerk/nextjs/server";
import { QueryResult } from "pg";

async function addCommentsToPosts(posts: Post[], skipUserIds: number[]=[-1]) {
  return await Promise.all (
    posts.map(async (post) => {
      const comments = await getComments(post.id, skipUserIds);
      post.comments = comments;
      return post
    })
  )
}

export async function setPostsData(response: QueryResult) {
    const posts: Post[] = []
    if (!response.rowCount) return posts; 
    for (let i=0; i < response.rowCount; i++) {
      const post: Post = {
        id: response.rows[i].id,
        userId: response.rows[i].user_id,
        clerkUser: 
          response.rows[i].clerk_user_id
          ? JSON.parse(JSON.stringify(await clerkClient().users.getUser(response.rows[i].clerk_user_id))) 
          : null,
        artist: response.rows[i].artist,
        title: response.rows[i].title,
        genreId: response.rows[i].genre_id,
        genreName: response.rows[i].genre_name,
        link: response.rows[i].link,
        content: response.rows[i].content,
        dateCreated: response.rows[i].date_created,
        savedCount: response.rows[i].saved_count,
        comments: {data: [], pagination: {totalComments: 0, currentPage: 1, totalPages: 1, pageSize: 10}}
      }
      posts.push(post);
    }
    return posts;
}

async function setCommentsData(response: QueryResult) {
  const comments: Comment[] = []
  if (!response.rowCount) return comments;
  for (let i=0; i < response.rowCount; i++) {
    const comment: Comment = {
      id: response.rows[i].id,
      userId: response.rows[i].user_id,
      clerkUser: response.rows[i].clerk_user_id ? JSON.parse(JSON.stringify(await clerkClient().users.getUser(response.rows[i].clerk_user_id))) : null,
      postId: response.rows[i].post_id,
      content: response.rows[i].content,
      dateCreated: new Date(response.rows[i].date_created),
      likeCount: response.rows[i].like_count
    }
    comments.push(comment);
  }
  return comments;
}

/// READ

// -1 in skip arrays stops postgres complaining about empty arrays. If have time later could remove this and make sql querys incude exceptions for empty arrays inline or assemble them based on conditions (removing sql NOT IN if empty array). This would cover the use case where the function is called with an empty array passed in manually, though this shouldn't ever happen as a user shouldn't be able to do this.

export async function getPostsAll(
  skipUserIds: number[] = [-1],
  skipGenreIds: number[] = [-1],
  page: number = 1,
  limit: number = 10
) {
  "use server";

  const offset = (page-1)*limit;
  const response = await db.query(`
    SELECT cw_posts.*, cw_users.clerk_user_id, cw_genres.name AS genre_name
    FROM cw_posts
    JOIN cw_users ON cw_users.id = cw_posts.user_id
    JOIN cw_genres ON cw_genres.id = cw_posts.genre_id
    WHERE cw_posts.user_id NOT IN (SELECT unnest($1::bigint[]))
    AND cw_posts.genre_id NOT IN (SELECT unnest($2::bigint[]))
    ORDER BY cw_posts.created_at DESC
    LIMIT $3 OFFSET $4`,
    [skipUserIds, skipGenreIds, limit, offset]
  );
  const posts: Post[] = await setPostsData(response);

  const totalResponse = await db.query(`
    SELECT COUNT(*) FROM cw_posts
    WHERE user_id NOT IN (SELECT unnest($1::bigint[]))
    AND genre_id NOT IN (SELECT unnest($2::bigint[]))`,
    [skipUserIds, skipGenreIds]
  );
  const totalPosts = parseInt(totalResponse.rows[0].count);

  const commentedPosts = await addCommentsToPosts(posts, skipUserIds);

  return {
    data: commentedPosts,
    pagination: { 
      totalPosts: totalPosts, 
      currentPage: page, 
      totalPages: Math.ceil(totalPosts / limit),
      pageSize: limit
    }
  };
}

export async function getPostsUser(
  userId: number, 
  skipGenreIds: number[] = [-1],
  page: number = 1,
  limit: number = 10
) {
  "use server";
  
  const offset = (page-1)*limit;
  const response = await db.query(`
    SELECT cw_posts.*, cw_users.clerk_user_id, cw_genres.name AS genre_name
    FROM cw_posts
    JOIN cw_users ON cw_users.id = cw_posts.user_id
    JOIN cw_genres ON cw_genres.id = cw_posts.genre_id
    WHERE cw_posts.user_id = $1
    AND cw_posts.genre_id NOT IN (SELECT unnest($2::bigint[]))
    ORDER BY cw_posts.created_at DESC
    LIMIT $3 OFFSET $4`,
    [userId, skipGenreIds, limit, offset]
  );
  const posts: Post[] = await setPostsData(response);
  
  const totalResponse = await db.query(`
    SELECT COUNT(*) FROM cw_posts
    WHERE user_id = $1
    AND genre_id NOT IN (SELECT unnest($2::bigint[]))`,
    [userId, skipGenreIds]
  );
  const totalPosts = parseInt(totalResponse.rows[0].count);

  const commentedPosts = await addCommentsToPosts(posts)

  return {
    data: commentedPosts,
    pagination: { 
      totalPosts: totalPosts, 
      currentPage: page, 
      totalPages: Math.ceil(totalPosts / limit),
      pageSize: limit
    }
  };
}

export async function getPostsGenre(
  genreId: number, 
  skipUserIds: number[] = [-1],
  page: number = 1,
  limit: number = 10
) {
  "use server";

  const offset = (page-1)*limit;
  const response = await db.query(`
    SELECT cw_posts.*, cw_users.clerk_user_id, cw_genres.name AS genre_name
    FROM cw_posts
    JOIN cw_users ON cw_users.id = cw_posts.user_id
    JOIN cw_genres ON cw_genres.id = cw_posts.genre_id
    WHERE cw_posts.genre_id = $1
    AND cw_posts.user_id NOT IN (SELECT unnest($2::bigint[]))
    ORDER BY cw_posts.created_at DESC
    LIMIT $3 OFFSET $4`,
    [genreId, skipUserIds, limit, offset]
  );
  const posts: Post[] = await setPostsData(response);
  
  const totalResponse = await db.query(`
    SELECT COUNT(*) FROM cw_posts
    WHERE genre_id = $1
    AND user_id NOT IN (SELECT unnest($2::bigint[]))`,
    [genreId, skipUserIds]
  );
  const totalPosts = parseInt(totalResponse.rows[0].count);

  const commentedPosts = await addCommentsToPosts(posts,skipUserIds)

  
  return {
    data: commentedPosts,
    pagination: { 
      totalPosts: totalPosts, 
      currentPage: page, 
      totalPages: Math.ceil(totalPosts / limit),
      pageSize: limit
    }
  }
}

export async function getPostsCustom(
  userDbId: number[], 
  genreId: number[],
  page: number = 1,
  limit: number = 10
) {
  "use server";

  const offset = (page-1)*limit;
  const response = await db.query(`
    SELECT cw_posts.*, cw_users.clerk_user_id, cw_genres.name AS genre_name
    FROM cw_posts
    JOIN cw_users ON cw_users.id = cw_posts.user_id
    JOIN cw_genres ON cw_genres.id = cw_posts.genre_id
    WHERE cw_posts.user_id = ANY($1::bigint[])
    OR cw_posts.genre_id = ANY($2::bigint[])
    ORDER BY cw_posts.created_at DESC
    LIMIT $3 OFFSET $4`,
    [userDbId, genreId, limit, offset]
  );
  const posts: Post[] = await setPostsData(response);
  
  const totalResponse = await db.query(`
    SELECT COUNT(*) FROM cw_posts
    WHERE user_id = $1
    AND genre_id = $2`,
    [userDbId, genreId]
  );
  const totalPosts = parseInt(totalResponse.rows[0].count);

  const commentedPosts = await addCommentsToPosts(posts)

  return {
    data: commentedPosts,
    pagination: { 
      totalPosts: totalPosts, 
      currentPage: page, 
      totalPages: Math.ceil(totalPosts / limit),
      pageSize: limit
    }
  }
}

export async function getPostsArray(
  postIds: number[],
  page=1,
  limit=10
) {
  "use server";

  const offset = (page-1)*limit;
  const response = await db.query(`
    SELECT cw_posts.*, cw_users.clerk_user_id, cw_genres.name AS genre_name
    FROM cw_posts
    JOIN cw_users ON cw_users.id = cw_posts.user_id
    JOIN cw_genres ON cw_genres.id = cw_posts.genre_id
    WHERE cw_posts.id = ANY($1::bigint[])
    ORDER BY cw_posts.created_at DESC
    LIMIT $2 OFFSET $3`,
    [postIds, limit, offset]
  );
  const posts: Post[] = await setPostsData(response);

  const totalResponse = await db.query(`
    SELECT COUNT(*) FROM cw_posts
    WHERE id = ANY($1::bigint[])`,
    [postIds]
  );
  const totalPosts = parseInt(totalResponse.rows[0].count);

  const commentedPosts = await addCommentsToPosts(posts)

  return {
    data: commentedPosts,
    pagination: {
      totalPosts: totalPosts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      pageSize: limit
    }
  }
}

export async function getComments(
  postId: number, 
  skipUserIds: number[] = [-1],
  page=1,
  limit=10
) {
  "use server";

  const offset = (page-1)*limit;
  const response = await db.query(`
    SELECT cw_comments.*, cw_users.clerk_user_id
    FROM cw_comments
    JOIN cw_users ON cw_users.id = cw_comments.user_id
    WHERE cw_comments.post_id = $1
    AND cw_comments.user_id NOT IN (SELECT unnest($2::bigint[]))
    ORDER BY cw_comments.created_at DESC
    LIMIT $3 OFFSET $4`,
    [postId, skipUserIds, limit, offset]
  );
  const comments = await setCommentsData(response);

  const totalResponse = await db.query(`
    SELECT COUNT(*) FROM cw_comments
    WHERE post_id = $1
    AND user_id NOT IN (SELECT unnest($2::bigint[]))`,
    [postId, skipUserIds]
  );
  const totalComments = parseInt(totalResponse.rows[0].count);

  return {
    data: comments,
    pagination: { 
      totalComments: totalComments, 
      currentPage: page, 
      totalPages: Math.ceil(totalComments / limit),
      pageSize: limit
    }
  }
}

export async function getCommentsUser(
  userId: number, 
  page=1,
  limit=10
) {
  "use server";

  const offset = (page-1)*limit;
  const response = await db.query(`
    SELECT cw_comments.*, cw_users.clerk_user_id 
    FROM cw_comments
    JOIN cw_users ON cw_users.id = cw_comments.user_id
    WHERE cw_comments.user_id = $1
    ORDER BY cw_comments.created_at DESC
    LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  const comments = await setCommentsData(response);
  
  const totalResponse = await db.query(`
    SELECT COUNT(*) FROM cw_comments
    WHERE user_id = $1`,
    [userId]
  );
  const totalComments = parseInt(totalResponse.rows[0].count);

  return {
    data: comments,
    pagination: { 
      totalComments: totalComments, 
      currentPage: page, 
      totalPages: Math.ceil(totalComments / limit),
      pageSize: limit
    }
  }
}

export async function getLikedComments(
  userId: number,
  page=1,
  limit=10
) {
  "use server";

  const offset = (page-1)*limit;
  const response = await db.query(`
    SELECT cw_comments.*, cw_users.clerk_user_id 
    FROM cw_comments
    JOIN cw_users ON cw_users.id = cw_comments.user_id
    WHERE cw_comments.id = ANY(
      SELECT unnest(liked_comments)
      FROM cw_users
      WHERE id = $1
    )
    ORDER BY cw_comments.created_at DESC
    LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  const likedComments = await setCommentsData(response);

  const totalResponse = await db.query(`
    SELECT COUNT(*) FROM cw_comments
    WHERE user_id = $1`,
    [userId]
  );
  const totalLikedComments = parseInt(totalResponse.rows[0].count);

  return {
    data: likedComments,
    pagination: { 
      totalLikedComments: totalLikedComments, 
      currentPage: page, 
      totalPages: Math.ceil(totalLikedComments / limit),
      pageSize: limit
    }
  };
}


/// CREATE
export async function insertPost(postData: Omit<Post, 'id' | 'clerkUser' | 'genreName'>) {
  "use server";

  await db.query(`
    INSERT INTO cw_posts 
    (user_id, artist, title, genre_id, link, content)
    VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      postData.userId,
      postData.artist,
      postData.title,
      postData.genreId,
      postData.link,
      postData.content,
    ]
  );
  const path = "/feed/";
  revalidatePath(path);
  redirect(path);
}

export async function insertComment(commentData: Omit<Comment, 'id' | 'clerkUser'>) {
  "use server";
  
  await db.query(`
    INSERT INTO cw_comments 
    (user_id, post_id, content)
    VALUES ($1, $2, $3)`,
    [commentData.userId, commentData.postId, commentData.content]
  );
}


/// UPDATE
export async function updatePost(
  postId: number, 
  updateData: {artist: string, title: string, genreId: number, link: string, content: string}
) {
  "use server";

  await db.query(`
    UPDATE cw_posts
    SET 
      artist = $1, 
      title = $2, 
      genre_id = $3, 
      link = $4, 
      content = $5
    WHERE id = $6`,
    [
      updateData.artist,
      updateData.title,
      updateData.genreId,
      updateData.link,
      updateData.content,
      postId
    ]
  );
}

export async function updateComment(
  commentId: number, 
  content: string
) {
  "use server";

  await db.query(`
    UPDATE cw_comments
    SET content = $1
    WHERE id = $2`,
    [content, commentId]
  );
}

export async function savePost(
  postId: number, 
  userId: number, 
  addOrRemove=true
) {
  "use server";

  if (addOrRemove) {
    await db.query(`
      UPDATE cw_users
      SET saved_posts = array_append(saved_posts, $1)
      WHERE id = $2`,
      [postId, userId]
    );
    await db.query(`
      UPDATE cw_posts
      SET saved_count = saved_count + 1
      WHERE id = $1`,
      [postId]
    );
  }
  else {
    await db.query(`
      UPDATE cw_users
      SET saved_posts = array_remove(saved_posts, $1)
      WHERE id = $2`,
      [postId, userId]
    );
    await db.query(`
      UPDATE cw_posts
      SET saved_count = saved_count - 1
      WHERE id = $1`,
      [postId]
    );
  }
}

export async function likeComment(
  commentId: number,
  userId: number,
  addOrRemove=true
) {
  "use server";

  if (addOrRemove) {
    await db.query(`
      update cw_users
      SET liked_comments = array_append(liked_comments, $1)
      WHERE id = $2`,
      [commentId, userId]
    );
    await db.query(`
      UPDATE cw_comments
      SET like_count = like_count + 1
      WHERE id = $1`,
      [commentId]
    );
  }
  else {
    await db.query(`
      update cw_users
      SET liked_comments = array_remove(liked_comments, $1)
      WHERE id = $2`,
      [commentId, userId]
    );
    await db.query(`
      UPDATE cw_comments
      SET like_count = like_count - 1
      WHERE id = $1`,
      [commentId]
    );
  }
}


/// DELETE
export async function deletePost(postId: number) {
  "use server";

  await db.query(`
    DELETE FROM cw_posts
    WHERE id = $1`,
    [postId]
  );
}

export async function deleteComment(commentId: number) {
  "use server";

  await db.query(`
    DELETE FROM cw_comments
    WHERE id = $1`,
    [commentId]
  );
}
