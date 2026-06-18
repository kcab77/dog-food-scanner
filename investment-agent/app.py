#!/usr/bin/env python3
"""
Investment Analyst Web App
Run: python3 app.py
Then open: http://localhost:5000
"""

import json
import os

import yfinance as yf
from flask import Flask, Response, jsonify, render_template, request, stream_with_context

from analyzer import SYSTEM_PROMPT, TOOLS, client, execute_tool
from screener import scan_universe

app = Flask(__name__)

ANALYSIS_PROMPT = """\
Please perform a comprehensive investment analysis of: {query}

Apply the full value investing framework from the system prompt.
Use the available tools to gather real financial data, then deliver a \
structured analysis with a clear Buy / Hold / Avoid verdict, target price \
range, and margin of safety.\
"""

TOOL_LABELS = {
    "get_key_metrics":        "Fetching key metrics & ratios",
    "get_income_statement":   "Fetching income statement (P&L)",
    "get_balance_sheet":      "Fetching balance sheet",
    "get_cash_flow":          "Fetching cash flow statement",
    "get_price_history":      "Fetching price history",
    "calculate_dcf_estimate": "Calculating DCF intrinsic value",
}


def sse(payload: dict) -> str:
    return f"data: {json.dumps(payload)}\n\n"


def analyze_stream(query: str):
    """Yield SSE-compatible JSON events during analysis."""
    if not os.environ.get("ANTHROPIC_API_KEY"):
        yield sse({"type": "error", "message": "ANTHROPIC_API_KEY is not set."})
        return

    messages = [{"role": "user", "content": ANALYSIS_PROMPT.format(query=query)}]
    max_iterations = 15

    for iteration in range(1, max_iterations + 1):
        yield sse({"type": "status", "message": f"Thinking… (turn {iteration})"})

        try:
            with client.messages.stream(
                model="claude-opus-4-6",
                max_tokens=8192,
                thinking={"type": "adaptive"},
                system=SYSTEM_PROMPT,
                tools=TOOLS,
                messages=messages,
            ) as stream:
                for event in stream:
                    if (
                        event.type == "content_block_delta"
                        and event.delta.type == "text_delta"
                    ):
                        yield sse({"type": "text_delta", "text": event.delta.text})

                final = stream.get_final_message()

        except Exception as e:
            yield sse({"type": "error", "message": str(e)})
            return

        if final.stop_reason == "end_turn":
            yield sse({"type": "done"})
            return

        if final.stop_reason != "tool_use":
            yield sse({"type": "error", "message": f"Unexpected stop: {final.stop_reason}"})
            return

        # Handle tool calls
        messages.append({"role": "assistant", "content": final.content})
        tool_results = []

        for block in final.content:
            if block.type != "tool_use":
                continue

            ticker = block.input.get("ticker", "").upper()
            label = TOOL_LABELS.get(block.name, block.name)
            yield sse({"type": "tool_call", "label": label, "ticker": ticker})

            result_json = execute_tool(block.name, block.input)
            result_data = json.loads(result_json)
            success = "error" not in result_data

            yield sse({"type": "tool_done", "label": label, "ticker": ticker, "success": success})
            tool_results.append({
                "type": "tool_result",
                "tool_use_id": block.id,
                "content": result_json,
            })

        messages.append({"role": "user", "content": tool_results})

    yield sse({"type": "error", "message": "Max iterations reached."})


@app.route("/search")
def search():
    q = request.args.get("q", "").strip()
    if len(q) < 2:
        return jsonify({"results": []})
    try:
        hits = yf.Search(q, max_results=8, enable_fuzzy_query=True).quotes or []
        results = [
            {
                "ticker": r.get("symbol", ""),
                "name":   r.get("longname") or r.get("shortname", ""),
                "exchange": r.get("exchDisp", ""),
            }
            for r in hits
            if r.get("quoteType") in ("EQUITY", "ETF") and r.get("symbol")
        ][:6]
        return jsonify({"results": results})
    except Exception as e:
        return jsonify({"results": [], "error": str(e)})


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/analyze", methods=["POST"])
def analyze():
    query = (request.json or {}).get("query", "").strip()
    if not query:
        return {"error": "No query provided"}, 400

    def generate():
        yield from analyze_stream(query)

    return Response(
        stream_with_context(generate()),
        mimetype="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


@app.route("/screen", methods=["POST"])
def screen():
    include_midcap = (request.json or {}).get("midcap", False)

    def generate():
        for event in scan_universe(include_midcap=include_midcap):
            yield sse(event)

    return Response(
        stream_with_context(generate()),
        mimetype="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7777))
    print(f"\n  Investment Analyst running at http://localhost:{port}\n")
    app.run(host="0.0.0.0", port=port, debug=False, threaded=True)
