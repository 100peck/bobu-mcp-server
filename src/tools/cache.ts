import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { PrestaShopClient } from "../prestashop-client.js";

export function registerCacheTools(server: McpServer, client: PrestaShopClient) {
  server.tool(
    "clear_cache",
    "Clear PrestaShop cache",
    {
      cache_type: z.enum(["all"]).optional().default("all").describe("Type of cache to clear"),
    },
    async (args) => {
      const result = await client.clearCache(args.cache_type);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_cache_status",
    "Get current cache configuration status",
    {},
    async () => {
      const result = await client.getCacheStatus();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
