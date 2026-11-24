const WHATSAPP_SUPPORT = "https://wa.me/918368371597";
export function trialRequestUrl(mobile = "") {
  const registeredMobile = typeof mobile === "string" && /^[6-9]\d{9}$/.test(mobile.trim())
    ? mobile.trim() : "";
  const message = "Hello UnderSigned, I would like to request a 24-hour trial. My registered mobile number is: " + registeredMobile;
  return WHATSAPP_SUPPORT + "?text=" + encodeURIComponent(message);
}

