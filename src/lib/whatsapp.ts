export const WHATSAPP_DIGITS = "66928320802";
export const WHATSAPP_DISPLAY = "+66 92 832 0802";
export const WHATSAPP_ME = `https://wa.me/${WHATSAPP_DIGITS}`;

function isMobileUserAgent(userAgent: string) {
  return /Android|iPhone|iPad|iPod|webOS|Mobile/i.test(userAgent);
}

/** Desktop opens WhatsApp Web; phones use wa.me (which opens the app). */
export function whatsappHref(text: string, userAgent?: string) {
  const encoded = encodeURIComponent(text);
  const ua = userAgent ?? (typeof navigator === "undefined" ? "" : navigator.userAgent);
  if (ua && !isMobileUserAgent(ua)) {
    return `https://web.whatsapp.com/send?phone=${WHATSAPP_DIGITS}&text=${encoded}`;
  }
  return `${WHATSAPP_ME}?text=${encoded}`;
}

export function openWhatsApp(text: string) {
  const href = whatsappHref(text);
  const opened = window.open(href, "_blank", "noopener,noreferrer");
  if (!opened) {
    window.location.href = href;
  }
  return href;
}

export function contactWhatsAppText(input: {
  name: string;
  message: string;
  interest: string;
}) {
  return [
    `Hi Tara & Jenny — I’m ${input.name}.`,
    `I’m writing about the Phuket Pole Art Retreat (${input.interest}).`,
    "",
    input.message.trim(),
  ].join("\n");
}

export function chatWhatsAppText(input: { name?: string; message: string }) {
  const who = input.name?.trim() ? `I’m ${input.name.trim()}. ` : "";
  return `Hi Tara & Jenny — ${who}${input.message.trim()}`;
}
