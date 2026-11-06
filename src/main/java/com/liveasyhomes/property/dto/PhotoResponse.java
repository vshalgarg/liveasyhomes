package com.liveasyhomes.property.dto;

import java.util.UUID;

public record PhotoResponse(UUID id, String url, int sortOrder) {
}
