import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { useContext } from "react"
import UserContext from "@/context/userContext"
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"

export function SelectedUserProfileModal({ children }) {
    const { selectedChat,user } = useContext(UserContext);  // Assuming selectedChat is available in UserContext
    
    const selectedUser = selectedChat.participants.filter(participant=> participant._id !== user.userId )[0];
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{selectedUser?.name || "User Profile"}</DialogTitle>
                    <DialogDescription>
                         {selectedUser?.email}.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-4">
                    <Avatar
    
                        className="h-16 w-16 rounded-full bg-green-300"
                    >
                        <AvatarImage src={selectedUser?.avatar?.url || "https://github.com/shadcn.png"} alt={selectedUser?.name[0] + selectedChat?.name[selectedChat?.name.length-1]} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-semibold text-lg">{selectedUser?.name}</div>
                    </div>
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
