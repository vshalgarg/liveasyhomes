package com.liveasyhomes.visit;

import java.util.regex.Pattern;

public final class PhoneNumbers {

  private static final Pattern E164 = Pattern.compile("^\\+[1-9]\\d{7,14}$");

  private PhoneNumbers() {
  }

  /** Turns a 10-digit Indian number, or an existing E.164 number, into E.164. */
  public static String toE164(String raw) {
    if (raw == null) {
      return "";
    }
    String trimmed = raw.trim();
    String digits = trimmed.replaceAll("\\D", "");
    if (digits.isEmpty()) {
      return "";
    }
    if (digits.length() == 10) {
      return "+91" + digits;
    }
    if (digits.length() == 11 && digits.startsWith("0")) {
      return "+91" + digits.substring(1);
    }
    if (digits.length() == 12 && digits.startsWith("91")) {
      return "+" + digits;
    }
    if (trimmed.startsWith("+") && digits.length() >= 8 && digits.length() <= 15) {
      return "+" + digits;
    }
    return "";
  }

  public static boolean isE164(String value) {
    return value != null && E164.matcher(value).matches();
  }
}
