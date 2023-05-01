import { getTestName, signin, takeShot } from "../utils.js";
import { expect, test } from "@playwright/test";

const name = getTestName(import.meta.url);
test.describe(name, async () => {
  const correct = name + "/correct";
  test(correct, async ({ page }) => {
    await takeShot(page, correct + "/before");
    await signin(page);
    await takeShot(page, correct + "/after");

    const url = page.url();
    expect(url.endsWith("/")).toBe(true);
  });

  const incorrect = name + "/incorrect";
  test(incorrect, async ({ page }) => {
    await takeShot(page, incorrect + "/before");
    await signin(page, "wrong@gmailcom", "wrong");
    await takeShot(page, incorrect + "/after");
  });
});
