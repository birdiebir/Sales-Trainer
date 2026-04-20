import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { ScenarioCard } from "@/components/dashboard/ScenarioCard";
import { useScenarioList, type Difficulty } from "@/simulation/useScenarioList";
import { getClientAvatar } from "@/simulation/clientAvatars";
import { AlertTriangle, Loader2, Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const FILTERS: Array<{ key: Difficulty | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "easy", label: "Easy" },
  { key: "medium", label: "Medium" },
  { key: "hard", label: "Hard" },
];

const Dashboard = () => {
  const { scenarios, loading, error } = useScenarioList();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Difficulty | "all">("all");

  useEffect(() => {
    document.title = "Training Dashboard — Interactive Client Scenarios";
    const desc =
      "Browse and launch branching client scenarios. Practise objections, trust-building and compliance across difficulty tiers.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", window.location.origin + "/");
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return scenarios.filter((s) => {
      if (filter !== "all" && s.difficulty !== filter) return false;
      if (!q) return true;
      return (
        s.scenario_title.toLowerCase().includes(q) ||
        s.client_name.toLowerCase().includes(q) ||
        s.objective.toLowerCase().includes(q)
      );
    });
  }, [scenarios, query, filter]);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm">Loading scenarios…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-6 text-center">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <h1 className="text-lg font-semibold">Couldn't load scenarios</h1>
        <p className="max-w-sm text-sm text-muted-foreground">{error}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 animate-bubble-in">
      <header className="mb-6">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-trust-high text-primary-foreground shadow-bubble">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold leading-tight tracking-tight">Training Dashboard</h1>
            <p className="text-[13px] text-muted-foreground">
              Pick a client meeting to practise.
            </p>
          </div>
        </div>
      </header>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, client, or mission…"
            className="h-11 pl-9"
            aria-label="Search scenarios"
          />
        </div>
        <div role="tablist" aria-label="Filter by difficulty" className="flex rounded-full border border-border bg-card p-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              role="tab"
              aria-selected={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors",
                filter === f.key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
          <p className="text-sm font-medium">No scenarios match your search.</p>
          <p className="mt-1 text-[12px] text-muted-foreground">Try a different keyword or filter.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((s) => (
            <ScenarioCard
              key={s.scenario_id}
              scenario={s}
              avatarSrc={getClientAvatar(s.scenario_id)}
              onSelect={(id) => navigate(`/scenarios/${id}/briefing`)}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default Dashboard;
