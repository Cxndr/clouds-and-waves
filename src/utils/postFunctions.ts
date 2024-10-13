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
    SELECT * FROM cw_posts
    WHERE user_id NOT IN (SELECT unnest($1::bigint[]))
    AND genre_id NOT IN (SELECT unnest($2::bigint[]))
    ORDER BY created_at DESC
    LIMIT $3 OFFSET $4`,
    [skipUserIds, skipGenreIds, limit, offset]
  );
  const posts = response.rows as Post[];

  const totalResponse = await db.query(`
    SELECT COUNT(*) FROM cw_posts
    WHERE user_id NOT IN (SELECT unnest($1::bigint[]))
    AND genre_id NOT IN (SELECT unnest($2::bigint[]))`,
    [skipUserIds, skipGenreIds]
  );
  const totalPosts = parseInt(totalResponse.rows[0].count);

  return {
    data: posts,
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
    SELECT * FROM cw_posts
    WHERE user_id = $1
    AND genre_id NOT IN (SELECT unnest($2::bigint[]))
    ORDER BY created_at DESC
    LIMIT $3 OFFSET $4`,
    [userId, skipGenreIds, limit, offset]
  );
  const posts = response.rows as Post[];
  
  const totalResponse = await db.query(`
    SELECT COUNT(*) FROM cw_posts
    WHERE user_id = $1
    AND genre_id NOT IN (SELECT unnest($2::bigint[]))`,
    [userId, skipGenreIds]
  );
  const totalPosts = parseInt(totalResponse.rows[0].count);

  return {
    data: posts,
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
    SELECT * FROM cw_posts
    WHERE genre_id = $1
    AND user_id NOT IN (SELECT unnest($2::bigint[]))
    ORDER BY created_at DESC
    LIMIT $3 OFFSET $4`,
    [genreId, skipUserIds, limit, offset]
  );
  const posts = response.rows as Post[];
  
  const totalResponse = await db.query(`
    SELECT COUNT(*) FROM cw_posts
    WHERE genre_id = $1
    AND user_id NOT IN (SELECT unnest($2::bigint[]))`,
    [genreId, skipUserIds]
  );
  const totalPosts = parseInt(totalResponse.rows[0].count);

  return {
    data: posts,
    pagination: { 
      totalPosts: totalPosts, 
      currentPage: page, 
      totalPages: Math.ceil(totalPosts / limit),
      pageSize: limit
    }
  }
}

export async function getPostsCustom(
  userDbId: number, 
  genreId: number,
  page: number = 1,
  limit: number = 10
) {
  "use server";

  const offset = (page-1)*limit;
  const response = await db.query(`
    SELECT * FROM cw_posts
    WHERE user_id = $1
    AND genre_id = $2
    ORDER BY created_at DESC
    LIMIT $3 OFFSET $4`,
    [userDbId, genreId, limit, offset]
  );
  const posts = response.rows as Post[];
  
  const totalResponse = await db.query(`
    SELECT COUNT(*) FROM cw_posts
    WHERE user_id = $1
    AND genre_id = $2`,
    [userDbId, genreId]
  );
  const totalPosts = parseInt(totalResponse.rows[0].count);

  return {
    data: posts,
    pagination: { 
      totalPosts: totalPosts, 
      currentPage: page, 
      totalPages: Math.ceil(totalPosts / limit),
      pageSize: limit
    }
  }
}

export async function getPostsArray(postIds: number[]) {
  "use server";

  const response = await db.query(`
    SELECT * FROM cw_posts
    WHERE id = ANY($1::bigint[])
    ORDER BY created_at DESC`,
    [postIds]
  );
  const posts = response.rows as Post[];
  return posts;
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
    SELECT * FROM cw_comments
    WHERE post_id = $1
    AND user_id NOT IN (SELECT unnest($2::bigint[]))
    ORDER BY created_at DESC
    LIMIT $3 OFFSET $4`,
    [postId, skipUserIds, limit, offset]
  );
  const comments = response.rows;
  
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
    SELECT * FROM cw_comments
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  const comments = response.rows;
  
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

export async function getSavedPosts(
  userId: number,
) {
  "use server";

  const response = await db.query(`
    SELECT saved_posts FROM cw_users
    WHERE id = $1`,
    [userId]
  );
  const savedPosts = response.rows;
    return savedPosts
}

export async function getLikedComments(
  userId: number,
  page=1,
  limit=10
) {
  "use server";

  const offset = (page-1)*limit;
  const response = await db.query(`
    SELECT * FROM cw_comments
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  const likedComments = response.rows;
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
export async function insertPost(postData: Omit<Post, 'id'>) {
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

export async function insertComment(commentData: Comment) {
  "use server";

  await db.query(`
    INSERT INTO cw_comments 
    (user_id, post_id, content)
    VALUES ($1, $2, $3)`,
    [
      commentData.userId,
      commentData.postId,
      commentData.content,
    ]
  );
}


/// UPDATE
export async function updatePost(
  postId: number, 
  postData: Post
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
    WHERE post_id = $6`,
    [
      postData.artist,
      postData.title,
      postData.genreId,
      postData.link,
      postData.content,
      postId
    ]
  );
}

export async function updateComment(
  commentId: number, 
  commentData: Comment
) {
  "use server";

  await db.query(`
    UPDATE cw_comments
    SET content = $1
    WHERE comment_id = $2`,
    [commentData.content, commentId]
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
      WHERE post_id = $1`,
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
      WHERE post_id = $1`,
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
      INSERT INTO cw_liked_comments 
      (user_id, comment_id)
      VALUES ($1, $2)`,
      [userId, commentId]
    );
    await db.query(`
      UPDATE cw_comments
      SET like_count = like_count + 1
      WHERE comment_id = $1`,
      [commentId]
    );
  }
  else {
    await db.query(`
      DELETE FROM cw_liked_comments
      WHERE user_id = $1
      AND comment_id = $2`,
      [userId, commentId]
    );
    await db.query(`
      UPDATE cw_comments
      SET like_count = like_count - 1
      WHERE comment_id = $1`,
      [commentId]
    );
  }
}


/// DELETE
export async function deletePost(postId: number) {
  "use server";

  await db.query(`
    DELETE FROM cw_posts
    WHERE post_id = $1`,
    [postId]
  );
}

export async function deleteComment(commentId: number) {
  "use server";

  await db.query(`
    DELETE FROM cw_comments
    WHERE comment_id = $1`,
    [commentId]
  );
}

