import { brochure } from "@/lib/company";

function Download({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
      aria-hidden
    >
      <path d="M12 3v12M7 11l5 5 5-5" strokeLinecap="square" />
      <path d="M4 20h16" strokeLinecap="square" />
    </svg>
  );
}

/**
 * Downloads the company profile deck. `download` on a same-origin static file
 * saves it rather than opening the browser's PDF viewer.
 */
export default function BrochureButton({
  variant = "onDark",
  className = "",
  label = "Download brochure",
}: {
  /** `onDark` sits on a navy or primary band, `outline` on white or tint. */
  variant?: "onDark" | "outline";
  className?: string;
  label?: string;
}) {
  const styles = {
    onDark: "border border-muted/60 text-white hover:bg-white/10",
    outline: "border border-line text-primary hover:bg-tint",
  }[variant];

  return (
    <a
      href={brochure.path}
      download={brochure.filename}
      className={`group inline-flex items-center gap-3 px-8 py-4 transition-colors duration-200 ${styles} ${className}`}
    >
      <Download className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
      <span className="label-caps">{label}</span>
      <span className="label-caps text-[0.65rem] opacity-60">
        PDF · {brochure.sizeLabel}
      </span>
    </a>
  );
}
