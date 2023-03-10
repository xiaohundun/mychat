import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";
import type { Message } from "../types";
function ConversationList({
  conversation,
  onChangeConversation,
  onRemoveConversation,
}: {
  conversation: Array<{
    key: string;
    data: Array<Message>;
  }>;
  onChangeConversation: Function;
  onRemoveConversation: Function;
}) {
  return (
    <>
      <div
        className=" border-dashed flex justify-center items-center p-2 m-2 border border-light-900 rounded hover:bg-gray-200 cursor-pointer"
        onClick={() => {
          onChangeConversation(null);
        }}
      >
        <PlusIcon className="h-5 w-5"></PlusIcon>
      </div>
      {conversation.map((item, index) => (
        <div
          className="flex justify-center items-center p-2 m-2 border border-light-900 rounded hover:bg-gray-200 "
          key={item.key}
        >
          <div
            className="flex-grow cursor-pointer"
            onClick={() => {
              onChangeConversation(item);
            }}
          >
            <p className="text-left line-clamp-2">
              {item.data.find((i) => i.role === "user")?.content}
            </p>
          </div>
          <div
            className="flex-grow-0 cursor-pointer"
            onClick={() => {
              onRemoveConversation(item);
            }}
          >
            <XMarkIcon className="w-5 h-5"></XMarkIcon>
          </div>
        </div>
      ))}
    </>
  );
}
// export default ChatList;
export const Conversation = React.memo((props: any) => (
  <ConversationList
    conversation={props.conversation}
    onChangeConversation={props.onChangeConversation}
    onRemoveConversation={props.onRemoveConversation}
  ></ConversationList>
));
