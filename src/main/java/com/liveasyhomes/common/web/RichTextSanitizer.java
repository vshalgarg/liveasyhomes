package com.liveasyhomes.common.web;

import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;

/** Keeps the same formatting the listing editor allows, and drops scripts and attributes. */
public final class RichTextSanitizer {

  private static final Safelist ALLOWED = Safelist.none()
      .addTags("b", "strong", "i", "em", "u", "br", "p", "div", "span");

  private RichTextSanitizer() {
  }

  public static String clean(String value) {
    if (value == null || value.isBlank()) {
      return "";
    }
    return Jsoup.clean(value, ALLOWED).trim();
  }
}
