import axios from 'axios';
import React, { useCallback, useMemo } from 'react';
import { PlusIcon, CheckIcon } from '@heroicons/react/24/outline';

// import useCurrentUser from '@/hooks/useCurrentUser';
import useFavorites from '@/hooks/useFavorites';

interface FavoriteButtonProps {
  movieId: number
}
  // working favourite
const FavoriteButton: React.FC<FavoriteButtonProps> = ({ movieId }) => {
  const {data: favoritesMovie, mutate: mutateFavorites } = useFavorites();




  const isFavorite = useMemo(() => {
    if (favoritesMovie) {
          return favoritesMovie.find(movie => movie.id === movieId);
         }
         return null;
  }, [favoritesMovie, movieId]);

  console.log(favoritesMovie);
  console.log(isFavorite);
  



  const toggleFavorites = useCallback(async () => {
    let response;

    if (isFavorite) {
      response = await axios.delete('/api/favorite', { data: { movieId } });
    } else {
      response = await axios.post('/api/favorite', { movieId });
    }

 
    mutateFavorites();
  }, [movieId, isFavorite, mutateFavorites]);
  
  const Icon = isFavorite ? CheckIcon : PlusIcon;

  return (
    <div onClick={toggleFavorites} className="cursor-pointer group/item w-6 h-6 lg:w-10 lg:h-10 border-white border-2 rounded-full flex justify-center items-center transition hover:border-neutral-300">
      <Icon className="text-white group-hover/item:text-neutral-300 w-4 lg:w-6" />
    </div>
  )
}

export default FavoriteButton