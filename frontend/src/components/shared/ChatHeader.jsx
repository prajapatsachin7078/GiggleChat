
import React from "react";

import { UpdateGroupModal } from "./UpdateGroupModal";
import { SelectedUserProfileModal } from "./SelectedUserProfileModal";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const ChatHeader = ({ selectedChat, user }) => {
  return (
    <div className="flex w-full justify-between px-2 py-1 items-center">
      <div className="flex items-center gap-1">
        <Avatar>
          <AvatarImage
            src={
              selectedChat?.isGroupChat
                ? selectedChat?.avatar
                : selectedChat.participants.filter(
                    (participant) => participant._id !== user.userId
                  )[0].avatar.url
            }
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span>
          {selectedChat?.isGroupChat
            ? selectedChat.name
            : selectedChat.participants.filter(
                (participant) => participant._id !== user.userId
              )[0].name}
        </span>
      </div>

      {selectedChat?.isGroupChat ? (
        <UpdateGroupModal>
          <EyeOpenIcon className="hover:cursor-pointer w-6 h-6" />
        </UpdateGroupModal>
      ) : (
        <SelectedUserProfileModal>
          <EyeOpenIcon className="hover:cursor-pointer w-6 h-6" />
        </SelectedUserProfileModal>
      )}
    </div>
  );
};

export default ChatHeader;
