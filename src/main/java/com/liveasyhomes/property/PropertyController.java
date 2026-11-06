package com.liveasyhomes.property;

import com.liveasyhomes.common.web.PageResponse;
import com.liveasyhomes.media.MediaService;
import com.liveasyhomes.property.dto.PropertyRequest;
import com.liveasyhomes.property.dto.PropertyResponse;
import com.liveasyhomes.property.dto.PropertySearchCriteria;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
public class PropertyController {

  private final PropertyService properties;
  private final MediaService media;

  @GetMapping
  public PageResponse<PropertyResponse> list(
      @RequestParam(required = false) String section,
      @RequestParam(required = false) String city,
      @RequestParam(required = false) String location,
      @RequestParam(required = false) Long minPrice,
      @RequestParam(required = false) Long maxPrice,
      @RequestParam(required = false) String propertyType,
      @RequestParam(required = false) Integer beds,
      @RequestParam(required = false) String q,
      @RequestParam(required = false) PropertyStatus status,
      @RequestParam(defaultValue = "false") boolean mine,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size
  ) {
    return properties.list(new PropertySearchCriteria(
        section, city, location, minPrice, maxPrice, propertyType, beds, q, status, mine, page, size
    ));
  }

  @GetMapping("/{id}")
  public PropertyResponse get(@PathVariable String id) {
    return properties.get(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize("hasAnyRole('LANDLORD','ADMIN')")
  public PropertyResponse create(@Valid @RequestBody PropertyRequest request) {
    return properties.create(request);
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasAnyRole('LANDLORD','ADMIN')")
  public PropertyResponse update(@PathVariable String id, @Valid @RequestBody PropertyRequest request) {
    return properties.update(id, request);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @PreAuthorize("hasAnyRole('LANDLORD','ADMIN')")
  public void delete(@PathVariable String id) {
    properties.delete(id);
  }

  @PostMapping(value = "/{id}/photos", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @PreAuthorize("hasAnyRole('LANDLORD','ADMIN')")
  public PropertyResponse addPhotos(
      @PathVariable String id,
      @RequestParam("files") List<MultipartFile> files
  ) {
    return media.addPhotos(id, files);
  }

  @DeleteMapping("/{id}/photos/{photoId}")
  @PreAuthorize("hasAnyRole('LANDLORD','ADMIN')")
  public PropertyResponse deletePhoto(@PathVariable String id, @PathVariable UUID photoId) {
    return media.deletePhoto(id, photoId);
  }
}
