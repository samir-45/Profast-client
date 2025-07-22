import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure'; // adjust the path if needed

const useSearchRiders = (searchTerm) => {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ['searchRiders', searchTerm],
    enabled: !!searchTerm && searchTerm.length > 0,
    queryFn: async () => {
      const res = await axiosSecure.get(`/riders/search?name=${searchTerm}`);
      return res.data;
    }
  });
};

export default useSearchRiders;
