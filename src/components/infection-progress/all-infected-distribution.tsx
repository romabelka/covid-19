import React, {useState} from 'react'
import {InfectionStage, IPerson} from '../../types'
import {DataChart, ITotals} from './data-chart'
import {InfectionControls, ISimulationData} from './infection-progress-controls'
import {Person} from '../../simulation/person'
import {Simulation} from '../../simulation/simulation'
import {Covid19} from '../../simulation/virus'
import {getRandomSubArray} from '../../simulation/utils'

export interface AllInfectedDistributionProps {
}

const defaultSimulation: ISimulationData = {
    infectedPopulation: [1e4, 1e4, 1e4, 1e4, 1e4, 1e4, 1e4, 1e4, 1e4, 1e4],
    hospitalBeds: 1e4
}

export const AllInfectedDistribution: React.FC<AllInfectedDistributionProps> = ({ }) => {
    const [simulationData, setSimulationData] = useState<ISimulationData>(defaultSimulation)

    const population = simulationData.infectedPopulation
        .flatMap((amount, group) =>
            Array(amount).fill(group * 10 + 5).map(age => new Person({ age }))
        )

    getRandomSubArray(population, 100).forEach(person => person.infect())

    const simulation = new Simulation(population, new Covid19(), simulationData.hospitalBeds, 10)

    const data = []

    for (let day = 0; day < 70; day++) {
        simulation.nextDay();
        data.push({
            total: population.length,
            incubation: population.filter(p => p.infectionsStage === InfectionStage.incubation).length,
            mild: population.filter(p => p.infectionsStage === InfectionStage.mild).length,
            severe: population.filter(p => p.infectionsStage === InfectionStage.severe).length,
            death: population.filter(p => p.infectionsStage === InfectionStage.death).length,
            healed: population.filter(p => p.infectionsStage === InfectionStage.healed).length,
            hospitalBeds: simulation.hospitalBeds
        })
    }

    const totals = {
        general: getTotals(simulation.population),
        byAge: Array(10).fill(0).map((_, age) =>
            getTotals(simulation.population.filter(p => p.age >= age * 10 && p.age < (age + 1) * 10))
        )
    }

    return (
        <div>
            <h1>Naive Infection Distribution</h1>
            <DataChart data={data} totals={totals}/>
            <InfectionControls simulationData={simulationData} setSimulationData={setSimulationData} />
        </div>
    )
}


function getTotals(population: IPerson[]): ITotals {
    const totalInfected = population.filter(p => p.infectionsStage !== InfectionStage.healthy)

    return {
        total: population.length,
        dead: population.filter(p => p.infectionsStage === InfectionStage.death).length,
        infected: totalInfected.length,
        healed: population.filter(p => p.infectionsStage === InfectionStage.healed).length,
        onlyMildSymptoms: totalInfected.filter(p =>
            p.history.has(InfectionStage.incubation) && !p.history.get(InfectionStage.severe)
        ).length,
        hadSevereSymptoms: totalInfected.filter(p =>
            p.history.has(InfectionStage.severe) || p.infectionsStage === InfectionStage.severe
        ).length

    }
}
