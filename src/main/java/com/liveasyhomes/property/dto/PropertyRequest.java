package com.liveasyhomes.property.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.liveasyhomes.property.PropertyStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record PropertyRequest(
    @NotBlank(message = "Please enter a property title.")
    @Size(max = 120)
    String title,
    @NotBlank(message = "Please enter a location.")
    @Size(max = 180)
    String location,
    @Size(max = 80)
    String city,
    Double lat,
    Double lng,
    @NotBlank(message = "Please enter a monthly rent amount.")
    @JsonDeserialize(using = PriceDeserializer.class)
    String price,
    @NotNull(message = "Please enter the number of bedrooms.")
    @Min(value = 0, message = "Bedrooms cannot be negative.")
    @Max(value = 30, message = "Bedrooms cannot exceed 30.")
    Integer beds,
    @NotNull(message = "Please enter the number of bathrooms.")
    @Min(value = 0, message = "Bathrooms cannot be negative.")
    @Max(value = 30, message = "Bathrooms cannot exceed 30.")
    Integer baths,
    @NotNull(message = "Please enter the area in sqft.")
    @Min(value = 1, message = "Please enter the area in sqft.")
    @Max(value = 100000, message = "Area is too large.")
    Integer area,
    @Size(max = 40)
    String tag,
    String section,
    @NotBlank(message = "Please choose a property type.")
    @Size(max = 40)
    String propertyType,
    @Size(max = 20)
    String floorPlan,
    @NotBlank(message = "Please choose a furnishing option.")
    @Size(max = 40)
    String furnished,
    @Size(max = 80)
    String availableFrom,
    @Min(value = 0, message = "Onboarding charge cannot be negative.")
    Long onboardingCharge,
    @Size(max = 80)
    String deposit,
    @Size(max = 80)
    String maintenance,
    @NotBlank(message = "Please add a short description.")
    @Size(max = 5000)
    String description,
    @Size(max = 12, message = "You can add up to 12 highlights.")
    @JsonDeserialize(using = HighlightListDeserializer.class)
    List<@NotBlank @Size(max = 240) String> highlights,
    @Size(max = 20, message = "You can add up to 20 rent exclusions.")
    @JsonDeserialize(using = StringListDeserializer.class)
    List<@NotBlank @Size(max = 240) String> rentExcludes,
    @Size(max = 20, message = "You can add up to 20 items LivEasy Homes manages.")
    @JsonDeserialize(using = StringListDeserializer.class)
    List<@NotBlank @Size(max = 240) String> liveasyManages,
    @Size(max = 20, message = "You can add up to 20 owner responsibilities.")
    @JsonDeserialize(using = StringListDeserializer.class)
    List<@NotBlank @Size(max = 240) String> ownerResponsibilities,
    @Size(max = 5000, message = "Terms and conditions must be 5000 characters or fewer.")
    String termsAndConditions,
    @Size(max = 20, message = "You can add up to 20 amenities.")
    @JsonDeserialize(using = AmenityListDeserializer.class)
    List<AmenityInput> amenities,
    PropertyStatus status,
    Boolean isActive
) {
}
