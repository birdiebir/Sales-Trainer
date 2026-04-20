import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClientBriefing } from "@/components/dashboard/ClientBriefing";
import { useScenarioList } from "@/simulation/useScenarioList";
import { getClientAvatar } from "@/simulation/clientAvatars";
import { AlertTriangle, Loader2 } from "lucide-react";

const Briefing = () => {
  const { scenarioId = "" } = useParams();
  const navigate = useNavigate();
  const { scenarios, loading, error } = useScenarioList();
  const scenario = scenarios.find((s) => s.scenario_id === scenarioId);

  useEffect(() => {
    if (!scenario) return;
    document.title = `Briefing: ${scenario.scenario_title} — Client Scenario`;
  }, [scenario]);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm">Preparing briefing…</p>
      </main>
    );
  }

  if (error || !scenario) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-6 text-center">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <h1 className="text-lg font-semibold">Scenario unavailable</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          {error ?? "That scenario couldn't be found."}
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Back to dashboard
        </button>
      </main>
    );
  }

  return (
    <ClientBriefing
      scenario={scenario}
      avatarSrc={getClientAvatar(scenario.scenario_id)}
      onStart={() => navigate(`/scenarios/${scenario.scenario_id}/simulate`)}
      onBack={() => navigate("/")}
    />
  );
};

export default Briefing;
