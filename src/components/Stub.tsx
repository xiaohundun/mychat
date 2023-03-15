import { ComputerDesktopIcon } from "@heroicons/react/24/outline";
import { forwardRef } from "react";

export const ForwardRefStub = forwardRef(function stub(
  props,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <div className={`p-2 w-full flex items-top`}>
      <ComputerDesktopIcon className="w-5 h-5 mx-2"></ComputerDesktopIcon>
      <div
        ref={ref}
        style={{
          textAlign: "left",
          backgroundColor: "white",
        }}
        className={`break-words rounded-xl p-2 content-bubble whitespace-pre-wrap`}
      >
        ...
      </div>
    </div>
  );
});
