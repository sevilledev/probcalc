import React from 'react'
import sty from '../styles/dock.module.css'


export const Dock = (props) => {
    return (
        <div className={sty.dock}>
            <div className={sty.dockMenu}>
                <h3>≡</h3>
                <h5>Dock</h5>
            </div>

            <div className={sty.dockInput}>
                {props.children}
            </div>
        </div>
    )
}