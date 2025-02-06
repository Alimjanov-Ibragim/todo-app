import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Page from "@/app/todos/page";
import { TestWrapper } from "@/lib/TestWrapper";

describe("Page", () => {
  it("renders a heading", () => {
    render(
      <TestWrapper>
        <Page />
      </TestWrapper>
    );

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toBeInTheDocument();
  });
});
