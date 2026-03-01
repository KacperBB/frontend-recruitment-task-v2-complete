# Submission: Kacper B.

## Time Spent

Total time: **4h** (approximate, spread across triage, fixes, verification, and submission prep)

## Ticket Triage

### Tickets I Addressed

List the ticket numbers you worked on, in the order you addressed them:

1. **CFG-148**: Fixed crash when dependency-related add-ons were invalidated by option changes (removed mutation risk and added defensive handling).
2. **CFG-142**: Fixed race condition in async price calculation by guarding updates with latest request id.
3. **CFG-154**: Fixed quantity discount threshold off-by-one (`>=` at 50).
4. **CFG-147**: Fixed share URL encoding/decoding flow for special characters; stabilized loading configuration from URL.
5. **CFG-152**: Improved keyboard accessibility (focusability, arrow navigation for color swatches, modal focus behavior).
6. **CFG-151**: Replaced technical error codes in UI with user-friendly error mapping and actionable messages.
7. **CFG-157**: Added unsaved-changes confirmation flow + beforeunload protection.
8. **CFG-146**: Standardized save timestamps using ISO strings and consistent display formatting.
9. **CFG-143**: Fixed resize-handler leak risk by adding cleanup + debouncing.
10. **CFG-149**: Added clearer loading state for price recalculation (dim + spinner indicator).
11. **CFG-153**: Implemented compare configurations feature (select 2 drafts, side-by-side differences, prominent price difference).

### Tickets I Deprioritized

List tickets you intentionally skipped and why:

| Ticket  | Reason |
| ------- | ------ |
| CFG-155 | Dark mode was non-blocking for core demo stability; prioritized correctness/bugs/accessibility first. |
| CFG-156 | Missing keys warnings were low-risk for end-user behavior; left for cleanup pass after critical/demo blockers. |
| CFG-150 | I couldn't think of fix |


### Tickets That Need Clarification

List any tickets where you couldn't proceed due to ambiguity:

| Ticket  | Question |
| ------- | -------- |
|  |

---

## Technical Write-Up

### Critical Issues Found

Describe the most important bugs you identified:

#### Issue 1: Stale async responses overwriting newer price state

**Ticket(s):** CFG-142 (and impacted share-link scenarios from CFG-147)

**What was the bug?**

Rapid changes triggered overlapping async price requests. Older responses could still win and overwrite a newer configuration’s price.

**How did you find it?**

Reproduced via quick option changes and reviewed the request-tracking logic in pricing hook/API.

**How did you fix it?**

Updated request deduping so only the latest in-flight request can update UI state.

**Why this approach?**

Low-risk patch in existing architecture (no major refactor), directly addresses root cause.

---

#### Issue 2: Hard crash from dependent add-on invalidation

**Ticket(s):** CFG-148

**What was the bug?**

When a required dependency was removed (e.g., packaging), dependent add-ons became invalid and state handling led to unsafe rendering paths.

**How did you find it?**

Followed provided repro steps and traced add-on update flow around dependency checks.

**How did you fix it?**

Switched to safe state updates for dependent add-ons and added defensive checks when rendering add-on price data.

**Why this approach?**

Prevents runtime failure at source while preserving existing UX behavior.

---

### Other Changes Made

Brief description of any other modifications:

- Added compare-drafts workflow and compare table with highlighted differences + prominent price delta (CFG-153).
- Improved message quality and consistency (friendly errors, dependency text using human-readable option names).
- Improved timestamp consistency and formatting path for draft save/load.
- Added unsaved changes modal flow with Save & Close / Discard behavior.
- Additional styling changes for buttons in Draft Modal for mobile as well as configuration-actions on mobile.

---

## Code Quality Notes

### Things I Noticed But Didn't Fix

List any issues you noticed but intentionally left:

| Issue | Why I Left It |
| ----- | ------------- |
| Monolithic `ProductConfigurator` (~1000+ LOC) | Large structural refactor was out of scope for bug-fix/demo timeline. |
| Mixed legacy patterns and hook dependency warnings | Would benefit from focused refactor pass; not all are blocking runtime behavior. |
| Quick Add product-direction conflict | Deferred pending product decision between CFG-144 and CFG-145. |

### Potential Improvements for the Future

If you had more time, what would you improve?

1. Split `ProductConfigurator` into smaller feature components/hooks (drafts, share, pricing, compare).
2. Add integration tests for: race conditions, share-link hydration, dependency invalidation, and compare output.

---

## Questions for the Team

Questions you would ask in a real scenario:

1. For Quick Add, which ticket is final: remove (CFG-144) or enhance (CFG-145)-- based on provided informations i did CFG-144 but i am not sure of my decision?
2. Should compare configurations (CFG-153) include only current option/add-on/price diff, or also metadata/history/export?

---

## Assumptions Made

List any assumptions you made to proceed:

1. Demo blockers (correct pricing, crash prevention, share stability, accessibility) have higher priority than nice-to-have UI/theme work.
2. Existing mock pricing logic is source of truth unless explicitly contradicted by product guidance.

---

## Self-Assessment

### What went well?

Prioritization and sequencing of fixes worked well: crash/race/price correctness first, then UX/accessibility improvements.

### What was challenging?

Balancing multiple overlapping tickets on one large legacy component with intertwined state/effects.

### What would you do differently with more time?

I would add automated regression tests earlier and do a structural cleanup pass to reduce future risk.

---

## Additional Notes

Anything else you want us to know:

Implemented CFG-153 compare feature on dedicated branch and prepared it for PR workflow. Main branch was kept focused for requested file-level updates and submission alignment.
