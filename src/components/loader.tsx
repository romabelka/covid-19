import React from 'react'

export interface ILoaderProps {
    active: boolean
}

const loaderStyle: any = {
    position: 'fixed',
    top: 0, left: 0,
    right: 0, bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999
}

export const Loader: React.FC<ILoaderProps> = ({ active }) => {
    if (!active) return null;

    return <div style={loaderStyle}>
        <h2 style={{color: '#fff'}}>Running Simulation, it can take a while...</h2>
    </div>
}
