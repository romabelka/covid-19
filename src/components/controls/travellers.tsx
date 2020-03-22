import React from 'react'
import {Slider} from 'antd'

interface TravellersControlProps {
    handleTravellersChange: (amount: number) => void
    travellers: number
}

export const TravellersControl: React.FC<TravellersControlProps> = ({ travellers, handleTravellersChange }) => {
    return (
        <div>
            <h3>Infected Travellers per day:</h3>
            <p>* after quarantine ends</p>
            <Slider
                defaultValue={travellers}
                min={0}
                max={10}
                marks={{0: 0, 10: 10}}
                onAfterChange={(amount) => handleTravellersChange(amount as number)}
            />
        </div>
    )
}
