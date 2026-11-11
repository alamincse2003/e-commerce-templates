import { createTheme } from "@/config/schema/theme";
import { organicTheme } from "@/config/themes";

export default createTheme(organicTheme, {
  id: "terra-thread",
  name: "Terra & Thread",
  layout: { buttonRadius: "0px" },
});
