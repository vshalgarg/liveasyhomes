package com.liveasyhomes.contact;

import com.liveasyhomes.contact.dto.ContactRequest;
import com.liveasyhomes.contact.dto.ContactResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContactService {

  private final ContactMessageRepository messages;
  private final ContactNotificationSender notifications;

  public ContactResponse create(ContactRequest request) {
    ContactMessage message = new ContactMessage();
    message.setName(request.name().trim());
    message.setEmail(request.email().trim().toLowerCase());
    message.setPhone(request.phone().trim());
    message.setMessage(request.message() == null ? "" : request.message().trim());
    ContactMessage saved = messages.save(message);
    notify(saved);
    return new ContactResponse(true, "Message received.", saved.getId());
  }

  private void notify(ContactMessage saved) {
    try {
      notifications.send(saved);
    } catch (RuntimeException ex) {
      log.error("Contact message {} was saved but the notification email failed", saved.getId());
    }
  }
}
