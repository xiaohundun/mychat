import { ComputerDesktopIcon, UserIcon } from "@heroicons/react/24/outline";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import type { Message } from "../types";

function Item({ item, index }: { index: number; item: Message }) {
  const inferLang = (content: string) => {
    const match = content.match("^(.*)\\s");
    if (match && match?.length > 1) {
      return match[1];
    } else if (match) {
      return match[0];
    }
    return "";
  };

  const renderInlineCode = (content: string) => {
    let temp = content;
    let indexOfStub = content.indexOf("`");
    let index2OfStub = 0;
    let left = "",
      code = "",
      right = "";
    if (indexOfStub > -1) {
      left = content.substring(0, indexOfStub);
      temp = content.replace(left + "`", "");
      index2OfStub = temp.indexOf("`");
      code = temp.substring(0, index2OfStub);
      right = temp.replace(code + "`", "");
      return (
        <span>
          {left}
          <code className="inline-code-cus">{code}</code>
          {right.indexOf("`") > -1 ? renderInlineCode(right) : right}
        </span>
      );
    }
    return <>{content}</>;
  };

  const renderCode = (content: string) => {
    let temp = content;
    let indexOfStub = content.indexOf("```");
    let index2OfStub = 0;
    let left = "",
      code = "",
      right = "",
      lang = "";
    if (indexOfStub > -1) {
      left = content.substring(0, indexOfStub);
      temp = content.replace(left + "```", "");
      index2OfStub = temp.indexOf("```");
      code = temp.substring(0, index2OfStub);
      right = temp.replace(code + "```", "");
      lang = inferLang(code);
      code = code.replace(lang, "");
      return (
        <div>
          {renderInlineCode(left)}
          <SyntaxHighlighter
            style={a11yDark}
            language={lang}
            wrapLongLines={true}
            customStyle={{
              borderRadius: "5px",
            }}
          >
            {code}
          </SyntaxHighlighter>
          {right.indexOf("```") > -1
            ? renderCode(right)
            : renderInlineCode(right)}
        </div>
      );
    }
    return <div>{renderInlineCode(content)}</div>;
  };
  return (
    <div
      className={`p-2 w-full flex items-top ${
        item.role === "user" ? "flex-row-reverse" : ""
      }`}
      key={index}
    >
      {item.role === "user" ? (
        <UserIcon className="w-5 h-5 mx-2"></UserIcon>
      ) : (
        <ComputerDesktopIcon className="w-5 h-5 mx-2"></ComputerDesktopIcon>
      )}

      <div
        style={{
          textAlign: "left",
          maxWidth: "68%",
          backgroundColor: item.role === "user" ? "rgb(169,234,122)" : "white",
        }}
        className={`break-words rounded-xl p-2 content-bubble whitespace-pre-wrap ${
          item.role === "user" ? "content-bubble-right" : "content-bubble-left"
        }`}
      >
        {item.content.includes("```")
          ? renderCode(item.content)
          : renderInlineCode(item.content)}
      </div>
    </div>
  );
}
export default Item;
