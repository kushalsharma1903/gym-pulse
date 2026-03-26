export function generateWhatsAppMessage(
  memberName: string,
  gymName: string,
  daysLeft: number,
  gymPhone: string,
  waTemplate?: string
): string {
  const daysText =
    daysLeft < 0
      ? "has expired"
      : daysLeft === 0
      ? "today"
      : daysLeft === 1
      ? "tomorrow"
      : `in ${daysLeft} days`;

  const phoneLine = gymPhone ? `📞 Call us: ${gymPhone}` : "";

  const defaultTemplate = `Hi {name} 👋\n\nYour membership at *{gym}* expires *{days}*.\n\nDon’t lose your progress 💪\nRenew now and stay consistent.\n\n{phoneLine}`;

  const templateToUse = waTemplate || defaultTemplate;

  const message = templateToUse
    .replace(/{name}/g, memberName || "Member")
    .replace(/{gym}/g, gymName || "your gym")
    .replace(/{days}/g, daysText)
    .replace(/{phone}/g, gymPhone || "")
    .replace(/{phoneLine}/g, phoneLine);

  return message.trim();
}
