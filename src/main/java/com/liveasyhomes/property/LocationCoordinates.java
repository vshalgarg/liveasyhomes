package com.liveasyhomes.property;

import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

public final class LocationCoordinates {

  public record Coords(double lat, double lng) {
  }

  private static final Coords BANGALORE = new Coords(12.9716, 77.5946);
  private static final Map<String, Coords> LOCALITIES = new LinkedHashMap<>();

  static {
    LOCALITIES.put("indiranagar", new Coords(12.9784, 77.6408));
    LOCALITIES.put("koramangala", new Coords(12.9352, 77.6245));
    LOCALITIES.put("hsr layout", new Coords(12.9116, 77.6474));
    LOCALITIES.put("hsr", new Coords(12.9116, 77.6474));
    LOCALITIES.put("whitefield", new Coords(12.9698, 77.7499));
    LOCALITIES.put("jayanagar", new Coords(12.925, 77.5938));
    LOCALITIES.put("bellandur", new Coords(12.926, 77.6762));
    LOCALITIES.put("jp nagar", new Coords(12.9063, 77.5857));
    LOCALITIES.put("btm layout", new Coords(12.9166, 77.6101));
    LOCALITIES.put("hebbal", new Coords(13.0358, 77.597));
    LOCALITIES.put("electronic city", new Coords(12.8399, 77.677));
    LOCALITIES.put("marathahalli", new Coords(12.9591, 77.6974));
  }

  private LocationCoordinates() {
  }

  public static Coords resolve(String location) {
    String key = location == null ? "" : location.toLowerCase(Locale.ROOT);
    for (Map.Entry<String, Coords> entry : LOCALITIES.entrySet()) {
      if (key.contains(entry.getKey())) {
        return entry.getValue();
      }
    }
    return BANGALORE;
  }
}
