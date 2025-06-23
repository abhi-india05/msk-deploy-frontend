import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";


import Login from "./Login";

describe("login form", () => {
it("fills and submits", () => {
render(
<MemoryRouter>
<ThemeProvider>
<Login />
</ThemeProvider>
</MemoryRouter>
);
const emailInput = screen.getByLabelText(/email/i);
const passwordInput = screen.getByLabelText(/password/i);
const submitButton = screen.getByRole("button", { name: /log in/i });

fireEvent.change(emailInput, { target: { value: "test@example.com" } });
fireEvent.change(passwordInput, { target: { value: "test123" } });
fireEvent.click(submitButton);

expect(emailInput.value).toBe("test@example.com");
expect(passwordInput.value).toBe("test123");
});
});