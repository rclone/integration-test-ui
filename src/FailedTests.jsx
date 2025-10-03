import { useState } from 'react'
import { useData } from './DataContext'

export default function FailedTests() {
    const [filter, setFilter] = useState(null);
    const styling = (test) => ({ cursor: "pointer", backgroundColor: test === filter ? "red" : "transparent" })
    const { selected } = useData();
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
