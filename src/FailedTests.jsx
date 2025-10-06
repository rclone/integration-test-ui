import { useState, useEffect, useLayoutEffect } from 'react'
import { useData } from './DataContext'

// component to display and allow filtering of failed tests
export default function FailedTests() {
    const [filter, setFilter] = useState("");
    const { data, selected, setSelected } = useData();
    const [ready, setReady] = useState(false)
    const styling = (test) => (test === filter ? "selected" : "unselected")

    useLayoutEffect(() => {
        // set filter and selected from URL
        if (!data) return

        const params = new URLSearchParams(window.location.search)
        const f = params.get("filter")
        const d = params.get("date")

        if (f !== null) setFilter(f)
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
        if (filter) {
            params.set("filter", filter)
        } else {
            params.delete("filter")
        }
        if (selected?.DateTime) params.set("date", String(selected.DateTime)); else params.delete("date")

        const qs = params.toString()
        const newURL = `${window.location.pathname}${qs ? `?${qs}` : ""}`
        const oldURL = `${window.location.pathname}${window.location.search}`
        if (newURL !== oldURL) window.history.replaceState(null, "", newURL)
    }, [filter, selected])

    selected.Failed.map((t) => (t.FailedTests ??= ["DID NOT COMPLETE"]))
    // create map of filtered tests
    const filtered = selected.Failed.filter((item) => filter
        ? item.Backend === filter || item.Remote === filter || item.Path === filter || String(item.FastList) === filter
        || (item.FailedTests ?? []).includes(filter)
        : true)

    const toggleFilter = v => {
        setFilter(prev => prev === v ? "" : v)
    }

    return (
        <>
            <h2>Failed Tests: {filtered.length}</h2>
            <p className="unselected" onClick={() => setFilter("")}>
                current filter:
                <span className={filter ? "selected" : ""}>
                    {filter !== "" ? " " + filter : " none"}
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
                            <td className={styling(item.Backend)} onClick={() => toggleFilter(item.Backend)}>{item.Backend}</td>
                            <td className={styling(item.Remote)} onClick={() => toggleFilter(item.Remote)}>{item.Remote}</td>
                            <td className={styling(item.Path)} onClick={() => toggleFilter(item.Path)}>{item.Path}</td>
                            <td className={styling(String(item.FastList))} onClick={() => toggleFilter(String(item.FastList))}>{String(item.FastList)}</td>
                            <td>
                                {/* make each failed test filterable */}
                                {(item.FailedTests ?? []).map((test, idx) => (
                                    <div key={idx} className={styling(test)} onClick={() => toggleFilter(test)}>{test}</div>
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
