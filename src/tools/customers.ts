import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { PrestaShopClient } from "../prestashop-client.js";

export function registerCustomerTools(server: McpServer, client: PrestaShopClient) {
  server.tool(
    "get_customers",
    "Get PrestaShop customers",
    {
      limit: z.number().int().optional().default(10).describe("Number of customers to retrieve"),
      email_filter: z.string().optional().describe("Filter by email"),
    },
    async (args) => {
      const result = await client.getCustomers(args.limit, args.email_filter);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "create_customer",
    "Create a new customer",
    {
      email: z.string().describe("Customer email"),
      firstname: z.string().describe("First name"),
      lastname: z.string().describe("Last name"),
      password: z.string().describe("Customer password"),
      active: z.boolean().optional().default(true).describe("Whether customer is active"),
    },
    async (args) => {
      const result = await client.createCustomer({
        email: args.email,
        firstname: args.firstname,
        lastname: args.lastname,
        password: args.password,
        active: args.active,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "update_customer",
    "Update an existing customer",
    {
      customer_id: z.string().describe("Customer ID to update"),
      email: z.string().optional().describe("New email"),
      firstname: z.string().optional().describe("New first name"),
      lastname: z.string().optional().describe("New last name"),
      active: z.boolean().optional().describe("Whether customer is active"),
    },
    async (args) => {
      const result = await client.updateCustomer(args.customer_id, {
        email: args.email,
        firstname: args.firstname,
        lastname: args.lastname,
        active: args.active,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
