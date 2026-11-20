package com.liveasyhomes.contact;

import static org.hamcrest.Matchers.containsString;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import com.liveasyhomes.common.config.AppProperties;
import java.time.Instant;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

class ResendContactNotificationSenderTest {

  @Test
  void sendsTheContactFormToBothInboxes() {
    AppProperties properties = new AppProperties();
    properties.getResend().setApiKey("re_test_key");
    properties.getResend().setContactFrom("LivEasy Homes <contact@liveasyhomes.in>");
    properties.getResend().setRecipients("karan@liveasyhomes.in,dev.gdeepanshi@gmail.com");

    RestClient.Builder builder = RestClient.builder();
    MockRestServiceServer http = MockRestServiceServer.bindTo(builder).build();
    http.expect(requestTo("https://api.resend.com/emails"))
        .andExpect(header(HttpHeaders.AUTHORIZATION, "Bearer re_test_key"))
        .andExpect(content().string(containsString("\"subject\":\"Contact - LivEasyHomes\"")))
        .andExpect(content().string(containsString("contact@liveasyhomes.in")))
        .andExpect(content().string(containsString("\"to\":[\"karan@liveasyhomes.in\",\"dev.gdeepanshi@gmail.com\"]")))
        .andExpect(content().string(containsString("\"reply_to\":\"jane@example.com\"")))
        .andExpect(content().string(containsString("Jane Doe")))
        .andExpect(content().string(containsString("+91 98114 46782")))
        .andExpect(content().string(containsString("Looking for a 2 BHK")))
        .andRespond(withSuccess("{}", MediaType.APPLICATION_JSON));

    RestClient client = builder.baseUrl("https://api.resend.com")
        .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer re_test_key")
        .build();
    new ResendContactNotificationSender(properties, client).send(message());

    http.verify();
  }

  @Test
  void failsWhenTheApiKeyIsMissing() {
    ContactMessage message = message();
    IllegalStateException error = assertThrows(
        IllegalStateException.class,
        () -> new ResendContactNotificationSender(new AppProperties(), RestClient.builder().build()).send(message)
    );
    assertEquals("RESEND_API_KEY is not set", error.getMessage());
  }

  private static ContactMessage message() {
    ContactMessage message = new ContactMessage();
    message.setId(UUID.randomUUID());
    message.setName("Jane Doe");
    message.setEmail("jane@example.com");
    message.setPhone("+91 98114 46782");
    message.setMessage("Looking for a 2 BHK");
    message.setCreatedAt(Instant.parse("2026-11-11T08:00:00Z"));
    return message;
  }
}
