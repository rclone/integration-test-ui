import { useState } from 'react'
import { Tooltip } from 'antd'
import { useData } from './DataContext'
import { ignoreKey, ignoreLabel } from './ignored'

const MAX = 8

// tooltip contents for an ignored row
function chipTitle(t, entry) {
    const failed = t.FailedTests ?? []
    return (
        <div>
            {failed.slice(0, 10).map((name, i) => <div key={i}>{name}</div>)}
            {failed.length > 10 && <div>…and {failed.length - 10} more</div>}
            {entry && <div className="chip-meta">Ignored {new Date(entry.at).toLocaleDateString()}</div>}
            <div className="chip-meta">Click to unignore</div>
        </div>
    )
}

// one line of small chips for ignored rows - click a chip to unignore
export default function IgnoredChips({ items }) {
    const { ignored, unignore } = useData()
    const [expanded, setExpanded] = useState(false)
    if (items.length === 0) return null
    const visible = expanded ? items : items.slice(0, MAX)
    const hidden = items.length - visible.length

    return (
        <div className="ignored-chips">
            <span className="ignored-label">Ignored ({items.length}):</span>
            {visible.map(t => {
                const k = ignoreKey(t)
                return (
                    <Tooltip key={k} title={chipTitle(t, ignored[k])} classNames={{ root: "ignored-tooltip" }}>
                        <span className="ignored-chip" role="button" onClick={() => unignore(t)}>
                            {ignoreLabel(t)} <span className="chip-x">✕</span>
                        </span>
                    </Tooltip>
                )
            })}
            {hidden > 0 && (
                <span className="ignored-chip ignored-more" role="button" onClick={() => setExpanded(true)}>
                    +{hidden} more
                </span>
            )}
        </div>
    )
}
