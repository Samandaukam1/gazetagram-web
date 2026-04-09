"use client";

import { useState } from "react";

interface ShareButtonProps {
  url: string;
  title: string;
}

export default function ShareButton({ url, title }: ShareButtonProps) {
  const [status, setStatus] = useState<string | null>(null);

  const copyText = async (text: string) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      setStatus("Link copied to clipboard.");
      return true;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();

    let copied = false;
    try {
      copied = document.execCommand("copy");
      if (copied) {
        setStatus("Link copied to clipboard.");
      }
    } catch (error) {
      copied = false;
    }

    document.body.removeChild(textarea);
    return copied;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        setStatus("Shared successfully.");
        return;
      } catch (error: unknown) {
        if (error instanceof Error) {
          const message = error.message.toLowerCase();
          if (message.includes("cancel") || message.includes("abort")) {
            setStatus("Share cancelled.");
            return;
          }
        }
      }
    }

    const copied = await copyText(url);
    if (!copied) {
      setStatus(`Copy this link: ${url}`);
    }
  };

  return (
    <div className="inline-flex flex-col items-start gap-2">
      <button
        onClick={handleShare}
        className="btn-ghost text-sm px-4 py-2"
        aria-label="Bu maqolani ulashish"
      >
        <svg
          className="h-4 w-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
          />
        </svg>
        Ulashish
      </button>
      {status ? (
        <p className="text-xs text-neutral-500 font-medium" aria-live="polite">
          {status}
        </p>
      ) : null}
    </div>
  );
}
