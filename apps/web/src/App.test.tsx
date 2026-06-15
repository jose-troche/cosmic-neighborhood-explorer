import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { App } from "./App";

vi.mock("@react-three/fiber", () => ({
  Canvas: () => <div data-testid="canvas" />,
  useFrame: () => undefined
}));

vi.mock("@react-three/drei", () => ({
  Html: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  OrbitControls: () => null,
  Stars: () => null
}));

describe("App", () => {
  it("loads the app experience with catalog metrics", async () => {
    render(<App />);

    await waitFor(() => expect(screen.getByText("Cosmic Neighborhood Explorer")).toBeInTheDocument());
    expect(await screen.findByText(/stars, .* exoplanets/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Worlds/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Deep Sky/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Density/ })).toBeInTheDocument();
    expect(screen.getByLabelText("3D map layers")).toBeInTheDocument();
    expect(screen.getAllByText("Selected Star").length).toBeGreaterThan(0);
  });
});
