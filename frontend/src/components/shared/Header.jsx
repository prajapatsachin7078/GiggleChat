                                       
import React, { useContext, useState } from 'react'
import SideDrawer  from './SideDrawer'
import { Avatar } from '../ui/avatar'
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { BellIcon } from '@radix-ui/react-icons'
import { Separator } from '../ui/separator'
import {UserContext} from '@/context/userContext'
import ProfileModal from './ProfileModal'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from '@/hooks/use-toast'
import { Skeleton } from '../ui/skeleton'

function Header() {
    const { user } = useContext(UserContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogOut = async() => {
        try {
            const response = await axios.get('http://localhost:3000/api/v1/user/logout',{
                withCredentials: true
            });
            console.log(response.data);
            toast({
                description: response.data.message
            })
            localStorage.removeItem('userInfo');
            navigate('/');
        } catch (error) {
            console.log("Try againt!")
            toast({
                description:"Try Again! Internal Server error."
            })
        }
        
    }
   
    return (
        <nav className='border-b flex justify-between items-center px-4 py-2 bg-white shadow-sm'>
            <SideDrawer />
            <h1 className='text-2xl font-semibold'>Chat-App</h1>
            <div className='flex items-center space-x-4'>
                <BellIcon className='w-6 h-6 hover:cursor-pointer text-gray-600' />

                {user ? (
                    <div className="relative">
                        {/* Avatar Button */}
                        <div onClick={toggleDropdown} className="cursor-pointer flex items-center space-x-2">
                            <Avatar>
                                <AvatarImage src={user?.avatar?.url || "/fallback-avatar.png"} alt="User Avatar" />
                                <AvatarFallback>{user?.name ? user.name.charAt(0) : "?"}</AvatarFallback>
                            </Avatar>
                        </div>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                                <div className="flex flex-col p-2">
                                    <ProfileModal user={user}>
                                        <Button
                                            variant="ghost"
                                        >{user.name}
                                        </Button>
                                    </ProfileModal>
                                    <Separator className="my-1" />
                                    <Button
                                        variant="ghost"
                                        className="text-left w-full"
                                        onClick={handleLogOut}
                                    >
                                        Log Out
                                    </Button>
                                </div>
                            </div>
                        )}

                    </div>
                ) : (
                    <Skeleton className="h-12 w-12 rounded-full" />
                )}
            </div>
        </nav>
    );
}

export default Header;
