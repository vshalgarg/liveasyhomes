package com.liveasyhomes.property;

import com.liveasyhomes.common.error.ApiException;
import com.liveasyhomes.property.dto.AmenityInput;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

public final class AmenityCatalog {

  private static final Map<String, String> OPTIONS = new LinkedHashMap<>();

  static {
    OPTIONS.put("wifi", "High-speed WiFi");
    OPTIONS.put("power", "Power backup");
    OPTIONS.put("security", "24/7 security");
    OPTIONS.put("housekeeping", "Weekly housekeeping");
    OPTIONS.put("parking", "Reserved parking");
    OPTIONS.put("ac", "Air conditioning");
    OPTIONS.put("gym", "Fitness centre access");
    OPTIONS.put("pool", "Swimming pool");
    OPTIONS.put("garden", "Shared garden access");
  }

  private AmenityCatalog() {
  }

  public static List<Amenity> resolve(List<AmenityInput> requested) {
    if (requested == null || requested.isEmpty()) {
      return defaults();
    }

    List<Amenity> amenities = new ArrayList<>();
    for (AmenityInput input : requested) {
      if (input == null || input.key() == null || input.key().isBlank()) {
        throw new ApiException(400, "Each amenity needs a key.");
      }
      String key = input.key().trim().toLowerCase(Locale.ROOT);
      String known = OPTIONS.get(key);
      if (known == null) {
        throw new ApiException(400, "Unknown amenity: " + key);
      }
      boolean alreadyAdded = amenities.stream().anyMatch(amenity -> amenity.getKey().equals(key));
      if (alreadyAdded) {
        continue;
      }
      String label = input.label() == null || input.label().isBlank() ? known : input.label().trim();
      amenities.add(new Amenity(key, label));
    }
    return amenities.isEmpty() ? defaults() : amenities;
  }

  private static List<Amenity> defaults() {
    return OPTIONS.entrySet().stream()
        .limit(6)
        .map(entry -> new Amenity(entry.getKey(), entry.getValue()))
        .toList();
  }
}
