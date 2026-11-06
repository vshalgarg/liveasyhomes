package com.liveasyhomes.config;

import java.net.URI;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.http.urlconnection.UrlConnectionHttpClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;

@Configuration
@ConditionalOnProperty(name = "app.storage.type", havingValue = "r2")
public class R2Config {

  @Bean(destroyMethod = "close")
  S3Client r2Client(
      @Value("${app.storage.r2.account-id:}") String accountId,
      @Value("${app.storage.r2.access-key:}") String accessKey,
      @Value("${app.storage.r2.secret-key:}") String secretKey
  ) {
    if (accountId.isBlank() || accessKey.isBlank() || secretKey.isBlank()) {
      throw new IllegalStateException(
          "R2_ACCOUNT_ID, R2_ACCESS_KEY, and R2_SECRET_KEY are required when STORAGE_TYPE=r2."
      );
    }
    return S3Client.builder()
        .httpClient(UrlConnectionHttpClient.create())
        .region(Region.of("auto"))
        .endpointOverride(URI.create("https://" + accountId.trim() + ".r2.cloudflarestorage.com"))
        .credentialsProvider(StaticCredentialsProvider.create(
            AwsBasicCredentials.create(accessKey, secretKey)
        ))
        .serviceConfiguration(S3Configuration.builder().pathStyleAccessEnabled(true).build())
        .build();
  }
}
