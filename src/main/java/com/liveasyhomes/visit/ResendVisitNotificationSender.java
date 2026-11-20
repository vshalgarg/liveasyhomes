package com.liveasyhomes.visit;

import com.liveasyhomes.common.config.AppProperties;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

@Slf4j
@Service
public class ResendVisitNotificationSender implements VisitNotificationSender {

  private final AppProperties properties;
  private final RestClient client;

  @Autowired
  public ResendVisitNotificationSender(AppProperties properties) {
    this(properties, client(properties.getResend().getApiKey()));
  }

  ResendVisitNotificationSender(AppProperties properties, RestClient client) {
    this.properties = properties;
    this.client = client;
  }

  @Override
  public void send(VisitRequest request) {
    String apiKey = properties.getResend().getApiKey();
    if (apiKey == null || apiKey.isBlank()) {
      throw new IllegalStateException("RESEND_API_KEY is not set");
    }
    List<String> recipients = recipients();
    if (recipients.isEmpty()) {
      throw new IllegalStateException("Visit notification recipients are not set");
    }
    Map<String, Object> payload = new LinkedHashMap<>();
    payload.put("from", properties.getResend().getFrom());
    payload.put("to", recipients);
    payload.put("subject", "New visit request: " + oneLine(request.getPropertyTitle()));
    payload.put("text", body(request));
    deliver(payload);
  }

  private void deliver(Map<String, Object> payload) {
    RuntimeException last = new IllegalStateException("Resend request failed");
    for (int attempt = 1; attempt <= 2; attempt++) {
      try {
        client.post()
            .uri("/emails")
            .contentType(MediaType.APPLICATION_JSON)
            .body(payload)
            .retrieve()
            .toBodilessEntity();
        return;
      } catch (RestClientResponseException ex) {
        int status = ex.getStatusCode().value();
        last = new IllegalStateException("Resend returned HTTP " + status);
        if (status != 429 && status < 500) {
          throw last;
        }
        log.warn("Visit notification attempt {} returned HTTP {}", attempt, status);
      } catch (RestClientException ex) {
        last = new IllegalStateException("Resend request failed");
        log.warn("Visit notification attempt {} could not reach Resend", attempt);
      }
    }
    throw last;
  }

  private List<String> recipients() {
    return Arrays.stream(properties.getResend().getRecipients().split(","))
        .map(String::trim)
        .filter(value -> !value.isEmpty())
        .toList();
  }

  private static String body(VisitRequest request) {
    String when = request.getCreatedAt() == null
        ? ""
        : DateTimeFormatter.ofPattern("d MMM yyyy, h:mm a z")
            .withZone(ZoneId.of("Asia/Kolkata"))
            .format(request.getCreatedAt());
    return """
        A new visit request was submitted.

        User Name: %s
        Email: %s
        Verified Phone Number: %s
        Property Name: %s
        Property ID: %s
        Request Date and Time: %s
        """.formatted(
        oneLine(request.getName()),
        oneLine(request.getEmail()),
        oneLine(request.getPhone()),
        oneLine(request.getPropertyTitle()),
        oneLine(request.getPropertySlug()),
        when
    );
  }

  private static String oneLine(String value) {
    if (value == null) {
      return "";
    }
    return value.replaceAll("[\\r\\n]+", " ").trim();
  }

  private static RestClient client(String apiKey) {
    RestClient.Builder builder = RestClient.builder().baseUrl("https://api.resend.com");
    if (apiKey != null && !apiKey.isBlank()) {
      builder.defaultHeader("Authorization", "Bearer " + apiKey);
    }
    return builder.build();
  }
}
