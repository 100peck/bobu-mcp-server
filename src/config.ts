export interface Config {
  shopUrl: string;
  apiKey: string;
  mcpApiKey: string;
}

export function loadConfig(): Config {
  const shopUrl = process.env.PRESTASHOP_SHOP_URL;
  const apiKey = process.env.PRESTASHOP_API_KEY;
  const mcpApiKey = process.env.MCP_API_KEY;

  if (!shopUrl) throw new Error("PRESTASHOP_SHOP_URL environment variable is required");
  if (!apiKey) throw new Error("PRESTASHOP_API_KEY environment variable is required");
  if (!mcpApiKey) throw new Error("MCP_API_KEY environment variable is required");
  if (!shopUrl.startsWith("http://") && !shopUrl.startsWith("https://")) {
    throw new Error("PRESTASHOP_SHOP_URL must start with http:// or https://");
  }

  return { shopUrl, apiKey, mcpApiKey };
}
