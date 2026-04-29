import Link from "next/link";
import { GitFork, MessageCircle } from "lucide-react";
import { socialLinks } from "@/constants/social";

const iconMap: Record<string, React.ReactNode> = {
  github: <GitFork size={20} />,
};

export default function Contact() {
  return (
    <section id="contact" className="py-20 px-4 lg:px-8">
      <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-8">
        <div>
          <h2 className="text-3xl font-bold text-base-content mb-3">Contact</h2>
          <p className="text-base-content/70 leading-relaxed">
            お仕事のご相談・技術的な話題など、お気軽にどうぞ。
            AIチャットから話しかけていただくこともできます。
          </p>
        </div>

        <Link href="/chat" className="btn btn-primary btn-lg gap-2 shadow-md hover:shadow-lg transition-shadow">
          <MessageCircle size={20} />
          AIチャットで話しかける
        </Link>

        <div className="divider w-32 mx-auto" />

        <div className="flex gap-4 justify-center">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline gap-2"
            >
              {iconMap[link.icon]}
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
