import React from 'react'
import {Slider} from 'antd'

interface DaysControlProps {
    handleDaysChange: (amount: number) => void
    days: number
}

export const DaysControl: React.FC<DaysControlProps> = ({ days, handleDaysChange }) => {
    return (
        <div>
            <h3>Simulation days:</h3>
            <Slider
                defaultValue={days}
                min={0}
                max={1e3}
                marks={{0: 0, 1000: 1000}}
                onAfterChange={(amount) => handleDaysChange(amount as number)}
            />
        </div>
    )
}
