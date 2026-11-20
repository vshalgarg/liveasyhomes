const COUNTRY_CODES = [
  { code: "+91", label: "India (+91)", digits: 10 },
  { code: "+1", label: "US/Canada (+1)", digits: 10 },
  { code: "+44", label: "UK (+44)", digits: 10 },
  { code: "+971", label: "UAE (+971)", digits: 9 },
];

export function getCountryOptions() {
  return COUNTRY_CODES;
}

export function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

/**
 * Build E.164 phone number from country code + national number.
 * Returns null when invalid.
 */
export function toE164(countryCode, nationalNumber) {
  const code = String(countryCode || "").trim();
  const raw = String(nationalNumber || "").trim();

  // Already E.164
  if (/^\+\d{8,15}$/.test(raw)) return raw;

  // Bare 10-digit Indian number → +91 (matches backend comparison rules)
  const bare = digitsOnly(raw);
  if ((!code || code === "+91") && /^[6-9]\d{9}$/.test(bare)) {
    return `+91${bare}`;
  }

  if (!/^\+\d{1,4}$/.test(code)) return null;

  const digits = bare;
  const meta = COUNTRY_CODES.find((item) => item.code === code);
  const expected = meta?.digits || 10;

  if (digits.length !== expected) return null;
  if (code === "+91" && !/^[6-9]\d{9}$/.test(digits)) return null;

  return `${code}${digits}`;
}

export function maskPhone(e164) {
  const value = String(e164 || "");
  if (value.length < 6) return value;
  const visible = value.slice(-4);
  const prefix = value.slice(0, value.length - 4).replace(/\d/g, "•");
  return `${prefix}${visible}`;
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}
