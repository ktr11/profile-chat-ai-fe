import { skills } from "@/constants/skills";
import { Code2, Globe, Cloud, Database, Cpu, Container } from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  Backend: <Code2 size={18} />,
  Frontend: <Globe size={18} />,
  Infrastructure: <Cloud size={18} />,
  Database: <Database size={18} />,
  "AI Tools": <Cpu size={18} />,
  DevOps: <Container size={18} />,
};

export default function Skills() {
  return (
    <section id="skills" className="py-20 px-4 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-base-content mb-10">Skills</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {skills.map((skill) => (
            <div key={skill.name} className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow p-4 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-primary">{categoryIcons[skill.category] ?? <Code2 size={18} />}</span>
                <span className="badge badge-ghost badge-sm">{skill.category}</span>
              </div>
              <p className="font-semibold text-base-content text-sm">{skill.name}</p>
              <p className="text-xs text-base-content/60">{skill.years}年経験</p>
              <p className="text-xs text-base-content/70 leading-relaxed">{skill.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
