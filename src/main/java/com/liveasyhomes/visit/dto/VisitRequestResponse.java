package com.liveasyhomes.visit.dto;

public record VisitRequestResponse(boolean success, String message, Data data) {

  public record Data(String requestId, String status) {
  }
}
