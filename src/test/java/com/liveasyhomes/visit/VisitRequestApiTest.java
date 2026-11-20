package com.liveasyhomes.visit;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.liveasyhomes.common.error.ApiException;
import com.liveasyhomes.common.security.FirebaseTokenVerifier;
import com.liveasyhomes.common.security.RateLimitFilter;
import com.liveasyhomes.common.security.VerifiedCaller;
import com.liveasyhomes.property.ListingSection;
import com.liveasyhomes.property.Property;
import com.liveasyhomes.property.PropertyRepository;
import com.liveasyhomes.property.PropertyStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class VisitRequestApiTest {

  @Autowired
  private MockMvc mvc;

  @Autowired
  private PropertyRepository properties;

  @MockitoBean
  private FirebaseTokenVerifier tokens;

  @MockitoBean
  private VisitNotificationSender notifications;

  @Autowired
  private RateLimitFilter rateLimit;

  @BeforeEach
  void rejectUnknownTokens() {
    rateLimit.resetForTests();
    doThrow(new ApiException(401, "Authentication token is invalid.")).when(tokens).verifyAuthorization(any());
  }

  @Test
  void missingAuthorizationIsRejected() throws Exception {
    mvc.perform(post("/api/visits/request")
            .contentType(MediaType.APPLICATION_JSON)
            .content(json("Ada Lovelace", "ada@example.com", "+919876543210", "secto-16", true)))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.error").value("Authentication required."));
  }

  @Test
  void invalidTokenIsRejected() throws Exception {
    mvc.perform(post("/api/visits/request")
            .header("Authorization", "Bearer bad-token")
            .contentType(MediaType.APPLICATION_JSON)
            .content(json("Ada Lovelace", "ada@example.com", "+919876543210", "secto-16", false)))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.error").value("Authentication token is invalid."));
  }

  @Test
  void invalidEmailIsRejected() throws Exception {
    mvc.perform(post("/api/visits/request")
            .header("Authorization", "Bearer good")
            .contentType(MediaType.APPLICATION_JSON)
            .content(json("Ada Lovelace", "not-an-email", "+919876543210", "secto-16", false)))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.fields.email").value("Please enter a valid email address."));
  }

  @Test
  void missingPropertyIsRejected() throws Exception {
    allow("+919876543210");

    mvc.perform(post("/api/visits/request")
            .header("Authorization", "Bearer good")
            .contentType(MediaType.APPLICATION_JSON)
            .content(json("Ada Lovelace", "ada@example.com", "9876543210", "missing-home", false)))
        .andExpect(status().isNotFound());
  }

  @Test
  void inactivePropertyIsRejected() throws Exception {
    allow("+919876543210");
    save("closed-home", PropertyStatus.PUBLISHED, false);

    mvc.perform(post("/api/visits/request")
            .header("Authorization", "Bearer good")
            .contentType(MediaType.APPLICATION_JSON)
            .content(json("Ada Lovelace", "ada@example.com", "9876543210", "closed-home", false)))
        .andExpect(status().isForbidden())
        .andExpect(jsonPath("$.error").value("This property is not available for visits."));
  }

  @Test
  void phoneMismatchIsRejected() throws Exception {
    allow("+14155552671");
    save("other-home", PropertyStatus.PUBLISHED, true);

    mvc.perform(post("/api/visits/request")
            .header("Authorization", "Bearer good")
            .contentType(MediaType.APPLICATION_JSON)
            .content(json("Ada Lovelace", "ada@example.com", "9876543210", "other-home", false)))
        .andExpect(status().isForbidden())
        .andExpect(jsonPath("$.error").value("The phone number does not match the verified number."));
  }

  @Test
  void duplicateRequestIsRejected() throws Exception {
    allow("+919811112233");
    save("dup-home", PropertyStatus.PUBLISHED, true);
    String payload = json("Ada Lovelace", "ada@example.com", "9811112233", "dup-home", false);

    mvc.perform(post("/api/visits/request")
            .header("Authorization", "Bearer good")
            .contentType(MediaType.APPLICATION_JSON)
            .content(payload))
        .andExpect(status().isCreated());

    mvc.perform(post("/api/visits/request")
            .header("Authorization", "Bearer good")
            .contentType(MediaType.APPLICATION_JSON)
            .content(payload))
        .andExpect(status().isConflict());
  }

  @Test
  void submitsAVisitRequest() throws Exception {
    allow("+919876543210");
    save("secto-16", PropertyStatus.PUBLISHED, true);

    mvc.perform(post("/api/visits/request")
            .header("Authorization", "Bearer good")
            .contentType(MediaType.APPLICATION_JSON)
            .content(json("Ada Lovelace", "Ada@Example.com", "9876543210", "secto-16", true)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.success").value(true))
        .andExpect(jsonPath("$.message").value("Visit request submitted successfully"))
        .andExpect(jsonPath("$.data.requestId").isNotEmpty())
        .andExpect(jsonPath("$.data.status").value("REQUESTED"));
  }

  private void allow(String phone) {
    doReturn(new VerifiedCaller("uid-1", phone)).when(tokens).verifyAuthorization("Bearer good");
  }

  private void save(String slug, PropertyStatus status, boolean active) {
    Property property = new Property();
    property.setSlug(slug);
    property.setTitle("Secto 16");
    property.setLocation("Sector 16, Noida");
    property.setCity("Noida");
    property.setPriceAmount(25000);
    property.setBeds(2);
    property.setBaths(2);
    property.setArea(900);
    property.setTag("New");
    property.setSection(ListingSection.NEW);
    property.setPropertyType("Apartment");
    property.setFloorPlan("2 BHK");
    property.setFurnished("Fully furnished");
    property.setAvailableFrom("Immediate");
    property.setOnboardingCharge(0L);
    property.setDeposit("2 months");
    property.setMaintenance("Included");
    property.setDescription("A bright apartment.");
    property.setTermsAndConditions("");
    property.setStatus(status);
    property.setActive(active);
    properties.saveAndFlush(property);
  }

  private static String json(String name, String email, String phone, String propertyId, boolean verifiedFlag) {
    return """
        {
          "name": "%s",
          "email": "%s",
          "phone": "%s",
          "propertyId": "%s",
          "isVerified": %s
        }
        """.formatted(name, email, phone, propertyId, verifiedFlag);
  }
}
