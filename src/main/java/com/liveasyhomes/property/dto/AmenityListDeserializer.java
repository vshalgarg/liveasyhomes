package com.liveasyhomes.property.dto;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/** Accepts ["wifi"] or [{"key":"wifi","label":"High-speed WiFi"}]. */
public class AmenityListDeserializer extends JsonDeserializer<List<AmenityInput>> {

  @Override
  public List<AmenityInput> deserialize(JsonParser parser, DeserializationContext context) throws IOException {
    JsonNode node = parser.readValueAsTree();
    if (node == null || node.isNull()) {
      return null;
    }
    if (!node.isArray()) {
      throw context.weirdStringException(node.toString(), List.class, "amenities must be a list");
    }
    List<AmenityInput> amenities = new ArrayList<>();
    for (JsonNode item : node) {
      if (item.isTextual()) {
        amenities.add(new AmenityInput(item.asText(), null));
      } else if (item.isObject()) {
        String key = text(item.get("key"));
        String label = text(item.get("label"));
        amenities.add(new AmenityInput(key, label));
      }
    }
    return amenities;
  }

  private static String text(JsonNode node) {
    if (node == null || node.isNull()) {
      return null;
    }
    return node.asText();
  }
}
