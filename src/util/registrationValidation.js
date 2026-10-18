// Keep this policy identical in server/utils and client/src/util; parity is tested.
const PLACEHOLDER_NAMES = new Set([
  "abc", "abcd", "abcdef", "xyz", "qwerty", "asdf", "asdfgh", "asdfghjkl", "zxcv",
  "test", "testing", "test user", "testuser", "dummy", "dummy user", "dummyuser",
  "sample", "sample user", "anonymous", "unknown", "your name", "full name",
  "name", "username", "enter name", "no name", "admin", "administrator",
]);
function isValidEmail(value) {
  if (typeof value !== "string" || value.length > 254) return false;
  const parts = value.split("@");
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (!local || local.length > 64 || !/^[a-z0-9.!#$%&'*+/=?^_\x60{|}~-]+$/i.test(local) ||
      local.startsWith(".") || local.endsWith(".") || local.includes("..")) return false;
  const labels = domain.split(".");
  return labels.length >= 2 && labels.every(label =>
    label.length >= 1 && label.length <= 63 && /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(label)) &&
    /^[a-z]{2,63}$/i.test(labels[labels.length - 1]);
}
function normalizeName(value) {
  return typeof value === "string" ? value.normalize("NFC").trim().replace(/\s+/gu, " ") : "";
}
function validateRegistration(input) {
  const errors = {};
  if (!input || typeof input !== "object" || Array.isArray(input))
    return { data: {}, errors: { form: "Please submit valid registration details." } };
  const nameTooLong = typeof input.name === "string" && input.name.length > 160;
  const name = nameTooLong ? "" : normalizeName(input.name);
  const mobile = typeof input.mobile === "string" ? input.mobile.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const password = typeof input.password === "string" ? input.password : "";
  const batch = typeof input.batch === "string" ? input.batch.trim() : "";
  if (nameTooLong) errors.name = "Enter a name with no more than 80 characters.";
  else if (!name) errors.name = "Enter your name.";
  else if (Array.from(name).length > 80 || (name.match(/\p{L}/gu) || []).length < 2)
    errors.name = "Enter a name with at least 2 letters and no more than 80 characters.";
  else if (!/^[\p{L}\p{M} .'\u2019\u02BC\p{Pd}\u200C\u200D]+$/u.test(name) ||
      !/^\p{L}/u.test(name) || !/[\p{L}\p{M}.]$/u.test(name) || /[.]{2}|[-]{2}|[']{2}/u.test(name))
    errors.name = "Use letters, spaces, initials, apostrophes or hyphens in your name.";
  else if (PLACEHOLDER_NAMES.has(name.toLowerCase()) || /^(\p{L})\1{3,}$/iu.test(name))
    errors.name = "Enter your name rather than a placeholder such as ABC, test or dummy.";
  if (!/^[6-9][0-9]{9}$/.test(mobile))
    errors.mobile = "Enter a 10-digit Indian mobile number starting with 6, 7, 8 or 9.";
  if (!isValidEmail(email))
    errors.email = "Enter a valid email address, such as name@example.in.";
  if (password.length < 6)
    errors.password = "Use at least 6 characters for your password.";
  else if (password.length > 72 || new TextEncoder().encode(password).length > 72 || /\p{Cc}/u.test(password))
    errors.password = "Use a password of at most 72 UTF-8 bytes without control characters.";
  if ((input.batch !== undefined && typeof input.batch !== "string") || batch.length > 40 || /[\p{Cc}<>]/u.test(batch))
    errors.batch = "Enter a batch year or short batch description (up to 40 characters).";
  return { data: { name, mobile, email, password, batch }, errors };
}

export { validateRegistration, isValidEmail, normalizeName };
