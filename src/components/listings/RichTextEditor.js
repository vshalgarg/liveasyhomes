"use client";

import { useEffect, useRef } from "react";
import { Bold, Italic, Underline } from "lucide-react";
import { sanitizeRichText } from "@/lib/richText";

const toolbarBtn =
  "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E0D6CC] bg-white text-[#2B2118] hover:bg-[#F7F3EE] transition disabled:opacity-50";

export default function RichTextEditor({
  id,
  value,
  onChange,
  placeholder = "",
  "aria-invalid": ariaInvalid,
}) {
  const editorRef = useRef(null);
  const lastHtml = useRef("");

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const next = value || "";
    if (next !== lastHtml.current && el.innerHTML !== next) {
      el.innerHTML = next;
      lastHtml.current = next;
    }
  }, [value]);

  const emit = () => {
    const el = editorRef.current;
    if (!el) return;
    const html = sanitizeRichText(el.innerHTML);
    lastHtml.current = html;
    onChange(html);
  };

  const run = (command) => {
    editorRef.current?.focus();
    document.execCommand(command, false);
    emit();
  };

  const onPaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    emit();
  };

  return (
    <div className="rounded-xl border border-[#E0D6CC] bg-white focus-within:border-[#B08B6D] focus-within:ring-2 focus-within:ring-[#B08B6D]/20 transition">
      <div className="flex items-center gap-1.5 border-b border-[#EDE6DF] px-2 py-2">
        <button
          type="button"
          className={toolbarBtn}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => run("bold")}
          aria-label="Bold"
          title="Bold"
        >
          <Bold className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          className={toolbarBtn}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => run("italic")}
          aria-label="Italic"
          title="Italic"
        >
          <Italic className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          className={toolbarBtn}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => run("underline")}
          aria-label="Underline"
          title="Underline"
        >
          <Underline className="h-4 w-4" aria-hidden="true" />
        </button>
        <span className="ml-2 text-xs text-gray-400">
          Bold · Italic · Underline · line breaks kept
        </span>
      </div>

      <div
        id={id}
        ref={editorRef}
        role="textbox"
        aria-multiline="true"
        aria-invalid={ariaInvalid}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onBlur={emit}
        onPaste={onPaste}
        data-placeholder={placeholder}
        className="rich-text-editor min-h-[140px] max-h-[320px] overflow-y-auto px-4 py-3 text-[#2B2118] outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
      />
    </div>
  );
}
