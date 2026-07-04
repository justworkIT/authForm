import { test, expect } from "@playwright/test";

/**
 * These tests exercise real flows against a live Supabase project — they
 * are not mocked. Run against a DEV/TEST Supabase project, never production,
 * since signup tests create real (if throwaway) user accounts.
 *
 * Flows requiring email inbox access (confirming a signup, clicking a reset
 * link) aren't covered here since that needs an email-testing service
 * (e.g. Mailosaur, Ethereal) wired up separately — out of scope for this
 * starter suite. What's covered is everything reachable without an inbox.
 */

function uniqueEmail() {
  return `authform.e2e.${Date.now()}.${Math.random().toString(36).slice(2)}@example.com`;
}

test.describe("Signup", () => {
  test("shows validation error for an invalid email", async ({ page }) => {
    await page.goto("/signup");
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByLabel("Password", { exact: true }).fill("password123");
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page.getByRole("alert")).toContainText(/valid email/i);
  });

  test("shows validation error for a short password", async ({ page }) => {
    await page.goto("/signup");
    await page.getByLabel("Email").fill(uniqueEmail());
    await page.getByLabel("Password", { exact: true }).fill("short");
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page.getByRole("alert")).toContainText(/at least 8 characters/i);
  });

  test("shows a confirmation message after successful signup", async ({ page }) => {
    await page.goto("/signup");
    await page.getByLabel("Email").fill(uniqueEmail());
    await page.getByLabel("Password", { exact: true }).fill("a-secure-password-123");
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page.getByRole("alert")).toContainText(/check your email/i);
  });

  test("shows the Google OAuth option", async ({ page }) => {
    await page.goto("/signup");
    await expect(
      page.getByRole("button", { name: /continue with google/i })
    ).toBeVisible();
  });
});

test.describe("Login", () => {
  test("shows a generic error for invalid credentials (no user enumeration)", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(uniqueEmail());
    await page.getByLabel("Password", { exact: true }).fill("wrong-password-123");
    await page.getByRole("button", { name: "Log in" }).click();
    await expect(page.getByRole("alert")).toContainText(/invalid email or password/i);
  });

  test("has a link to the forgot-password page", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("link", { name: /forgot password/i }).click();
    await expect(page).toHaveURL(/\/forgot-password/);
  });

  test("has a link to the signup page", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("link", { name: /sign up/i }).click();
    await expect(page).toHaveURL(/\/signup/);
  });
});

test.describe("Password visibility toggle", () => {
  test("toggles the password field between hidden and visible", async ({ page }) => {
    await page.goto("/login");
    const passwordField = page.getByLabel("Password", { exact: true });
    await expect(passwordField).toHaveAttribute("type", "password");

    await page.getByRole("button", { name: /show password/i }).click();
    await expect(passwordField).toHaveAttribute("type", "text");

    await page.getByRole("button", { name: /hide password/i }).click();
    await expect(passwordField).toHaveAttribute("type", "password");
  });
});

test.describe("Forgot password", () => {
  test("shows the same generic success message for any email", async ({ page }) => {
    await page.goto("/forgot-password");
    await page.getByLabel("Email").fill(uniqueEmail());
    await page.getByRole("button", { name: /send reset link/i }).click();
    await expect(page.getByRole("alert")).toContainText(/reset link is on its way/i);
  });

  test("rejects an invalid email before hitting the server", async ({ page }) => {
    await page.goto("/forgot-password");
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByRole("button", { name: /send reset link/i }).click();
    await expect(page.getByRole("alert")).toContainText(/valid email/i);
  });
});

test.describe("Protected routes", () => {
  test("redirects unauthenticated users from /dashboard to /login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("redirects unauthenticated users from /reset-password to /forgot-password", async ({
    page,
  }) => {
    await page.goto("/reset-password");
    await expect(page).toHaveURL(/\/forgot-password/);
  });

  test("root path redirects to /login when logged out", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
  });
});
