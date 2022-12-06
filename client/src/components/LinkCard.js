import React from 'react'

export const LinkCard = ({ link }) => {
    return (
        <>
            <h2>Link</h2>

            <p>ur link: <a href={link.to} target = "_blank" rel = "noopener noreferrer">{link.to}</a></p>
            <p>from: <a href={link.from} target = "_blank" rel = "noopener noreferrer">{link.from}</a></p>
            <p>amount clicks: <strong>{link.clicks}</strong></p>
            <p>Date of creating: <strong>{new Date(link.date).toLocaleDateString()}</strong></p>

        </>
    )
}