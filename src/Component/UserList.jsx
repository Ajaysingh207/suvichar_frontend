import React, { useEffect,  useState } from "react";
import { MessageCircle, Send, Users, UserPlus, X, Check, Search, User, LogOut, Menu, Upload } from 'lucide-react';

export default function UserList({ onSelect, activeChat }) {
 const API_URL = import.meta.env.VITE_API_URL;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
  // State management
  const [users, setUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [lastMessages, setLastMessages] = useState({});
  const [onlineUsers, setOnlineUsers] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [open, setOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [singleUser, setSingleUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [friendRequests, setFriendRequests] = useState([]);
  const [showRequests, setShowRequests] = useState(false);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [socket, setSocket] = useState(null);
  const [notification, setNotification] = useState(null);

  const myId = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Initialize Socket.IO
  useEffect(() => {
    if (!myId) return;

    const initSocket = async () => {
      try {
        // Dynamically load socket.io-client
        const io = await import('https://cdn.socket.io/4.5.4/socket.io.esm.min.js').then(m => m.io);
        const newSocket = io(SOCKET_URL, { withCredentials: true });

        newSocket.on('connect', () => {
          console.log('Socket connected');
          newSocket.emit('userOnline', myId);
        });

        newSocket.on('onlineUsers', (arr) => {
          const map = {};
          arr.forEach((id) => (map[id] = true));
          setOnlineUsers(map);
        });

        newSocket.on('typing', ({ from }) => {
          setTypingUsers((prev) => ({ ...prev, [from]: true }));
        });

        newSocket.on('stopTyping', ({ from }) => {
          setTypingUsers((prev) => ({ ...prev, [from]: false }));
        });

        newSocket.on('newMessageNotification', (payload) => {
          const from = payload.from;
          if (from !== activeChat) {
            setUnreadCounts((prev) => ({ ...prev, [from]: (prev[from] || 0) + 1 }));
          }
          setLastMessages((prev) => ({
            ...prev,
            [from]: { text: payload.message, createdAt: payload.createdAt },
          }));
          setUsers((prev) => {
            const user = prev.find((u) => u._id === from);
            if (!user) return prev;
            return [user, ...prev.filter((u) => u._id !== from)];
          });
        });

        newSocket.on('receiveMessage', (msg) => {
          const otherId = msg.sender === myId ? msg.receiver : msg.sender;
          setLastMessages((prev) => ({
            ...prev,
            [otherId]: { text: msg.message, createdAt: msg.createdAt },
          }));
          if (msg.sender !== myId && activeChat !== msg.sender) {
            setUnreadCounts((prev) => ({
              ...prev,
              [msg.sender]: (prev[msg.sender] || 0) + 1,
            }));
          }
          setUsers((prev) => {
            const user = prev.find((u) => u._id === otherId);
            if (!user) return prev;
            return [user, ...prev.filter((u) => u._id !== otherId)];
          });
        });

        setSocket(newSocket);
      } catch (error) {
        console.error('Socket initialization error:', error);
      }
    };

    initSocket();

    return () => {
      if (socket) {
        socket.emit('userOffline', myId);
        socket.disconnect();
      }
    };
  }, [myId]);

  // Load current user data
  const loadMyData = async () => {
    if (!myId) return;
    try {
      const res = await fetch(`${API_URL}/api/user/${myId}`, { credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.user) {
        setSingleUser(data.user);
        setFriendRequests(data.user.friendRequests?.received || []);
        setFriends(data.user.friends || []);
        setBlockedUsers(data.user.blockedUsers || []);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  useEffect(() => {
    loadMyData();
  }, [myId]);

  // Load all users
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/allusers`, { credentials: 'include' });
        const data = await res.json();
        if (res.ok) {
          let list = data.users || data.user || [];
          list = list.filter((u) => u._id !== myId);
          setUsers(list);
        }
      } catch (error) {
        console.error("Error loading users:", error);
      }
    };
    load();
  }, [myId]);

  const handleSelect = (u) => {
    onSelect(u);
    setUnreadCounts((prev) => ({ ...prev, [u._id]: 0 }));
    setTypingUsers((prev) => ({ ...prev, [u._id]: false }));
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_URL}/api/logout`, {
        method: 'POST',
        credentials: 'include'
      });

      if (res.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        showNotification("Logged out successfully");
        window.location.href = "/";
      }
    } catch (error) {
      showNotification("Logout failed", "error");
      console.error("Logout error:", error);
    }
  };

  // Friend request actions
  const sendFriendRequest = async (toUserId) => {
    try {
      const res = await fetch(`${API_URL}/api/friend/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ from: myId, to: toUserId })
      });
      const data = await res.json();
      showNotification(data.message || "Friend request sent!");
      loadMyData();
    } catch (err) {
      console.error('Error sending friend request:', err);
      showNotification("Failed to send friend request", "error");
    }
  };

  const acceptFriendRequest = async (fromUserId) => {
    try {
      const res = await fetch(`${API_URL}/api/friend/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ from: fromUserId, to: myId })
      });
      if (res.ok) {
        showNotification('Friend request accepted!');
        loadMyData();
      }
    } catch (err) {
      console.error('Error accepting friend request:', err);
      showNotification("Failed to accept friend request", "error");
    }
  };

  const rejectFriendRequest = async (fromUserId) => {
    try {
      const res = await fetch(`${API_URL}/api/friend/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ from: fromUserId, to: myId })
      });
      if (res.ok) {
        showNotification('Friend request rejected');
        loadMyData();
      }
    } catch (err) {
      console.error('Error rejecting friend request:', err);
      showNotification("Failed to reject friend request", "error");
    }
  };

  const blockUser = async (blockId) => {
    if (!window.confirm('Are you sure you want to block this user?')) return;
    
    try {
      const res = await fetch(`${API_URL}/api/block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId: myId, blockId })
      });
      if (res.ok) {
        showNotification('User blocked successfully');
        loadMyData();
      }
    } catch (err) {
      console.error('Error blocking user:', err);
      showNotification("Failed to block user", "error");
    }
  };

  const unblockUser = async (blockId) => {
    try {
      const res = await fetch(`${API_URL}/api/unblock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId: myId, blockId })
      });
      if (res.ok) {
        showNotification('User unblocked successfully');
        loadMyData();
      }
    } catch (err) {
      console.error('Error unblocking user:', err);
      showNotification("Failed to unblock user", "error");
    }
  };
 
  // Handle profile image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
 
    try {
      const res = await fetch(`${API_URL}/api/updateProfilePic`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (res.ok) {
        showNotification('Profile picture updated!');
        loadMyData();
      }
    } catch (error) {
      console.error('Upload error:', error);
      showNotification('Failed to upload image', 'error');
    }
  };

  // Filter users based on search and view mode
  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.userName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const friendsList = users.filter(u => 
    friends.includes(u._id) && 
    !blockedUsers.includes(u._id) &&
    (u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     u.userName?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const displayUsers = showAllUsers ? filteredUsers : friendsList;

  const isFriend = (userId) => friends.includes(userId);
  const isBlocked = (userId) => blockedUsers.includes(userId);

  return (
    <div className="w-80 border-r border-gray-200 flex flex-col h-screen bg-white">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white animate-fade-in`}>
          {notification.message}
        </div>
      )}

      {/* Header Section */}
      <div className="p-3 border-b bg-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <p className="text-xl text-orange-500 font-bold">Suvichar</p>
          </div>
          <Menu
            size={20}
            className="cursor-pointer text-gray-600 hover:text-gray-800"
            onClick={() => setOpen(!open)}
          />
        </div>

        {/* Dropdown Menu */}
        {open && (
          <div className="absolute left-64 top-16 bg-white shadow-lg rounded-md w-40 p-2 z-50 border">
            <ul className="flex flex-col gap-1">
              <li
                className="p-2 hover:bg-gray-100 cursor-pointer rounded flex items-center gap-2"
                onClick={() => setOpenProfile(!openProfile)}
              >
                <User className="w-4 h-4" />
                Profile
              </li>
              <li className="p-2 hover:bg-gray-100 cursor-pointer rounded flex items-center gap-2">
                <Search className="w-4 h-4" />
                Settings
              </li>
              <li
                className="p-2 hover:bg-gray-100 cursor-pointer rounded text-red-600 flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </li>
            </ul>
          </div>
        )}

        {/* Profile Modal */}
        {openProfile && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setOpenProfile(false)}
          >
            <div
              className="bg-white rounded-lg p-6 w-96 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Profile</h2>
                <X
                  className="cursor-pointer hover:text-red-500"
                  onClick={() => setOpenProfile(false)}
                />
              </div>
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-orange-500">
                  <img
                           src={
                           singleUser?.image
                             ? `http://localhost:3000/uploads/${singleUser.image}`
                             : "https://via.placeholder.com/150"
                         }
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-lg font-bold mb-2">
                  {singleUser?.name} {singleUser?.surname}
                </p>
                <p className="text-gray-600 mb-4">@{singleUser?.userName}</p>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                    <Upload className="w-4 h-4" />
                    Update Picture
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search and Controls */}
      <div className="p-3 bg-orange-500">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-white">
            <User className="w-6 h-6" />
            <span className="font-semibold">
              {showAllUsers ? "All Users" : "My Friends"}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAllUsers(!showAllUsers)}
              className="p-2 hover:bg-orange-600 rounded-full transition"
              title={showAllUsers ? "Show Friends Only" : "Show All Users"}
            >
              <Users className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setShowRequests(!showRequests)}
              className="relative p-2 hover:bg-orange-600 rounded-full transition"
              title="Friend Requests"
            >
              <UserPlus className="w-5 h-5 text-white" />
              {friendRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {friendRequests.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white bg-opacity-20 rounded-lg text-black placeholder-white placeholder-opacity-70 focus:outline-none focus:bg-opacity-30"
          />
        </div>
      </div>

      {/* Friend Requests Panel */}
      {showRequests && (
        <div className="p-4 bg-yellow-50 border-b max-h-60 overflow-y-auto">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-800">
            <UserPlus className="w-5 h-5" />
            Friend Requests ({friendRequests.length})
          </h3>
          {friendRequests.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No pending requests</p>
          ) : (
            <div className="space-y-2">
              {friendRequests.map((reqId) => {
                const user = users.find((u) => u._id === reqId);
                if (!user) return null;
                return (
                  <div
                    key={reqId}
                    className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
                        <img
                          src={
                            user?.image
                              ? `http://localhost:3000/uploads/${user.image}`
                              : `https://ui-avatars.com/api/?name=${user.name}&size=40&background=f97316&color=fff`
                          }
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-500">@{user.userName}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => acceptFriendRequest(reqId)}
                        className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
                        title="Accept"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => rejectFriendRequest(reqId)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                        title="Reject"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Users List */}
      <div className="flex-1 overflow-y-auto">
        {displayUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="font-medium">
              {showAllUsers
                ? "No users found"
                : "No friends yet"}
            </p>
            <p className="text-sm mt-2">
              {showAllUsers
                ? "Try a different search"
                : "Add some friends to start chatting!"}
            </p>
          </div>
        ) : (
          displayUsers.map((user) => (
            <div
              key={user._id}
              onClick={() =>
                isFriend(user._id) &&
                !isBlocked(user._id) &&
                handleSelect(user)
              }
              className={`p-4 border-b ${
                isFriend(user._id) && !isBlocked(user._id)
                  ? "cursor-pointer hover:bg-gray-50"
                  : "opacity-60 cursor-not-allowed"
              } transition ${
                activeChat === user._id ? "bg-orange-50" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                      <img
                        src={
                          user?.image
                            ? `http://localhost:3000/uploads/${user.image}`
                            : `https://ui-avatars.com/api/?name=${user.name}&size=50&background=f97316&color=fff`
                        }
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {onlineUsers[user._id] && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800 truncate">
                        {user.name}
                      </span>
                      {isBlocked(user._id) && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                          Blocked
                        </span>
                      )}
                      {isFriend(user._id) && !isBlocked(user._id) && (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">
                          Friend
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mb-1">
                      @{user.userName}
                    </div>
                    {lastMessages[user._id] && (
                      <div className="text-xs text-gray-600 truncate">
                        {lastMessages[user._id]?.text?.slice(0, 30)}...
                      </div>
                    )}
                    {typingUsers[user._id] && (
                      <div className="text-xs text-orange-500 italic">
                        typing...
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {unreadCounts[user._id] > 0 && (
                    <div className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                      {unreadCounts[user._id]}
                    </div>
                  )}
                  <div
                    className="flex gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {!isFriend(user._id) && !isBlocked(user._id) && (
                      <button
                        onClick={() => sendFriendRequest(user._id)}
                        className="p-1.5 hover:bg-orange-100 rounded-full transition"
                        title="Send Friend Request"
                      >
                        <UserPlus className="w-4 h-4 text-orange-600" />
                      </button>
                    )}
                    {isBlocked(user._id) ? (
                      <button
                        onClick={() => unblockUser(user._id)}
                        className="p-1.5 hover:bg-green-100 rounded-full transition"
                        title="Unblock User"
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </button>
                    ) : (
                      <button
                        onClick={() => blockUser(user._id)}
                        className="p-1.5 hover:bg-red-100 rounded-full transition"
                        title="Block User"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
