import { NextApiRequest, NextApiResponse } from "next";
// import { without } from "lodash";

import prismadb from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const { currentUser } = await serverAuth(req, res);

      const { movieId } = req.body;


      const existingMovie = await prismadb.movie.findUnique({
        where: { id: Number(movieId) },
      });

      if (!existingMovie) {
        throw new Error("Invalid ID");
      }
      // Number(id)

      // console.log(currentUser.id)
      // const userId = currentUser.id

      const CreateFavourateMovie =  await prismadb.favorite.create({
        data: {
          userId: currentUser?.id,
          movieId: Number(movieId),
        },
      });

      // const updatedUser = await prismadb.user.update({
      //   where: { email: currentUser.email || '' },
      //   data: {
      //     favorites: {
      //       connect: { id: parseInt(movieId, 10) },
      //     },
      //   },
      //   include: { favorites: true },
      // });

  

      return res.status(200).json(CreateFavourateMovie);
    }

    if (req.method === "DELETE") {
      const { currentUser } = await serverAuth(req, res);

      const { movieId } = req.body;

      const existingMovie = await prismadb.movie.findUnique({
        where: {
          id: movieId,
        },
      });

      if (!existingMovie) {
        throw new Error("Invalid ID");
      }

      // const updatedFavoriteIds = without(currentUser.favoriteIds, movieId);
      // favorite

      // const Removefavoritemovie = await prismadb.favorite.delete({
      //   where: {
      //     movieId: Number(movieId),
      //   },
      // })

      const Removefavoritemovie = await prismadb.favorite.delete({
        where: {
          userId_movieId: {
            userId: currentUser.id,
            movieId: Number(movieId),
          },
        },
      });
     

      return res.status(200).json(Removefavoritemovie);
    }

    return res.status(405).end();
  } catch (error) {
    console.log(error);

    return res.status(500).end();
  }
}
