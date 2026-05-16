import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatInput from "./ChatInput";

describe("ChatInput", () => {
  it("入力フォームと送信ボタンが表示される", () => {
    render(<ChatInput onSend={vi.fn()} />);
    expect(screen.getByPlaceholderText("メッセージを入力...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "送信" })).toBeInTheDocument();
  });

  it("テキストを入力して送信すると onSend が呼ばれる", async () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);

    await userEvent.type(screen.getByPlaceholderText("メッセージを入力..."), "hello");
    await userEvent.click(screen.getByRole("button", { name: "送信" }));

    expect(onSend).toHaveBeenCalledWith("hello");
  });

  it("送信後に入力フィールドがクリアされる", async () => {
    render(<ChatInput onSend={vi.fn()} />);
    const input = screen.getByPlaceholderText("メッセージを入力...");

    await userEvent.type(input, "hello");
    await userEvent.click(screen.getByRole("button", { name: "送信" }));

    expect(input).toHaveValue("");
  });

  it("空文字のみのときは onSend が呼ばれない", async () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);

    await userEvent.type(screen.getByPlaceholderText("メッセージを入力..."), "   ");
    await userEvent.click(screen.getByRole("button", { name: "送信" }));

    expect(onSend).not.toHaveBeenCalled();
  });

  it("disabled=true のとき入力とボタンが無効になる", () => {
    render(<ChatInput onSend={vi.fn()} disabled={true} />);
    expect(screen.getByPlaceholderText("メッセージを入力...")).toBeDisabled();
    expect(screen.getByRole("button", { name: "送信" })).toBeDisabled();
  });

  it("disabled=true のとき onSend が呼ばれない", async () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} disabled={true} />);

    await userEvent.type(screen.getByPlaceholderText("メッセージを入力..."), "hello");
    await userEvent.click(screen.getByRole("button", { name: "送信" }));

    expect(onSend).not.toHaveBeenCalled();
  });
});
