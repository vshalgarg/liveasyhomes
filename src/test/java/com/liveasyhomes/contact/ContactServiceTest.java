package com.liveasyhomes.contact;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.liveasyhomes.contact.dto.ContactRequest;
import com.liveasyhomes.contact.dto.ContactResponse;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ContactServiceTest {

  @Mock
  private ContactMessageRepository messages;

  @Mock
  private ContactNotificationSender notifications;

  @InjectMocks
  private ContactService service;

  @Test
  void savesTheMessageAndSendsTheEmail() {
    when(messages.save(org.mockito.ArgumentMatchers.any())).thenAnswer(invocation -> {
      ContactMessage message = invocation.getArgument(0);
      message.setId(UUID.randomUUID());
      return message;
    });

    ContactResponse response = service.create(new ContactRequest(
        "Jane Doe",
        "Jane@Example.com",
        "+91 98114 46782",
        "Looking for a 2 BHK"
    ));

    assertTrue(response.success());
    verify(notifications).send(org.mockito.ArgumentMatchers.argThat(message ->
        message.getEmail().equals("jane@example.com")
            && message.getPhone().equals("+91 98114 46782")
            && message.getMessage().equals("Looking for a 2 BHK")
    ));
  }

  @Test
  void keepsTheSavedMessageWhenEmailFails() {
    ContactMessage saved = new ContactMessage();
    saved.setId(UUID.randomUUID());
    when(messages.save(org.mockito.ArgumentMatchers.any())).thenReturn(saved);
    doThrow(new IllegalStateException("Resend returned HTTP 500")).when(notifications).send(saved);

    ContactResponse response = service.create(new ContactRequest(
        "Jane Doe",
        "jane@example.com",
        "9811446782",
        ""
    ));

    assertEquals(saved.getId(), response.id());
    assertTrue(response.success());
  }
}
