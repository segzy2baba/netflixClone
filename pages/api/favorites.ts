import { NextApiRequest, NextApiResponse } from "next";
import { isEmpty } from "lodash";
import prismadb from '@/libs/prismadb';
import serverAuth from "@/libs/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).end();
    }

    const { currentUser } = await serverAuth(req, res);
    

    const favoritedMovies = await prismadb.favorite.findMany({
      where: {
        // where: { published: true },
      //  include: { author: true },
        id: {
          in: currentUser?.id,
        }
      },
      include: { movie: true },
    });

    const movies = favoritedMovies.map(favorite => favorite.movie);

    // const favoritedstatus = favoritedMovies.status
    const data = {
      favoritedMovies,
      movies
    };

    const responseData = isEmpty(data) ? { error: "No data found" } : data;

    // const movies = favoritedMovies.map(favorite => favorite.movie);

    return res.status(200).json( responseData);
  } catch (error) {
    console.log(error);
    return res.status(500).end();
  }
}
