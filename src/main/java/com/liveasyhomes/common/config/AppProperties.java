package com.liveasyhomes.common.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "app")
public class AppProperties {

  private Jwt jwt = new Jwt();
  private Cors cors = new Cors();
  private Storage storage = new Storage();
  private Admin admin = new Admin();
  private Otp otp = new Otp();

  @Getter
  @Setter
  public static class Jwt {
    private String secret;
    private long expirationMinutes = 1440;
  }

  @Getter
  @Setter
  public static class Cors {
    private String allowedOrigins = "http://localhost:3000";
  }

  @Getter
  @Setter
  public static class Storage {
    /** local or s3 (S3-compatible, including Cloudflare R2). */
    private String type = "local";
    private String localDir = "./uploads";
    private String publicBaseUrl = "http://localhost:8080";
    private S3 s3 = new S3();
  }

  @Getter
  @Setter
  public static class S3 {
    private String bucket;
    private String region = "ap-south-1";
    private String endpoint;
    private String accessKey;
    private String secretKey;
  }

  @Getter
  @Setter
  public static class Admin {
    private String email;
    private String password;
  }

  @Getter
  @Setter
  public static class Otp {
    private boolean exposeInResponse = false;
    private long ttlSeconds = 300;
  }
}
