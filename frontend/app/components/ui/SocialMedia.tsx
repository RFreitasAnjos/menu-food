"use client";

const socialMediaLinks = [
  { name: "Facebook", initial: "f", url: "https://www.facebook.com" },
  { name: "WhatsApp", initial: "w", url: "https://www.whatsapp.com" },
  { name: "X (Twitter)", initial: "𝕏", url: "https://www.twitter.com" },
  { name: "Instagram", initial: "in", url: "https://www.instagram.com" }];

export default function SocialMedia() {
  return (
    <div className="flex items-center gap-3">
      {socialMediaLinks.map(({ name, initial, url }) => (
        <a
          key={name}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-full bg-gray-700 hover:bg-[var(--primary-color)] transition-colors flex items-center justify-center text-white text-xs font-bold uppercase"
          aria-label={name}
          title={name}
        >
          {initial}
        </a>
      ))}
    </div>
  );
}
