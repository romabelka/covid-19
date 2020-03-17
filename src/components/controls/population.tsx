import React from 'react'
import {Slider} from 'antd'

interface PopulationProps {
    handlePopulationChange: (group: number, amount: number) => void
    population: number[]
}

export const PopulationControl: React.FC<PopulationProps> = ({ population, handlePopulationChange }) => {
    const sliders = Array(10).fill(0)
        .map((_, group) => (
            <div key={group} style={{ width: '50%'}}>
                <h4>{group*10}-{group*10 + 9}</h4>
                <Slider
                    defaultValue={population[group]}
                    min={0}
                    max={1e4}
                    onAfterChange={(amount) => handlePopulationChange(group, amount as number)}
                />
            </div>
        ))
    return (
        <div>
            {sliders}
        </div>
    )
}
