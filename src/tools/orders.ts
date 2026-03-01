import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { PrestaShopClient } from "../prestashop-client.js";

export function registerOrderTools(server: McpServer, client: PrestaShopClient) {
  server.tool(
    "get_orders",
    "Get PrestaShop orders",
    {
      limit: z.number().int().optional().default(10).describe("Number of orders to retrieve"),
      customer_id: z.string().optional().describe("Filter by customer ID"),
      status: z.string().optional().describe("Filter by order status"),
    },
    async (args) => {
      const result = await client.getOrders(args.limit, args.customer_id, args.status);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "update_order_status",
    "Update order status",
    {
      order_id: z.string().describe("Order ID"),
      status_id: z.string().describe("New status ID"),
    },
    async (args) => {
      const result = await client.updateOrderStatus(args.order_id, args.status_id);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_order_states",
    "Get available order states/statuses",
    {},
    async () => {
      const result = await client.getOrderStates();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
