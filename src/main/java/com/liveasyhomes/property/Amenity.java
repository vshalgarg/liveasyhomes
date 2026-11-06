package com.liveasyhomes.property;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class Amenity {

  @Column(name = "amenity_key", nullable = false, length = 40)
  private String key;

  @Column(name = "amenity_label", nullable = false, length = 120)
  private String label;
}
