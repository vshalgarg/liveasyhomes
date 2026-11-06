package com.liveasyhomes.media;

import com.liveasyhomes.common.error.ApiException;
import com.liveasyhomes.property.Property;
import com.liveasyhomes.property.PropertyAccess;
import com.liveasyhomes.property.PropertyMapper;
import com.liveasyhomes.property.PropertyPhoto;
import com.liveasyhomes.property.PropertyRepository;
import com.liveasyhomes.property.dto.PropertyResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class MediaService {

  public static final int MAX_PHOTOS = 8;
  private static final long MAX_BYTES = 5L * 1024 * 1024;

  private final PropertyAccess access;
  private final PropertyRepository properties;
  private final PropertyMapper mapper;
  private final StorageService storage;

  @Transactional
  public PropertyResponse addPhotos(String propertyRef, List<MultipartFile> files) {
    if (files == null || files.isEmpty()) {
      throw new ApiException(400, "Please upload at least one photo.");
    }
    Property property = access.requireEditable(propertyRef);
    if (property.getPhotos().size() + files.size() > MAX_PHOTOS) {
      throw new ApiException(400, "You can upload up to " + MAX_PHOTOS + " photos.");
    }

    List<StoredObject> stored = new ArrayList<>();
    try {
      int sortOrder = property.getPhotos().stream().mapToInt(PropertyPhoto::getSortOrder).max().orElse(-1) + 1;
      for (MultipartFile file : files) {
        StoredObject object = storeOne(property.getId(), file);
        stored.add(object);
        PropertyPhoto photo = new PropertyPhoto();
        photo.setUrl(object.url());
        photo.setStorageKey(object.key());
        photo.setContentType(object.contentType());
        photo.setSortOrder(sortOrder++);
        property.addPhoto(photo);
      }
      return mapper.toResponse(properties.save(property));
    } catch (RuntimeException ex) {
      for (StoredObject object : stored) {
        try {
          storage.delete(object.key());
        } catch (RuntimeException ignored) {
          // Keep the original upload failure.
        }
      }
      throw ex;
    }
  }

  @Transactional
  public PropertyResponse deletePhoto(String propertyRef, UUID photoId) {
    Property property = access.requireEditable(propertyRef);
    PropertyPhoto photo = property.getPhotos().stream()
        .filter(item -> item.getId().equals(photoId))
        .findFirst()
        .orElseThrow(() -> new ApiException(404, "Photo not found."));
    if (photo.getStorageKey() != null && !photo.getStorageKey().isBlank()) {
      storage.delete(photo.getStorageKey());
    }
    property.getPhotos().remove(photo);
    return mapper.toResponse(properties.save(property));
  }

  private StoredObject storeOne(UUID propertyId, MultipartFile file) {
    if (file == null || file.isEmpty()) {
      throw new ApiException(400, "Please upload at least one photo.");
    }
    if (file.getSize() > MAX_BYTES) {
      throw new ApiException(400, "Each photo must be 5 MB or smaller.");
    }
    try {
      byte[] bytes = file.getBytes();
      String contentType = ImageSignatures.contentType(bytes);
      String extension = contentType == null ? null : ImageSignatures.extension(contentType);
      if (extension == null) {
        throw new ApiException(400, "Photos must be JPEG, PNG, or WebP.");
      }
      return storage.store(propertyId, bytes, contentType, extension);
    } catch (IOException ex) {
      throw new ApiException(400, "Could not read one or more photos. Please try again.");
    }
  }
}
