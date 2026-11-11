import { createTheme } from "@/config/schema/theme";
import { luxuryTheme } from "@/config/themes";

/** Maison Élan: the Luxury preset with a warmer ivory and a slightly deeper gold. */
export default createTheme(luxuryTheme, {
  id: "maison-elan",
  name: "Maison Élan",
  colors: {
    background: "#F3EEE5",
    accent: "#A7834E",
  },
});
