package com.liveasyhomes.contact.dto;

import java.util.UUID;

public record ContactResponse(boolean success, String message, UUID id) {
}
