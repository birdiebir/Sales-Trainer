import clientTan from "@/assets/client-avatar.jpg";
import clientLin from "@/assets/client-lin.jpg";

/**
 * Maps a scenario_id to its client avatar image.
 * Falls back to the default portrait when no mapping exists.
 */
const AVATAR_BY_SCENARIO: Record<string, string> = {
  "11111111-1111-1111-1111-111111111111": clientTan,
  "22222222-2222-2222-2222-222222222222": clientLin,
};

export function getClientAvatar(scenarioId: string): string {
  return AVATAR_BY_SCENARIO[scenarioId] ?? clientTan;
}
