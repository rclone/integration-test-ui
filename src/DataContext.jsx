import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const DataContext = createContext();
const URL = "https://pub.rclone.org/integration-tests/"

// fetch the integration test directory listing
async function getListing(url) {
    const res = await fetch(url, {
        headers: { Accept: "application/json" },
        mode: "cors",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

// create DataProvider component to give children access to data
export function DataProvider({ children }) {
    const [selected, setSelected] = useState()
    const [data, setData] = useState()
    const [loading, setLoading] = useState(true)
    const [progress, setProgress] = useState({ done: 0, total: 0 })

    // fetch json test data from subdirectories in listing
    useEffect(() => {
        (async () => {
            setLoading(true)
            try {
                const listing = await getListing(URL)
                const tests = listing.filter(item => item.name.startsWith("20"))
                setProgress({ done: 0, total: tests.length })

                const results = await Promise.all(
                    tests.map(async t => {
                        const d = await getListing(`${URL}${t.name}/index.json`)
                        setProgress(p => ({ ...p, done: p.done + 1 }))
                        return d
                    })
                )

                setData(results)
                setSelected(results[results.length - 1])
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const value = useMemo(() => ({ data, selected, setSelected, loading, progress }), [data, selected, loading, progress])

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
    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// function for getting data from context
export function useData() {
    return useContext(DataContext)
}
