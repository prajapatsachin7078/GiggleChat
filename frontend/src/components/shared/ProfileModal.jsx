import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar } from '../ui/avatar';
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

function ProfileModal({ user, children }) {
    // Create state for form inputs
    const [name, setName] = useState(user?.name || ""); // Initialize with user data or empty string
    const [username, setUsername] = useState(user?.email || "");
    const [isEditing, setIsEditing] = useState(false); // Track if the modal is in edit mode

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic to handle saving the changes, e.g., updating user profile
        console.log("Submitted data:", { name, username });
        setIsEditing(false); // Exit editing mode on submit
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>User Profile</DialogTitle>
                    <DialogDescription>
                        View and edit your profile information.
                    </DialogDescription>
                </DialogHeader>

                {/* Avatar Display */}
                <div className="flex items-center space-x-4 mb-4">
                    <Avatar>
                        <AvatarImage src={user?.avatar?.url || "/fallback-avatar.png"} alt="User Avatar" />
                        <AvatarFallback>{user?.name ? user.name.charAt(0) : "?"}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-lg font-bold">{name}</h2>
                        <p className="text-gray-600">{username}</p>
                    </div>
                </div>

                {/* Form */}
                <form className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={name} // Controlled input
                            onChange={(e) => setName(e.target.value)} // Update state on change
                            className="col-span-3"
                            disabled={!isEditing} // Disable input if not editing
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Username
                        </Label>
                        <Input
                            id="username"
                            value={username} // Controlled input
                            onChange={(e) => setUsername(e.target.value)} // Update state on change
                            className="col-span-3"
                            disabled={!isEditing} // Disable input if not editing
                        />
                    </div>

                    <DialogFooter>
                        {isEditing ? (
                            <Button type="submit" onSubmit={handleSubmit} >Save changes</Button>
                        ) : (
                            <Button type="button" onClick={(e) => { e.preventDefault(); setIsEditing(true) }}>Edit</Button> // Prevent form submission
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default ProfileModal;
