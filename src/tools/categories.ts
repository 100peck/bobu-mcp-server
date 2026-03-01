import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { PrestaShopClient } from "../prestashop-client.js";

export function registerCategoryTools(server: McpServer, client: PrestaShopClient) {
  server.tool(
    "get_categories",
    "Get PrestaShop categories",
    {
      limit: z.number().int().optional().default(10).describe("Number of categories to retrieve"),
      parent_id: z.string().optional().describe("Filter by parent category ID"),
    },
    async (args) => {
      const result = await client.getCategories(args.limit, args.parent_id);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "create_category",
    "Create a new category",
    {
      name: z.string().describe("Category name"),
      description: z.string().optional().describe("Category description"),
      parent_id: z.string().optional().default("2").describe("Parent category ID"),
      active: z.boolean().optional().default(true).describe("Whether category is active"),
    },
    async (args) => {
      const result = await client.createCategory({
        name: args.name,
        description: args.description,
        parentId: args.parent_id,
        active: args.active,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "update_category",
    "Update an existing category",
    {
      category_id: z.string().describe("Category ID to update"),
      name: z.string().optional().describe("New category name"),
      description: z.string().optional().describe("New category description"),
      active: z.boolean().optional().describe("Whether category is active"),
    },
    async (args) => {
      const result = await client.updateCategory(args.category_id, {
        name: args.name,
        description: args.description,
        active: args.active,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "delete_category",
    "Delete a category",
    {
      category_id: z.string().describe("Category ID to delete"),
    },
    async (args) => {
      const result = await client.deleteCategory(args.category_id);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
