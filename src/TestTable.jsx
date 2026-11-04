import { useData } from './DataContext'
import ExpandableList from './ExpandableList'
import TierBadge from './TierBadge'
import IgnoredChips from './IgnoredChips'
import { ignoreKey, splitIgnored } from './ignored'

// Reusable table for displaying failed test rows with optional filtering
function matchesFilter(item, filter) {
    return item.Backend === filter || item.Remote === filter || item.Path === filter || String(item.FastList) === filter
        || (item.FailedTests ?? []).includes(filter)
}

// If ignorable is set, ignored rows are shown as chips below the table
// and each row gets a button to ignore it.
export default function TestTable({ tests, variant, ignorable }) {
    const { selected, filter, toggleFilter, backends, ignored, ignore } = useData()
    const styling = (value) => (filter && value === filter ? "selected" : "unselected")
    const matching = filter ? tests.filter(item => matchesFilter(item, filter)) : tests
    const [filtered, ignoredRows] = ignorable ? splitIgnored(matching, ignored) : [matching, []]

    return (
        <>
        <table className={variant ? `table-${variant}` : ""}>
            <thead>
                <tr>
                    <th>Backend</th>
                    <th>Remote</th>
                    <th>Test</th>
                    <th>FastList</th>
                    <th>Failed</th>
                    <th>Logs</th>
                    {ignorable && <th></th>}
                </tr>
            </thead>
            <tbody>
                {filtered.map(item => (
                    <tr key={ignoreKey(item)}>
                        <td onClick={() => toggleFilter(item.Backend)}>
                            <span className={styling(item.Backend)}>{item.Backend}</span>
                            {backends?.get(item.Backend) && <TierBadge tier={backends.get(item.Backend).tier} />}
                        </td>
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
                        {ignorable && (
                            <td className="ignore-cell">
                                <span
                                    className="ignore-btn"
                                    role="button"
                                    title="Ignore until it passes"
                                    onClick={() => ignore(item)}
                                >⊘</span>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
        {ignorable && <IgnoredChips items={ignoredRows} />}
        </>
    )
}
