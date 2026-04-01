import { useState } from 'react'

const MAX = 5

// Shows up to MAX items, with a clickable "N more" to reveal the rest
export default function ExpandableList({ items, renderItem }) {
    const [expanded, setExpanded] = useState(false)
    const visible = expanded ? items : items.slice(0, MAX)
    const hidden = items.length - MAX

    return (
        <>
            {visible.map(renderItem)}
            {!expanded && hidden > 0 && (
                <div className="expand-more" onClick={() => setExpanded(true)}>
                    {hidden} more…
                </div>
            )}
        </>
    )
}
