import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaTrashAlt } from "react-icons/fa";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const ActiveRiders = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: riders = [], isLoading } = useQuery({
    queryKey: ["activeRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders?status=active");
      return res.data;
    },
  });

  const handleDeactivate = (rider) => {
    Swal.fire({
      title: `Deactivate ${rider.name}?`,
      text: "The rider will no longer be able to access the rider system.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, deactivate",
      confirmButtonColor: "#dc2626",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.patch(`/riders/${rider._id}`, { status: "deactivated" });
          Swal.fire("Success", "Rider deactivated", "success");
          queryClient.invalidateQueries(["activeRiders"]);
        } catch (err) {
            console.log(err)
          Swal.fire("Error", "Failed to deactivate", "error");
        }
      }
    });
  };

  const filteredRiders = riders.filter((rider) =>
    rider.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Active Riders</h2>

      <input
        type="text"
        placeholder="Search by name"
        className="input input-bordered mb-4 w-full max-w-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Region</th>
                <th>District</th>
                <th>Bike</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRiders.map((rider, index) => (
                <tr key={rider._id}>
                  <td>{index + 1}</td>
                  <td>{rider.name}</td>
                  <td>{rider.email}</td>
                  <td>{rider.phone}</td>
                  <td>{rider.region}</td>
                  <td>{rider.district}</td>
                  <td>{rider.bike_brand} - {rider.bike_number}</td>
                  <td>
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => handleDeactivate(rider)}
                    >
                      <FaTrashAlt className="mr-1" /> Deactivate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredRiders.length === 0 && <p className="text-center mt-4">No riders found.</p>}
        </div>
      )}
    </div>
  );
};

export default ActiveRiders;
