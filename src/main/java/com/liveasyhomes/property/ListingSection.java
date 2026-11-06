package com.liveasyhomes.property;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import com.liveasyhomes.common.error.ApiException;
import java.util.Locale;

public enum ListingSection {
  FEATURED("featured"),
  NEW("new");

  private final String value;

  ListingSection(String value) {
    this.value = value;
  }

  @JsonValue
  public String value() {
    return value;
  }

  @JsonCreator
  public static ListingSection from(String raw) {
    if (raw == null || raw.isBlank()) {
      return null;
    }
    String normalized = raw.trim().toLowerCase(Locale.ROOT);
    for (ListingSection section : values()) {
      if (section.value.equals(normalized) || section.name().equalsIgnoreCase(raw.trim())) {
        return section;
      }
    }
    throw new ApiException(400, "Section must be featured or new.");
  }
}
