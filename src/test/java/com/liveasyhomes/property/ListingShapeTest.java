package com.liveasyhomes.property;

import static org.assertj.core.api.Assertions.assertThat;

import com.liveasyhomes.common.web.RichTextSanitizer;
import org.junit.jupiter.api.Test;

class ListingShapeTest {

  @Test
  void slugMatchesTheFrontendHelper() {
    assertThat(SlugGenerator.slugify("Maple Heights Test")).isEqualTo("maple-heights-test");
    assertThat(SlugGenerator.slugify("  Hello!! World  ")).isEqualTo("hello-world");
    assertThat(SlugGenerator.unique("Maple Heights", slug -> slug.equals("maple-heights")))
        .isEqualTo("maple-heights-2");
  }

  @Test
  void priceUsesIndianGrouping() {
    assertThat(PriceFormat.parse("₹48,000")).isEqualTo(48000);
    assertThat(PriceFormat.format(48000)).isEqualTo("48,000");
    assertThat(PriceFormat.format(100000)).isEqualTo("1,00,000");
  }

  @Test
  void richTextDropsScripts() {
    assertThat(RichTextSanitizer.clean("<p>Rent is due.</p><script>alert(1)</script>"))
        .isEqualTo("<p>Rent is due.</p>");
    assertThat(RichTextSanitizer.clean("<b onclick=\"alert(1)\">Due</b>")).isEqualTo("<b>Due</b>");
  }

  @Test
  void knownLocalitiesKeepTheFrontendPins() {
    assertThat(LocationCoordinates.resolve("Indiranagar, Bangalore").lat()).isEqualTo(12.9784);
    assertThat(LocationCoordinates.resolve("Indiranagar, Bangalore").lng()).isEqualTo(77.6408);
    assertThat(LocationCoordinates.resolve("Somewhere else").lat()).isEqualTo(12.9716);
  }
}
