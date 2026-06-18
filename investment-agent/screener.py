"""
Stock Screener — scans S&P 500 (and optionally S&P 400 mid-caps) and scores
each company on value investing criteria derived from Buffett / Munger.
"""

import concurrent.futures
import time
from typing import Optional

import pandas as pd
import yfinance as yf


# ── Stock universe ─────────────────────────────────────────────────────────

def get_sp500_tickers() -> list[str]:
    df = pd.read_html(
        "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies",
        attrs={"id": "constituents"},
    )[0]
    return df["Symbol"].str.replace(".", "-", regex=False).tolist()


def get_sp400_tickers() -> list[str]:
    try:
        df = pd.read_html(
            "https://en.wikipedia.org/wiki/List_of_S%26P_400_companies",
            attrs={"id": "constituents"},
        )[0]
        col = next(c for c in df.columns if "ticker" in c.lower() or "symbol" in c.lower())
        return df[col].str.replace(".", "-", regex=False).tolist()
    except Exception:
        return []


# ── Scoring ────────────────────────────────────────────────────────────────

MAX_SCORE = 100

def score_stock(ticker: str) -> Optional[dict]:
    """
    Pull key metrics for one ticker and return a scored dict, or None if
    the data is insufficient / the stock doesn't pass minimum quality filters.
    """
    try:
        info = yf.Ticker(ticker).info
        if not info:
            return None

        price = info.get("currentPrice") or info.get("regularMarketPrice")
        if not price:
            return None

        score = 0
        flags = []   # positive signals
        warnings = []  # red flags

        # ── 1. Return on Equity (max 20 pts) ──────────────────────────────
        roe = info.get("returnOnEquity")
        roe_pct = round(roe * 100, 1) if roe else None
        if roe:
            if roe >= 0.25:   score += 20; flags.append("ROE ≥ 25%")
            elif roe >= 0.15: score += 13; flags.append("ROE ≥ 15%")
            elif roe >= 0.10: score += 6
            else: warnings.append("Low ROE")

        # ── 2. Debt / Equity (max 20 pts) ─────────────────────────────────
        de_raw = info.get("debtToEquity")  # yfinance gives this as e.g. 45.2 = 45.2%
        de = round(de_raw / 100, 2) if de_raw is not None else None
        if de is not None:
            if de < 0.3:   score += 20; flags.append("Low debt")
            elif de < 0.6: score += 13
            elif de < 1.0: score += 6
            else: warnings.append("High debt")

        # ── 3. Net profit margin (max 15 pts) ─────────────────────────────
        margin = info.get("profitMargins")
        margin_pct = round(margin * 100, 1) if margin else None
        if margin:
            if margin >= 0.20:   score += 15; flags.append("Fat margins")
            elif margin >= 0.10: score += 10
            elif margin >= 0.05: score += 4
            else: warnings.append("Thin margins")

        # ── 4. P/E ratio (max 15 pts) ─────────────────────────────────────
        pe = info.get("trailingPE")
        pe = round(pe, 1) if pe and pe > 0 else None
        if pe:
            if 8 <= pe <= 15:   score += 15; flags.append("Cheap P/E")
            elif 15 < pe <= 22: score += 10
            elif 22 < pe <= 30: score += 5
            else: warnings.append("Expensive P/E")

        # ── 5. PEG ratio (max 15 pts) ─────────────────────────────────────
        peg = info.get("pegRatio")
        peg = round(peg, 2) if peg and peg > 0 else None
        if peg:
            if peg < 1.0:   score += 15; flags.append("PEG < 1")
            elif peg < 1.5: score += 10
            elif peg < 2.0: score += 5
            else: warnings.append("High PEG")

        # ── 6. Free cash flow (max 10 pts) ────────────────────────────────
        fcf = info.get("freeCashflow")
        if fcf and fcf > 0:
            score += 10; flags.append("FCF positive")
        elif fcf and fcf < 0:
            warnings.append("Negative FCF")

        # ── 7. Revenue growth (max 5 pts) ─────────────────────────────────
        rev_growth = info.get("revenueGrowth")
        rev_growth_pct = round(rev_growth * 100, 1) if rev_growth else None
        if rev_growth:
            if 0.05 <= rev_growth <= 0.30: score += 5
            elif rev_growth > 0.30: score += 3  # very high growth is less predictable

        # ── Minimum bar: skip junk ─────────────────────────────────────────
        if score < 25:
            return None

        # ── Moat signal: high ROE + low debt + fat margin ─────────────────
        moat_signal = "Wide" if (
            roe and roe >= 0.20 and de is not None and de < 0.5 and margin and margin >= 0.15
        ) else "Narrow" if (
            roe and roe >= 0.15 and margin and margin >= 0.10
        ) else "Unclear"

        return {
            "ticker":        ticker,
            "name":          info.get("shortName") or info.get("longName", ticker),
            "sector":        info.get("sector", "N/A"),
            "price":         round(float(price), 2),
            "market_cap":    info.get("marketCap"),
            "score":         score,
            "moat":          moat_signal,
            "roe_pct":       roe_pct,
            "de_ratio":      de,
            "net_margin_pct": margin_pct,
            "pe":            pe,
            "peg":           peg,
            "fcf_positive":  bool(fcf and fcf > 0),
            "rev_growth_pct": rev_growth_pct,
            "flags":         flags,
            "warnings":      warnings,
        }

    except Exception:
        return None


# ── Main scanner (generator, yields events) ───────────────────────────────

def scan_universe(include_midcap: bool = False, max_workers: int = 25):
    """
    Generator that yields dict events:
      {"type": "meta",     "total": N}
      {"type": "progress", "scanned": N, "total": N, "found": N}
      {"type": "found",    ...stock dict...}
      {"type": "done",     "scanned": N, "found": N, "top": [...sorted list...]}
    """
    tickers = get_sp500_tickers()
    if include_midcap:
        mid = get_sp400_tickers()
        tickers = list(dict.fromkeys(tickers + mid))  # deduplicate

    total = len(tickers)
    yield {"type": "meta", "total": total}

    results = []
    scanned = 0

    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as pool:
        futures = {pool.submit(score_stock, t): t for t in tickers}

        for future in concurrent.futures.as_completed(futures):
            scanned += 1
            result = future.result()

            if result:
                results.append(result)
                yield {"type": "found", **result}

            if scanned % 10 == 0 or scanned == total:
                yield {"type": "progress", "scanned": scanned, "total": total, "found": len(results)}

    # Sort by score descending
    top = sorted(results, key=lambda x: x["score"], reverse=True)[:50]
    yield {"type": "done", "scanned": scanned, "found": len(results), "top": top}
