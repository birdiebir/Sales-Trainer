import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Difficulty = "easy" | "medium" | "hard";

export interface ScenarioSummary {
  scenario_id: string;
  scenario_title: string;
  difficulty: Difficulty;
  client_name: string;
  client_background: string;
  objective: string;
  estimated_minutes: number;
  starting_node_id: string;
  /** Number of completed simulation runs for this scenario (anonymous). */
  completion_count: number;
  /** Best (highest) final_trust_score across completed runs, or null if none. */
  best_trust: number | null;
}

interface UseScenarioListResult {
  scenarios: ScenarioSummary[];
  loading: boolean;
  error: string | null;
}

interface ScenarioRow {
  scenario_id: string;
  scenario_title: string;
  starting_node_id: string;
  difficulty: string;
  client_name: string;
  client_background: string;
  objective: string;
  estimated_minutes: number;
}

/**
 * Loads every scenario + its completion telemetry for the dashboard.
 * Completion stats rely on `agent_simulations` being publicly readable —
 * if SELECT is locked down, counts gracefully fall back to 0.
 */
export function useScenarioList(): UseScenarioListResult {
  const [scenarios, setScenarios] = useState<ScenarioSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const { data, error: fetchErr } = await supabase
        .from("scenarios")
        .select(
          "scenario_id, scenario_title, starting_node_id, difficulty, client_name, client_background, objective, estimated_minutes",
        )
        .order("difficulty", { ascending: true })
        .order("scenario_title", { ascending: true });

      if (cancelled) return;

      if (fetchErr) {
        setError(fetchErr.message);
        setLoading(false);
        return;
      }

      const rows = (data ?? []) as ScenarioRow[];

      // Completion stats — best effort; ignore errors (RLS may hide them).
      const { data: simRows } = await supabase
        .from("agent_simulations")
        .select("scenario_id, final_trust_score");

      const stats = new Map<string, { count: number; best: number }>();
      for (const r of simRows ?? []) {
        const s = stats.get(r.scenario_id) ?? { count: 0, best: -Infinity };
        s.count += 1;
        s.best = Math.max(s.best, r.final_trust_score);
        stats.set(r.scenario_id, s);
      }

      const list: ScenarioSummary[] = rows.map((r) => {
        const s = stats.get(r.scenario_id);
        return {
          scenario_id: r.scenario_id,
          scenario_title: r.scenario_title,
          starting_node_id: r.starting_node_id,
          difficulty: (["easy", "medium", "hard"].includes(r.difficulty) ? r.difficulty : "medium") as Difficulty,
          client_name: r.client_name,
          client_background: r.client_background,
          objective: r.objective,
          estimated_minutes: r.estimated_minutes,
          completion_count: s?.count ?? 0,
          best_trust: s && s.best > -Infinity ? s.best : null,
        };
      });

      setScenarios(list);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { scenarios, loading, error };
}
