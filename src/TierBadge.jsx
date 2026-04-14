const TIER_INFO = {
    "Tier 1": { label: "T1", desc: "Core — Production-grade, first-class" },
    "Tier 2": { label: "T2", desc: "Stable — Well-supported, minor gaps" },
    "Tier 3": { label: "T3", desc: "Supported — Works for many uses; known caveats" },
    "Tier 4": { label: "T4", desc: "Experimental — Use with care; expect gaps/changes" },
    "Tier 5": { label: "T5", desc: "Deprecated — No longer maintained or supported" },
}

export default function TierBadge({ tier }) {
    if (!tier) return null
    const info = TIER_INFO[tier]
    if (!info) return null
    const cls = `tier-badge tier-${tier.slice(-1)}`
    return (
        <a
            href="https://rclone.org/tiers/"
            target="_blank"
            rel="noopener noreferrer"
            className={cls}
            title={`${tier}: ${info.desc}`}
            onClick={e => e.stopPropagation()}
        >
            {info.label}
        </a>
    )
}
