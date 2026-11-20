package com.liveasyhomes.contact;

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
public class ResendContactNotificationSender implements ContactNotificationSender {

  private static final String SUBJECT = "Contact - LivEasyHomes";

  private final AppProperties properties;
  private final RestClient client;

  @Autowired
  public ResendContactNotificationSender(AppProperties properties) {
    this(properties, client(properties.getResend().getApiKey()));
  }

  ResendContactNotificationSender(AppProperties properties, RestClient client) {
    this.properties = properties;
    this.client = client;
  }

  @Override
  public void send(ContactMessage message) {
    String apiKey = properties.getResend().getApiKey();
    if (apiKey == null || apiKey.isBlank()) {
      throw new IllegalStateException("RESEND_API_KEY is not set");
    }
    List<String> recipients = recipients();
    if (recipients.isEmpty()) {
      throw new IllegalStateException("Contact notification recipients are not set");
    }
    Map<String, Object> payload = new LinkedHashMap<>();
    payload.put("from", properties.getResend().getContactFrom());
    payload.put("to", recipients);
    payload.put("reply_to", message.getEmail());
    payload.put("subject", SUBJECT);
    payload.put("text", body(message));
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
        log.warn("Contact notification attempt {} returned HTTP {}", attempt, status);
      } catch (RestClientException ex) {
        last = new IllegalStateException("Resend request failed");
        log.warn("Contact notification attempt {} could not reach Resend", attempt);
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

  private static String body(ContactMessage message) {
    String when = message.getCreatedAt() == null
        ? ""
        : DateTimeFormatter.ofPattern("d MMM yyyy, h:mm a z")
            .withZone(ZoneId.of("Asia/Kolkata"))
            .format(message.getCreatedAt());
    String text = message.getMessage() == null || message.getMessage().isBlank()
        ? "(no message)"
        : message.getMessage().trim();
    return """
        A new message was sent from the contact page.

        Name: %s
        Email: %s
        Phone: %s
        Message:
        %s

        Submitted at: %s
        """.formatted(
        oneLine(message.getName()),
        oneLine(message.getEmail()),
        oneLine(message.getPhone()),
        text,
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
