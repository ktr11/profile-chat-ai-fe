import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "./Header";

describe("Header", () => {
  it("ハンバーガーボタンを押すとモバイルメニューが開く", async() => {
    render(<Header/>);
    expect(screen.getAllByRole("link", { name: "About" })).toHaveLength(1);
    await userEvent.click(screen.getByRole("button", { name: "Toggle menu" }));
    expect(screen.getAllByRole("link", { name: "About" })).toHaveLength(2);
  });

  it("ハンバーガーボタンを押すとモバイルメニューが閉じる", async() => {
    render(<Header/>);
    await userEvent.click(screen.getByRole("button", { name: "Toggle menu" }));
    expect(screen.getAllByRole("link", { name: "About" })).toHaveLength(2);
    await userEvent.click(screen.getByRole("button", { name: "Toggle menu" }));
    expect(screen.getAllByRole("link", { name: "About" })).toHaveLength(1);
  });

});
