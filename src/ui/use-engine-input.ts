import { useMemo } from "react";
import { evidenceIndex, masteryTier } from "../app/selectors.ts";
import type { EngineInput, Tier } from "../app/engines/types.ts";
import { useApp } from "./context.ts";

/**
 * One derivation shared by every engine call in a screen. Tiers and the newest evidence timestamp are
 * built once per snapshot, so the routine, inbox, path and lesson always agree with each other and
 * with the atlas.
 */
export function useEngineInput(): EngineInput {
  const { state } = useApp();
  return useMemo(() => {
    const index = evidenceIndex(state);
    const tiers: Record<string, Tier> = {};
    const lastEvidenceAt: Record<string, number> = {};
    for (const n of Object.values(state.nodes)) tiers[n.id] = masteryTier(index, n.id);
    for (const [id, list] of index.byTarget) {
      const last = list[list.length - 1];
      if (last) lastEvidenceAt[id] = last.at;
    }
    return { nodes: state.nodes, edges: state.edges, tiers, lastEvidenceAt, now: new Date() };
  }, [state]);
}
