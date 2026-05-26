#!/usr/bin/env bash
# bc-check.sh — Backward compatibility checks for P0 refactor.
#
# Runs six mechanical checks (BC-1 through BC-6) and emits PASS/FAIL lines.
# Exits 0 iff every check passes.
#
# Usage:
#   ./scripts/bc-check.sh                 # compare HEAD against BASE_SHA env var (default: 2df7d140)
#   BASE_SHA=<sha> ./scripts/bc-check.sh
#
# Checks:
#   BC-1: package.json field diff (name/version/main/module/types/exports/peerDependencies/dependencies)
#   BC-2: dts export-set diff (dist/types/index.d.ts named/type exports)
#   BC-3: hook return shape diff (against context-shape-baseline.json) — placeholder for Phase 2
#   BC-4: dts walker — no `internal/` symbols leaked into dist/types/index.d.ts
#   BC-5: internal source import — no external file imports from .../internal/
#   BC-6: scrollPubSub contract — topic literal + payload type set unchanged
#
# Notes:
#   - BC-3 requires the Phase 0 context-shape baseline JSON; until Phase 2 it
#     emits SKIP rather than FAIL when the baseline is absent.
#   - BC-2/BC-4 require a prior `yarn build` (dist/ must exist). The script
#     will run `yarn build` if `--build` is passed.

set -uo pipefail

BASE_SHA="${BASE_SHA:-2df7d140}"
DO_BUILD=0
RESULT_OK=1

for arg in "$@"; do
  case "$arg" in
    --build) DO_BUILD=1 ;;
    --base=*) BASE_SHA="${arg#--base=}" ;;
    *) echo "[bc-check] unknown arg: $arg" >&2; exit 64 ;;
  esac
done

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)"
cd "$repo_root"

emit_pass() { echo "[BC-$1] PASS — $2"; }
emit_fail() { echo "[BC-$1] FAIL — $2"; RESULT_OK=0; }
emit_skip() { echo "[BC-$1] SKIP — $2"; }

# --- BC-1: package.json field diff ----------------------------------------
bc1_fields='.name, .version, .main, .module, .types, .typings, .exports, .style, .files, .peerDependencies, .dependencies'
bc1_base="$(git show "$BASE_SHA":package.json 2>/dev/null | jq -c "{name, version, main, module, types, typings, exports, style, files, peerDependencies, dependencies}" 2>/dev/null || echo "")"
bc1_head="$(jq -c "{name, version, main, module, types, typings, exports, style, files, peerDependencies, dependencies}" package.json 2>/dev/null || echo "")"
if [ -z "$bc1_base" ] || [ -z "$bc1_head" ]; then
  emit_fail 1 "could not extract package.json fields (base or head)"
elif [ "$bc1_base" = "$bc1_head" ]; then
  emit_pass 1 "package.json public fields unchanged vs $BASE_SHA"
else
  emit_fail 1 "package.json public fields differ vs $BASE_SHA"
  diff <(echo "$bc1_base" | jq .) <(echo "$bc1_head" | jq .) | head -40
fi

# --- Build (if requested) -------------------------------------------------
if [ "$DO_BUILD" = "1" ]; then
  if ! yarn build >/tmp/bc-check-build.log 2>&1; then
    echo "[bc-check] yarn build failed — see /tmp/bc-check-build.log" >&2
    tail -40 /tmp/bc-check-build.log >&2
    exit 2
  fi
fi

# --- BC-2: dts export-set diff --------------------------------------------
dts_head="dist/types/index.d.ts"
if [ ! -f "$dts_head" ]; then
  emit_skip 2 "$dts_head not present (run with --build)"
  emit_skip 4 "depends on BC-2 build artifact"
else
  bc2_tmp_base="$(mktemp)"
  bc2_tmp_head="$(mktemp)"
  # Extract the set of `export ...` declarations from base sha's dist (if any)
  # — best-effort: if base sha's dist isn't committed, BC-2 is informational only.
  if git show "$BASE_SHA:dist/types/index.d.ts" >/dev/null 2>&1; then
    git show "$BASE_SHA:dist/types/index.d.ts" | node scripts/bc-check/dts-export-walker.mjs --mode=exports > "$bc2_tmp_base"
    node scripts/bc-check/dts-export-walker.mjs --mode=exports < "$dts_head" > "$bc2_tmp_head"
    if diff -q "$bc2_tmp_base" "$bc2_tmp_head" >/dev/null; then
      emit_pass 2 "dist/types/index.d.ts export set unchanged vs $BASE_SHA"
    else
      emit_fail 2 "dist/types/index.d.ts export set differs vs $BASE_SHA"
      diff "$bc2_tmp_base" "$bc2_tmp_head" | head -40
    fi
  else
    # Base sha's dist not committed — record current export set as a snapshot
    node scripts/bc-check/dts-export-walker.mjs --mode=exports < "$dts_head" > "$bc2_tmp_head"
    snapshot_path="src/__tests__/p0-baseline/dts-export-set.txt"
    if [ -f "$snapshot_path" ]; then
      if diff -q "$snapshot_path" "$bc2_tmp_head" >/dev/null; then
        emit_pass 2 "dist/types/index.d.ts export set unchanged vs committed snapshot"
      else
        emit_fail 2 "dist/types/index.d.ts export set differs vs $snapshot_path"
        diff "$snapshot_path" "$bc2_tmp_head" | head -40
      fi
    else
      emit_skip 2 "no base dist and no committed snapshot — run with --build during Phase 0 to capture"
    fi
  fi

  # --- BC-4: internal/ leak check (depends on dist/types/index.d.ts) ------------
  internal_leaks="$(node scripts/bc-check/dts-export-walker.mjs --mode=internal-leak < "$dts_head" || true)"
  if [ -z "$internal_leaks" ]; then
    emit_pass 4 "dist/types/index.d.ts does not re-export from internal/"
  else
    emit_fail 4 "dist/types/index.d.ts leaks internal/ symbols:"
    echo "$internal_leaks" | head -20
  fi

  rm -f "$bc2_tmp_base" "$bc2_tmp_head"
fi

# --- BC-3: hook return shape (Phase 2 baseline) ---------------------------
ctx_baseline="src/__tests__/p0-baseline/context-shape-baseline.json"
if [ -f "$ctx_baseline" ]; then
  # Phase 2+: a dedicated jest helper captures the runtime shape; here we
  # only assert the baseline file exists and is well-formed. The actual
  # field-set diff is performed by the jest spec
  # `src/__tests__/p0-characterization/context-shape-parity.spec.tsx`.
  if jq empty "$ctx_baseline" >/dev/null 2>&1; then
    emit_pass 3 "context-shape-baseline.json present and well-formed"
  else
    emit_fail 3 "context-shape-baseline.json malformed"
  fi
else
  emit_skip 3 "context-shape-baseline.json not yet captured (Phase 0 deliverable)"
fi

# --- BC-5: internal source import (grep) ----------------------------------
# Match imports from any path containing `/internal/` but exclude relative
# imports issued from inside src/modules/GroupChannel/internal/ itself.
internal_import_matches="$(
  grep -rEn "from ['\"](\\.\\.?/)+(.*/)?internal/" src --include='*.ts' --include='*.tsx' \
    | grep -vE 'src/modules/GroupChannel/internal/' \
    || true
)"
if [ -z "$internal_import_matches" ]; then
  emit_pass 5 "no external source imports from internal/"
else
  emit_fail 5 "external source imports from internal/ detected:"
  echo "$internal_import_matches" | head -20
fi

# --- BC-6: scrollPubSub contract ------------------------------------------
# The contract is the `ScrollTopics` union type in useMessageListScroll.tsx.
# Snapshot file captures the topic literals from that type. A FAIL means
# either the type was changed OR new publish call sites use unexpected topics.
scroll_snapshot="src/__tests__/p0-baseline/scroll-pubsub-contract.txt"
scroll_src="src/modules/GroupChannel/context/hooks/useMessageListScroll.tsx"
if [ ! -f "$scroll_src" ]; then
  emit_skip 6 "$scroll_src not found"
elif [ ! -f "$scroll_snapshot" ]; then
  emit_skip 6 "$scroll_snapshot not yet captured (Phase 0 deliverable)"
else
  # Extract topic literals from `ScrollTopics = 'a' | 'b'` style declaration.
  current_topics="$(grep -E "ScrollTopics\s*=" "$scroll_src" | grep -oE "'[a-zA-Z0-9_]+'" | sort -u)"
  if [ -z "$current_topics" ]; then
    emit_fail 6 "could not extract ScrollTopics type literals from $scroll_src"
  else
    # Find all publish call sites across the GroupChannel module and extract
    # the topic argument, sorted/unique.
    call_sites="$(grep -rhoE "scrollPubSub[?]?\.?publish\(\s*['\"][a-zA-Z0-9_]+['\"]" \
      src/modules/GroupChannel --include='*.ts' --include='*.tsx' \
      | grep -oE "'[a-zA-Z0-9_]+'" \
      | sort -u)"
    # Both must equal the snapshot — type and call sites must agree.
    if diff -q <(echo "$current_topics") "$scroll_snapshot" >/dev/null \
       && diff -q <(echo "$call_sites") "$scroll_snapshot" >/dev/null; then
      emit_pass 6 "scrollPubSub topics: type + call sites match snapshot"
    else
      emit_fail 6 "scrollPubSub topic contract drift detected"
      echo "  type vs snapshot:"
      diff <(echo "$current_topics") "$scroll_snapshot" | head -20
      echo "  call sites vs snapshot:"
      diff <(echo "$call_sites") "$scroll_snapshot" | head -20
    fi
  fi
fi

# --- Summary --------------------------------------------------------------
if [ "$RESULT_OK" = "1" ]; then
  echo "[bc-check] all checks passed"
  exit 0
else
  echo "[bc-check] one or more checks FAILED"
  exit 1
fi
