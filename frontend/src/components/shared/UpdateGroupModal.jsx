import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import axios from "axios";
import { useContext, useState, useEffect } from "react"
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { Cross1Icon } from "@radix-ui/react-icons";
import { toast } from "@/hooks/use-toast";
import UserContext from "@/context/userContext";

export function UpdateGroupModal({ children }) {
    const [participants, setParticipants] = useState([]);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResult] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { user, selectedChat, setSelectedChat, setChats } = useContext(UserContext);

    // Check if the current user is the admin of the group
    const isAdmin = selectedChat?.admin?._id === user.userId;

    useEffect(() => {
        if (selectedChat?.isGroupChat) {
            setName(selectedChat.name); // Pre-fill the group name
            setParticipants(selectedChat.participants); // Pre-fill the group participants
        }
    }, [selectedChat]);

    const handleSearch = async (e) => {
        setIsLoading(true);
        setSearch(e.target.value);

        try {
            const response = await axios.get(`http://localhost:3000/api/v1/user/get-users?search=${search}`, {
                withCredentials: true
            });
            setSearchResult(response.data.users);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRenameGroup = async () => {
        if (!name) {
            toast({
                variant: "destructive",
                description: "Please provide a group name!",
            });
            return;
        }

        try {
            const response = await axios.put(`http://localhost:3000/api/v1/chat/rename/${selectedChat._id}/${name}`, {}, {
                withCredentials: true
            });
            setSelectedChat({ ...selectedChat, name: response.data.name });
            toast({ description: "Group name updated successfully." });
        } catch (error) {
            console.log("Error renaming group:", error);
        }
    };

    const handleAddParticipant = async (id, userName) => {
        if (!participants.some(user => user._id === id)) {
            try {
                const response = await axios.put(`http://localhost:3000/api/v1/chat/add/${selectedChat._id}/${id}`, {}, {
                    withCredentials: true
                });
                setParticipants(response.data.chatGroup.participants);
                setSelectedChat(response.data.chatGroup);
                toast({ description: `${userName} added to the group.` });
            } catch (error) {
                console.log("Error adding participant:", error);
            }
        }
    };

    const handleRemoveParticipant = async (id) => {
        try {
            const response = await axios.put(`http://localhost:3000/api/v1/chat/remove/${selectedChat._id}/${id}`, {}, {
                withCredentials: true
            });
            setParticipants(response.data.chatGroup.participants);
            setSelectedChat(response.data.chatGroup);
            toast({ description: "Participant removed from the group." });
        } catch (error) {
            console.log("Error removing participant:", error);
        }
    };

    const handleLeaveGroup = async () => {
        try {
            const response = await axios.put(`http://localhost:3000/api/v1/chat/leave/${selectedChat._id}`, {}, {
                withCredentials: true
            });
            setChats(prevChats => prevChats.filter(chat => chat._id !== selectedChat._id));
            setSelectedChat(null);
            toast({ description: "You left the group." });
        } catch (error) {
            console.log("Error leaving group:", error);
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(!isDialogOpen)}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isAdmin?"Update Group":selectedChat.name}</DialogTitle>
                    <DialogDescription>
                        {isAdmin
                            ? "Update the group's details or manage participants."
                            : "View participants or leave the group if you no longer want to participate."}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    {isAdmin && (
                        <>
                            <div className="items-center gap-4 mb-2 flex">
                                <Input id="name"
                                    value={name}
                                    placeholder="Group Name"
                                    onChange={(e) => setName(e.target.value)}
                                    className="col-span-3  float-end"
                                />
                                <Button onClick={handleRenameGroup}>Rename</Button>
                            </div>
                            <div className="items-center">
                                <Input id="search"
                                    placeholder="Add users, e.g. Piyush, Sachin.."
                                    onChange={handleSearch}
                                    value={search}
                                    className="col-span-3 mb-2"
                                />
                            </div>
                        </>
                    )}

                    {/* Participants list */}
                    <div className={`${participants.length > 0 ? 'border my-2 px-1 py-2' : ''}`}>
                        {participants.map((participant, index) => (
                            <Badge key={index} className={'p-2 m-1 text-sm hover:bg-black'}>
                                {participant.name}
                                {isAdmin && participant._id !== user._id && (
                                    <Cross1Icon
                                        className="ml-2 hover:cursor-pointer"
                                        onClick={() => handleRemoveParticipant(participant._id)}
                                    />
                                )}
                            </Badge>
                        ))}
                    </div>

                    {/* Search Results */}
                    {isAdmin && (
                        <div>
                            {isLoading ? (
                                <div className="flex flex-col space-y-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <Skeleton className="h-4 w-[250px]" />
                                </div>
                            ) : (
                                searchResults.length > 0 && searchResults.slice(0, 4).map((user) => (
                                    <div key={user._id} className="flex items-center hover:cursor-pointer hover:bg-red-400 justify-between rounded-md px-1 hover:text-white space-x-4 py-2 border-b"
                                        onClick={() => handleAddParticipant(user._id, user.name)}
                                    >
                                        <div className='flex'>
                                            <img src={user.avatar.url || '/fallback-avatar.png'} alt={user.name} className="h-12 w-12 rounded-full" />
                                            <div className='ml-2'>
                                                <div className="font-semibold">{user.name}</div>
                                                <div className="text-gray-700">{user.email}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    <div className="flex justify-center mt-4">
                        <Button variant="destructive" onClick={handleLeaveGroup}>Leave Group</Button>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
