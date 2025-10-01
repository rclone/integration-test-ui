import './App.css'
import InfoTable from './InfoTable'
import TestDiffTable from './TestDiffTable'
import FailedTests from './FailedTests'
import TestSelector from './TestSelector'

function App() {
    return (
        <>
            <TestSelector />
            <InfoTable />
            <FailedTests />
            <TestDiffTable />
        </>
    )
}

export default App
