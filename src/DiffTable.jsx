import { useData } from "./DataContext";
import { useMemo } from 'react'
import TestTable from './TestTable'

// make unique key for each test
function key(t) {
    return `${t.Backend}|${t.Path}|${t.Remote}`
}

// get a map of failed tests
function failedSet(report) {
    return new Map((report.Failed || []).map(t => [key(t), t]));
}

// compare current and previous test
function compare(oldReport, newReport) {
    const oldF = failedSet(oldReport)
    const newF = failedSet(newReport)

    const regressed = [...newF.values()].filter(t => !oldF.has(key(t)))
    const fixed = [...oldF.values()].filter(t => !newF.has(key(t)))
    const continued = [...newF.values()].filter(t => oldF.has(key(t)))

    return { regressed, fixed, continued }
}

// create the tables for each difference
export default function DiffTable() {
    const { data, selected } = useData()

    // only calculate on data or selected change
    const { regressed, fixed, continued } = useMemo(() => {
        if (!data || !selected) return { regressed: [], fixed: [], continued: [] };
        const idx = data.indexOf(selected)
        const previous = idx > 0 ? data[idx - 1] : null;
        if (!previous) return { regressed: [], fixed: [], continued: [] };
        return compare(previous, selected)
    }, [data, selected])

    if (!data || !selected) return null

    return (
        <>
            <h2>Regressed Tests</h2>
            <TestTable tests={regressed} variant="regressed" />
            <h2>Continued Failed Tests</h2>
            <TestTable tests={continued} variant="continued" />
            <h2>Fixed Tests</h2>
            <TestTable tests={fixed} variant="fixed" />
        </>
    )
}
