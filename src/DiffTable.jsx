import { useData } from "./DataContext";
import { useMemo } from 'react'

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

function createTable(tests) {
    const { selected } = useData()
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
    )
}

// create the tables for each difference
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
            {createTable(regressed)}
            <h2>Continued Failed Tests</h2>
            {createTable(continued)}
            <h2>Fixed Tests</h2>
            {createTable(fixed)}
        </>
    )
}
