import React, {useState, useRef, useLayoutEffect} from 'react'
import {InfectionStage, IPerson, ISimulationHistory} from '../../types'
import {DataChart, ITotals} from './data-chart'
import {InfectionControls, ISimulationData} from './infection-progress-controls'
import {Person} from '../../simulation/person'
import {Simulation} from '../../simulation/simulation'
import {Covid19} from '../../simulation/virus'
import {getRandomSubArray} from '../../simulation/utils'
import {Loader} from '../loader'

export interface AllInfectedDistributionProps {
}

const defaultSimulation: ISimulationData = {
    //Ukraine age population: https://ukrstat.org/uk/druk/publicat/kat_u/2019/zb/07/zb_rpnu2019.pdf page 26
    //'1960529, 2 372 969, 2 147 481, 1 834 598, 2 200 523, 2 886 099, 3 563 993, 3 358 614, 3 069 863, 2 907 414, 2 743 877 , 3 110 494, 2 792 559, 2 389 627, 1 474 886, 1 382 695, 1 787 343'
    //the last to numbers age given as 80+, my split is 1000000 and 787343
    // [4333498, 3982079, 5086622, 6922607, 5977277, 5854371, 5182186, 2857581, 1000000, 787343]
    infectedPopulation: [4333, 3982, 5086, 6922, 5977, 5854, 5182, 2857, 1000, 787],
    //infectedPopulation: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000],
    hospitalBeds: 150,
    travellers: 2,
    days: 400,
    socialContacts: {
        avContactsQuarantine: 1,
        avContactsGeneral: 20,
        quarantineAge: 50,
        quarantineTime: 90
    }
}

export const AllInfectedDistribution: React.FC<AllInfectedDistributionProps> = () => {
    const [calculating, setCalculating] = useState<boolean>(true)
    const [simulationData, setSimulationData] = useState<ISimulationData>(defaultSimulation)
    const lastRunSimulationData = useRef<ISimulationData>(simulationData)

    const [data, setData] = useState<ISimulationHistory[] | null>(null)
    const [totals, setTotals] = useState<any>(null)

    const update = () => setCalculating(true)

    const recalculate = () => {
        if (!calculating) return;

        //todo: I'll move this dirty hack to WebWorker
        setTimeout(() => {
            const population = simulationData.infectedPopulation
                .flatMap((amount, group) =>
                    Array(amount).fill(group * 10 + 5).map(age => new Person({ age }))
                )

            getRandomSubArray(population, 1000).forEach(person => person.infect())

            const simulation = new Simulation(population, new Covid19(), simulationData.hospitalBeds, simulationData.socialContacts);
            (window as any).simulation = simulation

            const nextData = simulation.run(simulationData.days)
            const totals = {
                general: getTotals(simulation.population),
                byAge: Array(10).fill(0).map((_, age) =>
                    getTotals(simulation.population.filter(p => p.age >= age * 10 && p.age < (age + 1) * 10))
                )
            }
            setCalculating(false)
            setData(nextData)
            setTotals(totals)
            lastRunSimulationData.current = simulationData
        })

    }

    useLayoutEffect(recalculate, [calculating])

    return (
        <div>
            <Loader active={calculating}/>
            <h1>Naive Infection Distribution</h1>
            <div style={{ display: 'flex' }}>
            {data && totals && <DataChart data={data} totals={totals} quarantineTime={simulationData.socialContacts.quarantineTime}/>}
            <InfectionControls update={update} simulationData={simulationData} setSimulationData={setSimulationData} />
            </div>
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
        ).length,
        severeNotHospitalized: totalInfected.filter(p => p.severeNotHospitalized).length,
        R0: totalInfected.reduce((acc, p) => acc + p.infectionSpread, 0)/totalInfected.length
    }
}
