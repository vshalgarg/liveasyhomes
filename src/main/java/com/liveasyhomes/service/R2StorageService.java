package com.liveasyhomes.service;

import com.liveasyhomes.common.error.ApiException;
import com.liveasyhomes.media.ImageSignatures;
import com.liveasyhomes.media.StorageService;
import com.liveasyhomes.media.StoredObject;
import java.io.IOException;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
@ConditionalOnProperty(name = "app.storage.type", havingValue = "r2")
public class R2StorageService implements StorageService {

  private static final long MAX_BYTES = 5L * 1024 * 1024;

  private final S3Client client;
  private final String bucket;
  private final String publicBaseUrl;

  public R2StorageService(
      S3Client r2Client,
      @Value("${app.storage.r2.bucket:}") String bucket,
      @Value("${app.storage.r2.public-base-url:}") String publicBaseUrl
  ) {
    if (bucket.isBlank()) {
      throw new IllegalStateException("R2_BUCKET is required when STORAGE_TYPE=r2.");
    }
    if (publicBaseUrl.isBlank()) {
      throw new IllegalStateException("R2_PUBLIC_BASE_URL is required when STORAGE_TYPE=r2.");
    }
    this.client = r2Client;
    this.bucket = bucket.trim();
    this.publicBaseUrl = stripTrailingSlash(publicBaseUrl.trim());
  }

  public StoredObject upload(MultipartFile file) {
    if (file == null || file.isEmpty()) {
      throw new ApiException(400, "Please upload a photo.");
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
      String key = "uploads/" + UUID.randomUUID() + extension;
      put(key, bytes, contentType);
      return new StoredObject(key, publicUrl(key), contentType);
    } catch (IOException ex) {
      throw new ApiException(400, "Could not read the photo. Please try again.");
    }
  }

  @Override
  public StoredObject store(UUID propertyId, byte[] bytes, String contentType, String extension) {
    String key = "properties/" + propertyId + "/" + UUID.randomUUID() + extension;
    put(key, bytes, contentType);
    return new StoredObject(key, publicUrl(key), contentType);
  }

  @Override
  public void delete(String storageKey) {
    if (storageKey == null || storageKey.isBlank()) {
      return;
    }
    if (storageKey.contains("..") || storageKey.contains("\\") || storageKey.startsWith("/")) {
      throw new ApiException(400, "Invalid photo reference.");
    }
    try {
      client.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key(storageKey).build());
    } catch (RuntimeException ex) {
      throw new ApiException(500, "Could not delete the photo.");
    }
  }

  private void put(String key, byte[] bytes, String contentType) {
    try {
      client.putObject(
          PutObjectRequest.builder().bucket(bucket).key(key).contentType(contentType).build(),
          RequestBody.fromBytes(bytes)
      );
    } catch (RuntimeException ex) {
      throw new ApiException(500, "Could not store the photo.");
    }
  }

  private String publicUrl(String key) {
    return publicBaseUrl + "/" + key;
  }

  private static String stripTrailingSlash(String value) {
    return value.endsWith("/") ? value.substring(0, value.length() - 1) : value;
  }

}
