import { useData } from "./DataContext";
import { useMemo } from 'react'
import TestTable from './TestTable'
import { splitIgnored } from './ignored'

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
    // fixed tests come from the old report, so take the log names from
    // the matching passed test in the new report as the logs are linked
    // to the new report's directory
    const newP = new Map((newReport.Passed || []).map(t => [key(t), t]))
    const fixed = [...oldF.values()]
        .filter(t => !newF.has(key(t)))
        .map(t => ({ ...t, TrialNames: newP.get(key(t))?.TrialNames ?? [] }))
    const continued = [...newF.values()].filter(t => oldF.has(key(t)))

    return { regressed, fixed, continued }
}

// create the tables for each difference
export default function DiffTable() {
    const { data, selected, ignored } = useData()

    // only calculate on data or selected change
    const { regressed, fixed, continued } = useMemo(() => {
        if (!data || !selected) return { regressed: [], fixed: [], continued: [] };
        const idx = data.indexOf(selected)
        const previous = idx > 0 ? data[idx - 1] : null;
        if (!previous) return { regressed: [], fixed: [], continued: [] };
        return compare(previous, selected)
    }, [data, selected])

    if (!data || !selected) return null

    // count of visible tests with ignored count if any
    const count = tests => {
        const [visible, hidden] = splitIgnored(tests, ignored)
        return `${visible.length}${hidden.length > 0 ? ` (${hidden.length} ignored)` : ""}`
    }

    return (
        <>
            <h2>Regressed Tests: {count(regressed)}</h2>
            <TestTable tests={regressed} variant="regressed" ignorable />
            <h2>Continued Failed Tests: {count(continued)}</h2>
            <TestTable tests={continued} variant="continued" ignorable />
            <h2>Fixed Tests: {fixed.length}</h2>
            <TestTable tests={fixed} variant="fixed" />
        </>
    )
}
