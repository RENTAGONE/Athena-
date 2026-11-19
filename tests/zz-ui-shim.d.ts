declare module "react" { export type ReactNode = any; export const StrictMode: any; export function useState<T>(v: T | (() => T)): [T, (x: T | ((p: T) => T)) => void]; export function useEffect(f: () => any, d?: any[]): void; export function useMemo<T>(f: () => T, d: any[]): T; export function useRef<T>(v: T): { current: T }; export function useCallback<T extends (...a: any[]) => any>(f: T, d: any[]): T; export function createContext<T>(v: T): any; export function useContext<T>(c: any): T; }
declare module "react/jsx-runtime" { export const jsx: any; export const jsxs: any; export const Fragment: any; }
declare module "react-dom/client" { export function createRoot(e: any): { render(n: any): void }; }
declare module "virtual:pwa-register" { export function registerSW(o?: any): (r?: boolean) => Promise<void>; }
declare module "dexie" { const Dexie: any; export default Dexie; export type Table<T = any, K = any> = any; }
declare module "@fontsource/inter/latin-400.css"; declare module "@fontsource/inter/latin-600.css"; declare module "@fontsource/space-grotesk/latin-500.css"; declare module "@fontsource/space-grotesk/latin-700.css"; declare module "@fontsource/ibm-plex-mono/latin-400.css";
declare module "*.css";
declare namespace JSX { interface IntrinsicElements { [k: string]: any } interface IntrinsicAttributes { key?: any } }
