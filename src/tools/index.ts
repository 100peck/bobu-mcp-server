import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { PrestaShopClient } from "../prestashop-client.js";
import { registerProductTools } from "./products.js";
import { registerCategoryTools } from "./categories.js";
import { registerCustomerTools } from "./customers.js";
import { registerOrderTools } from "./orders.js";
import { registerModuleTools } from "./modules.js";
import { registerMenuTools } from "./menu.js";
import { registerCacheTools } from "./cache.js";
import { registerThemeTools } from "./themes.js";
import { registerInfoTools } from "./info.js";

export function registerAllTools(server: McpServer, client: PrestaShopClient) {
  registerInfoTools(server, client);
  registerProductTools(server, client);
  registerCategoryTools(server, client);
  registerCustomerTools(server, client);
  registerOrderTools(server, client);
  registerModuleTools(server, client);
  registerMenuTools(server, client);
  registerCacheTools(server, client);
  registerThemeTools(server, client);
}
