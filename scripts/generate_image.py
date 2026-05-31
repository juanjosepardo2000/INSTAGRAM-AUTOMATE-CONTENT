#!/usr/bin/env python3
"""
Image generation with automatic fallback: Higgsfield → Gemini.
Usage: python3 scripts/generate_image.py --prompt "..." --output slide_1.png
"""

import argparse
import base64
import json
import os
import sys
import urllib.request
import urllib.error

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
HIGGSFIELD_BASE = "https://api.higgsfield.ai"


def check_higgsfield_credits():
    """Returns credit count or 0 on any error."""
    try:
        req = urllib.request.Request(
            f"{HIGGSFIELD_BASE}/v1/user/balance",
            headers={"Authorization": f"Bearer {os.environ.get('HIGGSFIELD_API_KEY', '')}"},
        )
        with urllib.request.urlopen(req, timeout=8) as r:
            data = json.loads(r.read())
            return data.get("credits", 0)
    except Exception:
        return 0


def generate_with_gemini(prompt: str, output_path: str) -> bool:
    """Generate image via Gemini Imagen API. Returns True on success."""
    if not GEMINI_API_KEY:
        print("[gemini] No API key found in GEMINI_API_KEY env var.", file=sys.stderr)
        return False

    # Try image-capable Gemini models in priority order
    for model, endpoint, build_payload in [
        (
            "gemini-3-pro-image",
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image:generateContent?key={GEMINI_API_KEY}",
            lambda p: json.dumps({
                "contents": [{"parts": [{"text": p}]}],
                "generationConfig": {"responseModalities": ["IMAGE"]},
            }).encode(),
        ),
        (
            "gemini-3.1-flash-image",
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateContent?key={GEMINI_API_KEY}",
            lambda p: json.dumps({
                "contents": [{"parts": [{"text": p}]}],
                "generationConfig": {"responseModalities": ["IMAGE"]},
            }).encode(),
        ),
        (
            "gemini-2.5-flash-image",
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key={GEMINI_API_KEY}",
            lambda p: json.dumps({
                "contents": [{"parts": [{"text": p}]}],
                "generationConfig": {"responseModalities": ["IMAGE"]},
            }).encode(),
        ),
    ]:
        payload = build_payload(prompt)
        try:
            req = urllib.request.Request(
                endpoint,
                data=payload,
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=90) as r:
                result = json.loads(r.read())

            # Gemini Flash response format
            if "candidates" in result:
                for part in result["candidates"][0]["content"]["parts"]:
                    if "inlineData" in part:
                        img_b64 = part["inlineData"]["data"]
                        with open(output_path, "wb") as f:
                            f.write(base64.b64decode(img_b64))
                        print(f"[gemini:{model}] Saved to {output_path}")
                        return True

            # Imagen response format
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


def generate_with_higgsfield(prompt: str, output_path: str) -> bool:
    """
    Higgsfield generation is handled via the MCP connector in Claude sessions.
    This function signals that Higgsfield should be used by printing a JSON
    directive that the carousel skill reads.
    """
    credits = check_higgsfield_credits()
    if credits <= 0:
        print(f"[higgsfield] No credits available ({credits}).", file=sys.stderr)
        return False

    print(json.dumps({
        "provider": "higgsfield",
        "prompt": prompt,
        "output": output_path,
        "credits_available": credits,
    }))
    return True


def main():
    parser = argparse.ArgumentParser(description="Generate image with provider fallback.")
    parser.add_argument("--prompt", required=True, help="Image generation prompt")
    parser.add_argument("--output", required=True, help="Output file path (.png)")
    parser.add_argument("--force", choices=["higgsfield", "gemini"], help="Force a specific provider")
    args = parser.parse_args()

    if args.force == "gemini":
        success = generate_with_gemini(args.prompt, args.output)
    elif args.force == "higgsfield":
        success = generate_with_higgsfield(args.prompt, args.output)
    else:
        # Auto: try Higgsfield first, fall back to Gemini
        print("[auto] Checking Higgsfield credits...")
        credits = check_higgsfield_credits()
        if credits > 0:
            print(f"[auto] Higgsfield has {credits} credits — using Higgsfield via MCP.")
            success = generate_with_higgsfield(args.prompt, args.output)
        else:
            print(f"[auto] Higgsfield out of credits — falling back to Gemini.")
            success = generate_with_gemini(args.prompt, args.output)

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
