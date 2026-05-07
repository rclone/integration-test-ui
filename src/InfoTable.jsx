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

// parse DateTime strings of the form "YYYY-MM-DD-HHMMSS" (UTC) into a Date
function parseDateTime(s) {
    if (!s || s.length < 17) return null
    const iso = `${s.slice(0, 10)}T${s.slice(11, 13)}:${s.slice(13, 15)}:${s.slice(15, 17)}Z`
    const d = new Date(iso)
    return isNaN(d) ? null : d
}

function formatRelative(s) {
    const d = parseDateTime(s)
    if (!d) return ""
    const sec = Math.round((Date.now() - d.getTime()) / 1000)
    if (sec < 0) return "in the future"
    const pick = (n, unit) => `${n} ${unit}${n === 1 ? "" : "s"} ago`
    if (sec < 60) return pick(sec, "second")
    const min = Math.floor(sec / 60)
    if (min < 60) return pick(min, "minute")
    const hr = Math.floor(min / 60)
    if (hr < 24) return pick(hr, "hour")
    const day = Math.floor(hr / 24)
    if (day < 30) return pick(day, "day")
    const mon = Math.floor(day / 30)
    if (mon < 12) return pick(mon, "month")
    return pick(Math.floor(day / 365), "year")
}

// display general information about the report
export default function InfoTable() {
    const { selected } = useData()
    if (!selected) return null
    const d = formatDuration(selected.Duration)
    const n = (selected.Failed || []).length
    const p = (selected.Passed || []).length

    return (
        <>
            <h2>{n === 0 ? "PASS" : `FAIL: ${n} tests failed and ${p} passed in ${d}`}</h2>
            <table>
                <tbody>
                    {selected.Version && <tr><td>Version</td><td>{selected.Version}</td></tr>}
                    <tr><td>Test</td><td>{selected.DateTime} ({formatRelative(selected.DateTime)})</td></tr>
                    {selected.Branch && <tr><td>Branch</td><td><a href={`${URL}tree/${selected.Branch}`}>{selected.Branch}</a></td></tr>}
                    {selected.Commit && <tr><td>Commit</td><td><a href={`${URL}commit/${selected.Commit}`}>{selected.Commit}</a></td></tr>}
                    {selected.GoVersion && <tr><td>Go</td><td>{`${selected.GoVersion} ${selected.GOOS}/${selected.GOARCH}`}</td></tr>}
                    <tr><td>Duration</td><td>{d}</td></tr>
                </tbody>
            </table>
        </>
    )
}
