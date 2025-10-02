import { useState } from 'react'
import { useData } from './DataContext'

export default function FailedTests() {
    const [filter, setFilter] = useState();
    const styling = (test) => ({ cursor: "pointer", backgroundColor: test === filter ? "red" : "transparent" })
    const { selected } = useData();

    return (
        <>
            <h2>Failed Tests: {selected.Failed.length}</h2>
            <p style={{ cursor: "pointer" }} onClick={() => setFilter()}>current filter: {String(filter ?? "none")}</p>
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
                    {selected.Failed.filter((item) => filter
                        ? item.Backend === filter || item.Remote === filter || item.Path === filter || item.FastList === filter
                        || (item.FailedTests ?? []).includes(filter)
                        : true).map((item, i) => (
                            <tr key={i}>
                                <td style={styling(item.Backend)} onClick={() => setFilter(item.Backend)}>{item.Backend}</td>
                                <td style={styling(item.Remote)} onClick={() => setFilter(item.Remote)}>{item.Remote}</td>
                                <td style={styling(item.Path)} onClick={() => setFilter(item.Path)}>{item.Path}</td>
                                <td style={styling(item.FastList)} onClick={() => setFilter(item.FastList)}>{String(item.FastList)}</td>
                                <td>
                                    {(item.FailedTests ?? []).map((test, idx) => (
                                        <div key={idx} style={styling(test)} onClick={() => setFilter(test)}>{test}</div>
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
        </>
    )
}
