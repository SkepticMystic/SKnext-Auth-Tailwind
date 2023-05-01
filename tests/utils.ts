import type { Page } from "@playwright/test";
import { config } from "dotenv";
config();

export const getTestName = (url: string, parts = 2) => {
  const splits = url.split("/");
  return splits
    .slice(splits.length - parts, splits.length)
    .join("/")
    .split(".test.ts")[0];
};

export const takeShot = async (page: Page, name: string) =>
  await page.screenshot({ path: `./shots/${name}.png` });

export const signin = async (
  page: Page,
  email = "email@gmail.com",
  password = <string>process.env.TEST_PASSWORD
) => {
  await page.goto("/signin");
  await page.fill("input[name=email]", email);
  await page.fill("input[name=password]", password);
  await page.click("button:has-text('Sign in')");
  await page.waitForNavigation();
};
