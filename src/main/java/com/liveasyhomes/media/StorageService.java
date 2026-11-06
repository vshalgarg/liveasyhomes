package com.liveasyhomes.media;

import java.util.UUID;

public interface StorageService {

  StoredObject store(UUID propertyId, byte[] bytes, String contentType, String extension);

  void delete(String storageKey);
}
