import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ScenarioSummary } from "@/simulation/useScenarioList";
import { MAX_TURNS, STARTING_TRUST, TURN_SECONDS } from "@/simulation/useSimulation";
import { ArrowLeft, Clock, Play, ShieldCheck, Target, Timer } from "lucide-react";

interface ClientBriefingProps {
  scenario: ScenarioSummary;
  avatarSrc: string;
  onStart: () => void;
  onBack: () => void;
}

const DIFFICULTY_STYLES: Record<ScenarioSummary["difficulty"], { label: string; className: string }> = {
  easy: { label: "Easy", className: "bg-trust-high/15 text-trust-high" },
  medium: { label: "Medium", className: "bg-trust-mid/15 text-[hsl(var(--trust-mid))]" },
  hard: { label: "Hard", className: "bg-trust-low/15 text-trust-low" },
};

export function ClientBriefing({ scenario, avatarSrc, onStart, onBack }: ClientBriefingProps) {
  const diff = DIFFICULTY_STYLES[scenario.difficulty];

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 py-6 animate-bubble-in">
      <button
        onClick={onBack}
        className="mb-4 inline-flex w-fit items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </button>

      {/* Hero: client portrait + identity */}
      <section className="rounded-3xl border border-border bg-card p-6 shadow-bubble">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
          <img
            src={avatarSrc}
            alt={scenario.client_name}
            width={96}
            height={96}
            className="h-24 w-24 shrink-0 rounded-full object-cover ring-4 ring-primary/20"
          />
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center justify-center gap-1.5 sm:justify-start">
              <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", diff.className)}>
                {diff.label}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                <Clock className="h-3 w-3" />
                ~{scenario.estimated_minutes} min
              </span>
            </div>
            <h1 className="text-xl font-bold leading-tight text-foreground">{scenario.scenario_title}</h1>
            <p className="mt-0.5 text-[13px] font-medium text-primary">Meeting with {scenario.client_name}</p>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              {scenario.client_background}
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mt-4 rounded-3xl border border-border bg-card p-5 shadow-bubble">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Your Mission
            </h2>
            <p className="mt-1 text-[15px] font-medium leading-relaxed text-foreground">
              {scenario.objective}
            </p>
          </div>
        </div>
      </section>

      {/* Mechanic legend */}
      <section className="mt-4 grid gap-3 sm:grid-cols-3">
        <Mechanic
          icon={ShieldCheck}
          title="Trust Bar"
          body={`Starts at ${STARTING_TRUST}/100. Rises when you acknowledge and explain; falls with pressure or jargon. Hits zero → client walks.`}
        />
        <Mechanic
          icon={Timer}
          title="Reply Timer"
          body={`You have ${TURN_SECONDS} seconds to pick a reply. Freeze and the client disengages.`}
        />
        <Mechanic
          icon={Clock}
          title="Turn Limit"
          body={`Max ${MAX_TURNS} exchanges. Use them wisely — build rapport before closing.`}
        />
      </section>

      {/* CTA */}
      <div className="mt-6 pb-4">
        <Button onClick={onStart} size="lg" className="w-full gap-2 text-base">
          <Play className="h-5 w-5" />
          Start Meeting
        </Button>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Once you start, the simulation is logged — exiting mid-meeting counts as a walkaway.
        </p>
      </div>
    </main>
  );
}

interface MechanicProps {
  icon: React.ElementType;
  title: string;
  body: string;
}

function Mechanic({ icon: Icon, title, body }: MechanicProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-muted text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <h3 className="text-[13px] font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
