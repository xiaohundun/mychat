import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import Chat from "./components/ChatList";
// import data from "./test.json";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { Conversation } from "./components/ConversationList";
import InputArea from "./components/InputArea";
import { ForwardRefStub } from "./components/Stub";
import { Message } from "./types";

const controller = new AbortController();
const signal = controller.signal;
let sse = "";

const iniChat = [
  {
    role: "system",
    content:
      '我希望你扮演英文翻译官，仅当{{your content here}}是"translate:"开头时才翻译文本，并且保持原意，不需要解释，仅当{{your content here}}是"translate:"开头时才翻译文本；',
  },
  {
    role: "assistant",
    content: "Hello! How may I assist you today?",
  },
];

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

  const getKey = () => {
    const randomstring = require("randomstring");
    return "local-conversation:" + randomstring.generate();
  };

  const onReachEnd = (inStr?: string) => {
    const msg = inStr || sse;
    setChat((old) => {
      const newAry = [
        ...old,
        {
          role: "assistant",
          content: msg,
        },
      ];
      localStorage.setItem(localStorageKey, JSON.stringify(newAry));
      setLocalConversation(getLocalItems());
      return newAry;
    });
  };
  const makeReq = async () => {
    if (waitReply) return;
    if (!textRef.current.value) return;
    sse = "";
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
      signal: signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.REACT_APP_OPENAI_API_KEY,
      },
      onmessage(ev) {
        if (ev.data === "[DONE]") {
          onReachEnd(sse);
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
      if (!item) {
        setLocalStorageKey(getKey());
        setChat(iniChat);
      } else {
        setLocalStorageKey(item.key);
        setChat(item.data);
      }
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

  const [localStorageKey, setLocalStorageKey] = useState(getKey());

  let [localConversation, setLocalConversation]: any = useState(() =>
    getLocalItems()
  );

  const [chat, setChat] = useState<Array<Message>>(iniChat);
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
        className="bg-white flex flex-col overflow-hidden w-0 md:w-1/5"
        style={{
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
        className="flex flex-col scroll-smooth h-full w-full md:w-4/5"
      >
        <div
          className="px-0 relative mx-0 overflow-y-scroll grow"
          ref={msgContainerRef}
          style={{}}
        >
          <Chat chat={chat.filter((item) => item.role !== "system")}>
            {waitReply && <ForwardRefStub ref={stubRef}></ForwardRefStub>}
          </Chat>
        </div>
        <div className="flex-none mx-4 mt-4 mb-2">
          <InputArea
            waitReply={waitReply}
            composition={composition}
            textRef={textRef}
            makeReq={makeReq}
            setComposition={setComposition}
            setWaitReply={setWaitReply}
            onReachEnd={onReachEnd}
            controller={controller}
          ></InputArea>
        </div>
      </div>
    </div>
  );
}

export default App;
