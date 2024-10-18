import React, { useContext } from "react";

import { UpdateGroupModal } from "./UpdateGroupModal";
import { SelectedUserProfileModal } from "./SelectedUserProfileModal";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {UserContext} from "@/context/userContext";

const ChatHeader = ({ selectedChat, user }) => {

  const {setSelectedChat} = useContext(UserContext);
  return (
    <div className="flex w-full justify-between px-2 py-1 items-center">
      <ArrowLeftIcon
        className="font-bold w-6 h-6 hover:cursor-pointer"
        onClick={() => {
          setSelectedChat(null);
        }}
      />
      <div className="flex items-center gap-1">
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
          <Avatar className="cursor-pointer">
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
        </UpdateGroupModal>
      ) : (
        <SelectedUserProfileModal>
          <Avatar className="cursor-pointer">
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
        </SelectedUserProfileModal>
      )}
    </div>
  );
};

export default ChatHeader;
