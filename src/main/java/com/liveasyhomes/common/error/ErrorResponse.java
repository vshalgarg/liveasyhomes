package com.liveasyhomes.common.error;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(String error, Map<String, String> fields) {

  public static ErrorResponse of(String error) {
    return new ErrorResponse(error, null);
  }
}
