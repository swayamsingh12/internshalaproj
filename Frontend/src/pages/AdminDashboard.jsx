import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import Loading from '../components/Loading';
import StarRating from '../components/StarRating';
import { toast } from '../components/ToastContainer';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: null,
  });
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'normal',
  });
  const [assignData, setAssignData] = useState({
    email: '',
    users: [],
    selectedUserId: null,
  });
  const [storeOwnerSearch, setStoreOwnerSearch] = useState({
    email: '',
    users: [],
    selectedUserId: null,
  });

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllStores();
      setStores(response.data);
    } catch (error) {
      toast('Failed to load stores', 'error');
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    try {
      const storeData = {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        ownerId: storeOwnerSearch.selectedUserId || null,
      };
      await adminAPI.createStore(storeData);
      toast('Store created successfully!', 'success');
      setIsModalOpen(false);
      setFormData({ name: '', email: '', address: '', ownerId: null });
      setStoreOwnerSearch({ email: '', users: [], selectedUserId: null });
      fetchStores();
    } catch (error) {
      toast(error.response?.data?.error || 'Failed to create store', 'error');
    }
  };

  const handleSearchStoreOwner = async () => {
    if (!storeOwnerSearch.email) {
      toast('Please enter an email to search', 'warning');
      return;
    }
    try {
      const response = await adminAPI.searchUsers(storeOwnerSearch.email);
      setStoreOwnerSearch((prev) => ({
        ...prev,
        users: response.data || [],
      }));
    } catch (error) {
      toast('Failed to search users', 'error');
    }
  };

  const handleEditStore = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.updateStore(selectedStore.id, formData);
      toast('Store updated successfully!', 'success');
      setIsEditModalOpen(false);
      setSelectedStore(null);
      setFormData({ name: '', email: '', address: '' });
      fetchStores();
    } catch (error) {
      toast(error.response?.data?.error || 'Failed to update store', 'error');
    }
  };

  const handleDeleteStore = async (id) => {
    if (!window.confirm('Are you sure you want to delete this store?')) {
      return;
    }
    try {
      await adminAPI.deleteStore(id);
      toast('Store deleted successfully!', 'success');
      fetchStores();
    } catch (error) {
      toast(error.response?.data?.error || 'Failed to delete store', 'error');
    }
  };

  const handleOpenEdit = (store) => {
    setSelectedStore(store);
    setFormData({
      name: store.name || '',
      email: store.email || '',
      address: store.address || '',
    });
    setIsEditModalOpen(true);
  };

  const handleSearchUsers = async () => {
    if (!assignData.email) {
      toast('Please enter an email to search', 'warning');
      return;
    }
    try {
      const response = await adminAPI.searchUsers(assignData.email);
      setAssignData((prev) => ({
        ...prev,
        users: response.data || [],
      }));
    } catch (error) {
      toast('Failed to search users', 'error');
    }
  };

  const handleAssignOwner = async () => {
    if (!selectedStore || !assignData.selectedUserId) {
      toast('Please select a user', 'warning');
      return;
    }
    try {
      await adminAPI.assignOwner(selectedStore.id, assignData.selectedUserId);
      toast('Owner assigned successfully!', 'success');
      setIsAssignModalOpen(false);
      setAssignData({ email: '', users: [], selectedUserId: null });
      setSelectedStore(null);
      fetchStores();
    } catch (error) {
      toast(error.response?.data?.error || 'Failed to assign owner', 'error');
    }
  };

  const handleOpenAssign = (store) => {
    setSelectedStore(store);
    setIsAssignModalOpen(true);
  };

  const handleCreateUser = async (e) => {



    e.preventDefault();
    try {
      alert("hello");
      await adminAPI.createUser(userFormData);
      toast('User created successfully!', 'success');
      setIsUserModalOpen(false);
      setUserFormData({
        name: '',
        email: '',
        address: '',
        password: '',
        role: 'normal',
      });
    } catch (error) {
      toast(error.response?.data?.error || 'Failed to create user', 'error');
    }
  };

  if (loading) {
    return <Loading message="Loading stores..." />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome, {user?.name}!</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                console.log('Add User button clicked');
                setIsUserModalOpen(true);
              }}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition cursor-pointer"
            >
              Add User
            </button>
            <button
              type="button"
              onClick={() => {
           
                setIsModalOpen(true);
              }}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition cursor-pointer"
            >
              Add New Store
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">{store.name}</h3>
              <p className="text-gray-600 text-sm mb-2">
                <span className="font-semibold">Address:</span> {store.address || 'N/A'}
              </p>
              {store.email && (
                <p className="text-gray-600 text-sm mb-4">
                  <span className="font-semibold">Email:</span> {store.email}
                </p>
              )}

              {store.avgRating !== undefined && (
                <div className="border-t pt-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating
                      rating={parseFloat(store.avgRating || 0)}
                      readonly
                      size="text-lg"
                    />
                    <span className="text-gray-700 font-semibold">
                      {parseFloat(store.avgRating || 0).toFixed(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Reviews: <span className="font-semibold">{store.ratingsCount || 0}</span>
                  </p>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    console.log('Edit button clicked for store:', store.id);
                    handleOpenEdit(store);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm cursor-pointer"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    console.log('Assign Owner button clicked for store:', store.id);
                    handleOpenAssign(store);
                  }}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition text-sm cursor-pointer"
                >
                  Assign Owner
                </button>
                <button
                  type="button"
                  onClick={() => {
                    console.log('Delete button clicked for store:', store.id);
                    handleDeleteStore(store.id);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {stores.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">No stores found. Create your first store!</p>
          </div>
        )}

        {/* Create Store Modal */}
        {isModalOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsModalOpen(false);
                setFormData({ name: '', email: '', address: '', ownerId: null });
                setStoreOwnerSearch({ email: '', users: [], selectedUserId: null });
              }
            }}
          >
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Create New Store</h2>
              <form onSubmit={handleCreateStore}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Store Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter store name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="store@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter store address"
                    />
                  </div>

                  {/* Owner Assignment Section */}
                  <div className="border-t pt-4 mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assign Owner (Optional)
                    </label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={storeOwnerSearch.email}
                          onChange={(e) =>
                            setStoreOwnerSearch({ ...storeOwnerSearch, email: e.target.value })
                          }
                          placeholder="Search owner by email"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={handleSearchStoreOwner}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                          Search
                        </button>
                      </div>

                      {storeOwnerSearch.users.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Owner:
                          </label>
                          <select
                            value={storeOwnerSearch.selectedUserId || ''}
                            onChange={(e) =>
                              setStoreOwnerSearch({
                                ...storeOwnerSearch,
                                selectedUserId: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">No owner (leave unassigned)</option>
                            {storeOwnerSearch.users
                              .filter((user) => user.role === 'store_owner' || user.role === 'admin')
                              .map((user) => (
                                <option key={user.id} value={user.id}>
                                  {user.name} ({user.email}) - {user.role}
                                </option>
                              ))}
                          </select>
                        </div>
                      )}

                      {storeOwnerSearch.users.length === 0 && storeOwnerSearch.email && (
                        <p className="text-sm text-gray-600">
                          No users found. Try a different email or leave unassigned.
                        </p>
                      )}

                      {storeOwnerSearch.selectedUserId && (
                        <div className="p-2 bg-green-50 border border-green-200 rounded">
                          <p className="text-sm text-green-700">
                            ✓ Owner will be assigned to this store
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setFormData({ name: '', email: '', address: '', ownerId: null });
                      setStoreOwnerSearch({ email: '', users: [], selectedUserId: null });
                    }}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    Create Store
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Store Modal */}
        {isEditModalOpen && selectedStore && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsEditModalOpen(false);
                setSelectedStore(null);
              }
            }}
          >
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-4">Edit Store</h2>
              <form onSubmit={handleEditStore}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Store Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setSelectedStore(null);
                      setFormData({ name: '', email: '', address: '' });
                    }}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create User Modal */}
        {isUserModalOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsUserModalOpen(false);
              }
            }}
          >
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-4">Create New User</h2>
              <form onSubmit={handleCreateUser}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={userFormData.name}
                      onChange={(e) =>
                        setUserFormData({ ...userFormData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={userFormData.email}
                      onChange={(e) =>
                        setUserFormData({ ...userFormData, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={userFormData.address}
                      onChange={(e) =>
                        setUserFormData({ ...userFormData, address: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={userFormData.password}
                      onChange={(e) =>
                        setUserFormData({ ...userFormData, password: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role *
                    </label>
                    <select
                      value={userFormData.role}
                      onChange={(e) =>
                        setUserFormData({ ...userFormData, role: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="normal">Normal User</option>
                      <option value="store_owner">Store Owner</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserModalOpen(false);
                      setUserFormData({
                        name: '',
                        email: '',
                        address: '',
                        password: '',
                        role: 'normal',
                      });
                    }}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                  >
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Assign Owner Modal */}
        {isAssignModalOpen && selectedStore && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsAssignModalOpen(false);
                setSelectedStore(null);
              }
            }}
          >
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-4">Assign Owner to {selectedStore.name}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search by Email
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={assignData.email}
                      onChange={(e) =>
                        setAssignData({ ...assignData, email: e.target.value })
                      }
                      placeholder="user@example.com"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleSearchUsers}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Search
                    </button>
                  </div>
                </div>

                {assignData.users.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select User:
                    </label>
                    <select
                      value={assignData.selectedUserId || ''}
                      onChange={(e) =>
                        setAssignData({ ...assignData, selectedUserId: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a user...</option>
                      {assignData.users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email}) - {user.role}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {assignData.users.length === 0 && assignData.email && (
                  <p className="text-sm text-gray-600">No users found. Try a different email.</p>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsAssignModalOpen(false);
                    setSelectedStore(null);
                    setAssignData({ email: '', users: [], selectedUserId: null });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAssignOwner}
                  disabled={!assignData.selectedUserId}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition disabled:bg-gray-400"
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

