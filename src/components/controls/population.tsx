import React from 'react'
import {Slider} from 'antd'
import {multiplier} from '../../simulation/constants'

interface PopulationProps {
    handlePopulationChange: (group: number, amount: number) => void
    population: number[]
}

export const PopulationControl: React.FC<PopulationProps> = ({ population, handlePopulationChange }) => {
    const sliders = Array(10).fill(0)
        .map((_, group) => (
            <div key={group}>
                <h4>age group: {group*10}-{group*10 + 9}</h4>
                <Slider
                    defaultValue={population[group] * multiplier}
                    min={0}
                    max={10000 * multiplier}
                    marks={{0: 0, [10000 * multiplier]: 10000 * multiplier}}
                    step={multiplier}
                    onAfterChange={(amount) => handlePopulationChange(group, Math.round(amount as number / multiplier))}
                    tooltipVisible
                />
            </div>
        ))
    return (
        <div>
            <h3>Population:</h3>
            {sliders}
        </div>
    )
}
