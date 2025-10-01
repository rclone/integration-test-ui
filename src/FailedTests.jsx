// each item should be clickable, sorting only those things
// extension: would be nice to see tick/cross on each test for the last few days to see if it passed
// sidebar: when a header is selected, when moved to another date of testing it should stay selected

import data from './assets/index.json'
import { useState } from 'react'



function FailedTests() {
    const [filter, setFilter] = useState();

    const styling = (test) => ({ cursor: "pointer", backgroundColor: test === filter ? "red" : "transparent" })

    return (
        <>
            <h3>Failed Tests: {data.Failed.length}</h3>
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
                    {data.Failed.filter((item) => filter
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
                                <td>{item.TrialNames}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </>
    )
}
export default FailedTests
