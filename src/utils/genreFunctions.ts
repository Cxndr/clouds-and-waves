/*
  genreFunctions.ts

  Variables output:
    - none needed?

  Functions output:
    - getGenres(): gets all genres from the database. an array with index being same as db index or an object with genreId as key???
    - getGenreName(genreId): gets a genre name from the database.
    - submitGenre(genreName, submitReason): submits a genre to the devs for approval.
*/

import { db } from "./dbConn";

/// READ
export async function getGenres() {
  const response = await db.query(`
    SELECT * FROM cw_genres
  `);
  const genres = response.rows;
  return genres;
}

export async function getGenreName(genreId: number) {
  const response = await db.query(`
    SELECT genre_name FROM cw_genres
    WHERE id = $1`,
    [genreId]
  );
  const genreName = response.rows[0].genre_name;
  return genreName;
}

/// CREATE
export async function submitGenre(userId: number ,genreName: string, submitReason: string) {
  await db.query(`
    INSERT INTO cw_genre_submissions (user_id, genre_name, submit_reason)
    VALUES ($1, $2, $3)`,
    [userId, genreName, submitReason]
  );
}