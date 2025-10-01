import data1 from './assets/index.json'
import data2 from './assets/index2.json'

const key = t => `${t.Backend}|${t.Path}|${t.Remote}`;

function failedSet(report) {
    return new Set((report.Failed || []).map(key));
}

function compare(oldReport, newReport) {
    const oldF = failedSet(oldReport);
    const newF = failedSet(newReport);

    const regressed = [...newF].filter(k => !oldF.has(k)); // pass -> fail
    const fixed = [...oldF].filter(k => !newF.has(k)); // fail -> pass
    const continued = [...newF].filter(k => oldF.has(k)); // fail -> fail

    return { regressed, fixed, continued };
}

const { regressed, fixed, continued } = compare(data2, data1)

function createtable(type) {
    return (
        <table>
            <tbody>
                {type.map((k, i) => (
                    <tr key={i}>
                        <td>{k}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

function TestDiffTable() {
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
export default TestDiffTable
