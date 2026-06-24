export function getStoredRegisteredIdentity() {
  const token = localStorage.getItem("jwtToken");
  const registeredUser = safeParseJson(localStorage.getItem("registeredUser"));

  if (!token || !registeredUser) {
    return {
      isLoggedIn: false,
      username: "",
      mobile: "",
    };
  }

  return {
    isLoggedIn: true,
    username: registeredUser.name || registeredUser.username || "",
    mobile: registeredUser.mobile || "",
  };
}

function safeParseJson(value) {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
