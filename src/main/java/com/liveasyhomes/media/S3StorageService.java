package com.liveasyhomes.media;

import com.liveasyhomes.common.config.AppProperties;
import com.liveasyhomes.common.error.ApiException;
import jakarta.annotation.PreDestroy;
import java.net.URI;
import java.util.UUID;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.http.urlconnection.UrlConnectionHttpClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3ClientBuilder;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
@ConditionalOnProperty(name = "app.storage.type", havingValue = "s3")
public class S3StorageService implements StorageService {

  private final S3Client client;
  private final String bucket;
  private final String region;
  private final String publicBaseUrl;

  public S3StorageService(AppProperties properties) {
    AppProperties.S3 s3 = properties.getStorage().getS3();
    if (s3.getBucket() == null || s3.getBucket().isBlank()) {
      throw new IllegalStateException("S3_BUCKET is required when STORAGE_TYPE=s3.");
    }
    if (s3.getAccessKey() == null || s3.getAccessKey().isBlank()
        || s3.getSecretKey() == null || s3.getSecretKey().isBlank()) {
      throw new IllegalStateException("S3_ACCESS_KEY and S3_SECRET_KEY are required when STORAGE_TYPE=s3.");
    }

    this.bucket = s3.getBucket();
    this.region = s3.getRegion() == null || s3.getRegion().isBlank() ? "us-east-1" : s3.getRegion();
    this.publicBaseUrl = stripTrailingSlash(properties.getStorage().getPublicBaseUrl());

    S3ClientBuilder builder = S3Client.builder()
        .httpClient(UrlConnectionHttpClient.create())
        .region(Region.of(this.region))
        .credentialsProvider(StaticCredentialsProvider.create(
            AwsBasicCredentials.create(s3.getAccessKey(), s3.getSecretKey())
        ));
    if (s3.getEndpoint() != null && !s3.getEndpoint().isBlank()) {
      builder
          .endpointOverride(URI.create(s3.getEndpoint()))
          .serviceConfiguration(S3Configuration.builder().pathStyleAccessEnabled(true).build());
    }
    this.client = builder.build();
  }

  @Override
  public StoredObject store(UUID propertyId, byte[] bytes, String contentType, String extension) {
    String key = "properties/" + propertyId + "/" + UUID.randomUUID() + extension;
    try {
      client.putObject(
          PutObjectRequest.builder().bucket(bucket).key(key).contentType(contentType).build(),
          RequestBody.fromBytes(bytes)
      );
    } catch (RuntimeException ex) {
      throw new ApiException(500, "Could not store the photo.");
    }
    return new StoredObject(key, publicUrl(key), contentType);
  }

  @Override
  public void delete(String storageKey) {
    if (storageKey == null || storageKey.isBlank()) {
      return;
    }
    try {
      client.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key(storageKey).build());
    } catch (RuntimeException ex) {
      throw new ApiException(500, "Could not delete the photo.");
    }
  }

  @PreDestroy
  public void close() {
    client.close();
  }

  private String publicUrl(String key) {
    if (publicBaseUrl != null && !publicBaseUrl.isBlank() && !publicBaseUrl.contains("localhost")) {
      return publicBaseUrl + "/" + key;
    }
    return "https://" + bucket + ".s3." + region + ".amazonaws.com/" + key;
  }

  private static String stripTrailingSlash(String value) {
    if (value == null || value.isBlank()) {
      return "";
    }
    return value.endsWith("/") ? value.substring(0, value.length() - 1) : value;
  }
}
