import { useContext, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { SearchIcon } from "lucide-react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "../ui/drawer";
import axios from 'axios'; // Import Axios
import { Skeleton } from '../ui/skeleton'; // Import your Skeleton component
import UserSearchList from "./UserSearchList";
import UserContext from "@/context/userContext";

function SideDrawer() {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Manage drawer state
    const { setSelectedChat } = useContext(UserContext);

    // Fetch users based on search input
    async function fetchData() {
        try {
            const response = await axios.get(`http://localhost:3000/api/v1/user/get-users?search=${search}`, {
                withCredentials: true // Ensure credentials are sent
            });
            setSearchResult(response?.data?.users); // Assume the response has user data
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleSearch = async () => {
        setLoading(true);
        fetchData();
    };

    const chatStartHandler = async(userId) => {
        try {
            const response = await axios.post('http://localhost:3000/api/v1/chat',{
                userId
            },{
                withCredentials: true
            });
            // console.log(response.data);
            setSelectedChat(response?.data);
        } catch (error) {
            console.log("Error while creating new chat..");
        }
        // Close the drawer after initiating the chat
        setIsDrawerOpen(false);
    };

    useEffect(() => {
        if (search) fetchData();
    }, [search]);

    return (
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}> {/* Controlled open state */}
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DrawerTrigger asChild>
                            <Button
                                variant="outline"
                                className="flex items-center space-x-2"
                                onClick={() => setIsDrawerOpen(true)} // Open drawer
                            >
                                <span className="flex items-center">
                                    <SearchIcon className="h-4 w-4" />
                                </span>
                                <span>Search User</span>
                            </Button>
                        </DrawerTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Search users to chat</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Search Users</DrawerTitle>
                        <DrawerDescription>Find users to chat with.</DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                        <input
                            type="text"
                            placeholder="Search for users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border p-2 rounded"
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // Trigger search on Enter
                        />
                    </div>
                    <div className="p-4">
                        {loading ? (
                            <div className="flex flex-col space-y-4">
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
                            </div>
                        ) : (
                            <div>
                                <UserSearchList searchResult={searchResult} chatStartHandler={chatStartHandler} />
                                {searchResult.length === 0 && !loading && (
                                    <p>No users found.</p>
                                )}
                            </div>
                        )}
                    </div>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline"
                                className="hover:bg-red-600 hover:text-white"
                                onClick={() => setIsDrawerOpen(false)} // Close drawer
                            >
                                Cancel
                            </Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}

export default SideDrawer;