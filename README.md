# Glow Notes ✨

Glow Notes is a calm, action-oriented note-taking app where any sentence can be turned into a gentle action with one tap.

Instead of separating thinking from doing, Glow keeps actions embedded in the context they came from — helping users move forward without breaking flow.

---

## ✨ Core Idea

> Notes are for reflection.  
> Actions are for movement.  
> Glow connects the two.

Users can highlight any sentence inside a note and instantly convert it into an action. Actions remain traceable back to their source, creating a lightweight, mindful task system layered on top of writing.

---

## 🌿 Features

- **Rich note editor**
  - Freeform writing with paragraph focus
  - Subtle focus mode that dims everything except the current paragraph

- **Action Highlights**
  - Highlight text → “Make Action”
  - Actions preserve source context
  - Soft pastel action chips

- **Daily Action Review**
  - Separate pending and completed actions
  - Gentle copy and empty states
  - Designed as a reflective ritual, not a task dump

- **Thoughtful UX**
  - Dark mode with ambient glow system
  - Smooth entrance animations
  - Reduced-motion accessibility support
  - Elegant typography and spacing

- **Note management**
  - Search
  - Pin
  - Archive

---

## 🎨 Design Philosophy

Glow prioritizes:
- calm over urgency  
- clarity over density  
- encouragement over pressure  

There are no streaks, alarms, or gamification. The interface is intentionally soft, minimal, and forgiving.

---

## 🧠 Technical Overview

- **Frontend:** React + TypeScript
- **Build:** Vite
- **Styling:** Custom CSS system (no Tailwind dependency)
- **State:** Client-side state with demo data
- **Animations:** CSS keyframes with `prefers-reduced-motion` support

This repository focuses on **UX, interaction design, and frontend architecture**.

---

## 🔒 What’s intentionally not included

This public repository is a **reference implementation** and intentionally excludes:

- Authentication
- Cloud sync
- Payments / subscriptions
- Production AI integrations
- Backend services

Those features are implemented separately in a private backend.

This separation reflects real-world trust boundaries and security practices.

---

## 🧪 Demo / Local Use

Clone the repo and run:

```bash
npm install
npm run dev
```

## Why this project exists

Glow Notes was built as a product-focused exploration of:

- calm productivity

- editor UX

- action extraction without pressure

- finishing and polishing a real app, not a prototype