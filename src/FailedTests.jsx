import { useState, useEffect, useLayoutEffect } from 'react'
import { useData } from './DataContext'

const parseFilter = v => {
    if (v === null) return null
    if (v === "true") return true
    if (v === "false") return false
    return v;
}

export default function FailedTests() {
    const [filter, setFilter] = useState(null);
    const { data, selected, setSelected } = useData();
    const [ready, setReady] = useState(false)
    const styling = (test) => ({ cursor: "pointer", backgroundColor: test === filter ? "red" : "transparent" })

    useLayoutEffect(() => {
        // set filter and selected from URL
        if (!data) return

        const params = new URLSearchParams(window.location.search)
        const f = params.get("filter")
        const d = params.get("date")

        setFilter(parseFilter(f))
        if (d !== null) {
            const match = data.find(t => String(t.DateTime) === d)
            if (match) setSelected(match)
        }

        setReady(true)
    }, [data])

    useEffect(() => {
        // changes url based on filter and selected
        if (!ready) return

        const params = new URLSearchParams(window.location.search)
        if (filter !== null && filter !== undefined) {
            params.set("filter", String(filter))
        } else params.delete("filter")
        if (selected?.DateTime) params.set("date", String(selected.DateTime)); else params.delete("date")

        const qs = params.toString()
        const newURL = `${window.location.pathname}${qs ? `?${qs}` : ""}`
        const oldURL = `${window.location.pathname}${window.location.search}`
        if (newURL !== oldURL) window.history.replaceState(null, "", newURL)
    }, [filter, selected])

    selected.Failed.map((t) => (
        t.FailedTests ??= ["DID NOT COMPLETE"]
    ))
    const filtered = selected.Failed.filter((item) => filter
        ? item.Backend === filter || item.Remote === filter || item.Path === filter || item.FastList === filter
        || (item.FailedTests ?? []).includes(filter)
        : true)

    const toggleFilter = v => {
        setFilter(prev => prev === v ? null : v)
    }

    return (
        <>
            <h2>Failed Tests: {filtered.length}</h2>
            <p style={{ cursor: "pointer" }} onClick={() => setFilter(null)}>
                current filter:
                <span style={{ backgroundColor: filter !== null ? "red" : "transparent" }}>
                    {" " + String(filter ?? "none")}
                </span>
            </p>
            <table>
                <thead>
                    <tr>
                        <th>Backend</th>
                        <th>Remote</th>
                        <th>Test</th>
                        <th>FastList</th>
                        <th>Failed</th>
                        <th>Logs</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((item, i) => (
                        <tr key={i}>
                            <td style={styling(item.Backend)} onClick={() => toggleFilter(item.Backend)}>{item.Backend}</td>
                            <td style={styling(item.Remote)} onClick={() => toggleFilter(item.Remote)}>{item.Remote}</td>
                            <td style={styling(item.Path)} onClick={() => toggleFilter(item.Path)}>{item.Path}</td>
                            <td style={styling(item.FastList)} onClick={() => toggleFilter(item.FastList)}>{String(item.FastList)}</td>
                            <td>
                                {(item.FailedTests ?? []).map((test, idx) => (
                                    <div key={idx} style={styling(test)} onClick={() => toggleFilter(test)}>{test}</div>
                                ))}
                            </td>
                            <td>
                                {(item.TrialNames.map((n, idx) => (
                                    <a
                                        key={idx}
                                        href={`https://pub.rclone.org/integration-tests/${selected.DateTime}/${n}`}
                                        style={{ marginRight: "0.2rem" }}
                                        target="_blank"
                                    >
                                        #{idx}
                                    </a>
                                )))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}
