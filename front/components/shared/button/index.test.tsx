import { render } from "@testing-library/react";
import { describe, it, vi } from "vitest";
import Button from ".";

describe("mainページ", () => {
  it("正しくレンダリングされること", () => {
    render(<Button />);
  });
});
