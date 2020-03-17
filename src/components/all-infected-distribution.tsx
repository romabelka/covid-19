import React from 'react'
import {InfectionStage, ISimulation} from '../types'
import {DataChart} from './data-chart'

export interface AllInfectedDistributionProps {
    simulation: ISimulation
}

export const AllInfectedDistribution: React.FC<AllInfectedDistributionProps> = ({ simulation }) => {
    const { population } = simulation
    const data = []

    for (let day = 0; day < 100; day++) {
        simulation.nextDay();
        data.push({
            total: population.length,
            incubation: population.filter(p => p.infectionsStage === InfectionStage.incubation).length,
            mild: population.filter(p => p.infectionsStage === InfectionStage.mild).length,
            severe: population.filter(p => p.infectionsStage === InfectionStage.severe).length,
            death: population.filter(p => p.infectionsStage === InfectionStage.death).length,
            healed: population.filter(p => p.infectionsStage === InfectionStage.healed).length,
        })
    }

    return (
        <div>
            <h1>Naive Infection Distribution</h1>
            <DataChart data={data}/>
        </div>
    )
}
