package com.liveasyhomes;

import static org.hamcrest.Matchers.closeTo;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import com.liveasyhomes.auth.Role;
import com.liveasyhomes.auth.UserAccountRepository;
import java.util.Base64;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PropertyApiTest {

  private static final byte[] PNG = Base64.getDecoder().decode(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
  );

  @Autowired
  private MockMvc mvc;

  @Autowired
  private UserAccountRepository users;

  @Test
  void landlordCreatesAListingTheFrontendCanRead() throws Exception {
    String token = register("Asha Rao", "asha@example.com", "LANDLORD");

    MvcResult created = mvc.perform(post("/api/properties")
            .header("Authorization", "Bearer " + token)
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "title": "Maple Heights Test",
                  "location": "Indiranagar, Bangalore",
                  "price": "48,000",
                  "beds": 2,
                  "baths": 2,
                  "area": 1200,
                  "propertyType": "Gated Apartment",
                  "furnished": "Fully furnished",
                  "description": "A sun-filled two-bedroom retreat for everyday living.",
                  "highlights": ["Corner unit", "Pet-friendly building"],
                  "rentExcludes": ["Electricity", "Cooking gas"],
                  "liveasyManages": ["Tenant onboarding", "Rent collection"],
                  "ownerResponsibilities": ["Major repairs"],
                  "termsAndConditions": "Rent is due on the 5th of each month.",
                  "amenities": [{ "key": "wifi", "label": "High-speed WiFi" }, "parking"]
                }
                """))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value("maple-heights-test"))
        .andExpect(jsonPath("$.price").value("48,000"))
        .andExpect(jsonPath("$.priceAmount").value(48000))
        .andExpect(jsonPath("$.city").value("Bangalore"))
        .andExpect(jsonPath("$.lat").value(closeTo(12.9784, 0.0001)))
        .andExpect(jsonPath("$.section").value("new"))
        .andExpect(jsonPath("$.tag").value("New"))
        .andExpect(jsonPath("$.isUserAdded").value(true))
        .andExpect(jsonPath("$.isActive").value(true))
        .andExpect(jsonPath("$.status").value("PUBLISHED"))
        .andExpect(jsonPath("$.highlights[0]").value("Corner unit"))
        .andExpect(jsonPath("$.rentExcludes[0]").value("Electricity"))
        .andExpect(jsonPath("$.rentExcludes[1]").value("Cooking gas"))
        .andExpect(jsonPath("$.liveasyManages[0]").value("Tenant onboarding"))
        .andExpect(jsonPath("$.ownerResponsibilities[0]").value("Major repairs"))
        .andExpect(jsonPath("$.termsAndConditions").value("Rent is due on the 5th of each month."))
        .andExpect(jsonPath("$.amenities[0].key").value("wifi"))
        .andExpect(jsonPath("$.amenities[1].label").value("Reserved parking"))
        .andReturn();

    String id = JsonPath.read(created.getResponse().getContentAsString(), "$.id");

    mvc.perform(get("/api/properties").param("q", "Maple Heights Test").param("minPrice", "40000").param("maxPrice", "50000"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content[0].id").value(id))
        .andExpect(jsonPath("$.totalElements").value(1));

    mvc.perform(get("/api/properties/" + id))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.beds").value(2))
        .andExpect(jsonPath("$.images").isArray());

    MockMultipartFile photo = new MockMultipartFile("files", "room.png", "image/png", PNG);
    mvc.perform(multipart("/api/properties/" + id + "/photos").file(photo).header("Authorization", "Bearer " + token))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.images.length()").value(1))
        .andExpect(jsonPath("$.photos[0].url").exists());
  }

  @Test
  void tenantCannotCreateAListing() throws Exception {
    String token = register("Neel Iyer", "neel@example.com", "TENANT");
    mvc.perform(post("/api/properties")
            .header("Authorization", "Bearer " + token)
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "title": "Blocked Listing",
                  "location": "HSR Layout",
                  "price": "30000",
                  "beds": 1,
                  "baths": 1,
                  "area": 600,
                  "propertyType": "Studio",
                  "furnished": "Unfurnished",
                  "description": "Should not be saved."
                }
                """))
        .andExpect(status().isForbidden());
  }

  @Test
  void contactAndVisitOtpMatchTheCurrentPayloads() throws Exception {
    String token = register("Landlord Two", "landlord2@example.com", "LANDLORD");
    MvcResult created = mvc.perform(post("/api/properties")
            .header("Authorization", "Bearer " + token)
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "title": "Visit House",
                  "location": "Koramangala, Bangalore",
                  "price": "62000",
                  "beds": 3,
                  "baths": 2,
                  "area": 1400,
                  "propertyType": "Gated Apartment",
                  "furnished": "Fully furnished",
                  "description": "A home ready for a visit."
                }
                """))
        .andExpect(status().isCreated())
        .andReturn();
    String propertyId = JsonPath.read(created.getResponse().getContentAsString(), "$.id");

    mvc.perform(post("/api/contact")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {"name":"Riya","email":"riya@example.com","phone":"9876543210","message":"Hello"}
                """))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.success").value(true));

    MvcResult otp = mvc.perform(post("/api/visits/otp/send")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {"name":"Riya Shah","email":"riya@example.com","phone":"+91 9876543210","propertyId":"%s","propertyTitle":"Visit House"}
                """.formatted(propertyId)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.success").value(true))
        .andExpect(jsonPath("$.expiresIn").value(300))
        .andReturn();
    String demoOtp = JsonPath.read(otp.getResponse().getContentAsString(), "$.demoOtp");

    mvc.perform(post("/api/visits/otp/verify")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {"phone":"9876543210","otp":"%s"}
                """.formatted(demoOtp)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.message").value("Visit scheduled successfully."))
        .andExpect(jsonPath("$.booking.propertyId").value(propertyId))
        .andExpect(jsonPath("$.booking.email").value("riya@example.com"));
  }

  private String register(String name, String email, String role) throws Exception {
    MvcResult result = mvc.perform(post("/api/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {"name":"%s","email":"%s","password":"password123","role":"TENANT"}
                """.formatted(name, email)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.tokenType").value("Bearer"))
        .andReturn();
    if ("LANDLORD".equals(role) || "ADMIN".equals(role)) {
      users.findByEmail(email).ifPresent(user -> {
        user.setRole(Role.valueOf(role));
        users.saveAndFlush(user);
      });
    }
    return JsonPath.read(result.getResponse().getContentAsString(), "$.token");
  }
}
