export default function Logo()
{
    return (
        <div style = {{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600, fontSize: 14 }}>
            <svg width = "22" height = "22" viewBox = "0 0 22 22" aria-hidden = "true">
                <circle cx = "11" cy = "11" r = "9.5" fill = "none" stroke = "currentColor" strokeWidth = "2" />
                <circle cx = "11" cy = "11" r = "3.5" fill = "currentColor" />
            </svg>
            <span>PeerConnect</span>
        </div>
    )
}