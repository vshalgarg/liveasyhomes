package com.liveasyhomes.property.dto;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/** Accepts either a string array or the add-property textarea (newline-separated). */
public class HighlightListDeserializer extends JsonDeserializer<List<String>> {

  @Override
  public List<String> deserialize(JsonParser parser, DeserializationContext context) throws IOException {
    JsonNode node = parser.readValueAsTree();
    if (node == null || node.isNull()) {
      return null;
    }
    if (node.isTextual()) {
      return Arrays.stream(node.asText().split("\\R"))
          .map(String::trim)
          .filter(line -> !line.isEmpty())
          .toList();
    }
    if (!node.isArray()) {
      throw context.weirdStringException(node.toString(), List.class, "highlights must be a list or text");
    }
    List<String> highlights = new ArrayList<>();
    for (JsonNode item : node) {
      if (item.isTextual() && !item.asText().isBlank()) {
        highlights.add(item.asText().trim());
      }
    }
    return highlights;
  }
}
