import './App.css'
import InfoTable from './InfoTable'
import DiffTable from './DiffTable'
import FailedTests from './FailedTests'
import TestSelector from './TestSelector'
import { DataProvider } from './DataContext'

export default function App() {
    return (
        <>
            <DataProvider>
                <TestSelector />
                <InfoTable />
                <FailedTests />
                <DiffTable />
            </DataProvider>
        </>
    )
}
