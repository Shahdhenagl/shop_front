// Style: SAFETY ENG — قواعد إدخال بسيطة وواضحة، برسائل عربية قابلة لإعادة الاستخدام في نماذج الخدمة.
const arabicDigits = "٠١٢٣٤٥٦٧٨٩";

export function normalizePhone(value: string) {
  let digits = value
    .split("")
    .map((character) => {
      const index = arabicDigits.indexOf(character);
      return index >= 0 ? String(index) : character;
    })
    .join("")
    .replace(/\D/g, "");

  if (digits.startsWith("0020") && digits.length === 14) digits = `0${digits.slice(4)}`;
  if (digits.startsWith("20") && digits.length === 12) digits = `0${digits.slice(2)}`;
  return digits;
}

export function isValidEgyptianPhone(value: string) {
  return /^01[0125]\d{8}$/.test(normalizePhone(value));
}

export const phoneValidationMessage = "اكتبي رقم موبايل مصري صحيح يبدأ بـ 010 أو 011 أو 012 أو 015.";
