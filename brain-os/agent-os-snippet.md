# Add Brain OS to agent-os (step by step)

I can't edit `agent-os/` (it's locked because it holds your Apple `.p8` key), so
you do this paste yourself. Your editor isn't restricted — only my tools are.

## Step 1 — start Brain OS (own terminal, leave it running)
```bash
cd /Users/Kyle/Documents/Projects/dog-food-scanner
./brain-os/start.sh        # serves http://localhost:4318
```
agent-os stays on 4317; Brain OS runs alongside on 4318.

## Step 2 — open the file
In VS Code, open `agent-os/index.html`.

## Step 3 — paste this block right before the closing `</body>` tag
This is **self-contained** — it does NOT need to match your existing tab system.
It adds a floating "🧠 Brain" button that opens the vault in an overlay.

```html
<!-- 🧠 Brain OS embed — needs Brain OS running on :4318 -->
<button onclick="document.getElementById('brainos-overlay').style.display='flex'"
  style="position:fixed;bottom:20px;right:20px;z-index:9998;background:#7c5cff;color:#fff;border:0;border-radius:999px;padding:12px 18px;font:600 14px system-ui;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.3)">🧠 Brain</button>
<div id="brainos-overlay" style="display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.6);align-items:center;justify-content:center">
  <div style="width:92vw;height:90vh;background:#070912;border-radius:14px;overflow:hidden;position:relative">
    <button onclick="document.getElementById('brainos-overlay').style.display='none'"
      style="position:absolute;top:10px;right:14px;z-index:1;background:#222;color:#fff;border:0;border-radius:8px;padding:6px 12px;cursor:pointer">✕ Close</button>
    <iframe src="http://localhost:4318" style="width:100%;height:100%;border:0"></iframe>
  </div>
</div>
```

## Step 4 — save + reload
Save the file, refresh agent-os (http://localhost:4317). A purple **🧠 Brain**
button appears bottom-right. Click it → your vault (List + Galaxy views) opens
right inside agent-os. Click **✕ Close** to dismiss.

## Troubleshooting
- **Blank overlay / "refused to connect"** → Brain OS isn't running. Re-run Step 1.
- **Button doesn't appear** → you pasted after `</body>` or `</html>`; it must go
  *before* `</body>`.
- **Want it auto-start with agent-os** → add this near the top of `agent-os/start.sh`:
  ```bash
  ( cd "$(dirname "$0")/../brain-os" && node server.mjs ) &
  ```

## Optional — a real tab instead of an overlay
If you'd rather it be a tab alongside your others, tell me your tab markup (paste
a couple of your existing tab lines here) and I'll give you the exact `showTab`
version. The overlay above needs zero knowledge of your tab system, so start there.
