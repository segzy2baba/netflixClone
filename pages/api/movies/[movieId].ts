import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/libs/prismadb';
// import serverAuth from "@/libs/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).end();
    }

    // await serverAuth(req, res);

    const { movieId } = req.query;

    if (typeof movieId !== 'string') {
      throw new Error('Invalid Id');
    }

    const id:number = parseInt(movieId, 10);

    if (isNaN(id)) {
      throw new Error('Invalid Id');
    }

    

    const movies = await prismadb.movie.findUnique({
      where: {
        id: id
      }
    });


    // console.log("out put mobie")
    // console.log(movies)

    return res.status(200).json(movies);
  } catch (error) {
    console.log(error);
    // return res.status(500).end();
  }
}
