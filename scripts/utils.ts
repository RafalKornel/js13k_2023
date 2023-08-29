import { fileURLToPath } from "url";
import path from "path";

export function RGBTAoHex(r: number, g: number, b: number, a: number) {
  let rs = r.toString(16);
  let gs = g.toString(16);
  let bs = b.toString(16);
  let as = a.toString(16);

  if (rs.length == 1) rs = "0" + rs;
  if (gs.length == 1) gs = "0" + gs;
  if (bs.length == 1) bs = "0" + bs;
  if (as.length === 1) as = "0" + as;

  return "#" + rs + gs + bs + as;
}

export const getDirname = () => {
  const __filename = fileURLToPath(import.meta.url);

  const __dirname = path.dirname(__filename);

  return __dirname;
};
