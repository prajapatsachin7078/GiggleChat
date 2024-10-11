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
import { Label } from "@/components/ui/label"
import { useState } from "react"

export function CreateNewGroup({children}) {
    const [participant, setParticipant] = useState('');
    const [name, setName] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    return (
        <Dialog open={isDialogOpen} onOpenChange={()=>{setIsDialogOpen(!isDialogOpen)}}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Group</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className=" py-4">
                    <div className=" items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Group Name
                        </Label>
                
                        <Input id="name" value={name} 
                            onChange ={(e)=>{setName(e.target.value)}}
                        className="col-span-3" />
                    </div>
                    <div className=" items-center ">
                        <Label htmlFor="username" className="text-right">
                            Username
                        </Label>
                        <Input id="participant"    
                            onChange={(e) => { setParticipant(e.target.value) }}
                            value={participant}
                            className="col-span-3" 
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
