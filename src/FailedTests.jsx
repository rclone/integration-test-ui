import { useState, useEffect, useLayoutEffect } from 'react'
import { useData } from './DataContext'
import TestTable from './TestTable'

// component to display and allow filtering of failed tests
export default function FailedTests() {
    const { data, selected, setSelected, filter, setFilter } = useData();
    const [ready, setReady] = useState(false)

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
    }, [data, setSelected, setFilter])

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
    }, [filter, selected, ready])

    if (!data || !selected) return null

    const failed = selected.Failed || []

    return (
        <>
            <h2>Failed Tests: {failed.length}</h2>
            <p className="unselected" onClick={() => setFilter("")}>
                current filter:
                <span className={filter ? "selected" : ""}>
                    {filter !== "" ? " " + filter : " none"}
                </span>
            </p>
            <TestTable tests={failed} variant="failed" />
        </>
    )
}
