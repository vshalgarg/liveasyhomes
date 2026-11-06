package com.liveasyhomes.visit.dto;

public record VisitBookedResponse(boolean success, String message, Booking booking) {

  public record Booking(String name, String email, String propertyId, String propertyTitle) {
  }
}
