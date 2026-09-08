---
description: Permanent project rules combining Ponytail (anti-overengineering) with Apple Design & Fluid Motion standards
trigger: always_on
---

# Project Engineering & Design Standards

This project combines **Ponytail's minimalism** (writing the least code necessary) with **Apple Design's fluid motion principles** (spring physics, interruptibility, direct manipulation, optical typography).

---

## 1. The Ponytail Decision Ladder (Anti-Overengineering)

Before writing any new code, climb this ladder and stop at the first rung that solves the problem:

1. **YAGNI (You Ain't Gonna Need It):** Does this feature, wrapper, or abstraction actually need to exist? If not, skip it.
2. **Reuse Codebase Assets:** Is there an existing component, helper, or utility in `@/components/ui` or `@/lib`? Reuse it.
3. **Standard Library First:** Does TypeScript/JavaScript or Web standard APIs do it natively? Use built-ins.
4. **Native Platform Features:** Can native HTML/CSS (e.g. `<dialog>`, CSS grid, `<input type="date">`, `backdrop-filter`) solve it?
5. **Existing Dependencies:** Use installed dependencies (`motion/react`, Tailwind CSS, Drizzle, Lucide) before adding any new package.
6. **One-Line / Minimal Implementation:** Can it be written cleanly in one or few lines?
7. **Write only the minimum code that works safely:** Never sacrifice security, error handling, or input validation, but ruthlessly eliminate boilerplate, excessive configuration, and speculative abstractions.

---

## 2. Apple Design & Fluid Motion Standards

When creating, updating, or animating UI components:

### Spring Physics Over Fixed Easing
- Use spring physics from `@/lib/motion` (`springs.default`, `springs.snappy`, `springs.sheet`, `springs.tap`).
- Default interactive UI: `damping: 1.0` (critically damped, no excessive wobble, crisp settle).
- Momentum / gestures: `damping: 0.8` (natural bounce only when preceded by velocity/flick).

### Interruptibility & Direct Manipulation
- Never lock out user input during transitions.
- Interactive elements must respond instantly on pointer-down (`active:scale-[0.97]`).
- Sheets and modals must support swipe gestures with velocity handoff and rubber-banding at boundaries.

### Translucency & Depth (Materials)
- Use translucent materials (`backdrop-filter: blur()`) with high-contrast text and border vibrancy rather than heavy opaque sheets.
- Animate blur radius and scale together on entry/exit so surfaces feel like physical material arriving.

### Optical Typography
- Size-specific tracking: negative tracking (`tracking-tight`) on large headers, normal tracking on body copy.
- Leading (line-height) tightens on display headlines and expands comfortably on reading copy.
