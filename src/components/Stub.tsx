import { ComputerDesktopIcon } from "@heroicons/react/24/outline";
import React, { forwardRef } from "react";

export const ForwardRefStub = forwardRef(function stub(
  props: { streamOpened: boolean },
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const dotStyle: React.CSSProperties = {
    display: "inline-block",
    marginRight: "0.5em",
    width: "0.4em",
    height: "0.4em",
    borderRadius: "50%",
    backgroundColor: "#333",
    animation: "dots-bounce 1.4s infinite ease-in-out both",
  };

  return (
    <div className={`p-2 w-full flex items-top`}>
      <ComputerDesktopIcon className="w-5 h-5 mx-2"></ComputerDesktopIcon>
      {!props.streamOpened ? (
        <div>
          <span style={dotStyle}></span>
          <span
            style={{
              ...dotStyle,
              animationDelay: "-0.2s",
            }}
          ></span>
          <span
            style={{
              ...dotStyle,
              animationDelay: "-0.4s",
            }}
          ></span>
        </div>
      ) : (
        <div
          ref={ref}
          style={{
            textAlign: "left",
            backgroundColor: "white",
          }}
          className={`break-words rounded-xl p-2 content-bubble whitespace-pre-wrap`}
        ></div>
      )}
    </div>
  );
});
