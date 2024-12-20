import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { UserContext } from "@/context/userContext";
import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { CreateNewGroup } from "./CreateNewGroup";

const API = import.meta.env.VITE_BACKEND_URI;

function MyChats() {
  const [currentUserId, setcurrentUserId] = useState();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredChats, setFilteredChats] = useState([]);

  const {
    chats,
    selectedChat,
    setChats,
    setSelectedChat,
    notification,
    fetchAgain
  } = useContext(UserContext);

  const fetchChats = async () => {
    try {
      const response = await axios.get(`${API}/api/v1/chat`, {
        withCredentials: true
      });
      const { populatedChats, currentUserId } = response.data;
      setChats(populatedChats);
      setFilteredChats(populatedChats);
      setcurrentUserId(currentUserId);
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [selectedChat, notification, fetchAgain]);

  useEffect(() => {
    // Filter chats based on search input
    if (search) {
      const results = chats.filter((chat) => {
        // Check if it's a group chat or individual chat
        if (chat.isGroupChat) {
          return chat.name.toLowerCase().includes(search.toLowerCase());
        } else {
          return chat.participants.some((participant) =>
            participant.name.toLowerCase().includes(search.toLowerCase())
          );
        }
      });
      setFilteredChats(results);
    } else {
      setFilteredChats(chats); // Reset to all chats if search is cleared
    }
  }, [search, chats]);

  return (
    <div className="mx-auto w-full p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">My Chats</h1>
        <CreateNewGroup>
          <Button className="bg-rose-500 hover:bg-rose-600 text-white">
            New Group <PlusIcon />
          </Button>
        </CreateNewGroup>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search for chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>

      <div className="h-[72vh] overflow-y-auto">
        {/* Added scrollable container */}
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex items-center justify-around mb-2">
              <Skeleton className="h-14 w-14 rounded-full" />
              <Skeleton className="h-14 w-[85%] rounded" />
            </div>
          ))
        ) : (
          <div className="h-full">
            {filteredChats.length === 0 ? (
              <p className="text-gray-500">No chats found.</p>
            ) : (
              <ul>
                {filteredChats.map((chat) => (
                  <li
                    key={chat._id}
                    onClick={() => {
                      setSelectedChat(chat); // Set the selected chat
                    }}
                    className={`border mb-2 hover:bg-teal-100 rounded-lg bg-white shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer`}
                  >
                    <div
                      className={`flex p-2 items-center space-x-4 ${
                        selectedChat?._id === chat?._id ? "bg-teal-100" : ""
                      }`}
                    >
                      {chat.isGroupChat ? (
                        <img
                          src={chat.avatar}
                          alt={chat.name}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        chat.participants
                          .filter(
                            (participant) => participant._id !== currentUserId
                          )
                          .map((participant) => (
                            <img
                              key={participant._id}
                              src={participant.avatar.url}
                              alt={participant.name}
                              className="h-10 w-10 rounded-full"
                            />
                          ))
                      )}
                      <div className="flex flex-col">
                        {chat.isGroupChat ? (
                          <div className="font-semibold text-lg">
                            {chat.name}
                          </div>
                        ) : (
                          chat.participants
                            .filter(
                              (participant) => participant._id !== currentUserId
                            )
                            .map((participant) => (
                              <div
                                key={participant._id}
                                className="font-semibold text-lg"
                              >
                                {participant.name}
                              </div>
                            ))
                        )}
                        <p className="text-gray-600">
                          {chat?.lastMessage?.content.slice(0, 20) ||
                            "No messages yet."}
                        </p>
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
