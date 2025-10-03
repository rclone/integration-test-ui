import { ConfigProvider, Tabs } from 'antd';
import { useData } from './DataContext'
import { useEffect } from 'react'

export default function TestSelector() {
    const { data, selected, setSelected } = useData()
    const idx = data.indexOf(selected)

    useEffect(() => {
        const handler = (e) => {
            if (e.key === "ArrowRight") {
                setSelected(data[(idx + 1) % data.length])
            }
            if (e.key === "ArrowLeft") {
                setSelected(data[(idx - 1 + data.length) % data.length])
            }
        }
        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [idx, data, setSelected])

    const items = data.map((d, i) => ({
        label: `${d.DateTime.slice(5, 10)}`,
        key: String(i),
    }))

    return (
        <ConfigProvider
            theme={{
                components: {
                    Tabs: {
                        itemColor: "purple",
                    }
                }
            }}
        >
            <Tabs
                tabPosition="top"
                type="scrollable"
                tabBarGutter={10}
                items={items}
                activeKey={String(data.indexOf(selected))}
                onChange={(key) => setSelected(data[Number(key)])}
                style={{ width: "100%" }}
            />
        </ConfigProvider>
    )
}
