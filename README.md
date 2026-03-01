# PrestaShop MCP Server

A TypeScript/Node.js [Model Context Protocol](https://modelcontextprotocol.io/) server for managing PrestaShop e-commerce stores. Deployed as a serverless function on **Vercel**.

---

## Overview

This server exposes 32 MCP tools that let AI assistants (Claude, etc.) manage every major area of a PrestaShop store — products, categories, customers, orders, modules, navigation menus, cache, and themes — through natural language.

**Transport:** [MCP Streamable HTTP](https://modelcontextprotocol.io/docs/concepts/transports) — stateless, request/response based, ideal for serverless deployments.

---

## Quick Start

### 1. Prerequisites

- Node.js 18+
- A PrestaShop store with the Webservice API enabled
- A Vercel account (Hobby plan is sufficient)

### 2. Clone & Install

```bash
git clone https://github.com/100peck/bobu-mcp-server.git
cd bobu-mcp-server
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
PRESTASHOP_SHOP_URL=https://your-shop.example.com
PRESTASHOP_API_KEY=your-prestashop-api-key
MCP_API_KEY=your-secret-bearer-token
```

| Variable | Description |
|----------|-------------|
| `PRESTASHOP_SHOP_URL` | Your store's root URL (no trailing slash) |
| `PRESTASHOP_API_KEY` | PrestaShop Webservice API key |
| `MCP_API_KEY` | Bearer token that protects the `/api/mcp` endpoint |

### 4. Run Locally

```bash
npx vercel dev
```

Test the endpoints:

```bash
# Health check (no auth required)
curl http://localhost:3000/api/health

# MCP endpoint
curl -X POST http://localhost:3000/api/mcp \
  -H "Authorization: Bearer your-secret-bearer-token" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

### 5. Deploy to Vercel

```bash
npx vercel --prod
```

Set the three environment variables in the Vercel project dashboard (Settings → Environment Variables).

---

## Connecting to Claude Desktop

Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "prestashop": {
      "type": "http",
      "url": "https://your-project.vercel.app/api/mcp",
      "headers": {
        "Authorization": "Bearer your-secret-bearer-token"
      }
    }
  }
}
```

**Config file locations:**
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

---

## Available Tools (32 total)

### Connection & Info
| Tool | Description |
|------|-------------|
| `test_connection` | Test PrestaShop API connectivity |
| `get_shop_info` | Shop statistics (product/customer/order counts) |

### Products (6)
| Tool | Description |
|------|-------------|
| `get_products` | List or retrieve single product; optional stock/category enrichment |
| `create_product` | Create a product with stock, price, description |
| `update_product` | Update name, price, description, category, status |
| `delete_product` | Delete a product |
| `update_product_stock` | Set stock quantity |
| `update_product_price` | Update price (and optionally wholesale price) |

### Categories (4)
| Tool | Description |
|------|-------------|
| `get_categories` | List categories, filter by parent |
| `create_category` | Create a category with multilingual fields |
| `update_category` | Update name, description, status |
| `delete_category` | Delete a category |

### Customers (3)
| Tool | Description |
|------|-------------|
| `get_customers` | List customers, filter by email |
| `create_customer` | Create a customer account |
| `update_customer` | Update email, name, status |

### Orders (3)
| Tool | Description |
|------|-------------|
| `get_orders` | List orders, filter by customer or status |
| `update_order_status` | Change order state |
| `get_order_states` | List available order states |

### Modules (4)
| Tool | Description |
|------|-------------|
| `get_modules` | List modules |
| `get_module_by_name` | Get a module by its technical name |
| `install_module` | Install a module |
| `update_module_status` | Activate or deactivate a module |

### Navigation Menu (8)
| Tool | Description |
|------|-------------|
| `get_main_menu_links` | Get `ps_mainmenu` custom links |
| `add_main_menu_link` | Add a custom link to the menu |
| `update_main_menu_link` | Edit a custom menu link |
| `get_menu_tree` | Get `PS_MENU_TREE` — categories shown in nav |
| `add_category_to_menu` | Add a category to the navigation tree |
| `remove_category_from_menu` | Remove a category from navigation |
| `update_menu_tree` | Replace the full category order in navigation |
| `get_menu_tree_status` | Get combined menu status (links + tree) |

### Cache (2)
| Tool | Description |
|------|-------------|
| `clear_cache` | Clear all PrestaShop cache types |
| `get_cache_status` | Check enabled/disabled status per cache type |

### Themes (2)
| Tool | Description |
|------|-------------|
| `get_themes` | Get current theme name, folder, logo settings |
| `update_theme_setting` | Update any theme-related configuration key |

---

## Project Structure

```
/
├── api/
│   ├── mcp.ts          ← MCP endpoint (Streamable HTTP, bearer auth)
│   └── health.ts       ← Health check (no auth)
├── src/
│   ├── config.ts       ← Environment variable loading & validation
│   ├── prestashop-client.ts  ← PrestaShop REST API client
│   └── tools/
│       ├── index.ts    ← Tool registration aggregator
│       ├── products.ts
│       ├── categories.ts
│       ├── customers.ts
│       ├── orders.ts
│       ├── modules.ts
│       ├── menu.ts
│       ├── cache.ts
│       ├── themes.ts
│       └── info.ts
├── package.json
├── tsconfig.json
├── vercel.json
└── .env.example
```

---

## Architecture Notes

### Why Streamable HTTP?

Vercel Hobby has a **10-second timeout** for serverless functions. Traditional SSE transport requires a long-lived connection and is not suitable. MCP Streamable HTTP works as a standard request/response — each tool call is a single HTTP round-trip that completes well within the timeout.

### Stateless Design

Each request to `/api/mcp` creates a fresh `McpServer` instance with a stateless transport (`sessionIdGenerator: undefined`). No in-memory session state is maintained between requests, which is the correct model for serverless.

### PrestaShop API Client

- Uses native `fetch` (Node.js 18+)
- **Authentication:** `Authorization: Basic {base64(API_KEY + ":")}`
- **Read operations:** `GET` with `?output_format=JSON`
- **Write operations:** `POST`/`PUT` with XML body generated by `xmlbuilder2`
- **Multilingual fields** are correctly serialized as `<language id="1">value</language>`

---

## PrestaShop Webservice Setup

1. In PrestaShop admin, go to **Advanced Parameters → Webservice**
2. Enable the Webservice
3. Create an API key with permissions for: `products`, `categories`, `customers`, `orders`, `order_histories`, `order_states`, `stock_availables`, `modules`, `configurations`

---

## Development

```bash
# Type check
npm run typecheck

# Local dev server
npm run dev
```

---

## License

MIT — see [LICENSE](LICENSE) for details.
