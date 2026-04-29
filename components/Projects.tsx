import { projects } from "@/constants/projects";
import { ExternalLink, GitFork, CircleDot, CheckCircle2 } from "lucide-react";

export default function Projects() {
  return (
    <section id="projects" className="py-20 px-4 lg:px-8 bg-base-200/40">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-base-content mb-10">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.title}
              className="card bg-base-100 border border-base-200 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
            >
              <div className="card-body gap-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="card-title text-base leading-snug">{project.title}</h3>
                  {project.status === "in_progress" ? (
                    <span className="badge badge-primary badge-sm whitespace-nowrap gap-1">
                      <CircleDot size={10} /> 開発中
                    </span>
                  ) : (
                    <span className="badge badge-ghost badge-sm whitespace-nowrap gap-1">
                      <CheckCircle2 size={10} /> 完了
                    </span>
                  )}
                </div>
                <p className="text-sm text-base-content/70 leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {project.techs.map((tech) => (
                    <span key={tech} className="badge badge-outline badge-sm">{tech}</span>
                  ))}
                </div>
                {(project.github || project.url) && (
                  <div className="card-actions mt-2">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-xs gap-1">
                        <GitFork size={14} /> GitHub
                      </a>
                    )}
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-xs gap-1">
                        <ExternalLink size={14} /> Demo
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
