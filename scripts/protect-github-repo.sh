#!/usr/bin/env bash
# Apply GitHub branch protection + safe repo defaults for Quality Central.
# Requires: gh auth login (admin access to the repo)
set -euo pipefail

REPO="${1:-Ashenk97/quality-central}"
BRANCH="${2:-main}"

echo "Protecting ${REPO}@${BRANCH}…"

# Public / solo-maintainer defaults:
# - PRs required (even for admins)
# - CI must pass
# - no force-push / branch delete
# - conversations must be resolved
# Approvals default to 0 so you can merge your own PRs; raise to 1 when you have co-maintainers.
gh api \
  --method PUT \
  "repos/${REPO}/branches/${BRANCH}/protection" \
  --input - <<'EOF'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["Lint, build, and smoke tests"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "required_approving_review_count": 0
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_conversation_resolution": true
}
EOF

echo "Updating repository safety settings…"
gh api --method PATCH "repos/${REPO}" \
  -F allow_squash_merge=true \
  -F allow_merge_commit=false \
  -F allow_rebase_merge=true \
  -F delete_branch_on_merge=true \
  -F allow_auto_merge=true \
  -F has_wiki=false \
  >/dev/null

gh api --method PUT "repos/${REPO}/vulnerability-alerts" >/dev/null 2>&1 || true
gh api --method PUT "repos/${REPO}/automated-security-fixes" >/dev/null 2>&1 || true

echo "Done."
echo "Verify: https://github.com/${REPO}/settings/branches"
echo "Tip: when you have co-maintainers, raise required reviews to 1 in branch settings."
