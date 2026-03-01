import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { PrestaShopClient } from "../prestashop-client.js";

export function registerInfoTools(server: McpServer, client: PrestaShopClient) {
  server.tool(
    "test_connection",
    "Test PrestaShop API connection",
    {},
    async () => {
      const result = await client.getConfigurations();
      const text =
        "error" in result
          ? JSON.stringify(result, null, 2)
          : JSON.stringify({ status: "success", message: "API connection working", xml_enabled: true }, null, 2);
      return { content: [{ type: "text", text }] };
    }
  );

  server.tool(
    "get_shop_info",
    "Get general shop information and statistics",
    {},
    async () => {
      const result = await client.getShopInfo();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
