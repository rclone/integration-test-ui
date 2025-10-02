import { createContext, useContext, useState } from 'react';
import index1 from './assets/index.json';
import index2 from './assets/index2.json';
import index3 from './assets/index3.json';
import index4 from './assets/index4.json';
import index5 from './assets/index5.json';
import index6 from './assets/index6.json';

const DataContext = createContext();
const data = [index1, index2, index3, index4, index5, index6];

export function DataProvider({ children }) {
    // gives children of DataProvider access to json
    const [selected, setSelected] = useState(data[data.length - 1])
    return (
        <DataContext.Provider value={{ data, selected, setSelected }}>
            {children}
        </DataContext.Provider>
    )
}

export function useData() {
    return useContext(DataContext)
}
