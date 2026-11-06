package com.liveasyhomes.property;

import com.liveasyhomes.common.error.ApiException;

public final class PriceFormat {

  private PriceFormat() {
  }

  public static long parse(String raw) {
    if (raw == null || raw.isBlank()) {
      throw new ApiException(400, "Please enter a monthly rent amount.");
    }
    String digits = raw.replaceAll("[^\\d]", "");
    if (digits.isEmpty()) {
      throw new ApiException(400, "Please enter a monthly rent amount.");
    }
    try {
      long amount = Long.parseLong(digits);
      if (amount < 1) {
        throw new ApiException(400, "Please enter a monthly rent amount.");
      }
      return amount;
    } catch (NumberFormatException ex) {
      throw new ApiException(400, "Please enter a valid monthly rent amount.");
    }
  }

  /** Indian grouping, matching JavaScript {@code toLocaleString("en-IN")}. */
  public static String format(long amount) {
    boolean negative = amount < 0;
    String digits = Long.toString(Math.abs(amount));
    if (digits.length() <= 3) {
      return (negative ? "-" : "") + digits;
    }
    String lastThree = digits.substring(digits.length() - 3);
    String rest = digits.substring(0, digits.length() - 3);
    StringBuilder grouped = new StringBuilder();
    int start = rest.length() % 2;
    if (start > 0) {
      grouped.append(rest, 0, start);
    }
    for (int index = start; index < rest.length(); index += 2) {
      if (!grouped.isEmpty()) {
        grouped.append(',');
      }
      grouped.append(rest, index, index + 2);
    }
    grouped.append(',').append(lastThree);
    return (negative ? "-" : "") + grouped;
  }
}
