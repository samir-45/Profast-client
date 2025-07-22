import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useTrackingUpdater from "../../../Hooks/useTrackingUpdater";

const TrackParcel = () => {
  const { register, handleSubmit, reset } = useForm();
  const {
    updateTracking,
    loading,
    success,
    error,
    response,
    errorMessage,
  } = useTrackingUpdater();

  const onSubmit = async (data) => {
    try {
      const res = await updateTracking({
        tracking_id: data.tracking_id,
        parcel_id: data.parcel_id,
        status: data.status,
        message: data.message,
        updated_by: data.updated_by || "admin@example.com",
      });

      Swal.fire({
        icon: "success",
        title: "Tracking Updated",
        text: `Tracking info added successfully!`,
        timer: 2000,
        showConfirmButton: false,
      });

      reset();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: errorMessage || "Something went wrong!",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl mx-auto bg-base-200 p-6 m-10 rounded-lg space-y-4"
    >
      <input
        {...register("tracking_id", { required: true })}
        className="input input-bordered w-full"
        placeholder="Tracking ID"
      />
      <input
        {...register("parcel_id", { required: true })}
        className="input input-bordered w-full"
        placeholder="Parcel ID"
      />
      <input
        {...register("status", { required: true })}
        className="input input-bordered w-full"
        placeholder="Status"
      />
      <input
        {...register("message", { required: true })}
        className="input input-bordered w-full"
        placeholder="Message"
      />
      <input
        {...register("updated_by")}
        className="input input-bordered w-full"
        placeholder="Updated By (optional)"
      />

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Tracking"}
      </button>
    </form>
  );
};

export default TrackParcel;