import { useData } from "./DataContext"

const URL = "https://github.com/rclone/rclone/"

function formatDuration(ns) {
    if (ns == null) return ""
    const seconds = ns / 1e9
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = (seconds % 60).toFixed(0)

    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}

// display general information about the report
export default function InfoTable() {
    const { selected } = useData()
    const d = formatDuration(selected.Duration)
    const n = selected.Failed.length
    const p = selected.Passed.length

    return (
        <>
            <h2>{n === 0 ? "PASS" : `FAIL: ${n} tests failed and ${p} passed in ${d}`}</h2>
            <table>
                <tbody>
                    <tr><td>Version</td><td>{selected.Version}</td></tr>
                    <tr><td>Test</td><td>{selected.DateTime}</td></tr>
                    <tr><td>Branch</td><td><a href={`${URL}tree/${selected.Branch}`}>{selected.Branch}</a></td ></tr >
                    <tr><td>Commit</td><td>{selected.Commit ? <a href={`${URL}commit/${selected.Commit}`}>{selected.Commit}</a> : "NO COMMIT LISTED"}</td></tr>
                    <tr><td>Go</td><td>{`${selected.GoVersion} ${selected.GOOS}/${selected.GOARCH}`}</td></tr>
                    <tr><td>Duration</td><td>{d}</td></tr>
                </tbody >
            </table >
        </>
    )
}
