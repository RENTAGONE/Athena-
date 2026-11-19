// Internal identifiers. UUIDv7 (RFC 9562): 48-bit unix-ms timestamp + random. ATHENA codes are separate (see codes.ts).
export type Uuid = string;
export interface IdGen {
  next(): Uuid;
}
function randomBytes(n: number): Uint8Array {
  const b = new Uint8Array(n);
  globalThis.crypto.getRandomValues(b);
  return b;
}
export function uuidv7(nowMs: number = Date.now(), rnd: (n: number) => Uint8Array = randomBytes): Uuid {
  const b = new Uint8Array(16);
  b.set(rnd(16));
  let t = nowMs;
  for (let i = 5; i >= 0; i--) {
    b[i] = t % 256;
    t = Math.floor(t / 256);
  }
  b[6] = (b[6]! & 0x0f) | 0x70;
  b[8] = (b[8]! & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
export function looksLikeUuid(s: unknown): boolean {
  return typeof s === "string" && UUID_RE.test(s.toLowerCase());
}
export function isUuidV7(s: unknown): boolean {
  return typeof s === "string" && UUID_RE.test(s) && s[14] === "7" && "89ab".includes(s[19]!);
}
export class DefaultIdGen implements IdGen {
  next(): Uuid {
    return uuidv7();
  }
}
/** Deterministic generator for tests: valid UUIDv7 strings with an incrementing counter. */
export class SeqIdGen implements IdGen {
  private n = 0;
  next(): Uuid {
    this.n += 1;
    const c = this.n;
    return uuidv7(1_700_000_000_000 + c, () => {
      const r = new Uint8Array(16);
      r[15] = c & 255;
      r[14] = (c >> 8) & 255;
      return r;
    });
  }
}
