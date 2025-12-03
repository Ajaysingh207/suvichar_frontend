import React, { useEffect, useState } from "react";
import { 
  Users, 
  MessageSquare, 
  Shield, 
  TrendingUp, 
  Search, 
  Filter,
  MoreVertical,
  UserCheck,
  UserX,
  Trash2,
  Edit,
  Eye,
  Download,
  RefreshCw,
  BarChart3,
  Activity,
  Clock,
  AlertCircle
} from "lucide-react";

export default function AdminDashboard() {
  const API_URL = 'http://localhost:3000/api';
  
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    totalMessages: 0
  });
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

 
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Fetch users
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/allusers`, { credentials: 'include' });
      const result = await res.json();
      const users = result.users || result.user || [];
      setData(users);
      setFilteredData(users);
      
      // Calculate stats
      setStats({
        totalUsers: users.length,
        activeUsers: users.filter(u => u.isActive !== false).length,
        blockedUsers: users.filter(u => u.isBlocked).length,
        totalMessages: users.reduce((acc, u) => acc + (u.messageCount || 0), 0)
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      showNotification("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  // Search and filter
  useEffect(() => {
    let filtered = data;

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

   
    if (filterStatus === 'active') {
      filtered = filtered.filter(u => u.isActive !== false && !u.isBlocked);
    } else if (filterStatus === 'blocked') {
      filtered = filtered.filter(u => u.isBlocked);
    } else if (filterStatus === 'inactive') {
      filtered = filtered.filter(u => u.isActive === false);
    }

    setFilteredData(filtered);
  }, [searchQuery, filterStatus, data]);

  // Block/Unblock user
  const toggleBlockUser = async (userId, isBlocked) => {
    try {
      const endpoint = isBlocked ? 'unblockUser' : 'blockUser';
      const res = await fetch(`${API_URL}/block/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId: localStorage.getItem('user'), blockId: userId })
      });

      if (res.ok) {
        showNotification(`User ${isBlocked ? 'unblocked' : 'blocked'} successfully`);
        fetchData();
      }
    } catch (error) {
      console.error('Error toggling block:', error);
      showNotification("Failed to update user status", "error");
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      const res = await fetch(`${API_URL}/user/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (res.ok) {
        showNotification('User deleted successfully');
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showNotification("Failed to delete user", "error");
    }
  };

  // Bulk actions
  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) {
      showNotification("No users selected", "error");
      return;
    }

    if (!window.confirm(`Are you sure you want to ${action} ${selectedUsers.length} users?`)) return;

    try {
      await Promise.all(selectedUsers.map(userId => {
        if (action === 'block') return toggleBlockUser(userId, false);
        if (action === 'delete') return deleteUser(userId);
      }));
      setSelectedUsers([]);
      fetchData();
    } catch (error) {
      console.error('Bulk action error:', error);
      showNotification("Bulk action failed", "error");
    }
  };

  // Export data
  const exportToCSV = () => {
    const csv = [
      ['Name', 'Username', 'Email', 'Status', 'Friends', 'Created'],
      ...filteredData.map(u => [
        u.name,
        u.userName,
        u.email || 'N/A',
        u.isBlocked ? 'Blocked' : u.isActive ? 'Active' : 'Inactive',
        u.friends?.length || 0,
        new Date(u.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_export.csv';
    a.click();
    showNotification('Data exported successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white animate-fade-in`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Manage users and monitor system activity</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={fetchData}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+12% from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeUsers}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              <span>{Math.round((stats.activeUsers / stats.totalUsers) * 100)}% active</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Blocked Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.blockedUsers}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span>Requires attention</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Messages</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalMessages.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-purple-600">
              <BarChart3 className="w-4 h-4 mr-1" />
              <span>Avg: {Math.round(stats.totalMessages / stats.totalUsers)} per user</span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name, username, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Users</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
                <option value="inactive">Inactive</option>
              </select>
              {selectedUsers.length > 0 && (
                <>
                  <button
                    onClick={() => handleBulkAction('block')}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                  >
                    Block ({selectedUsers.length})
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Delete ({selectedUsers.length})
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredData.length && filteredData.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers(filteredData.map(u => u._id));
                          } else {
                            setSelectedUsers([]);
                          }
                        }}
                        className="rounded"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">User</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Username</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Friends</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Joined</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, user._id]);
                            } else {
                              setSelectedUsers(selectedUsers.filter(id => id !== user._id));
                            }
                          }}
                          className="rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              user.image
                                ? `http://localhost:3000/uploads/${user.image}`
                                : `https://ui-avatars.com/api/?name=${user.name}&size=40&background=4f46e5&color=fff`
                            }
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email || 'No email'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">@{user.userName}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.isBlocked
                            ? 'bg-red-100 text-red-700'
                            : user.isActive !== false
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {user.isBlocked ? 'Blocked' : user.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{user.friends?.length || 0}</td>
                      <td className="px-4 py-3 text-gray-700 text-sm">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserModal(true);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => toggleBlockUser(user._id, user.isBlocked)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                            title={user.isBlocked ? 'Unblock' : 'Block'}
                          >
                            {user.isBlocked ? (
                              <UserCheck className="w-4 h-4 text-green-600" />
                            ) : (
                              <UserX className="w-4 h-4 text-orange-600" />
                            )}
                          </button>
                          <button
                            onClick={() => deleteUser(user._id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredData.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No users found</p>
                  <p className="text-sm mt-2">Try adjusting your filters or search query</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowUserModal(false)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">User Details</h2>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={
                    selectedUser.image
                      ? `http://localhost:3000/uploads/${selectedUser.image}`
                      : `https://ui-avatars.com/api/?name=${selectedUser.name}&size=100&background=4f46e5&color=fff`
                  }
                  alt={selectedUser.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
                />
                <div>
                  <h3 className="text-xl font-bold">{selectedUser.name} {selectedUser.surname}</h3>
                  <p className="text-gray-600">@{selectedUser.userName}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                    selectedUser.isBlocked
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {selectedUser.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-medium">{selectedUser.email || 'Not provided'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <p className="font-medium">{selectedUser.phone || 'Not provided'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Friends</p>
                  <p className="font-medium">{selectedUser.friends?.length || 0} friends</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Joined</p>
                  <p className="font-medium">
                    {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    toggleBlockUser(selectedUser._id, selectedUser.isBlocked);
                    setShowUserModal(false);
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg text-white transition ${
                    selectedUser.isBlocked
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-orange-500 hover:bg-orange-600'
                  }`}
                >
                  {selectedUser.isBlocked ? 'Unblock User' : 'Block User'}
                </button>
                <button
                  onClick={() => {
                    deleteUser(selectedUser._id);
                    setShowUserModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}