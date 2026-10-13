import {expect, test} from "@playwright/test";

test("runs a greenlight read and filters evidence", async ({page}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", {name: "Echoes of Bracken"})).toBeVisible();
  await page.getByRole("button", {name: "Run greenlight read"}).click();
  await expect(page.getByTestId("verdict")).toContainText("INVESTIGATE");
  await expect(page.getByTestId("verdict")).toContainText("56");
  await page.getByRole("button", {name: "Rights"}).click();
  await expect(page.getByRole("heading", {name: "Asset provenance"})).toBeVisible();
  await expect(page.getByRole("heading", {name: "Code health"})).toHaveCount(0);
});

test("candidate switch clears stale result and error can recover", async ({page}) => {
  await page.goto("/");
  await page.getByRole("button", {name: /Starfall Courier/}).click();
  await page.getByLabel("Simulate service failure").check();
  await page.getByRole("button", {name: "Run greenlight read"}).click();
  await expect(page.locator(".error-panel")).toContainText("ASSESSMENT_UNAVAILABLE");
  await page.getByRole("button", {name: "Retry assessment"}).click();
  await expect(page.getByTestId("verdict")).toContainText("SIGN");
  await page.getByRole("button", {name: /Neon Kennel/}).click();
  await expect(page.getByText("No decision issued yet")).toBeVisible();
});

test("mobile layout contains horizontal overflow", async ({page}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile-only assertion");
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.getByRole("button", {name: /Neon Kennel/}).click();
  await page.getByRole("button", {name: "Run greenlight read"}).click();
  await expect(page.getByTestId("verdict")).toContainText("REJECT");
});
