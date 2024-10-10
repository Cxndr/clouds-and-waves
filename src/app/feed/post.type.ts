export type Post = {
  userId: number,
  artist: string,
  title: string,
  genreId: number,
  link: string,
  content: string,
  dateCreated: Date,
  savedCount: number,
  comments: object[],
}