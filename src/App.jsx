import InfoTable from './InfoTable'
import DiffTable from './DiffTable'
import FailedTests from './FailedTests'
import TestSelector from './TestSelector'
import { DataProvider } from './DataContext'
import HelpButton from './HelpButton'

export default function App() {
    return (
        <DataProvider>
            <TestSelector />
            <HelpButton />
            <InfoTable />
            <FailedTests />
            <DiffTable />
        </DataProvider>
    )
}
