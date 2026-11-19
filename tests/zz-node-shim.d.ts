declare module "node:test" { export function test(name: string, fn: () => unknown | Promise<unknown>): void; }
declare module "node:assert/strict" { const assert: any; export default assert; }
declare module "node:fs" { export function readFileSync(p: string, enc: string): string; export function readdirSync(p: string): string[]; }
declare module "node:path" { export function join(...p: string[]): string; export function dirname(p: string): string; }
declare module "node:url" { export function fileURLToPath(u: string | URL): string; }
declare module "ajv/dist/2020.js" { const x: any; export default x; }
declare module "ajv-formats" { const x: any; export default x; }
interface ImportMeta { url: string }
declare module "fake-indexeddb/auto";
declare module "@playwright/test" { export const test: any; export const expect: any; export function defineConfig(c: any): any; }
declare module "vite" { export function defineConfig(c: any): any; }
declare module "@vitejs/plugin-react" { const x: any; export default x; }
declare module "vite-plugin-pwa" { export const VitePWA: any; }
declare const process: { env: Record<string, string | undefined>; exit(n: number): never };
declare module "*.json" { const v: any; export default v; }
