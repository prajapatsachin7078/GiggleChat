import { useContext, useEffect, useState } from "react";
import axios from 'axios'; 
import { Skeleton } from '../ui/skeleton'; 
import UserContext from "@/context/userContext";

function MyChats() {
  const [currentUserId, setcurrentUserId] = useState();
  
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredChats, setFilteredChats] = useState([]);

  const { chats, selectedChat, setChats, setSelectedChat } = useContext(UserContext);

  const fetchChats = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/chat', { withCredentials: true });
      setChats(response.data.populatedChats); // Assume the response has chat data
      setFilteredChats(response.data.populatedChats); // Initialize filtered chats with all chats
      setcurrentUserId(response.data.currentUserId);
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [selectedChat]);

  useEffect(() => {
    // Filter chats based on search input
    if (search) {
      const results = chats.filter(chat => {
        return chat.participants.some(participant =>
          participant.name.toLowerCase().includes(search.toLowerCase())
        );
      });
      setFilteredChats(results);
    } else {
      setFilteredChats(chats); // Reset to all chats if search is cleared
    }
  }, [search, chats]);

  return (
    <div className="mx-auto w-full  p-4 ">
      <h1 className="text-2xl font-bold mb-4">My Chats</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search for chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>
      <div>
        {loading ? (
          <div className="flex flex-col space-y-4">
            <Skeleton className="h-12 w-full rounded" />
            <Skeleton className="h-12 w-full rounded" />
          </div>
        ) : (
          <div className="overflow-y-auto">
            {filteredChats.length === 0 ? (
              <p className="text-gray-500">No chats found.</p>
            ) : (
              <ul>
                {filteredChats.map(chat => (
                  <li key={chat._id} className="border p-4 mb-2 rounded-lg bg-white shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                    onClick={()=>{}}
                  >
                    <div className="flex items-center space-x-4">
                      {/* Check if it's a group chat or an individual chat */}
                      {chat.isGroupChat ? (
                        <img src={chat.avatar} alt={chat.name} className="h-10 w-10 rounded-full" />
                      ) : (
                        chat.participants.filter(participant => participant._id !== currentUserId).map(participant => (
                          <img key={participant._id} src={participant.avatar.url} alt={participant.name} className="h-10 w-10 rounded-full" />
                        ))
                      )}
                      <div className="flex flex-col"> 
                        {chat.isGroupChat ? (
                          <div className="font-semibold text-lg">{chat.name}</div>
                        ) : (
                          chat.participants.filter(participant => participant._id !== currentUserId).map(participant => (
                            <div key={participant._id} className="font-semibold text-lg">{participant.name}</div>
                          ))
                        )}
                        <p className="text-gray-600">{chat.lastMessage?.content || "No messages yet."}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyChats;
