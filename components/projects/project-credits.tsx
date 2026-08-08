import type { ProjectCredits as Credits } from "@/data/projects"
import { cn } from "@/lib/utils"
import { LABEL } from "./shared"

/**
 * Cast and crew, kept apart and set the way an end roll is: a quiet left column
 * naming the part, the person against it. Either block can be missing — a music
 * video has no cast, and the panel simply doesn't mention one.
 */
export function ProjectCredits({ credits }: { credits: Credits }) {
  const { cast, crew } = credits

  return (
    <div className="grid max-w-4xl gap-12 md:grid-cols-2 md:gap-16">
      {cast && cast.length > 0 && (
        <section>
          <h3 className={cn(LABEL, "mb-5 block border-b border-border pb-3")}>Cast</h3>
          <dl>
            {cast.map((member) => (
              <div key={member.name} className="grid grid-cols-2 gap-4 py-2.5">
                <dt className="body-s text-foreground/90">{member.name}</dt>
                <dd className="body-s text-muted-foreground">{member.character}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {crew && crew.length > 0 && (
        <section>
          <h3 className={cn(LABEL, "mb-5 block border-b border-border pb-3")}>Crew</h3>
          <dl>
            {crew.map((member) => (
              <div key={`${member.role}-${member.name}`} className="grid grid-cols-2 gap-4 py-2.5">
                <dt className={cn(LABEL, "pt-0.5")}>{member.role}</dt>
                <dd className="body-s text-foreground/90">{member.name}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </div>
  )
}
