import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function Hero() {
  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center py-16 px-4 lg:px-8">
      <div className="max-w-5xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-6">
          <div>
            <p className="text-sm font-semibold tracking-widest text-primary uppercase mb-2">
              Software Engineer
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold text-base-content leading-tight">
              Build with <br className="hidden lg:block" />
              Code & AI.
            </h1>
          </div>
          <p className="text-base-content/70 leading-relaxed max-w-md">
            保険・オークションシステムを中心に8年以上のバックエンド開発経験を持つエンジニア。
            AIツールを積極的に活用し、チームの生産性向上とシステムの品質改善に取り組んでいます。
          </p>
          <div className="flex gap-3 flex-wrap justify-center md:justify-start">
            <a href="#projects" className="btn btn-primary">
              Works を見る
            </a>
            <Link href="/chat" className="btn btn-outline gap-2">
              <MessageCircle size={16} />
              AIと話す
            </Link>
          </div>
        </div>

        {/* Profile image */}
        <div className="flex justify-center">
          <div className="relative w-64 h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden ring-4 ring-base-200 shadow-xl">
            <Image
              src="/profile.jpg"
              alt="Kentaro.T"
              fill
              className="object-cover object-top"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
