import { createContext, useContext } from "react";
import type { Runtime } from "../app/runtime.ts";
import type { DbState } from "../domain/types.ts";

export interface AppCtx {
  rt: Runtime;
  state: DbState;
  refresh: () => Promise<void>;
}
export const Ctx = createContext<AppCtx | null>(null);
export function useApp(): AppCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp must be used inside <App>");
  return c;
}
