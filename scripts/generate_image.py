#!/usr/bin/env python3
"""
Image generation with multi-provider support.
Providers: higgsfield (via MCP), gemini, pollinations (free, no key needed)

Usage:
  python3 scripts/generate_image.py --prompt "..." --output slide_1.png
  python3 scripts/generate_image.py --prompt "..." --output slide_1.png --provider pollinations
  python3 scripts/generate_image.py --prompt "..." --output slide_1.png --provider gemini
  python3 scripts/generate_image.py --prompt "..." --output slide_1.png --provider auto
"""

import argparse
import base64
import json
import os
import sys
import time
import urllib.request
import urllib.error
import urllib.parse

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
HIGGSFIELD_BASE = "https://api.higgsfield.ai"


# ─── Pollinations ────────────────────────────────────────────────────────────

def generate_with_pollinations(prompt: str, output_path: str) -> bool:
    """Free, no key required. Uses FLUX model at 9:16 ratio."""
    encoded = urllib.parse.quote(prompt)
    url = (
        f"https://image.pollinations.ai/prompt/{encoded}"
        f"?width=768&height=1344&model=flux&nologo=true&seed={int(time.time())}"
    )
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "carousel-skill/1.0"})
        with urllib.request.urlopen(req, timeout=120) as r:
            data = r.read()
        if len(data) < 1000:
            print("[pollinations] Response too small — likely an error.", file=sys.stderr)
            return False
        with open(output_path, "wb") as f:
            f.write(data)
        print(f"[pollinations] Saved to {output_path}")
        return True
    except Exception as e:
        print(f"[pollinations] Error: {e}", file=sys.stderr)
        return False


# ─── Gemini ──────────────────────────────────────────────────────────────────

def generate_with_gemini(prompt: str, output_path: str) -> bool:
    """Requires GEMINI_API_KEY with billing active."""
    if not GEMINI_API_KEY:
        print("[gemini] No API key in GEMINI_API_KEY env var.", file=sys.stderr)
        return False

    models = [
        "gemini-3-pro-image",
        "gemini-3.1-flash-image",
        "gemini-2.5-flash-image",
    ]
    for model in models:
        endpoint = (
            f"https://generativelanguage.googleapis.com/v1beta/models/"
            f"{model}:generateContent?key={GEMINI_API_KEY}"
        )
        payload = json.dumps({
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"responseModalities": ["IMAGE"]},
        }).encode()
        try:
            req = urllib.request.Request(
                endpoint,
                data=payload,
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=90) as r:
                result = json.loads(r.read())

            if "candidates" in result:
                for part in result["candidates"][0]["content"]["parts"]:
                    if "inlineData" in part:
                        img_b64 = part["inlineData"]["data"]
                        with open(output_path, "wb") as f:
                            f.write(base64.b64decode(img_b64))
                        print(f"[gemini:{model}] Saved to {output_path}")
                        return True

            if "predictions" in result:
                img_b64 = result["predictions"][0].get("bytesBase64Encoded", "")
                if img_b64:
                    with open(output_path, "wb") as f:
                        f.write(base64.b64decode(img_b64))
                    print(f"[gemini:{model}] Saved to {output_path}")
                    return True

            print(f"[gemini:{model}] No image in response.", file=sys.stderr)

        except urllib.error.HTTPError as e:
            body = e.read().decode(errors="replace")
            print(f"[gemini:{model}] HTTP {e.code}: {body[:200]}", file=sys.stderr)
        except Exception as e:
            print(f"[gemini:{model}] Error: {e}", file=sys.stderr)

    print("[gemini] All models failed.", file=sys.stderr)
    return False


# ─── Higgsfield ──────────────────────────────────────────────────────────────

def check_higgsfield_credits() -> int:
    try:
        req = urllib.request.Request(
            f"{HIGGSFIELD_BASE}/v1/user/balance",
            headers={"Authorization": f"Bearer {os.environ.get('HIGGSFIELD_API_KEY', '')}"},
        )
        with urllib.request.urlopen(req, timeout=8) as r:
            return json.loads(r.read()).get("credits", 0)
    except Exception:
        return 0


def generate_with_higgsfield(prompt: str, output_path: str) -> bool:
    """Signals the carousel skill to use the Higgsfield MCP connector."""
    credits = check_higgsfield_credits()
    if credits <= 0:
        print(f"[higgsfield] No credits ({credits}).", file=sys.stderr)
        return False
    print(json.dumps({
        "provider": "higgsfield",
        "prompt": prompt,
        "output": output_path,
        "credits_available": credits,
    }))
    return True


# ─── Main ─────────────────────────────────────────────────────────────────────

PROVIDERS = {
    "pollinations": generate_with_pollinations,
    "gemini": generate_with_gemini,
    "higgsfield": generate_with_higgsfield,
}


def main():
    parser = argparse.ArgumentParser(description="Generate image — multi-provider.")
    parser.add_argument("--prompt", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument(
        "--provider",
        choices=["higgsfield", "gemini", "pollinations", "auto"],
        default="auto",
        help="Provider to use. 'auto' tries Higgsfield → Gemini → Pollinations.",
    )
    args = parser.parse_args()

    os.makedirs(os.path.dirname(args.output) if os.path.dirname(args.output) else ".", exist_ok=True)

    if args.provider != "auto":
        success = PROVIDERS[args.provider](args.prompt, args.output)
    else:
        # Auto fallback chain
        credits = check_higgsfield_credits()
        if credits > 0:
            print(f"[auto] Higgsfield has {credits} credits.")
            success = generate_with_higgsfield(args.prompt, args.output)
        elif GEMINI_API_KEY:
            print("[auto] Higgsfield empty — trying Gemini.")
            success = generate_with_gemini(args.prompt, args.output)
            if not success:
                print("[auto] Gemini failed — falling back to Pollinations (free).")
                success = generate_with_pollinations(args.prompt, args.output)
        else:
            print("[auto] No paid provider available — using Pollinations (free).")
            success = generate_with_pollinations(args.prompt, args.output)

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
