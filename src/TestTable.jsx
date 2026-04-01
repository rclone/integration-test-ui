import { useData } from './DataContext'
import ExpandableList from './ExpandableList'

// Reusable table for displaying failed test rows with optional filtering
function matchesFilter(item, filter) {
    return item.Backend === filter || item.Remote === filter || item.Path === filter || String(item.FastList) === filter
        || (item.FailedTests ?? []).includes(filter)
}

export default function TestTable({ tests, variant }) {
    const { selected, filter, toggleFilter } = useData()
    const styling = (value) => (filter && value === filter ? "selected" : "unselected")
    const filtered = filter ? tests.filter(item => matchesFilter(item, filter)) : tests

    return (
        <table className={variant ? `table-${variant}` : ""}>
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
                        <td onClick={() => toggleFilter(item.Backend)}><span className={styling(item.Backend)}>{item.Backend}</span></td>
                        <td onClick={() => toggleFilter(item.Remote)}><span className={styling(item.Remote)}>{item.Remote}</span></td>
                        <td onClick={() => toggleFilter(item.Path)}><span className={styling(item.Path)}>{item.Path}</span></td>
                        <td onClick={() => toggleFilter(String(item.FastList))}><span className={styling(String(item.FastList))}>{String(item.FastList)}</span></td>
                        <td>
                            <ExpandableList
                                items={item.FailedTests ?? []}
                                renderItem={(test, idx) => (
                                    <div key={idx} className={styling(test)} onClick={() => toggleFilter(test)}>{test}</div>
                                )}
                            />
                        </td>
                        <td>
                            {(item.TrialNames || []).map((n, idx) => (
                                <a
                                    key={idx}
                                    href={`https://pub.rclone.org/integration-tests/${selected.DateTime}/${n}`}
                                    style={{ marginRight: "0.2rem" }}
                                    target="_blank"
                                >
                                    #{idx}
                                </a>
                            ))}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
