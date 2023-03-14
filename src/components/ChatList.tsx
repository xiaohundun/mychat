import type { Message } from "../types";
import { ItemMemo as Item } from "./RenderItem";

function Chat({
  chat,
  children,
}: {
  chat: Array<Message>;
  children: React.ReactNode;
}) {
  return (
    <>
      {chat.map((item, index) => (
        <Item item={item} index={index} key={index}></Item>
      ))}
      {children}
    </>
  );
}
export default Chat;
