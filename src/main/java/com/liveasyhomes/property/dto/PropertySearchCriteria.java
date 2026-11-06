package com.liveasyhomes.property.dto;

import com.liveasyhomes.property.PropertyStatus;

public record PropertySearchCriteria(
    String section,
    String city,
    String location,
    Long minPrice,
    Long maxPrice,
    String propertyType,
    Integer beds,
    String q,
    PropertyStatus status,
    boolean mine,
    int page,
    int size
) {
}
