import { defineClient } from "../types";
import animation from "./animation.config";
import catalog from "./products";
import site from "./site.config";
import theme from "./theme.config";

export default defineClient({ id: "organic-fashion", site, theme, animation, catalog });
