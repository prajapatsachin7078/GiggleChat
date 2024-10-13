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
    const { selectedChat, setSelectedChat, setChats } = useContext(UserContext);

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

    return (
        <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(!isDialogOpen)}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Group</DialogTitle>
                    <DialogDescription>
                        Update the group's details or manage participants.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <div className="items-center gap-4 mb-2">
                        <Input id="name"
                            value={name}
                            placeholder="Group Name"
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3"
                        />
                        <Button onClick={handleRenameGroup}>Rename Group</Button>
                    </div>
                    <div className="items-center">
                        <Input id="search"
                            placeholder="Add users, e.g. Piyush, Sachin.."
                            onChange={handleSearch}
                            value={search}
                            className="col-span-3 mb-2"
                        />
                    </div>
                    {/* Participants list */}
                    <div className={`${participants.length > 0 ? 'border my-2 px-1 py-2' : ''}`}>
                        {participants.map((participant, index) => (
                            <Badge key={index} className={'p-2 m-1 text-sm hover:bg-black'}>
                                {participant.name}
                                <Cross1Icon
                                    className="ml-2 hover:cursor-pointer"
                                    onClick={() => handleRemoveParticipant(participant._id)}
                                />
                            </Badge>
                        ))}
                    </div>
                    {/* Search Results */}
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
                </div>
                <DialogFooter>
                    <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
