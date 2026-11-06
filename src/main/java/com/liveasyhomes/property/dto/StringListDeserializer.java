package com.liveasyhomes.property.dto;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/** Accepts a string array or newline-separated text for a repeatable property field. */
public class StringListDeserializer extends JsonDeserializer<List<String>> {

  @Override
  public List<String> deserialize(JsonParser parser, DeserializationContext context) throws IOException {
    JsonNode node = parser.readValueAsTree();
    if (node == null || node.isNull()) {
      return null;
    }
    String field = parser.currentName() == null ? "items" : parser.currentName();
    if (node.isTextual()) {
      return Arrays.stream(node.asText().split("\\R"))
          .map(String::trim)
          .filter(line -> !line.isEmpty())
          .toList();
    }
    if (!node.isArray()) {
      throw context.weirdStringException(node.toString(), List.class, field + " must be a list or text");
    }
    List<String> items = new ArrayList<>();
    for (JsonNode item : node) {
      if (item.isTextual() && !item.asText().isBlank()) {
        items.add(item.asText().trim());
      }
    }
    return items;
  }
}
