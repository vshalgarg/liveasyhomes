package com.liveasyhomes.visit;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.not;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import com.liveasyhomes.common.config.AppProperties;
import java.time.Instant;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

class ResendVisitNotificationSenderTest {

  @Test
  void sendsTheVisitDetailsWithoutAToken() {
    AppProperties properties = properties();
    Recording server = server(properties);

    server.sender().send(request());

    server.http().verify();
  }

  @Test
  void retriesOnceAfterAServerError() {
    AppProperties properties = properties();
    RestClient.Builder builder = RestClient.builder();
    MockRestServiceServer http = MockRestServiceServer.bindTo(builder).build();
    expectFailure(http);
    expectSuccess(http);
    ResendVisitNotificationSender sender = new ResendVisitNotificationSender(properties, client(builder));

    sender.send(request());

    http.verify();
  }

  @Test
  void failsWhenResendKeepsFailing() {
    AppProperties properties = properties();
    RestClient.Builder builder = RestClient.builder();
    MockRestServiceServer http = MockRestServiceServer.bindTo(builder).build();
    expectFailure(http);
    expectFailure(http);
    ResendVisitNotificationSender sender = new ResendVisitNotificationSender(properties, client(builder));

    IllegalStateException error = assertThrows(IllegalStateException.class, () -> sender.send(request()));
    org.junit.jupiter.api.Assertions.assertEquals("Resend returned HTTP 500", error.getMessage());
    http.verify();
  }

  private static void expectSuccess(MockRestServiceServer http) {
    http.expect(requestTo("https://api.resend.com/emails"))
        .andExpect(header(HttpHeaders.AUTHORIZATION, "Bearer re_test_key"))
        .andExpect(content().string(containsString("\"to\":[\"karan@liveasyhomes.in\",\"dev.gdeepanshi@gmail.com\"]")))
        .andExpect(content().string(containsString("request@liveasyhomes.in")))
        .andExpect(content().string(containsString("Ada Lovelace")))
        .andExpect(content().string(containsString("ada@example.com")))
        .andExpect(content().string(containsString("Verified Phone Number: +919876543210")))
        .andExpect(content().string(containsString("Property Name: Secto 16")))
        .andExpect(content().string(containsString("Property ID: secto-16")))
        .andExpect(content().string(containsString("Request Date and Time:")))
        .andExpect(content().string(not(containsString("re_test_key"))))
        .andExpect(content().string(not(containsString("firebase"))))
        .andRespond(withSuccess("{}", MediaType.APPLICATION_JSON));
  }

  private static void expectFailure(MockRestServiceServer http) {
    http.expect(requestTo("https://api.resend.com/emails"))
        .andRespond(withStatus(HttpStatus.INTERNAL_SERVER_ERROR));
  }

  private static Recording server(AppProperties properties) {
    RestClient.Builder builder = RestClient.builder();
    MockRestServiceServer http = MockRestServiceServer.bindTo(builder).build();
    expectSuccess(http);
    return new Recording(http, new ResendVisitNotificationSender(properties, client(builder)));
  }

  private static RestClient client(RestClient.Builder builder) {
    return builder.baseUrl("https://api.resend.com")
        .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer re_test_key")
        .build();
  }

  private static AppProperties properties() {
    AppProperties properties = new AppProperties();
    properties.getResend().setApiKey("re_test_key");
    properties.getResend().setFrom("LivEasy Homes <request@liveasyhomes.in>");
    properties.getResend().setRecipients("karan@liveasyhomes.in,dev.gdeepanshi@gmail.com");
    return properties;
  }

  private static VisitRequest request() {
    VisitRequest request = new VisitRequest();
    request.setId(UUID.randomUUID());
    request.setName("Ada Lovelace");
    request.setEmail("ada@example.com");
    request.setPhone("+919876543210");
    request.setPropertyTitle("Secto 16");
    request.setPropertySlug("secto-16");
    request.setFirebaseUid("uid-1");
    request.setStatus(VisitRequestStatus.REQUESTED);
    request.setCreatedAt(Instant.parse("2026-11-06T08:00:00Z"));
    request.setUpdatedAt(request.getCreatedAt());
    return request;
  }

  private record Recording(MockRestServiceServer http, ResendVisitNotificationSender sender) {
  }
}
