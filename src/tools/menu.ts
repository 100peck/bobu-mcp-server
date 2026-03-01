import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { PrestaShopClient } from "../prestashop-client.js";

export function registerMenuTools(server: McpServer, client: PrestaShopClient) {
  server.tool(
    "get_main_menu_links",
    "Get ps_mainmenu navigation links",
    {},
    async () => {
      const result = await client.getMainMenuLinks();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "update_main_menu_link",
    "Update a main menu navigation link",
    {
      link_id: z.string().describe("Menu link ID to update"),
      name: z.string().optional().describe("Link display name"),
      url: z.string().optional().describe("Link URL"),
      active: z.boolean().optional().describe("Whether link is active"),
    },
    async (args) => {
      const result = await client.updateMainMenuLink(args.link_id, {
        name: args.name,
        url: args.url,
        active: args.active,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "add_main_menu_link",
    "Add a new main menu navigation link",
    {
      name: z.string().describe("Link display name"),
      url: z.string().describe("Link URL"),
      position: z.number().int().optional().default(0).describe("Menu position"),
      active: z.boolean().optional().default(true).describe("Whether link is active"),
    },
    async (args) => {
      const result = await client.addMainMenuLink({
        name: args.name,
        url: args.url,
        position: args.position,
        active: args.active,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_menu_tree",
    "Get PS_MENU_TREE configuration - categories displayed in main navigation",
    {},
    async () => {
      const result = await client.getMenuTree();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "add_category_to_menu",
    "Add a category to the main navigation menu tree",
    {
      category_id: z.string().describe("Category ID to add to navigation"),
      position: z.number().int().optional().describe("Position in menu (optional, defaults to end)"),
    },
    async (args) => {
      const result = await client.addCategoryToMenu(args.category_id, args.position);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "remove_category_from_menu",
    "Remove a category from the main navigation menu tree",
    {
      category_id: z.string().describe("Category ID to remove from navigation"),
    },
    async (args) => {
      const result = await client.removeCategoryFromMenu(args.category_id);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "update_menu_tree",
    "Update the complete menu tree with new category order",
    {
      category_ids: z.array(z.string()).describe("Array of category IDs in desired order"),
    },
    async (args) => {
      const result = await client.updateMenuTree(args.category_ids);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_menu_tree_status",
    "Get comprehensive menu tree status including both custom links and category navigation",
    {},
    async () => {
      const result = await client.getMenuTreeStatus();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
