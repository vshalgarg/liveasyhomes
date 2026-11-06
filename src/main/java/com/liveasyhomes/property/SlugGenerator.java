package com.liveasyhomes.property;

import java.util.Locale;
import java.util.function.Predicate;

public final class SlugGenerator {

  private SlugGenerator() {
  }

  public static String slugify(String text) {
    String slug = text == null ? "" : text.toLowerCase(Locale.ROOT).trim()
        .replaceAll("[^a-z0-9\\s-]", "")
        .replaceAll("\\s+", "-")
        .replaceAll("-+", "-")
        .replaceAll("^-|-$", "");
    return slug.isBlank() ? "property" : slug;
  }

  public static String unique(String title, Predicate<String> taken) {
    String base = slugify(title);
    if (!taken.test(base)) {
      return base;
    }
    int suffix = 2;
    while (taken.test(base + "-" + suffix)) {
      suffix++;
    }
    return base + "-" + suffix;
  }
}
