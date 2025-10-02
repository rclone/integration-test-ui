import { useData } from "./DataContext";
import { useMemo } from 'react'

function key(t) {
    return `${t.Backend}|${t.Path}|${t.Remote}`
}

function failedSet(report) {
    return new Map((report.Failed || []).map(t => [key(t), t]));
}

function compare(oldReport, newReport) {
    const oldF = failedSet(oldReport)
    const newF = failedSet(newReport)

    const regressed = [...newF.values()].filter(t => !oldF.has(key(t)))
    const fixed = [...oldF.values()].filter(t => !newF.has(key(t)))
    const continued = [...newF.values()].filter(t => oldF.has(key(t)))

    return { regressed, fixed, continued }
}

function createtable(tests) {
    return (
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
                {tests.map((item, i) => (
                    <tr key={i}>
                        <td>{item.Backend}</td>
                        <td>{item.Remote}</td>
                        <td>{item.Path}</td>
                        <td>{String(item.FastList)}</td>
                        <td>
                            {(item.FailTests ?? []).map((test, idx) => (
                                <div key={idx}>{test}</div>
                            ))}
                        </td>
                        <td>
                            {(item.TrialNames.map((_, idx) => (
                                <a
                                    key={idx}
                                    href="needtoaddlink"
                                    style={{ marginRight: "0.2rem" }}
                                >
                                    #{idx}
                                </a>
                            )))}
                        </td>
                    </tr>
                ))}

            </tbody>
        </table>
    )
}

export default function DiffTable() {
    const { data, selected } = useData()

    // only calculate on data or selected change
    const { regressed, fixed, continued } = useMemo(() => {
        const idx = data.indexOf(selected)
        const previous = idx > 0 ? data[idx - 1] : null;
        if (!previous || !selected) return { regressed: [], fixed: [], continued: [] };
        return compare(previous, selected)
    }, [data, selected])

    return (
        <>
            <h2>Regressed Tests</h2>
            {createtable(regressed)}
            <h2>Continued Failed Tests</h2>
            {createtable(continued)}
            <h2>Fixed Tests</h2>
            {createtable(fixed)}
        </>
    )
}
