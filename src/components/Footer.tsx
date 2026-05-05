import { GitFork } from "lucide-react";
import { socialLinks } from "@/constants/social";

const iconMap: Record<string, React.ReactNode> = {
  github: <GitFork size={16} />,
};

export default function Footer() {
  return (
    <footer className="footer footer-center bg-base-200 py-8 px-4 gap-4">
      <div className="flex gap-4">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm gap-2"
          >
            {iconMap[link.icon]}
            {link.label}
          </a>
        ))}
      </div>
      <p className="text-base-content/50 text-sm">
        © {new Date().getFullYear()} Kentaro.T. All rights reserved.
      </p>
    </footer>
  );
}
