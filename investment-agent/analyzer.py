#!/usr/bin/env python3
"""
Investment Analysis Agent

Analyzes companies using value investing principles from:
  - Warren Buffett (moats, FCF, margin of safety)
  - Charlie Munger (mental models, inversion, quality businesses)
  - Jim Rickards (macro risk, systemic fragility, hard assets)
  - Philip Fisher (scuttlebutt, growth runway, management)
  - Peter Lynch (PEG ratio, invest in what you know)

Usage:
  python analyzer.py AAPL
  python analyzer.py "Apple"
  python analyzer.py  (interactive mode)
"""

import json
import os
import sys

import anthropic
import pandas as pd
import yfinance as yf

client = anthropic.Anthropic()

# ─────────────────────────────────────────────────────────────────────────────
# System Prompt — Investing Principles
# ─────────────────────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are an elite investment analyst drawing on the principles of the world's greatest investors.

═══ WARREN BUFFETT ═══
• Seek businesses with durable competitive moats: brand power, network effects, cost advantages, switching costs, efficient scale
• Stay within your Circle of Competence — only analyze what you can understand
• "Wonderful business at fair price" beats "fair business at wonderful price"
• Look for consistent, predictable earnings and free cash flow (owner earnings)
• Return on Equity >15% sustained over 10+ years signals a true moat
• Manageable or no debt; avoid businesses that need continuous capital
• Management with integrity — track record of honest capital allocation (buybacks at low prices, sensible acquisitions, no dilution)
• Require a Margin of Safety of 25–50% below intrinsic value
• Think in 10-year holding periods; ignore short-term noise

═══ CHARLIE MUNGER ═══
• Invert: "What would destroy this business?" — then check for those conditions
• Apply multiple mental models: economics, psychology, engineering, biology
• Beware commodity businesses with no pricing power
• Understand incentive structures — they drive behavior more than stated intentions
• "All I want to know is where I'm going to die, so I'll never go there"
• Look for businesses with inevitable, growing demand
• Avoid complexity; simple businesses that compound are better than clever ones

═══ JIM RICKARDS ═══
• Assess macro risks: dollar debasement, inflation, geopolitical instability
• Model systemic risk — highly leveraged balance sheets are fragile in crises
• Evaluate hard-asset exposure: companies with real assets, commodities, or gold hedges preserve value
• Analyze supply chain concentration risk (single-country, single-supplier)
• Currency risk for international revenue streams
• Central bank policy sensitivity — rate-sensitive businesses face existential risk in tight cycles
• Complex systems collapse non-linearly; underestimated tail risks matter

═══ PHILIP FISHER ═══
• Scuttlebutt: what do customers, suppliers, and competitors say about this business?
• Long runway for growth — large and growing total addressable market
• R&D investment and innovation pipeline
• Improving profit margins over time signal pricing power and operational leverage
• Strong, trustworthy management teams that execute

═══ PETER LYNCH ═══
• PEG ratio (P/E ÷ growth rate): ideally < 1.0 is attractive, > 2.0 is expensive
• Invest in what you know — understand the product and its customer
• Watch for "ten-bagger" potential: 10x opportunities in overlooked niches
• Avoid "diworsification" — companies straying outside their core competency
• Insiders buying stock is a strong positive signal

═══ ANALYSIS FRAMEWORK ═══
When analyzing a company, always:
1. Start with key metrics to get a baseline (get_key_metrics)
2. Pull income statement and cash flow data to assess trends (get_income_statement, get_cash_flow)
3. Check the balance sheet for financial health (get_balance_sheet)
4. Review price history for context (get_price_history)
5. Run a DCF estimate to get an intrinsic value anchor (calculate_dcf_estimate)
6. Synthesize into a clear verdict

Structure your final output as:
───────────────────────────────
COMPANY OVERVIEW
MOAT ASSESSMENT (score: weak/narrow/wide + rationale)
FINANCIAL HEALTH (key metrics, trends)
MANAGEMENT QUALITY (signals from data)
VALUATION (multiple methods, intrinsic value range, current price vs value)
MACRO & SYSTEMIC RISKS (Rickards lens)
KEY RISKS & RED FLAGS
KEY CATALYSTS & STRENGTHS
VERDICT: BUY / HOLD / AVOID
  • Target price range
  • Margin of safety at current price
  • Ideal entry point
───────────────────────────────
Be direct, specific, and data-driven. Cite the actual numbers you retrieved."""


# ─────────────────────────────────────────────────────────────────────────────
# Financial Data Functions
# ─────────────────────────────────────────────────────────────────────────────

def _df_to_dict(df: pd.DataFrame, max_years: int = 4) -> dict:
    """Convert a financial DataFrame to a clean nested dict."""
    result = {}
    cols = df.columns[:max_years]
    for col in cols:
        year_str = str(col.year) if hasattr(col, "year") else str(col)
        year_data = {}
        for idx in df.index:
            val = df.loc[idx, col]
            if pd.notna(val):
                year_data[str(idx)] = round(float(val), 0)
        result[year_str] = year_data
    return result


def get_income_statement(ticker: str) -> dict:
    """Fetch annual income statement (P&L) — revenue, margins, net income."""
    try:
        stock = yf.Ticker(ticker.upper())
        df = getattr(stock, "income_stmt", None)
        if df is None or df.empty:
            df = getattr(stock, "financials", None)
        if df is None or df.empty:
            return {"error": f"No income statement data for {ticker}"}
        return {"ticker": ticker, "income_statement": _df_to_dict(df)}
    except Exception as e:
        return {"error": str(e), "ticker": ticker}


def get_balance_sheet(ticker: str) -> dict:
    """Fetch annual balance sheet — assets, liabilities, equity, debt."""
    try:
        stock = yf.Ticker(ticker.upper())
        df = stock.balance_sheet
        if df is None or df.empty:
            return {"error": f"No balance sheet data for {ticker}"}
        return {"ticker": ticker, "balance_sheet": _df_to_dict(df)}
    except Exception as e:
        return {"error": str(e), "ticker": ticker}


def get_cash_flow(ticker: str) -> dict:
    """Fetch annual cash flow statement — operating, investing, financing, free cash flow."""
    try:
        stock = yf.Ticker(ticker.upper())
        df = getattr(stock, "cash_flow", None)
        if df is None or df.empty:
            df = getattr(stock, "cashflow", None)
        if df is None or df.empty:
            return {"error": f"No cash flow data for {ticker}"}
        return {"ticker": ticker, "cash_flow": _df_to_dict(df)}
    except Exception as e:
        return {"error": str(e), "ticker": ticker}


def get_key_metrics(ticker: str) -> dict:
    """Fetch key ratios and metrics: P/E, P/B, PEG, ROE, margins, debt/equity, FCF, etc."""
    try:
        stock = yf.Ticker(ticker.upper())
        info = stock.info

        raw = {
            "ticker": ticker.upper(),
            "company_name": info.get("longName"),
            "sector": info.get("sector"),
            "industry": info.get("industry"),
            "country": info.get("country"),
            "market_cap_usd": info.get("marketCap"),
            "enterprise_value_usd": info.get("enterpriseValue"),
            # Valuation
            "trailing_pe": info.get("trailingPE"),
            "forward_pe": info.get("forwardPE"),
            "peg_ratio": info.get("pegRatio"),
            "price_to_book": info.get("priceToBook"),
            "price_to_sales_ttm": info.get("priceToSalesTrailing12Months"),
            "ev_to_ebitda": info.get("enterpriseToEbitda"),
            "ev_to_revenue": info.get("enterpriseToRevenue"),
            # Profitability
            "gross_margin": info.get("grossMargins"),
            "operating_margin": info.get("operatingMargins"),
            "net_profit_margin": info.get("profitMargins"),
            "return_on_equity": info.get("returnOnEquity"),
            "return_on_assets": info.get("returnOnAssets"),
            "return_on_invested_capital": info.get("returnOnCapital"),
            # Growth
            "revenue_growth_yoy": info.get("revenueGrowth"),
            "earnings_growth_yoy": info.get("earningsGrowth"),
            "earnings_quarterly_growth": info.get("earningsQuarterlyGrowth"),
            # Financial health
            "total_debt": info.get("totalDebt"),
            "total_cash": info.get("totalCash"),
            "debt_to_equity": info.get("debtToEquity"),
            "current_ratio": info.get("currentRatio"),
            "quick_ratio": info.get("quickRatio"),
            "interest_coverage": info.get("interestCoverage"),
            # Cash flow
            "free_cash_flow_ttm": info.get("freeCashflow"),
            "operating_cash_flow_ttm": info.get("operatingCashflow"),
            # Per share
            "current_price": info.get("currentPrice") or info.get("regularMarketPrice"),
            "book_value_per_share": info.get("bookValue"),
            "eps_trailing_12m": info.get("trailingEps"),
            "eps_forward": info.get("forwardEps"),
            "shares_outstanding": info.get("sharesOutstanding"),
            # Dividends
            "dividend_yield": info.get("dividendYield"),
            "payout_ratio": info.get("payoutRatio"),
            "five_year_avg_dividend_yield": info.get("fiveYearAvgDividendYield"),
            # Risk
            "beta": info.get("beta"),
            "short_float_pct": info.get("shortPercentOfFloat"),
            # 52-week range
            "52wk_high": info.get("fiftyTwoWeekHigh"),
            "52wk_low": info.get("fiftyTwoWeekLow"),
            # Business summary (truncated)
            "business_description": (info.get("longBusinessSummary") or "")[:600],
        }

        # Remove None values for cleaner output
        return {k: v for k, v in raw.items() if v is not None}

    except Exception as e:
        return {"error": str(e), "ticker": ticker}


def get_price_history(ticker: str) -> dict:
    """Get price history and calculate 1yr / 3yr / 5yr returns."""
    try:
        stock = yf.Ticker(ticker.upper())
        hist = stock.history(period="5y")

        if hist.empty:
            return {"error": f"No price history for {ticker}"}

        closes = hist["Close"]
        current = float(closes.iloc[-1])

        def _ret(days):
            if len(closes) >= days:
                return round((current / float(closes.iloc[-days]) - 1) * 100, 2)
            return round((current / float(closes.iloc[0]) - 1) * 100, 2)

        return {
            "ticker": ticker.upper(),
            "current_price": round(current, 2),
            "1yr_return_pct": _ret(252),
            "3yr_return_pct": _ret(756),
            "5yr_return_pct": _ret(1260),
            "all_time_high_5yr": round(float(closes.max()), 2),
            "pct_off_5yr_high": round((current / float(closes.max()) - 1) * 100, 2),
            "52wk_high": round(float(closes.tail(252).max()), 2),
            "52wk_low": round(float(closes.tail(252).min()), 2),
        }

    except Exception as e:
        return {"error": str(e), "ticker": ticker}


def calculate_dcf_estimate(ticker: str) -> dict:
    """
    Two-stage DCF intrinsic value estimate using free cash flow.
    Stage 1: 10 years at estimated growth rate.
    Stage 2: Terminal value at 3% perpetual growth.
    Discount rate: 10% (Buffett's hurdle rate approximation).
    """
    try:
        stock = yf.Ticker(ticker.upper())
        info = stock.info

        fcf = info.get("freeCashflow")
        shares = info.get("sharesOutstanding")

        if not fcf or not shares or float(fcf) <= 0:
            return {
                "error": "Insufficient or negative FCF — DCF not meaningful for this company",
                "ticker": ticker,
                "note": "DCF requires positive free cash flow. Consider asset-based or earnings-based valuation instead.",
            }

        # Use analyst earnings growth if available, else revenue growth, else conservative 5%
        raw_growth = (
            info.get("earningsGrowth")
            or info.get("revenueGrowth")
            or 0.05
        )
        # Cap growth rate between -5% and 25% to stay conservative
        growth_rate = max(-0.05, min(float(raw_growth), 0.25))

        discount_rate = 0.10  # 10% hurdle rate
        terminal_growth = 0.03  # 3% terminal growth

        current_fcf = float(fcf)

        # Stage 1: 10 years
        stage1_pv = sum(
            current_fcf * (1 + growth_rate) ** yr / (1 + discount_rate) ** yr
            for yr in range(1, 11)
        )

        # Stage 2: Terminal value
        fcf_year10 = current_fcf * (1 + growth_rate) ** 10
        terminal_value = fcf_year10 * (1 + terminal_growth) / (discount_rate - terminal_growth)
        terminal_pv = terminal_value / (1 + discount_rate) ** 10

        total_equity_value = stage1_pv + terminal_pv
        intrinsic_per_share = total_equity_value / float(shares)

        current_price = info.get("currentPrice") or info.get("regularMarketPrice") or 0
        current_price = float(current_price)

        mos_pct = 0.0
        if current_price > 0 and intrinsic_per_share > 0:
            mos_pct = (intrinsic_per_share - current_price) / intrinsic_per_share * 100

        # Conservative estimate (20% haircut on growth)
        conservative_growth = growth_rate * 0.8
        stage1_conservative = sum(
            current_fcf * (1 + conservative_growth) ** yr / (1 + discount_rate) ** yr
            for yr in range(1, 11)
        )
        fcf10_cons = current_fcf * (1 + conservative_growth) ** 10
        tv_cons = fcf10_cons * (1 + terminal_growth) / (discount_rate - terminal_growth)
        conservative_iv = (stage1_conservative + tv_cons / (1 + discount_rate) ** 10) / float(shares)

        return {
            "ticker": ticker.upper(),
            "base_case_intrinsic_value_per_share": round(intrinsic_per_share, 2),
            "conservative_intrinsic_value_per_share": round(conservative_iv, 2),
            "current_price": round(current_price, 2),
            "margin_of_safety_pct": round(mos_pct, 2),
            "verdict": (
                "UNDERVALUED (strong MoS)" if mos_pct >= 30
                else "SLIGHTLY UNDERVALUED" if mos_pct >= 10
                else "FAIRLY VALUED" if mos_pct >= -10
                else "OVERVALUED"
            ),
            "assumptions": {
                "growth_rate_stage1_pct": round(growth_rate * 100, 2),
                "conservative_growth_rate_pct": round(conservative_growth * 100, 2),
                "discount_rate_pct": 10.0,
                "terminal_growth_rate_pct": 3.0,
                "ttm_free_cash_flow": round(current_fcf, 0),
                "shares_outstanding": int(shares),
            },
            "important_note": (
                "This is a simplified DCF. Real analysis requires adjusting for capex quality, "
                "normalized earnings, and competitive position durability. Use as one data point."
            ),
        }

    except Exception as e:
        return {"error": str(e), "ticker": ticker}


# ─────────────────────────────────────────────────────────────────────────────
# Tool Definitions
# ─────────────────────────────────────────────────────────────────────────────

TOOLS = [
    {
        "name": "get_key_metrics",
        "description": (
            "Fetch key financial ratios and metrics for a company: P/E, P/B, PEG ratio, "
            "ROE, ROA, gross/operating/net margins, revenue & earnings growth, debt-to-equity, "
            "current ratio, free cash flow, dividend yield, beta, 52-week range, and a brief "
            "business description. Best first tool to call for any company."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "ticker": {"type": "string", "description": "Stock ticker symbol (e.g., AAPL, MSFT, BRK-B, LVMUY)"}
            },
            "required": ["ticker"],
        },
    },
    {
        "name": "get_income_statement",
        "description": (
            "Fetch annual income statement (P&L) for the last 4 years: total revenue, gross profit, "
            "operating income, EBITDA, net income, EPS. Use to identify revenue trends, margin "
            "expansion/contraction, and earnings quality."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "ticker": {"type": "string", "description": "Stock ticker symbol"}
            },
            "required": ["ticker"],
        },
    },
    {
        "name": "get_balance_sheet",
        "description": (
            "Fetch annual balance sheet for the last 4 years: total assets, total liabilities, "
            "shareholders equity, total debt, cash & equivalents, inventory, goodwill. "
            "Use to assess financial fortress strength, debt levels, and book value."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "ticker": {"type": "string", "description": "Stock ticker symbol"}
            },
            "required": ["ticker"],
        },
    },
    {
        "name": "get_cash_flow",
        "description": (
            "Fetch annual cash flow statement for the last 4 years: operating cash flow, "
            "capital expenditures, free cash flow, investing activities, financing activities. "
            "Critical for evaluating Buffett's 'owner earnings' and FCF yield."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "ticker": {"type": "string", "description": "Stock ticker symbol"}
            },
            "required": ["ticker"],
        },
    },
    {
        "name": "get_price_history",
        "description": (
            "Get historical price data and calculate 1-year, 3-year, and 5-year total returns. "
            "Shows current price, % off the 5-year high, and 52-week range. "
            "Use to contextualize current valuation vs historical price."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "ticker": {"type": "string", "description": "Stock ticker symbol"}
            },
            "required": ["ticker"],
        },
    },
    {
        "name": "calculate_dcf_estimate",
        "description": (
            "Calculate a two-stage discounted cash flow (DCF) intrinsic value estimate. "
            "Uses trailing free cash flow, estimated growth rate, 10% discount rate, "
            "and 3% terminal growth. Returns base-case and conservative intrinsic value "
            "per share, margin of safety vs current price, and all assumptions. "
            "Only works for profitable companies with positive FCF."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "ticker": {"type": "string", "description": "Stock ticker symbol"}
            },
            "required": ["ticker"],
        },
    },
]

TOOL_MAP = {
    "get_key_metrics": get_key_metrics,
    "get_income_statement": get_income_statement,
    "get_balance_sheet": get_balance_sheet,
    "get_cash_flow": get_cash_flow,
    "get_price_history": get_price_history,
    "calculate_dcf_estimate": calculate_dcf_estimate,
}


def execute_tool(name: str, tool_input: dict) -> str:
    fn = TOOL_MAP.get(name)
    if not fn:
        return json.dumps({"error": f"Unknown tool: {name}"})
    ticker = str(tool_input.get("ticker", "")).upper().strip()
    result = fn(ticker)
    return json.dumps(result, default=str)


# ─────────────────────────────────────────────────────────────────────────────
# Agent Loop
# ─────────────────────────────────────────────────────────────────────────────

def analyze_company(query: str) -> str:
    """Run the investment analysis agent on a company query."""
    print(f"\n{'━' * 62}")
    print(f"  Investment Analysis Agent")
    print(f"  Analyzing: {query}")
    print(f"{'━' * 62}\n")

    messages = [
        {
            "role": "user",
            "content": (
                f"Please perform a comprehensive investment analysis of: {query}\n\n"
                "Apply the value investing frameworks from the system prompt. "
                "Use the available tools to gather real financial data, then deliver a "
                "structured analysis with a clear Buy / Hold / Avoid verdict including "
                "target price range and margin of safety."
            ),
        }
    ]

    max_iterations = 15
    iteration = 0

    while iteration < max_iterations:
        iteration += 1
        print(f"[turn {iteration}] Calling Claude Opus 4.6...", end=" ", flush=True)

        response = client.messages.create(
            model="claude-opus-4-6",
            max_tokens=8192,
            thinking={"type": "adaptive"},
            system=SYSTEM_PROMPT,
            tools=TOOLS,
            messages=messages,
        )

        print(f"stop_reason={response.stop_reason}")

        if response.stop_reason == "end_turn":
            for block in response.content:
                if block.type == "text":
                    return block.text
            return "(no text output)"

        if response.stop_reason != "tool_use":
            return f"Unexpected stop reason: {response.stop_reason}"

        # Process tool calls
        messages.append({"role": "assistant", "content": response.content})

        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                print(f"  → {block.name}({json.dumps(block.input)})")
                result_json = execute_tool(block.name, block.input)
                tool_results.append(
                    {
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result_json,
                    }
                )

        messages.append({"role": "user", "content": tool_results})

    return "Max iterations reached. Partial analysis may be incomplete."


# ─────────────────────────────────────────────────────────────────────────────
# Entry Point
# ─────────────────────────────────────────────────────────────────────────────

def main():
    if len(sys.argv) > 1:
        query = " ".join(sys.argv[1:])
    else:
        print("Investment Analysis Agent")
        print("Principles of Buffett · Munger · Rickards · Fisher · Lynch\n")
        query = input("Enter company name or ticker to analyze: ").strip()
        if not query:
            print("No input. Exiting.")
            return

    analysis = analyze_company(query)

    print(f"\n{'━' * 62}")
    print("  ANALYSIS")
    print(f"{'━' * 62}\n")
    print(analysis)
    print()


if __name__ == "__main__":
    main()
