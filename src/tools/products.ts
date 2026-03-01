import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { PrestaShopClient } from "../prestashop-client.js";

export function registerProductTools(server: McpServer, client: PrestaShopClient) {
  server.tool(
    "get_products",
    "Unified product retrieval - supports both single product by ID and multiple products with comprehensive filtering and enhancement options",
    {
      product_id: z.string().optional().describe("Retrieve single product by ID (takes precedence over other params)"),
      limit: z.number().int().optional().default(10).describe("Number of products to retrieve for list queries"),
      category_id: z.string().optional().describe("Filter by category ID"),
      name_filter: z.string().optional().describe("Filter by product name"),
      include_details: z.boolean().optional().default(false).describe("Include complete product information"),
      include_stock: z.boolean().optional().default(false).describe("Include stock/inventory information"),
      include_category_info: z.boolean().optional().default(false).describe("Include category details"),
      display: z.string().optional().describe("Comma-separated list of specific fields to include (e.g., 'id,name,price')"),
    },
    async (args) => {
      const result = await client.getProducts({
        productId: args.product_id,
        limit: args.limit,
        categoryId: args.category_id,
        nameFilter: args.name_filter,
        includeDetails: args.include_details,
        includeStock: args.include_stock,
        includeCategoryInfo: args.include_category_info,
        display: args.display,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "create_product",
    "Create a new product",
    {
      name: z.string().describe("Product name"),
      price: z.number().describe("Product price"),
      description: z.string().optional().describe("Product description"),
      category_id: z.string().optional().describe("Category ID"),
      quantity: z.number().int().optional().describe("Initial stock quantity"),
      reference: z.string().optional().describe("Product reference/SKU"),
      weight: z.number().optional().describe("Product weight"),
    },
    async (args) => {
      const result = await client.createProduct({
        name: args.name,
        price: args.price,
        description: args.description,
        categoryId: args.category_id,
        quantity: args.quantity,
        reference: args.reference,
        weight: args.weight,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "update_product",
    "Update an existing product",
    {
      product_id: z.string().describe("Product ID to update"),
      name: z.string().optional().describe("New product name"),
      price: z.number().optional().describe("New product price"),
      description: z.string().optional().describe("New product description"),
      category_id: z.string().optional().describe("New category ID"),
      active: z.boolean().optional().describe("Whether product is active"),
    },
    async (args) => {
      const result = await client.updateProduct(args.product_id, {
        name: args.name,
        price: args.price,
        description: args.description,
        categoryId: args.category_id,
        active: args.active,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "delete_product",
    "Delete a product",
    {
      product_id: z.string().describe("Product ID to delete"),
    },
    async (args) => {
      const result = await client.deleteProduct(args.product_id);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "update_product_stock",
    "Update product stock quantity",
    {
      product_id: z.string().describe("Product ID"),
      quantity: z.number().int().describe("New stock quantity"),
    },
    async (args) => {
      const result = await client.updateProductStock(args.product_id, args.quantity);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "update_product_price",
    "Update product price",
    {
      product_id: z.string().describe("Product ID"),
      price: z.number().describe("New price"),
      wholesale_price: z.number().optional().describe("New wholesale price"),
    },
    async (args) => {
      const result = await client.updateProductPrice(args.product_id, args.price, args.wholesale_price);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
