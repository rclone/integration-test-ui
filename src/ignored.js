// Persistence and pruning of ignored failed-test rows.
//
// An ignore is keyed on (Backend, Remote, Path, FastList) and is
// stored in localStorage. It is removed automatically once that row
// passes in a run newer than the newest run at the time of ignoring.

export const STORAGE_KEY = "ignoredTests"
const VERSION = 1

// unique key for an ignorable row
export function ignoreKey(t) {
    return JSON.stringify([t.Backend, t.Remote, t.Path, Boolean(t.FastList)])
}

// human readable label for an ignorable row
export function ignoreLabel(t) {
    const parts = [t.Backend, t.Remote, t.Path]
    if (t.FastList) parts.push("FastList")
    return parts.join(" · ")
}

// read the ignored items from localStorage, returning {} on any problem
export function loadIgnored() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return {}
        const parsed = JSON.parse(raw)
        if (parsed?.version !== VERSION || typeof parsed.items !== "object" || parsed.items === null) return {}
        return parsed.items
    } catch {
        return {}
    }
}

// write the ignored items to localStorage
export function saveIgnored(items) {
    try {
        if (Object.keys(items).length === 0) {
            localStorage.removeItem(STORAGE_KEY)
        } else {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: VERSION, items }))
        }
    } catch {
        // storage full or unavailable - ignores just won't persist
    }
}

// DateTime of the newest run in data
export function newestDateTime(data) {
    let newest = ""
    for (const r of data || []) {
        if (r.DateTime > newest) newest = r.DateTime
    }
    return newest
}

// Remove ignores whose row passed in a run newer than when they were
// ignored. Returns the remaining items and the list of cleared rows
// (as test objects from the passing run).
export function pruneIgnored(items, data) {
    const remaining = { ...items }
    const cleared = []
    for (const r of data || []) {
        for (const t of r.Passed || []) {
            const k = ignoreKey(t)
            const entry = remaining[k]
            if (entry && r.DateTime > entry.since) {
                delete remaining[k]
                cleared.push(t)
            }
        }
    }
    return { items: remaining, cleared }
}

// split tests into [visible, ignored]
export function splitIgnored(tests, items) {
    const visible = []
    const ignored = []
    for (const t of tests) {
        (items[ignoreKey(t)] ? ignored : visible).push(t)
    }
    return [visible, ignored]
}
