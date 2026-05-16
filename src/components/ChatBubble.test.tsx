import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ChatBubble from "./ChatBubble";

describe("ChatBubble", () => {
  it("メッセージ内容が表示される", () => {
    render(<ChatBubble message="こんにちは" isUser={false} />);
    expect(screen.getByText("こんにちは")).toBeInTheDocument();
  });

  it("isUser=true のとき chat-end クラスが付く", () => {
    const { container } = render(<ChatBubble message="hello" isUser={true} />);
    expect(container.firstChild).toHaveClass("chat-end");
  });

  it("isUser=false のとき chat-start クラスが付く", () => {
    const { container } = render(<ChatBubble message="hello" isUser={false} />);
    expect(container.firstChild).toHaveClass("chat-start");
  });

  it("isUser=true のとき chat-bubble-primary クラスが付く", () => {
    const { container } = render(<ChatBubble message="hello" isUser={true} />);
    expect(container.querySelector(".chat-bubble")).toHaveClass("chat-bubble-primary");
  });

  it("isUser=false のとき chat-bubble-primary クラスが付かない", () => {
    const { container } = render(<ChatBubble message="hello" isUser={false} />);
    expect(container.querySelector(".chat-bubble")).not.toHaveClass("chat-bubble-primary");
  });
});
