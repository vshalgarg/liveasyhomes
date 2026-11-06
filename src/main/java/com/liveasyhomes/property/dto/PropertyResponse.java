package com.liveasyhomes.property.dto;

import com.liveasyhomes.property.PropertyStatus;
import java.time.Instant;
import java.util.List;

/**
 * JSON shape matches the Next.js listing object. {@code id} is the slug
 * ({@code maple-heights}), and {@code price} is the Indian-formatted rent.
 */
public record PropertyResponse(
    String id,
    String title,
    String location,
    String city,
    Double lat,
    Double lng,
    String price,
    long priceAmount,
    int beds,
    int baths,
    int area,
    String tag,
    String section,
    String propertyType,
    String floorPlan,
    String furnished,
    String availableFrom,
    long onboardingCharge,
    String deposit,
    String maintenance,
    List<String> images,
    String description,
    List<String> highlights,
    List<String> rentExcludes,
    List<String> liveasyManages,
    List<String> ownerResponsibilities,
    String termsAndConditions,
    List<AmenityResponse> amenities,
    PropertyStatus status,
    boolean isActive,
    boolean isUserAdded,
    List<PhotoResponse> photos,
    Instant createdAt,
    Instant updatedAt
) {
}
