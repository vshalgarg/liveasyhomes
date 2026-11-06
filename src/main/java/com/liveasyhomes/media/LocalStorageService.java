package com.liveasyhomes.media;

import com.liveasyhomes.common.config.AppProperties;
import com.liveasyhomes.common.error.ApiException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(name = "app.storage.type", havingValue = "local", matchIfMissing = true)
public class LocalStorageService implements StorageService {

  private final Path root;
  private final String publicBaseUrl;

  public LocalStorageService(AppProperties properties) {
    this.root = Path.of(properties.getStorage().getLocalDir()).toAbsolutePath().normalize();
    this.publicBaseUrl = stripTrailingSlash(properties.getStorage().getPublicBaseUrl());
  }

  @Override
  public StoredObject store(UUID propertyId, byte[] bytes, String contentType, String extension) {
    String key = "properties/" + propertyId + "/" + UUID.randomUUID() + extension;
    Path target = resolve(key);
    try {
      Files.createDirectories(target.getParent());
      Files.write(target, bytes);
    } catch (IOException ex) {
      throw new ApiException(500, "Could not store the photo.");
    }
    return new StoredObject(key, publicBaseUrl + "/uploads/" + key, contentType);
  }

  @Override
  public void delete(String storageKey) {
    if (storageKey == null || storageKey.isBlank()) {
      return;
    }
    try {
      Files.deleteIfExists(resolve(storageKey));
    } catch (IOException ex) {
      throw new ApiException(500, "Could not delete the photo.");
    }
  }

  private Path resolve(String storageKey) {
    if (storageKey.contains("..") || storageKey.contains("\\")) {
      throw new ApiException(400, "Invalid photo reference.");
    }
    Path target = root.resolve(storageKey).normalize();
    if (!target.startsWith(root)) {
      throw new ApiException(400, "Invalid photo reference.");
    }
    return target;
  }

  private static String stripTrailingSlash(String value) {
    if (value == null || value.isBlank()) {
      return "http://localhost:8080";
    }
    return value.endsWith("/") ? value.substring(0, value.length() - 1) : value;
  }
}
