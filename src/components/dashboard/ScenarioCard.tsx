import { cn } from "@/lib/utils";
import type { ScenarioSummary } from "@/simulation/useScenarioList";
import { ArrowRight, CheckCircle2, Clock, Sparkles } from "lucide-react";

interface ScenarioCardProps {
  scenario: ScenarioSummary;
  avatarSrc: string;
  onSelect: (id: string) => void;
}

const DIFFICULTY_STYLES: Record<ScenarioSummary["difficulty"], { label: string; className: string }> = {
  easy: { label: "Easy", className: "bg-trust-high/15 text-trust-high" },
  medium: { label: "Medium", className: "bg-trust-mid/15 text-[hsl(var(--trust-mid))]" },
  hard: { label: "Hard", className: "bg-trust-low/15 text-trust-low" },
};

export function ScenarioCard({ scenario, avatarSrc, onSelect }: ScenarioCardProps) {
  const diff = DIFFICULTY_STYLES[scenario.difficulty];
  const completed = scenario.completion_count > 0;

  return (
    <button
      onClick={() => onSelect(scenario.scenario_id)}
      className={cn(
        "group relative flex w-full flex-col overflow-hidden rounded-2xl border-2 border-border bg-card p-5 text-left transition-all",
        "hover:-translate-y-1 hover:border-primary/60 hover:shadow-bubble active:translate-y-0",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      <div className="flex items-start gap-4">
        <img
          src={avatarSrc}
          alt={scenario.client_name}
          width={56}
          height={56}
          loading="lazy"
          className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-border"
        />
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", diff.className)}>
              {diff.label}
            </span>
            {completed && (
              <span className="flex items-center gap-1 rounded-full bg-trust-high/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-trust-high">
                <CheckCircle2 className="h-3 w-3" />
                Completed
              </span>
            )}
            {!completed && (
              <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                <Sparkles className="h-3 w-3" />
                New
              </span>
            )}
          </div>
          <h3 className="text-[15px] font-semibold leading-tight text-foreground">
            {scenario.scenario_title}
          </h3>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            with {scenario.client_name}
          </p>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
        {scenario.objective}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          ~{scenario.estimated_minutes} min
        </span>
        {completed && scenario.best_trust !== null && (
          <span>
            Best trust · <span className="font-semibold text-foreground">{scenario.best_trust}/100</span>
          </span>
        )}
        <span className="flex items-center gap-1 font-semibold text-primary transition-transform group-hover:translate-x-0.5">
          Start
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </button>
  );
}
