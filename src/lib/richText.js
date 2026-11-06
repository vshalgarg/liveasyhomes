const ALLOWED_TAGS = new Set([
  "B",
  "STRONG",
  "I",
  "EM",
  "U",
  "BR",
  "P",
  "DIV",
  "SPAN",
]);

/** True when the string looks like HTML we stored from the editor. */
export function looksLikeHtml(value) {
  return /<\/?[a-z][\s\S]*>/i.test(String(value || ""));
}

/** Strip tags for empty checks / API length. */
export function richTextToPlain(value) {
  if (!value) return "";
  if (typeof window === "undefined") {
    return String(value)
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<\/div>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/\u00a0/g, " ")
      .trim();
  }

  const doc = new DOMParser().parseFromString(String(value), "text/html");
  return (doc.body.textContent || "").replace(/\u00a0/g, " ").trim();
}

/** Server-safe allowlist: keep only simple formatting tags, strip attributes/scripts. */
function sanitizeRichTextFallback(html) {
  let out = String(html || "");

  // Neutralize scripts/styles and event handlers early
  out = out
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s(href|src|xlink:href)\s*=\s*("\s*javascript:[^"]*"|'\s*javascript:[^']*'|[^\s>]*javascript:[^\s>]*)/gi, "");

  // Drop disallowed tags but keep their text
  out = out.replace(/<\/?([a-z0-9]+)(\s[^>]*)?>/gi, (match, tagName, attrs = "") => {
    const tag = String(tagName).toUpperCase();
    if (!ALLOWED_TAGS.has(tag)) return "";
    if (tag === "BR") return "<br>";
    if (match.startsWith("</")) return `</${tag.toLowerCase()}>`;
    // Never keep attributes
    void attrs;
    return `<${tag.toLowerCase()}>`;
  });

  return out
    .replace(/<div><br><\/div>/gi, "<br>")
    .replace(/<p><br><\/p>/gi, "<br>")
    .replace(/(?:<br\s*\/?>\s*){3,}/gi, "<br><br>")
    .trim();
}

/**
 * Allowlist sanitizer for description HTML (bold/italic/underline + breaks).
 * Works on server and client before dangerouslySetInnerHTML.
 */
export function sanitizeRichText(html) {
  if (!html) return "";

  if (typeof window === "undefined") {
    return sanitizeRichTextFallback(html);
  }

  const doc = new DOMParser().parseFromString(String(html), "text/html");

  const walk = (node) => {
    const children = Array.from(node.childNodes);
    for (const child of children) {
      if (child.nodeType === Node.TEXT_NODE) continue;

      if (child.nodeType !== Node.ELEMENT_NODE) {
        child.remove();
        continue;
      }

      const tag = child.tagName.toUpperCase();
      if (!ALLOWED_TAGS.has(tag)) {
        while (child.firstChild) {
          node.insertBefore(child.firstChild, child);
        }
        child.remove();
        continue;
      }

      while (child.attributes?.length) {
        child.removeAttribute(child.attributes[0].name);
      }

      walk(child);
    }
  };

  walk(doc.body);

  return doc.body.innerHTML
    .replace(/<div><br><\/div>/gi, "<br>")
    .replace(/<p><br><\/p>/gi, "<br>")
    .replace(/(?:<br\s*\/?>\s*){3,}/gi, "<br><br>")
    .trim();
}

/** Escape plain text and keep newlines as <br> for legacy descriptions. */
export function plainTextToHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
}
