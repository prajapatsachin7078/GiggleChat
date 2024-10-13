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
import { useContext, useState } from "react"
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { Cross1Icon } from "@radix-ui/react-icons";
import { toast } from "@/hooks/use-toast";
import UserContext from "@/context/userContext";

export function CreateNewGroup({ children }) {
    const [participants, setParticipants] = useState([]);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResult] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { chats, selectedChat, setChats, setSelectedChat } = useContext   (UserContext);
    const handleSearch = async (e) => {
        setIsLoading(true);
        setSearch(e.target.value);

        try {
            const response = await axios.get(`http://localhost:3000/api/v1/user/get-users?search=${search}`, {
                withCredentials: true
            })
            setSearchResult(response.data.users);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }
    const handleCreateGroup = async (e) => {
        // prevent default behaviour
        e.preventDefault();
        // check if participant array is empty 
        if (participants.length == 0) {
            toast({
                variant: "destructive",
                description: "Add atleast one participant!",

            });
        } else if (!name) {
            toast({
                variant: "destructive",
                description: "Please provide a group name!",

            });
        }
        else {
            try {
                // Extracting array with participants id
                const users = participants.map(participant => participant.id);
                const response = await axios.post("http://localhost:3000/api/v1/chat/group", {
                    participants: users,
                    name
                }, {
                    withCredentials: true
                });
                setChats([...chats,response.data]);
                setSelectedChat(response.data);
            } catch (error) {
                console.log("Error in creating group: ", error);
            }finally{
                setIsDialogOpen(!isDialogOpen);
            }
        }

    }
    const handleAddParticipant = (id, userName) => {
        const participant = {
            name: userName,
            id
        }
        if (!participants.some(user => user.id == participant.id)) {
            setParticipants([...participants, participant]);
        }
    }
    const handleRemoveParticipant = (id) => {
        setParticipants(prevParticipants => prevParticipants.filter(participant => participant.id !== id));
    }
    return (
        <Dialog open={isDialogOpen} onOpenChange={() => { setIsDialogOpen(!isDialogOpen) }}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Group</DialogTitle>
                    <DialogDescription>
                        Create Groups and Have Fun with Friends and Family.
                    </DialogDescription>
                </DialogHeader>
                <div className=" py-4">
                    <div className=" items-center gap-4 mb-2">

                        <Input id="name" value={name}
                            placeholder="Group Name"
                            onChange={(e) => { setName(e.target.value) }}
                            className="col-span-3" />
                    </div>
                    <div className=" items-center">

                        <Input id="search"
                            placeholder="Add users, e.g. Piyush, Sachin.."
                            onChange={handleSearch}
                            value={search}
                            className="col-span-3 mb-2"
                        />
                    </div>
                    {/* Users list */}
                    <div className={`${participants.length > 0 ? 'border my-2 px-1 py-2' : ''}`}>
                        {
                            participants.map((participant, index) => (
                                <Badge key={index} className={'p-2 m-1 text-sm hover:bg-black'}>
                                    {participant.name}
                                    <Cross1Icon
                                        className="ml-2 hover:cursor-pointer"
                                        onClick={() => { handleRemoveParticipant(participant.id) }}
                                    />
                                </Badge>
                            ))
                        }
                    </div>
                    {/* Search List */}
                    <div>
                        {isLoading ?
                            (<div className="flex flex-col space-y-4">
                                <div className="flex items-center space-x-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[250px]" />
                                        <Skeleton className="h-4 w-[200px]" />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[250px]" />
                                        <Skeleton className="h-4 w-[200px]" />
                                    </div>
                                </div>
                            </div>)
                            : (searchResults.length > 0 && searchResults.slice(0, 4).map((user) => (
                                <div key={user._id} className="flex items-center  hover:cursor-pointer
                hover:bg-red-400 justify-between rounded-md px-1 hover:text-white space-x-4 py-2 border-b"
                                    onClick={() => { handleAddParticipant(user._id, user.name) }}
                                >
                                    <div className='flex'>
                                        <img src={user.avatar.url || '/fallback-avatar.png'} alt={user.name} className="h-12 w-12 rounded-full" />
                                        <div className='ml-2'>
                                            <div className="font-semibold">{user.name}</div>
                                            <div className="text-gray-700">{user.email}</div>
                                        </div>
                                    </div>
                                </div>
                            )))}
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit"
                        onClick={handleCreateGroup}
                    >Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
