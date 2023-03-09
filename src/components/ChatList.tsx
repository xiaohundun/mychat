import React, { forwardRef } from "react";
import type { Message } from "../types";
import Item from "./RenderItem";
// export default ChatList;
export const Chat = React.memo(
  forwardRef(
    (
      props: {
        children: React.ReactNode;
        chat: Array<Message>;
      },
      ref: React.ForwardedRef<HTMLDivElement>
    ) => {
      return (
        <>
          {props.chat.map((item, index) => (
            <Item item={item} index={index} key={index}></Item>
          ))}
          {props.children}
        </>
      );
    }
  )
);
