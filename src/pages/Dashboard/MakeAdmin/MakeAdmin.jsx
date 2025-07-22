import { useState, useEffect } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { FaUserShield, FaUserMinus } from "react-icons/fa";
import Swal from "sweetalert2";

const ManageAdmins = () => {
  const axiosSecure = useAxiosSecure();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounce search (300ms)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        fetchUsers(query);
      } else {
        setUsers([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const fetchUsers = async (email) => {
    try {
      setLoading(true);
      const res = await axiosSecure.get(`/users/search?email=${email}`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (user, newRole) => {
    const confirm = await Swal.fire({
      title: `Change role to "${newRole}"?`,
      text: `Are you sure you want to update ${user.email}'s role?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Update",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/users/${user._id}`, {
          role: newRole,
        });

        if (res.data.modifiedCount > 0) {
          Swal.fire("Updated!", `${user.email} is now ${newRole}.`, "success");
          fetchUsers(query); // refresh list
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to update role", "error");
      }
    }
  };

  return (
    <div className="max-w-4xl px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Manage Admins</h2>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by email..."
        className="input input-bordered w-full max-w-lg mb-4"
      />

      {loading ? (
        <p>Searching...</p>
      ) : users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Email</th>
                <th>Created At</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.email}</td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>{u.role || "user"}</td>
                  <td>
                    {u.role === "admin" ? (
                      <button
                        onClick={() => handleRoleUpdate(u, "user")}
                        className="btn btn-sm btn-warning"
                      >
                        <FaUserMinus className="mr-1" /> Remove Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRoleUpdate(u, "admin")}
                        className="btn btn-sm btn-success"
                      >
                        <FaUserShield className="mr-1" /> Make Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : query.trim() && !loading ? (
        <p>No users found.</p>
      ) : null}
    </div>
  );
};

export default ManageAdmins;
