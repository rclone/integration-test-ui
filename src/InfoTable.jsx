import data from './assets/index.json'

const keys = ["Version", "DateTime", "Previous", "Commit", "Branch", "Duration"]
const info = {};
for (const k of keys) info[k] = data[k]
info["Go"] = data["GoVersion"] + " " + data["GOOS"] + "/" + data["GOARCH"]

function InfoTable() {
    return (
        <table>
            <tbody>
                {Object.entries(info).map(([k, v]) => (
                    <tr key={k}>
                        <td>{k}</td>
                        <td>{v}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
export default InfoTable
