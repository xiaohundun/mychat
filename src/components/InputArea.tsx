import { MutableRefObject } from "react";

function InputArea({
  waitReply,
  composition,
  textRef,
  makeReq,
  setComposition,
  setWaitReply,
  onReachEnd,
  controller,
}: {
  waitReply: boolean;
  composition: boolean;
  textRef: MutableRefObject<HTMLTextAreaElement> | null;
  makeReq: () => void;
  setComposition: (v: boolean) => void;
  setWaitReply: (v: boolean) => void;
  onReachEnd: () => void;
  controller: AbortController;
}) {
  return (
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
      {waitReply ? (
        <button
          className="absolute p-1 rounded-md text-gray-500 bottom-0 hover:bg-gray-100 top-0 right-0"
          onClick={() => {
            controller.abort("user abort");
            onReachEnd();
            setWaitReply(false);
          }}
        >
          停止响应
        </button>
      ) : (
        <button
          onClick={makeReq}
          className="absolute p-1 text-gray-500 bottom-0 hover:bg-gray-100 top-0 right-0"
        >
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth={2}
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 m-2"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      )}
    </div>
  );
}

export default InputArea;
