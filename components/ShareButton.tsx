"use client";

interface ShareButtonProps {
  url: string;
  title: string;
}

export default function ShareButton({ url, title }: ShareButtonProps) {
  const handleShare = async () => {
    // Try native share first
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
        return; // Success, exit
      } catch (error) {
        // Share failed - could be user cancel or other error
        // Continue to fallback
      }
    }

    // Fallback: try clipboard if document is focused
    if (document.hasFocus() && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
        return;
      } catch (error) {
        // Clipboard failed, continue to final fallback
      }
    }

    // Final fallback: prompt user to copy manually
    try {
      window.prompt("Copy this link to share:", url);
    } catch (error) {
      // Even prompt failed, show a gentle message
      alert(`Share this link: ${url}`);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
      aria-label="Share this article"
    >
      <svg
        className="h-4 w-4"
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
      Share
    </button>
  );
}