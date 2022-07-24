import { formatDate, validateEmail } from "./utils";

test("validateEmail returns false for non-emails", () => {
  expect(validateEmail(undefined)).toBe(false);
  expect(validateEmail(null)).toBe(false);
  expect(validateEmail("")).toBe(false);
  expect(validateEmail("not-an-email")).toBe(false);
  expect(validateEmail("n@")).toBe(false);
});

test("validateEmail returns true for emails", () => {
  expect(validateEmail("kody@example.com")).toBe(true);
});

test("formatDate format dates as expected", () => {
  const rawDate = "2022-07-24T14:31:04.092Z";
  expect(formatDate(rawDate)).toBe("Sunday, July 24th, 2022 at 4:31 PM");
});
