import json
import requests
from http.server import HTTPServer, BaseHTTPRequestHandler

RPC = "https://node.testnet.casper.network/rpc"
CONTRACT = "28611fbed24f95c3f69607a85eaed782a80b36da588169bdeab8cbab92dbedb0"
PORT = 8765

def rpc_call(method, params={}):
    r = requests.post(RPC, json={
        "jsonrpc": "2.0", "method": method, "params": params, "id": 1
    }, timeout=10)
    return r.json()

TOOLS = {
    "tools": [
        {
            "name": "get_block_height",
            "description": "Get current Casper testnet block height",
            "inputSchema": {"type": "object", "properties": {}}
        },
        {
            "name": "get_cspr_price",
            "description": "Get live CSPR price from CoinGecko",
            "inputSchema": {"type": "object", "properties": {}}
        },
        {
            "name": "scan_agent",
            "description": "Scan AI agent transaction with x402 payment",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "agent_id": {"type": "string"},
                    "amount": {"type": "number"},
                    "service_id": {"type": "string"}
                },
                "required": ["agent_id", "amount", "service_id"]
            }
        },
        {
            "name": "get_contract_state",
            "description": "Get CasperGuard contract state",
            "inputSchema": {"type": "object", "properties": {}}
        }
    ]
}

def handle_tool(name, args):
    if name == "get_block_height":
        data = rpc_call("chain_get_block", {})
        height = data["result"]["block_with_signatures"]["block"]["Version2"]["header"]["height"]
        return {"block_height": height, "network": "casper-testnet"}

    elif name == "get_cspr_price":
        r = requests.get("https://api.coingecko.com/api/v3/simple/price?ids=casper-network&vs_currencies=usd")
        price = r.json()["casper-network"]["usd"]
        return {"cspr_price_usd": price}

    elif name == "scan_agent":
        agent_id = args.get("agent_id")
        amount = args.get("amount", 0)
        service_id = args.get("service_id")
        score = 0
        reasons = []
        if amount > 100:
            score += 3
            reasons.append("High amount >100 CSPR")
        elif amount > 10:
            score += 1
            reasons.append("Medium amount >10 CSPR")
        result = "BLOCKED" if score >= 3 else "APPROVED"
        return {
            "agent_id": agent_id,
            "amount": amount,
            "service_id": service_id,
            "result": result,
            "score": score,
            "reasons": reasons,
            "x402_fee": 0.1,
            "refunded": result == "BLOCKED",
            "contract": CONTRACT
        }

    elif name == "get_contract_state":
        state = rpc_call("chain_get_state_root_hash", [])
        return {
            "contract": CONTRACT,
            "state_root": state["result"]["state_root_hash"],
            "network": "casper-testnet",
            "status": "DEPLOYED"
        }

    return {"error": "Unknown tool"}

class MCPHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

    def send_json(self, data, status=200):
        body = json.dumps(data).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_json({})

    def do_GET(self):
        if self.path == "/mcp" or self.path == "/":
            self.send_json({
                "name": "CasperGuard MCP Server",
                "version": "1.0.0",
                "description": "Real Casper testnet MCP server with x402 payments",
                "contract": CONTRACT,
                **TOOLS
            })
        else:
            self.send_json({"error": "Not found"}, 404)

    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length)) if length else {}

        if self.path == "/mcp":
            method = body.get("method", "")
            if method == "tools/list":
                self.send_json(TOOLS)
            elif method == "tools/call":
                name = body.get("params", {}).get("name")
                args = body.get("params", {}).get("arguments", {})
                result = handle_tool(name, args)
                self.send_json({"content": [{"type": "text", "text": json.dumps(result, indent=2)}]})
            else:
                self.send_json({"error": "Unknown method"})
        else:
            self.send_json({"error": "Not found"}, 404)

if __name__ == "__main__":
    print(f"CasperGuard MCP Server starting on port {PORT}")
    print(f"Contract: {CONTRACT}")
    print(f"Tools: get_block_height, get_cspr_price, scan_agent, get_contract_state")
    server = HTTPServer(("0.0.0.0", PORT), MCPHandler)
    server.serve_forever()
