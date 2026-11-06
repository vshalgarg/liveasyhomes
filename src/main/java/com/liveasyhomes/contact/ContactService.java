package com.liveasyhomes.contact;

import com.liveasyhomes.contact.dto.ContactRequest;
import com.liveasyhomes.contact.dto.ContactResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ContactService {

  private final ContactMessageRepository messages;

  @Transactional
  public ContactResponse create(ContactRequest request) {
    ContactMessage message = new ContactMessage();
    message.setName(request.name().trim());
    message.setEmail(request.email().trim().toLowerCase());
    message.setPhone(request.phone().trim());
    message.setMessage(request.message() == null ? "" : request.message().trim());
    ContactMessage saved = messages.save(message);
    return new ContactResponse(true, "Message received.", saved.getId());
  }
}
