import React from 'react'
import {Slider} from 'antd'
import {multiplier} from '../../simulation/constants'

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
                defaultValue={travellers * multiplier}
                min={0}
                max={10 * multiplier}
                step={multiplier}
                marks={{0: 0, [10 * multiplier]: 10 * multiplier}}
                onAfterChange={(amount) => handleTravellersChange(Math.round(amount as number / multiplier))}
                tooltipVisible
            />
        </div>
    )
}
