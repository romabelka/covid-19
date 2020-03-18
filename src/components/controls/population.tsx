import React from 'react'
import {Slider} from 'antd'

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
                    defaultValue={population[group]}
                    min={0}
                    max={1e4}
                    marks={{0: 0, 10000: 10000}}
                    onAfterChange={(amount) => handlePopulationChange(group, amount as number)}
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
