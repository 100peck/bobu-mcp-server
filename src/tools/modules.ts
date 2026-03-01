import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { PrestaShopClient } from "../prestashop-client.js";

export function registerModuleTools(server: McpServer, client: PrestaShopClient) {
  server.tool(
    "get_modules",
    "Get PrestaShop modules",
    {
      limit: z.number().int().optional().default(20).describe("Number of modules to retrieve"),
      module_name: z.string().optional().describe("Filter by module name"),
    },
    async (args) => {
      const result = await client.getModules(args.limit, args.module_name);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_module_by_name",
    "Get specific module by technical name",
    {
      module_name: z.string().describe("Module technical name"),
    },
    async (args) => {
      const result = await client.getModuleByName(args.module_name);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "install_module",
    "Install a PrestaShop module",
    {
      module_name: z.string().describe("Module technical name to install"),
    },
    async (args) => {
      const result = await client.installModule(args.module_name);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "update_module_status",
    "Activate or deactivate a module",
    {
      module_name: z.string().describe("Module technical name"),
      active: z.boolean().describe("Whether module should be active"),
    },
    async (args) => {
      const result = await client.updateModuleStatus(args.module_name, args.active);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
