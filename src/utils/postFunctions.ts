/*
postFunctions.ts

Variables output:
  - none needed?

Functions output:

  *** GETS *** 
    (these should also get comments as array of objects in the object returned.)
  - getPostsAll([skipUserIds]=null, [skipGenreIds=null]): gets all posts from database.
  - getPostsUser(userId, [skipGenreIds]=null): gets all posts from a specific user, except optional skips.
  - getPostsGenre(genreId, [skipUserIds]=null): gets all posts from a specific genre.
  - getPostsCustom([userDbId, genreId]): gets all posts from specific users and genres.

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

