import { useState } from 'react'
import { useData } from './DataContext'
import TestTable from './TestTable'

export default function PassedTests() {
    const { selected } = useData()
    const [visible, setVisible] = useState(false)

    if (!selected) return null
    const passed = selected.Passed || []

    return (
        <>
            <h2>
                Passed Tests: {passed.length}{" "}
                <span className="expand-more" onClick={() => setVisible(v => !v)}>
                    {visible ? "hide" : "show"}
                </span>
            </h2>
            {visible && <TestTable tests={passed} variant="passed" />}
        </>
    )
}
