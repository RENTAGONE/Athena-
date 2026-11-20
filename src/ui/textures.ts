/**
 * Body textures. Forty generated surface maps ship with the atlas: sixteen worlds, ten moons and
 * fourteen star photospheres. A record's own seed picks its map, then the map is tinted by its
 * discipline, so the same record always wears the same surface and no two systems look alike.
 *
 * Everything is a flat, top-down map. Drawing wraps it onto the visible disc and applies limb
 * darkening and a day/night terminator in code, which is what makes a 2D texture read as a sphere.
 */
import planetOceanEarth from "../assets/textures/planet-ocean-earth.webp";
import planetRustDesert from "../assets/textures/planet-rust-desert.webp";
import planetIceWorld from "../assets/textures/planet-ice-world.webp";
import planetVolcanic from "../assets/textures/planet-volcanic.webp";
import planetBandedGiant from "../assets/textures/planet-banded-giant.webp";
import planetNeptuneBlue from "../assets/textures/planet-neptune-blue.webp";
import planetOrangeStorm from "../assets/textures/planet-orange-storm.webp";
import planetCrateredGrey from "../assets/textures/planet-cratered-grey.webp";
import planetLushAlien from "../assets/textures/planet-lush-alien.webp";
import planetVioletGiant from "../assets/textures/planet-violet-giant.webp";
import planetBlueOcean from "../assets/textures/planet-blue-ocean.webp";
import planetPinkGiant from "../assets/textures/planet-pink-giant.webp";
import planetCrystalTeal from "../assets/textures/planet-crystal-teal.webp";
import planetMoltenMetal from "../assets/textures/planet-molten-metal.webp";
import planetSaltFlats from "../assets/textures/planet-salt-flats.webp";
import planetAcidWorld from "../assets/textures/planet-acid-world.webp";
import moonCratered from "../assets/textures/moon-cratered-moon.webp";
import moonIceCracked from "../assets/textures/moon-ice-cracked.webp";
import moonSulphurIo from "../assets/textures/moon-sulphur-io.webp";
import moonCarbon from "../assets/textures/moon-carbon-moon.webp";
import moonRust from "../assets/textures/moon-rust-moon.webp";
import moonGlassyIce from "../assets/textures/moon-glassy-ice.webp";
import moonMetallic from "../assets/textures/moon-metallic.webp";
import moonGreenSulphur from "../assets/textures/moon-green-sulphur.webp";
import moonChalkDust from "../assets/textures/moon-chalk-dust.webp";
import starSun from "../assets/textures/star-sun-granulation.webp";
import starGoldG from "../assets/textures/star-gold-g.webp";
import starRedGiant from "../assets/textures/star-red-giant.webp";
import starBlueHot from "../assets/textures/star-blue-hot.webp";
import starOrangeDwarf from "../assets/textures/star-orange-dwarf.webp";
import starWhiteDwarf from "../assets/textures/star-white-dwarf.webp";
import starCrimsonDwarf from "../assets/textures/star-crimson-dwarf.webp";
import starBrownDwarf from "../assets/textures/star-brown-dwarf.webp";
import starNeutron from "../assets/textures/star-neutron-crust.webp";
import starMagnetar from "../assets/textures/star-magnetar.webp";
import starSupergiant from "../assets/textures/star-orange-supergiant.webp";
import starCarbon from "../assets/textures/star-carbon-star.webp";
import starWolfRayet from "../assets/textures/star-wolf-rayet.webp";
import starProtostar from "../assets/textures/star-protostar.webp";
import starHeliumBurn from "../assets/textures/star-helium-burn.webp";
import { hash01 } from "../app/atlas-graph.ts";

/** Gas giants: banded, no crust. */
const GIANTS = [planetBandedGiant, planetNeptuneBlue, planetOrangeStorm, planetVioletGiant, planetPinkGiant];
/** Rocky and ocean worlds: terrain, not bands. */
const ROCKS = [
  planetOceanEarth, planetRustDesert, planetIceWorld, planetVolcanic, planetCrateredGrey,
  planetLushAlien, planetBlueOcean, planetCrystalTeal, planetMoltenMetal, planetSaltFlats, planetAcidWorld,
];
const MOONS = [
  moonCratered, moonIceCracked, moonSulphurIo, moonCarbon, moonRust,
  moonGlassyIce, moonMetallic, moonGreenSulphur, moonChalkDust,
];
const STARS = [
  starSun, starGoldG, starRedGiant, starBlueHot, starOrangeDwarf, starWhiteDwarf,
  starCrimsonDwarf, starBrownDwarf, starNeutron, starMagnetar, starSupergiant, starCarbon, starWolfRayet,
  starProtostar, starHeliumBurn,
];

const pick = (list: readonly string[], seed: number, salt: number): string =>
  list[Math.floor(hash01(seed, salt) * list.length) % list.length]!;

/** The map a planet of this seed wears. Gas giants only ever get banded maps. */
export const planetMap = (seed: number, banded: boolean): string => pick(banded ? GIANTS : ROCKS, seed, 211);
export const moonMap = (seed: number): string => pick(MOONS, seed, 223);
export const starMap = (seed: number): string => pick(STARS, seed, 227);

const images = new Map<string, HTMLImageElement>();
function image(src: string): HTMLImageElement {
  let img = images.get(src);
  if (!img) {
    img = new Image();
    img.decoding = "async";
    img.src = src;
    images.set(src, img);
  }
  return img;
}

const TILE = 192;
const tiles = new Map<string, HTMLCanvasElement>();

/** A map tinted by its record's colour, cached per map + tint. Tint never replaces the terrain. */
function tintedTile(src: string, tint: string): HTMLCanvasElement | null {
  const key = `${src}|${tint}`;
  const hit = tiles.get(key);
  if (hit) return hit;
  const img = image(src);
  if (!img.complete || img.naturalWidth === 0) return null;
  const canvas = document.createElement("canvas");
  canvas.width = TILE;
  canvas.height = TILE;
  const g = canvas.getContext("2d");
  if (!g) return null;
  // A little punch before the tint: the maps arrive soft, and a soft map behind a terminator reads
  // as fog instead of terrain.
  g.filter = "saturate(1.22) contrast(1.12)";
  g.drawImage(img, 0, 0, TILE, TILE);
  g.filter = "none";
  // "color" carries the discipline hue onto the terrain while keeping its luminance, so an ice
  // world stays an ice world even when its owner is the engineering blue.
  g.globalCompositeOperation = "color";
  g.globalAlpha = 0.26;
  g.fillStyle = tint;
  g.fillRect(0, 0, TILE, TILE);
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.14;
  g.fillRect(0, 0, TILE, TILE);
  g.globalCompositeOperation = "source-over";
  g.globalAlpha = 1;
  tiles.set(key, canvas);
  return canvas;
}

/**
 * Wraps a flat map onto a lit disc. Returns false while the texture is still decoding, so callers
 * can fall back to their painted surface for a frame or two instead of showing an empty world.
 *
 * spin is in turns (0…1); the map scrolls sideways and wraps, which reads as rotation.
 */
export function drawTexturedDisc(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  src: string,
  tint: string,
  spin: number,
  alpha = 1,
): boolean {
  if (r < 3) return false;
  const tile = tintedTile(src, tint);
  if (!tile) return false;
  const size = r * 2;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.translate(x - r, y - r);
  const off = ((spin % 1) + 1) % 1;
  const dx = -off * size;
  ctx.drawImage(tile, dx, 0, size, size);
  ctx.drawImage(tile, dx + size, 0, size, size);
  // Limb darkening plus a terminator: light from the upper left, the far limb falling to shadow.
  const shade = ctx.createRadialGradient(size * 0.5 - size * 0.16, size * 0.5 - size * 0.19, size * 0.04, size * 0.5 - size * 0.02, size * 0.5 - size * 0.03, size * 0.74);
  shade.addColorStop(0, "rgba(255,255,255,0.12)");
  shade.addColorStop(0.3, "rgba(0,0,0,0)");
  shade.addColorStop(0.62, "rgba(2,4,10,0.42)");
  shade.addColorStop(0.86, "rgba(1,2,6,0.82)");
  shade.addColorStop(1, "rgba(0,0,0,0.97)");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, size, size);
  ctx.restore();
  return true;
}

/** Warm the cache for one map without drawing it (used when a system comes into range). */
export const primeTexture = (src: string): void => void image(src);
