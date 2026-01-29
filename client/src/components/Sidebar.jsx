import React, { useState } from 'react';
import { Plus, Search, MessageSquare, Trash2, MoreVertical } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Sidebar = ({ user }) => {
  const [hoveredChatId, setHoveredChatId] = useState(null);
  const { 
    chats, 
    currentChat, 
    searchQuery, 
    setSearchQuery, 
    createNewChat, 
    selectChat, 
    getFilteredChats,
    deleteChat 
  } = useAppContext();
  
  const filteredChats = getFilteredChats();
  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <div className="w-56 sm:w-64 bg-gray-800 border-r border-gray-700 flex flex-col h-screen">
      {/* Logo and Title */}
      <div className="p-3 sm:p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs sm:text-sm">TG</span>
          </div>
          <h1 className="text-white font-bold text-sm sm:text-lg">ThinkGuard</h1>
        </div>
        <p className="text-gray-400 text-xs">Intelligent AI Assistant</p>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={createNewChat}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
        >
          <Plus size={20} />
          <span className="font-medium">New Chat</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations"
            className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Recent Chats */}
      <div className="flex-1 overflow-y-auto px-4">
        <h3 className="text-gray-400 text-sm font-medium mb-3">Recent Chats</h3>
        <div className="space-y-2">
          {filteredChats && filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                onMouseEnter={() => setHoveredChatId(chat.id)}
                onMouseLeave={() => setHoveredChatId(null)}
                onClick={() => selectChat(chat)}
                className={`p-3 rounded-lg cursor-pointer transition-colors group ${
                  currentChat?.id === chat.id
                    ? 'bg-gray-700 border border-purple-500'
                    : 'hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <MessageSquare size={16} className="text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{chat.title}</p>
                    <p className="text-gray-400 text-xs">{formatTimestamp(chat.timestamp || chat.lastActivity)}</p>
                  </div>
                  {hoveredChatId === chat.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity p-1 rounded hover:bg-gray-600"
                      title="Delete chat"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center py-4">
              {searchQuery ? 'No chats found' : 'No recent chats'}
            </p>
          )}
        </div>
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {user?.name || user?.username || 'User'}
            </p>
            <p className="text-gray-400 text-xs truncate">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
