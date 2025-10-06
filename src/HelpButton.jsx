import { useState } from "react"

export default function HelpButton() {
    const [open, setOpen] = useState(false)
    return (
        <div className="help-container">
            <button onClick={() => setOpen(!open)}>?</button>
            {open && (

                <div
                    className="help-overlay"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="help-popup"
                        onClick={(e) => e.stopPropagation()}
                    >
                        This page shows the last month of integration test results gathered from
                        <a href="https://pub.rclone.org/integration-tests"> here</a>.
                        <ul>
                            <li>Click a failed test to filter and highlight occurences.</li>
                            <li>Navigate integration test history with tabs or with <kbd>←</kbd> and <kbd>→</kbd> keys.</li>
                            <li>Filters stay active when switching dates.</li>
                            <li>Current filter and date are stored in URL for link sharing.</li>
                            <li>Regressed: passed last run, failed this run.</li>
                            <li>Continued failed: failed both runs.</li>
                            <li>Fixed: failed last run, passed this run.</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    )
}
