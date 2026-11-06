package com.liveasyhomes.property;

import com.liveasyhomes.property.dto.AmenityResponse;
import com.liveasyhomes.property.dto.PhotoResponse;
import com.liveasyhomes.property.dto.PropertyResponse;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class PropertyMapper {

  public PropertyResponse toResponse(Property property) {
    List<PhotoResponse> photos = property.getPhotos().stream()
        .sorted(Comparator.comparingInt(PropertyPhoto::getSortOrder))
        .map(photo -> new PhotoResponse(photo.getId(), photo.getUrl(), photo.getSortOrder()))
        .toList();
    List<AmenityResponse> amenities = property.getAmenities().stream()
        .map(amenity -> new AmenityResponse(amenity.getKey(), amenity.getLabel()))
        .toList();
    return new PropertyResponse(
        property.getSlug(),
        property.getTitle(),
        property.getLocation(),
        property.getCity(),
        property.getLat(),
        property.getLng(),
        PriceFormat.format(property.getPriceAmount()),
        property.getPriceAmount(),
        property.getBeds(),
        property.getBaths(),
        property.getArea(),
        property.getTag(),
        property.getSection().value(),
        property.getPropertyType(),
        property.getFloorPlan() == null || property.getFloorPlan().isBlank() ? "1 BHK" : property.getFloorPlan(),
        property.getFurnished(),
        property.getAvailableFrom(),
        property.getOnboardingCharge() == null ? 0L : property.getOnboardingCharge(),
        property.getDeposit(),
        property.getMaintenance(),
        photos.stream().map(PhotoResponse::url).toList(),
        property.getDescription(),
        List.copyOf(property.getHighlights()),
        List.copyOf(property.getRentExcludes()),
        List.copyOf(property.getLiveasyManages()),
        List.copyOf(property.getOwnerResponsibilities()),
        property.getTermsAndConditions() == null ? "" : property.getTermsAndConditions(),
        amenities,
        property.getStatus(),
        property.isActive(),
        property.getOwner() != null,
        photos,
        property.getCreatedAt(),
        property.getUpdatedAt()
    );
  }
}
