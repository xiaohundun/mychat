import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import { Chat } from "./components/ChatList";
// import data from "./test.json";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { Conversation } from "./components/ConversationList";
import { ForwardRefStub } from "./components/Stub";
import { Message } from "./types";

function App() {
  const textRef = useRef<HTMLTextAreaElement>(
    document.createElement("textarea")
  );
  const msgContainerRef = useRef<HTMLDivElement>(document.createElement("div"));
  const stubRef = useRef<HTMLDivElement>(document.createElement("div"));

  const getLocalItems = () => {
    var rn = [];
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);
      if (key?.startsWith("local-conversation:")) {
        rn.push({
          data: JSON.parse(localStorage.getItem(key) || ""),
          key: key,
        });
      }
    }
    return rn;
  };

  const makeReq = async () => {
    if (waitReply) return;
    if (!textRef.current.value) return;
    let sse = "";
    const newAry = [
      ...chat,
      { role: "user", content: textRef.current?.value || "" },
    ];
    textRef.current.value = "";
    setChat(newAry);

    const data = {
      model: "gpt-3.5-turbo",
      messages: newAry.map((item) => {
        const { role, content } = item;
        return { role, content };
      }),
      stream: true,
    };
    await fetchEventSource("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer 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",
      },
      onmessage(ev) {
        if (ev.data === "[DONE]") {
          setChat((old) => {
            const newAry = [
              ...old,
              {
                role: "assistant",
                content: sse,
              },
            ];
            localStorage.setItem(localStorageKey, JSON.stringify(newAry));
            setLocalConversation(getLocalItems());
            return newAry;
          });
        } else {
          const msg = JSON.parse(ev.data);
          if (msg.choices[0].delta.content) {
            sse = (
              stubRef.current.innerText + msg.choices[0].delta.content
            ).replace("...", "");
            stubRef.current.innerText = sse;
          }
          msgContainerRef.current.scrollTo({
            top: msgContainerRef.current?.scrollHeight,
            behavior: "smooth",
          });
        }
      },
      async onopen() {
        setWaitReply(true);
      },
      onclose() {
        setWaitReply(false);
      },
      onerror(err) {
        throw err;
      },
    });
  };

  const onChangeConversation = useCallback(
    (item: {
      data: Array<{
        role: string;
        content: string;
      }>;
      key: string;
    }) => {
      setLocalStorageKey(item.key);
      setChat(item.data);
    },
    []
  );

  const onRemoveConversation = useCallback(
    (item: { data: Array<Message>; key: string }) => {
      localStorage.removeItem(item.key);
      setLocalConversation(getLocalItems());
    },
    []
  );

  const [localStorageKey, setLocalStorageKey] = useState(() => {
    const randomstring = require("randomstring");
    return "local-conversation:" + randomstring.generate();
  });

  let [localConversation, setLocalConversation]: any = useState(() =>
    getLocalItems()
  );

  const [chat, setChat] = useState<Array<Message>>([
    {
      role: "system",
      content:
        '我希望你扮演英文翻译官，仅当{{your content here}}是"translate:"开头时才翻译文本，并且保持原意，不需要解释，仅当{{your content here}}是"translate:"开头时才翻译文本；',
    },
    {
      role: "assistant",
      content: "Hello! How may I assist you today?",
    },
  ]);
  // const [chat, setChat] = useState(data);
  const [composition, setComposition] = useState(false);
  const [waitReply, setWaitReply] = useState(false);

  useEffect(() => {
    msgContainerRef.current.scrollTo({
      top: msgContainerRef.current?.scrollHeight,
      behavior: "smooth",
    });
  }, [chat]);

  return (
    <div
      className="App relative flex flex-row"
      style={{
        backgroundColor: "rgb(243,243,243)",
      }}
    >
      <div
        id="left"
        className="bg-white flex flex-col"
        style={{
          minWidth: "18vw",
          minHeight: "100vh",
        }}
      >
        <Conversation
          conversation={localConversation}
          onChangeConversation={onChangeConversation}
          onRemoveConversation={onRemoveConversation}
        ></Conversation>
      </div>
      <div
        id="chat"
        className="flex flex-col scroll-smooth h-full"
        style={{
          minWidth: "82vw",
        }}
      >
        <div
          className="px-5 md:px-0 relative mx-4 overflow-y-scroll grow"
          ref={msgContainerRef}
          style={{}}
        >
          <Chat
            ref={stubRef}
            chat={chat.filter((item) => item.role !== "system")}
          >
            {waitReply && <ForwardRefStub ref={stubRef}></ForwardRefStub>}
          </Chat>
        </div>
        <div className="flex-none mx-4 mt-4 mb-2">
          <div className="flex flex-col relative border border-black/10 bg-white rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)]">
            <textarea
              ref={textRef}
              style={{}}
              placeholder="Type here"
              className="m-0 resize-none w-full border-0 bg-transparent p-0 pl-2 pr-7 outline-0"
              onKeyDown={(event) => {
                if (!composition && event.key === "Enter") {
                  makeReq();
                  event.preventDefault();
                }
              }}
              onCompositionStart={() => {
                setComposition(true);
              }}
              onCompositionEnd={() => {
                setComposition(false);
              }}
            ></textarea>
            <button
              onClick={makeReq}
              className="absolute p-1 rounded-md text-gray-500 bottom-0 hover:bg-gray-100 top-0 right-0"
            >
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth={2}
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 m-2"
                style={{
                  animation: `${
                    waitReply && "myping 1s cubic-bezier(0, 0, 0.2, 1) infinite"
                  }`,
                }}
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
