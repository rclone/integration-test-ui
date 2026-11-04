import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { ConfigProvider, message, notification, theme } from 'antd';
import { STORAGE_KEY, ignoreKey, ignoreLabel, loadIgnored, saveIgnored, pruneIgnored, newestDateTime } from './ignored';

const DataContext = createContext();
const URL = "https://pub.rclone.org/integration-tests/"
const BACKENDS_URL = "https://tip.rclone.org/backends/index.json"

// fetch the integration test directory listing
// Returns null if the fetch fails (e.g. 404 for incomplete uploads)
async function getListing(url) {
    try {
        const res = await fetch(url, {
            headers: { Accept: "application/json" },
            mode: "cors",
        });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

// create DataProvider component to give children access to data
export function DataProvider({ children }) {
    const [selected, setSelected] = useState()
    const [data, setData] = useState()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [progress, setProgress] = useState({ done: 0, total: 0 })
    const [filter, setFilter] = useState("")
    const toggleFilter = useCallback(v => setFilter(prev => prev === v ? "" : v), [])
    const [backends, setBackends] = useState(null)
    const [ignored, setIgnored] = useState(loadIgnored)
    const [cleared, setCleared] = useState([])
    const [messageApi, messageHolder] = message.useMessage()
    const [notificationApi, notificationHolder] = notification.useNotification()

    // fetch json test data from subdirectories in listing
    useEffect(() => {
        (async () => {
            setLoading(true)
            try {
                const listing = await getListing(URL)
                if (!listing) {
                    setError("Failed to load test listing from " + URL)
                    return
                }
                const tests = listing.filter(item => item.name.startsWith("20"))
                setProgress({ done: 0, total: tests.length })

                const results = (await Promise.all(
                    tests.map(async t => {
                        const name = t.name.replace(/\/+$/, "")
                        const d = await getListing(`${URL}${name}/index.json`)
                        setProgress(p => ({ ...p, done: p.done + 1 }))
                        return d
                    })
                )).filter(Boolean)

                // fill in missing FailedTests so components don't have to
                for (const r of results) {
                    for (const t of (r.Failed || [])) {
                        t.FailedTests ??= ["DID NOT COMPLETE"]
                    }
                }

                if (results.length === 0) {
                    setError("No test data could be loaded")
                    return
                }

                // drop ignores for rows which have since passed
                const pruned = pruneIgnored(loadIgnored(), results)
                setIgnored(pruned.items)
                setCleared(pruned.cleared)

                setData(results)
                setSelected(results[results.length - 1])
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(BACKENDS_URL)
                if (!res.ok) return
                const data = await res.json()
                const map = new Map()
                for (const [key, b] of Object.entries(data)) {
                    map.set(key, b)
                }
                setBackends(map)
            } catch {
                // Non-critical — silently ignore
            }
        })()
    }, [])

    // persist ignores and keep them in sync with other tabs
    useEffect(() => saveIgnored(ignored), [ignored])
    useEffect(() => {
        const handler = (e) => { if (e.key === STORAGE_KEY) setIgnored(loadIgnored()) }
        window.addEventListener("storage", handler)
        return () => window.removeEventListener("storage", handler)
    }, [])

    // tell the user about ignores removed because the tests passed
    useEffect(() => {
        if (cleared.length === 0) return
        notificationApi.info({
            key: "ignores-cleared",
            message: `${cleared.length} ignore${cleared.length === 1 ? "" : "s"} cleared because the test${cleared.length === 1 ? "" : "s"} passed`,
            description: cleared.map(t => <div key={ignoreKey(t)}>{ignoreLabel(t)}</div>),
            duration: 0,
        })
    }, [cleared, notificationApi])

    // set or remove (entry == null) the ignore for key k
    const setIgnoreEntry = useCallback((k, entry) => {
        setIgnored(prev => {
            const next = { ...prev }
            if (entry) next[k] = entry; else delete next[k]
            return next
        })
    }, [])

    // ignore test t, offering undo
    const ignore = useCallback(t => {
        const k = ignoreKey(t)
        setIgnoreEntry(k, { since: newestDateTime(data), at: Date.now() })
        messageApi.open({
            key: k,
            type: "info",
            duration: 6,
            content: <span>Ignored {ignoreLabel(t)} until it passes. <a onClick={() => { setIgnoreEntry(k, null); messageApi.destroy(k) }}>Undo</a></span>,
        })
    }, [data, messageApi, setIgnoreEntry])

    // unignore test t, offering undo
    const unignore = useCallback(t => {
        const k = ignoreKey(t)
        const old = ignored[k]
        if (!old) return
        setIgnoreEntry(k, null)
        messageApi.open({
            key: k,
            type: "info",
            duration: 6,
            content: <span>Unignored {ignoreLabel(t)}. <a onClick={() => { setIgnoreEntry(k, old); messageApi.destroy(k) }}>Undo</a></span>,
        })
    }, [ignored, messageApi, setIgnoreEntry])

    const value = useMemo(() => ({ data, selected, setSelected, loading, progress, filter, setFilter, toggleFilter, backends, ignored, ignore, unignore }), [data, selected, loading, progress, filter, toggleFilter, backends, ignored, ignore, unignore])

    if (!loading && error) {
        return (
            <div style={{ padding: 16, fontFamily: "sans-serif", color: "#c00" }}>
                {error}
            </div>
        );
    }
    if (loading) {
        // loading bar
        const pct = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;
        return (
            <div style={{ padding: 16, fontFamily: "sans-serif" }}>
                <div style={{ marginBottom: 8 }}>Loading… {progress.done}/{progress.total} ({pct}%)</div>
                <div style={{ height: 8, background: "#eee", borderRadius: 999 }}>
                    <div style={{ width: `${pct}%`, height: "100%", borderRadius: 999, background: "#999" }} />
                </div>
            </div>
        );
    }
    const dark = window.matchMedia?.("(prefers-color-scheme: dark)").matches
    return (
        <DataContext.Provider value={value}>
            <ConfigProvider theme={{ algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
                {messageHolder}
                {notificationHolder}
            </ConfigProvider>
            {children}
        </DataContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useData() {
    return useContext(DataContext)
}
