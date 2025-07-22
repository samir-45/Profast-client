// hooks/useUserRole.js
import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure'; // your axios instance

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: role = 'user', isLoading, refetch } = useQuery({
    queryKey: ['userRole', user?.email],
    enabled: !!user?.email && !authLoading,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/role/${user.email}`);
      return res.data.role;
    },
  });

  return { role, roleLoading: isLoading || authLoading, refetch };
};

export default useUserRole;
