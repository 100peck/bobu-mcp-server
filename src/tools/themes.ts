import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { PrestaShopClient } from "../prestashop-client.js";

export function registerThemeTools(server: McpServer, client: PrestaShopClient) {
  server.tool(
    "get_themes",
    "Get available themes and current theme settings",
    {},
    async () => {
      const result = await client.getThemes();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "update_theme_setting",
    "Update a theme configuration setting",
    {
      setting_name: z.string().describe("Theme setting name (e.g., PS_LOGO, PS_THEME_NAME)"),
      value: z.string().describe("New setting value"),
    },
    async (args) => {
      const result = await client.updateThemeSetting(args.setting_name, args.value);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
