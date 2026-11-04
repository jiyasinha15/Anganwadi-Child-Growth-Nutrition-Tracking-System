# ANGANSETU

**Every Child. Every Milestone. Every Day.**
Intelligent growth and nutrition monitoring for Anganwadi communities. Demo mode, fictional data.

## Run

```bash
npm install
npm run dev      # development
npm run build    # production build
```

Worker demo sign-in: `priya@anganwadi.demo` / `Worker@123` (or "Continue with demo account").
Admin demo sign-in is shown on the admin sign-in page.

## Architecture

- `src/services/store.js` is the single source of truth. It hydrates lazily in the browser and never touches storage at import time.
- `src/lib/storage.js` is the only file that reads or writes browser storage directly.
- `src/services/*Service.js` hold all writes (measurements, nutrition, follow-ups, notifications) and `analyticsService.js` derives every metric, priority, insight and alert.
- `src/services/selectors.js` gives worker screens a centre-scoped view of the store.
- `src/components/forms/ActionHost.jsx` owns the record/create dialogs so any screen can open them.
- Demo "today" is fixed at 6 October 2026 (`src/lib/dates.js`), so data is deterministic.

## Notes

ANGANSETU supports monitoring and follow-up. It does not provide medical diagnosis.
