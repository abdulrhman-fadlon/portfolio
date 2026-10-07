#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PORTFOLIO ADMIN
===============
Edit your whole portfolio by answering simple questions — no HTML needed.
Everything is saved into data.js, and "Publish" pushes it to your GitHub
Pages site (the free hosting link updates automatically).

Run:            python admin.py
Validate only:  python admin.py --check
"""

import getpass
import json
import os
import subprocess
import sys
import time

BASE = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE, "data.js")
CONFIG_FILE = os.path.join(BASE, "admin_config.json")
GITIGNORE = os.path.join(BASE, ".gitignore")
DATA_PREFIX = "window.SITE_DATA = "

PRIVATE_FILES = ["admin_config.json", "profile-original.png"]


# ============================================================
# SAFE INPUT HELPERS — never crash, always re-ask
# ============================================================

def ask(prompt, default="", required=False):
    """Ask for one line. Empty input returns the default (if any).
    If the field is required and left empty, ask again."""
    while True:
        suffix = f" [{default}]" if default not in (None, "") else ""
        try:
            val = input(f"{prompt}{suffix}: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nCancelled.")
            return default if default else ""
        if not val:
            if default not in (None, ""):
                return default
            if required:
                print("   x This field is required — please write something.")
                continue
            return ""
        return val


def ask_int(prompt, default, lo=0, hi=100):
    """Ask for a number inside a range. Re-asks on any bad input."""
    while True:
        raw = ask(f"{prompt} ({lo}-{hi})", str(default))
        try:
            val = int(raw)
            if lo <= val <= hi:
                return val
            print(f"   x Please enter a number between {lo} and {hi}.")
        except ValueError:
            print("   x That is not a number — try again.")


def ask_yn(prompt, default=True):
    """Ask a yes/no question."""
    hint = "Y/n" if default else "y/N"
    while True:
        val = ask(f"{prompt} ({hint})", "").lower()
        if not val:
            return default
        if val in ("y", "yes"):
            return True
        if val in ("n", "no"):
            return False
        print("   x Please answer y or n.")


def ask_lines(prompt, existing=None):
    """Ask for a list of short lines. Empty line = done.
    Press Enter on the first prompt to keep the existing list."""
    existing = existing or []
    print(f"   {prompt} (one per line, empty line to finish)")
    if existing:
        for i, line in enumerate(existing, 1):
            print(f"      {i}. {line}")
        print("   (Press Enter right away to keep the current list)")
    items = []
    idx = 0
    while True:
        default = existing[idx] if idx < len(existing) else ""
        val = ask(f"      line {idx + 1}", default)
        if not val:
            if idx == 0 and existing:
                return existing  # kept everything
            if not items:
                return existing
            return items
        items.append(val)
        idx += 1


def ask_comma(prompt, existing=None):
    """Ask for a comma-separated list (e.g. tech tags)."""
    default = ", ".join(existing) if existing else ""
    raw = ask(f"{prompt} (comma-separated)", default)
    if not raw:
        return existing or []
    return [part.strip() for part in raw.split(",") if part.strip()]


def pause():
    input("\n(Enter to go back to the menu)")


def header(title):
    print("\n" + "=" * 55)
    print(f"  {title}")
    print("=" * 55)


# ============================================================
# DATA LOAD / SAVE (data.js)
# ============================================================

def load_data():
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            text = f.read()
    except FileNotFoundError:
        print("x data.js not found next to admin.py — are you in the right folder?")
        sys.exit(1)
    start = text.find(DATA_PREFIX)
    if start == -1:
        print("x data.js is broken — 'const SITE_DATA =' was not found.")
        sys.exit(1)
    body = text[start + len(DATA_PREFIX):].strip()
    if body.endswith(";"):
        body = body[:-1]
    try:
        return json.loads(body)
    except json.JSONDecodeError as e:
        print(f"x data.js is not valid: {e}")
        sys.exit(1)


def save_data(data):
    body = json.dumps(data, ensure_ascii=False, indent=2)
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        f.write(DATA_PREFIX + body + ";\n")


# ============================================================
# EDITORS — one function per part of the site
# ============================================================

def show_current(label, value):
    """Print a current value so you see what is stored before editing."""
    text = str(value if value not in (None, "") else "(empty)")
    if len(text) > 95:
        text = text[:95] + "…"
    print(f"   now → {label}: {text}")


def edit_profile(data):
    header("PROFILE — name, role, contact")
    p = data["profile"]
    print(f"  current: {p['name']} — {p['roleTitle']}")
    show_current("email", p["email"])
    show_current("linkedin", p["linkedin"])
    show_current("github", p["github"])
    print()
    p["name"] = ask("Your full name", p["name"], required=True)
    p["roleTitle"] = ask("Your title (shown big in the header)", p["roleTitle"], required=True)
    p["roleTags"] = ask("Tags after the title", p["roleTags"])
    p["lead"] = ask("Hero bio (1-2 sentences)", p["lead"], required=True)
    p["photo"] = ask("Profile photo file name", p["photo"] or "profile.png")
    p["email"] = ask("Email", p["email"], required=True)
    while "@" not in p["email"]:
        print("   x That does not look like an email (needs @).")
        p["email"] = ask("Email", p["email"], required=True)
    p["linkedin"] = ask("LinkedIn URL", p["linkedin"])
    p["github"] = ask("GitHub URL", p["github"])
    p["logStatus"] = ask("Terminal log line 1 (status)", p["logStatus"])
    p["logFocus"] = ask("Terminal log line 2 (focus)", p["logFocus"])
    save_data(data)
    print("+ Profile saved.")


def edit_about(data):
    header("ABOUT — the 4 facts, the story, the numbers note")
    a = data["about"]
    for i, fact in enumerate(a["facts"], 1):
        print(f"  current {i}: [{fact['label']}] {fact['text'][:70]}")
    print(f"  current story: {a['story'][:70]}")
    print()
    for i, fact in enumerate(a["facts"], 1):
        print(f"  Fact {i}:")
        fact["label"] = ask(f"  Fact {i} label", fact["label"], required=True)
        fact["text"] = ask(f"  Fact {i} text", fact["text"], required=True)
    a["story"] = ask("\nOne-line story", a["story"], required=True)
    a["numbersNote"] = ask("Numbers note", a["numbersNote"])
    save_data(data)
    print("+ About saved.")


def edit_usp(data):
    header("WHAT MAKES ME DIFFERENT — cards + proof")
    u = data["usp"]
    for c in u["cards"]:
        print(f"  current {c['num']}: {c['title']} — {c['text'][:60]}")
    for i, line in enumerate(u["proof"], 1):
        print(f"  current proof {i}: {line[:60]}")
    print()
    u["heading"] = ask("Section heading", u["heading"], required=True)
    u["sub"] = ask("Section subtitle", u["sub"])
    for c in u["cards"]:
        print(f"\n  Card {c['num']}:")
        c["title"] = ask("  Title", c["title"], required=True)
        c["text"] = ask("  Text", c["text"], required=True)
    u["proofTitle"] = ask("\nProof box title", u["proofTitle"])
    u["proof"] = ask_lines("Proof lines", u["proof"])
    save_data(data)
    print("+ What-makes-me-different saved.")


def edit_education(data):
    header("EDUCATION")
    e = data["education"]
    e["heading"] = ask("Section heading", e["heading"], required=True)
    e["sub"] = ask("Section subtitle", e["sub"])
    print("\n  Entries:")
    for i, it in enumerate(e["items"], 1):
        print(f"  {i}. {it['title']} — {it['meta']}")
        show_current("text", it["text"])
    print("  a) Add an entry   d) Delete an entry   Enter = keep")
    choice = ask("  Choice", "").lower()
    if choice == "a":
        item = {
            "title": ask("  Degree / school", required=True),
            "meta": ask("  Years · place"),
            "text": ask("  One line about it"),
        }
        e["items"].append(item)
    elif choice == "d":
        idx = ask_int("  Delete which number", 1, 1, len(e["items"]))
        removed = e["items"].pop(idx - 1)
        print(f"  - Removed: {removed['title']}")
    save_data(data)
    print("+ Education saved.")


def edit_skills(data):
    header("SKILLS — change the % levels (0-100)")
    s = data["skills"]
    s["heading"] = ask("Section heading", s["heading"], required=True)
    s["sub"] = ask("Section subtitle", s["sub"])
    for i, card in enumerate(s["cards"], 1):
        pills = ", ".join(f"{p['name']} {p['level']}%" for p in card["pills"])
        print(f"  {i}. {card['title']} → {pills}")
    idx = ask_int("  Edit which card", 1, 1, len(s["cards"]))
    card = s["cards"][idx - 1]
    card["title"] = ask("  Card title", card["title"], required=True)
    card["desc"] = ask("  Card description", card["desc"])
    for pill in card["pills"]:
        pill["level"] = ask_int(f"  {pill['name']}", pill["level"])
    save_data(data)
    print("+ Skills saved.")


def show_projects(data):
    for i, p in enumerate(data["projects"], 1):
        print(f"  {i}. [{p['code']}] {p['title']}  (image: {p.get('image') or 'none'})")


def ask_project_fields(p):
    p["title"] = ask("Project title", p.get("title", ""), required=True)
    p["badge"] = ask("Card label (e.g. PYTHON · CLI APP)", p.get("badge", ""))
    p["image"] = ask("Image file (e.g. prj05.png, empty = no image)", p.get("image", ""))
    p["desc"] = ask("Card description (2-3 sentences)", p.get("desc", ""), required=True)
    p["highlight"] = ask("Highlight strip (starts with //)", p.get("highlight", ""))
    p["overview"] = ask("Overview (opens in READ MORE)", p.get("overview", ""), required=True)
    p["hardPart"] = ask("The hard part", p.get("hardPart", ""), required=True)
    p["learned"] = ask("What you learned", p.get("learned", ""), required=True)
    p["steps"] = ask_lines("How it works steps", p.get("steps", []))
    p["tech"] = ask_comma("Technologies", p.get("tech", []))
    p["demo"] = ask("Demo URL (empty = no demo button)", p.get("demo") or "")
    if not p["demo"]:
        p["demo"] = None
    if not p.get("id"):
        p["id"] = f"proj-{int(time.time()) % 100000}"


def add_project(data):
    header("ADD A PROJECT")
    p = {"id": None}
    ask_project_fields(p)
    data["projects"].append(p)
    save_data(data)
    print(f"+ Project added: {p['title']}")
    print("  Remember: put the image file next to index.html (if you used one).")


def edit_project(data):
    header("EDIT A PROJECT")
    show_projects(data)
    if not data["projects"]:
        return
    idx = ask_int("  Edit which one", 1, 1, len(data["projects"]))
    p = data["projects"][idx - 1]
    while True:
        print(f"\n  Editing [{p['code']}] {p['title']}")
        print("  1) title   2) label   3) image   4) card description   5) highlight")
        print("  6) overview   7) hard part   8) learned   9) steps   10) technologies")
        print("  11) demo URL   0) done")
        choice = ask("  Field", "").strip()
        if choice == "0" or choice == "":
            break
        if choice == "1":
            p["title"] = ask("  New title", p["title"], required=True)
        elif choice == "2":
            p["badge"] = ask("  New label", p["badge"])
        elif choice == "3":
            p["image"] = ask("  New image file (empty = none)", p.get("image", ""))
        elif choice == "4":
            p["desc"] = ask("  New description", p["desc"], required=True)
        elif choice == "5":
            p["highlight"] = ask("  New highlight", p.get("highlight", ""))
        elif choice == "6":
            p["overview"] = ask("  New overview", p["overview"], required=True)
        elif choice == "7":
            p["hardPart"] = ask("  New hard part", p["hardPart"], required=True)
        elif choice == "8":
            p["learned"] = ask("  New learned", p["learned"], required=True)
        elif choice == "9":
            p["steps"] = ask_lines("  Steps", p.get("steps", []))
        elif choice == "10":
            p["tech"] = ask_comma("  Technologies", p.get("tech", []))
        elif choice == "11":
            p["demo"] = ask("  Demo URL (empty = no demo button)", p.get("demo") or "") or None
        else:
            print("  x Pick a number from the list.")
    save_data(data)
    print("+ Project saved.")


def delete_project(data):
    header("DELETE A PROJECT")
    show_projects(data)
    if not data["projects"]:
        return
    idx = ask_int("  Delete which one", 1, 1, len(data["projects"]))
    p = data["projects"][idx - 1]
    if ask_yn(f"  Really delete '{p['title']}'?", False):
        data["projects"].pop(idx - 1)
        save_data(data)
        print("- Project deleted.")
    else:
        print("  Cancelled — nothing deleted.")


def edit_experience(data):
    header("WORK EXPERIENCE")
    e = data["experience"]
    e["heading"] = ask("Section heading", e["heading"], required=True)
    e["sub"] = ask("Section subtitle", e["sub"])
    for i, it in enumerate(e["items"], 1):
        print(f"\n  Entry {i}: {it['title']}")
        it["title"] = ask("  Title", it["title"], required=True)
        it["meta"] = ask("  Dates · place", it["meta"])
        it["text"] = ask("  Description", it["text"])
    print("\n  a) Add an entry   d) Delete an entry   Enter = keep")
    choice = ask("  Choice", "").lower()
    if choice == "a":
        e["items"].append({
            "title": ask("  Role — Company", required=True),
            "meta": ask("  Dates"),
            "text": ask("  What you did"),
        })
    elif choice == "d":
        idx = ask_int("  Delete which number", 1, 1, len(e["items"]))
        e["items"].pop(idx - 1)
        print("  - Removed.")
    e["badge"] = ask("\nBadge under the section (empty = hide badge)", e["badge"])
    save_data(data)
    print("+ Work experience saved.")


def edit_services(data):
    header("SERVICES — what you can do for people")
    s = data["services"]
    s["heading"] = ask("Section heading", s["heading"], required=True)
    s["sub"] = ask("Section subtitle", s["sub"])
    for c in s["cards"]:
        print(f"  current {c['num']}: {c['title']} — {c['text'][:60]}")
    print()
    for c in s["cards"]:
        print(f"\n  {c['num']}:")
        c["title"] = ask("  Title", c["title"], required=True)
        c["text"] = ask("  Text", c["text"], required=True)
    save_data(data)
    print("+ Services saved.")


def edit_certificates(data):
    header("CERTIFICATES")
    while True:
        for i, c in enumerate(data["certificates"], 1):
            print(f"  {i}. {c['title']} — {c['meta']}")
        print("  a) Add   d) Delete   e) Edit one   Enter = back")
        choice = ask("  Choice", "").lower()
        if choice == "":
            return
        if choice == "a":
            item = {
                "title": ask("  Certificate name", required=True),
                "meta": ask("  Issuer · Year"),
                "image": ask("  Image file (empty = placeholder slot)"),
            }
            data["certificates"].append(item)
            save_data(data)
            print("+ Added.")
        elif choice == "d":
            idx = ask_int("  Delete which number", 1, 1, len(data["certificates"]))
            data["certificates"].pop(idx - 1)
            save_data(data)
            print("- Deleted.")
        elif choice == "e":
            idx = ask_int("  Edit which number", 1, 1, len(data["certificates"]))
            c = data["certificates"][idx - 1]
            c["title"] = ask("  Name", c["title"], required=True)
            c["meta"] = ask("  Issuer · Year", c["meta"])
            c["image"] = ask("  Image file (empty = placeholder slot)", c.get("image") or "")
            save_data(data)
            print("+ Saved.")


def edit_testimonials(data):
    header("TESTIMONIALS")
    while True:
        for i, t in enumerate(data["testimonials"], 1):
            print(f"  {i}. {t['quote'][:50]} — {t['author']}")
        print("  a) Add   d) Delete   Enter = back")
        choice = ask("  Choice", "").lower()
        if choice == "":
            return
        if choice == "a":
            item = {
                "quote": ask("  The quote", required=True),
                "author": ask("  Who said it (— name)", required=True),
                "dim": ask_yn("  Reserve slot (dim style)?", False),
            }
            data["testimonials"].append(item)
            save_data(data)
            print("+ Added.")
        elif choice == "d":
            idx = ask_int("  Delete which number", 1, 1, len(data["testimonials"]))
            data["testimonials"].pop(idx - 1)
            save_data(data)
            print("- Deleted.")


# ============================================================
# PHOTO PROTECTION — the full-res photo never goes public
# ============================================================

def protect_photo():
    """The repo only ever receives a small copy (max 480px wide).
    The original full-res photo (profile-original.png) stays on this
    machine only and is blocked by .gitignore. Note: anything shown
    on a public website can still be downloaded by visitors — this
    protects the original quality, not the published small copy."""
    original = os.path.join(BASE, "profile-original.png")
    deployed = os.path.join(BASE, "profile.png")
    if not os.path.exists(original):
        return
    ps = (
        "Add-Type -AssemblyName System.Drawing;"
        "$src=[System.Drawing.Image]::FromFile('" + original + "');"
        "$maxW=480;$w=$maxW;$h=[int]($src.Height*$maxW/$src.Width);"
        "if($src.Width -le $maxW){$w=$src.Width;$h=$src.Height};"
        "$bmp=New-Object System.Drawing.Bitmap($w,$h);"
        "$g=[System.Drawing.Graphics]::FromImage($bmp);"
        "$g.InterpolationMode='HighQualityBicubic';"
        "$g.DrawImage($src,0,0,$w,$h);"
        "$src.Dispose();"
        "$bmp.Save('" + deployed + "',[System.Drawing.Imaging.ImageFormat]::Png);"
        "$g.Dispose();$bmp.Dispose();"
    )
    try:
        subprocess.run(["powershell.exe", "-NoProfile", "-Command", ps],
                       check=True, capture_output=True, timeout=60)
        print("+ Photo protected: the site uses a small 480px copy; "
              "the original stays private on this machine.")
    except Exception as e:
        print(f"! Could not resize the photo automatically ({e}) — "
              "the existing profile.png will be published as-is.")


# ============================================================
# PUBLISH — push to GitHub Pages
# ============================================================

def load_config():
    if os.path.exists(CONFIG_FILE):
        with open(CONFIG_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return None


def save_config(cfg):
    with open(CONFIG_FILE, "w", encoding="utf-8") as f:
        json.dump(cfg, f, indent=2)


def ensure_gitignore():
    try:
        with open(GITIGNORE, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        content = ""
    changed = False
    for line in PRIVATE_FILES:
        if line not in content:
            content += f"\n{line}"
            changed = True
    if changed:
        with open(GITIGNORE, "w", encoding="utf-8") as f:
            f.write(content.strip() + "\n")
        print("+ .gitignore updated: your private files can never be uploaded.")


def run_git(args, timeout=120):
    return subprocess.run(["git"] + args, cwd=BASE, capture_output=True, text=True, timeout=timeout)


def publish():
    header("PUBLISH — push everything to your GitHub Pages site")
    cfg = load_config()
    if not cfg:
        print("First time? A few things, saved locally only\n"
              "(admin_config.json can never be uploaded).\n")
        username = ask("GitHub username", required=True)
        raw = ask("Repository — name like 'portfolio' OR paste the full URL", required=True)
        repo = raw.strip().rstrip("/").removesuffix(".git")
        if "github.com" in repo:
            parts = [p for p in repo.split("github.com/")[-1].split("/") if p]
            if len(parts) >= 2:
                if parts[0] != username:
                    if ask_yn(f"The URL says the repo belongs to '{parts[0]}' — use that username?", True):
                        username = parts[0]
                repo = parts[1]
            print(f"  + Parsed from the URL: username='{username}', repo='{repo}'")
        branch = ask("Branch (just press Enter for 'main')", "main")
        print()
        print("  ── Your Personal Access Token (2 minutes, ONE time only) ──")
        print("  1. Open:  https://github.com/settings/tokens")
        print("  2. 'Generate new token' → 'Generate new token (classic)'")
        print("  3. Note: anything, e.g. 'portfolio admin'")
        print("  4. Expiration: 90 days (or No expiration)")
        print("  5. IMPORTANT: tick the first checkbox 'repo' — that is")
        print("     the permission that lets me upload for you")
        print("  6. 'Generate token' → COPY it (starts with ghp_)")
        print("  7. Paste it below — hidden while typing")
        print("  " + "─" * 50)
        token = getpass.getpass("  Paste token (input hidden): ").strip()
        while not token:
            print("   x The token is what gives me permission to push.")
            token = getpass.getpass("  Paste token (input hidden): ").strip()
        cfg = {"username": username, "repo": repo, "branch": branch, "token": token}
        save_config(cfg)
        print("\n+ Saved. You will not be asked again "
              "(delete admin_config.json to redo this).\n")

    protect_photo()
    ensure_gitignore()

    # git must exist
    try:
        r = run_git(["--version"])
        if r.returncode != 0:
            raise FileNotFoundError
    except Exception:
        print("x Git is not installed or not in PATH. Install it from git-scm.com and try again.")
        return

    # repo must exist
    r = run_git(["rev-parse", "--is-inside-work-tree"])
    if r.returncode != 0 or "true" not in (r.stdout or ""):
        if ask_yn("This folder is not a git repo yet — create one now?", True):
            run_git(["init"])
            run_git(["branch", "-M", cfg["branch"]])
        else:
            print("x Cannot publish without a git repo.")
            return

    url = f"https://{cfg['username']}:{cfg['token']}@github.com/{cfg['username']}/{cfg['repo']}.git"

    print("\nUploading...")
    run_git(["add", "-A"])
    commit = run_git(["commit", "-m", "portfolio update via admin"])
    if "nothing to commit" in (commit.stdout or ""):
        print("+ Nothing new to upload — your site is already up to date.")
        print(f"  Live link: https://{cfg['username']}.github.io/{cfg['repo']}/")
        return

    push = run_git(["push", url, cfg["branch"]], timeout=180)
    if push.returncode == 0:
        print("+ PUBLISHED! Your site updates in about one minute at:")
        print(f"  https://{cfg['username']}.github.io/{cfg['repo']}/")
        if cfg["repo"] == cfg["username"] + ".github.io":
            print(f"  (clean link: https://{cfg['username']}.github.io/)")
    else:
        print("x Push failed. Git said:")
        print("  " + (push.stderr or push.stdout or "").strip()[:500])
        print("  Common fixes: wrong token (make a new one with 'repo' scope),")
        print("  wrong username/repo, or the repo does not exist yet (create it empty on github.com).")


# ============================================================
# VALIDATION (--check)
# ============================================================

def check(data):
    header("CHECKING data.js")
    problems = []
    if not data["profile"]["name"]:
        problems.append("profile.name is empty")
    if "@" not in data["profile"]["email"]:
        problems.append("profile.email does not look like an email")
    if not data["profile"]["photo"]:
        problems.append("profile.photo is empty")
    for p in data["projects"]:
        for field in ("title", "desc", "overview"):
            if not p.get(field):
                problems.append(f"project {p['code']}: {field} is empty")
        img = p.get("image")
        if img and not os.path.exists(os.path.join(BASE, img)):
            problems.append(f"project {p['code']}: image file '{img}' is missing on disk")
    for c in data["certificates"]:
        if c.get("image") and not os.path.exists(os.path.join(BASE, c["image"])):
            problems.append(f"certificate '{c['title']}': image file '{c['image']}' is missing")
    if problems:
        print("x Problems found:")
        for p in problems:
            print("  - " + p)
    else:
        print("+ All good: data.js is valid, every image file exists.")


# ============================================================
# MAIN MENU
# ============================================================

def main():
    if "--check" in sys.argv:
        check(load_data())
        return

    print("=" * 55)
    print("  PORTFOLIO ADMIN — edit by answering questions")
    print("  (Ctrl+C anytime — nothing breaks)")
    print("=" * 55)

    while True:
        try:
            data = load_data()
            print("\n=== MAIN MENU ===")
            print(" 1) Profile (name · title · email · links)")
            print(" 2) About (the 4 facts · story)")
            print(" 3) What makes me different")
            print(" 4) Education")
            print(" 5) Skills (% levels)")
            print(" 6) Projects — add / edit / delete")
            print(" 7) Work experience")
            print(" 8) Services")
            print(" 9) Certificates")
            print("10) Testimonials")
            print("11) Show projects summary")
            print("p) PUBLISH to your GitHub Pages site")
            print("0) Exit")
            choice = ask("Choice", "").strip().lower()

            if choice == "1": edit_profile(data)
            elif choice == "2": edit_about(data)
            elif choice == "3": edit_usp(data)
            elif choice == "4": edit_education(data)
            elif choice == "5": edit_skills(data)
            elif choice == "6":
                print("  a) Add   e) Edit   d) Delete")
                c = ask("  Choice", "").lower()
                if c == "a": add_project(data)
                elif c == "e": edit_project(data)
                elif c == "d": delete_project(data)
                else: print("  x Pick a, e or d.")
            elif choice == "7": edit_experience(data)
            elif choice == "8": edit_services(data)
            elif choice == "9": edit_certificates(data)
            elif choice == "10": edit_testimonials(data)
            elif choice == "11":
                show_projects(data)
                pause()
            elif choice == "p": publish()
            elif choice == "0":
                print("Bye — your site is whatever data.js says it is.")
                return
            else:
                print("x Pick a number from the list.")

        except KeyboardInterrupt:
            print("\n(Back to menu — nothing was lost; saves happen instantly)")
        except Exception as e:
            print(f"\nx Something went wrong: {type(e).__name__}: {e}")
            print("  Nothing was saved for that step — your data.js is safe.")


if __name__ == "__main__":
    main()
