import useAxiosSecure from "./useAxiosSecure";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useTrackingUpdater = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    mutateAsync: updateTracking,
    isPending: loading,
    isSuccess: success,
    isError: error,
    data: response,
    error: errorData,
  } = useMutation({
    mutationFn: async (trackingData) => {
      const res = await axiosSecure.post("/tracking", trackingData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tracking"]);
    },
  });

  return {
    updateTracking,
    loading,
    error,
    success,
    response,
    errorMessage: errorData?.response?.data?.error || null,
  };
};

export default useTrackingUpdater;