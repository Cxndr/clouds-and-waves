export type Profile = {
  id: number,
  username: string,
  bio: string,
  posts: object[],
  feedUsers: number[],
  feedGenres: number[],
  savedPosts: object[],
}

