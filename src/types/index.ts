export interface IPerson {
    id: string
    age: number
    immune: boolean
    infected: boolean
    hospitalized: boolean
    infectionDay: number
    currentStageDay: number
    infectionsStage: InfectionStage
    history: Map<InfectionStage, number>
    nextStage: InfectionStage

    setStage: (stage: InfectionStage) => void
    nextDay: () => void
    heal: () => void
}

export enum InfectionStage {
    healthy,
    incubation,
    mild,
    severe,
    death,
    healed
}

export interface IVirus {
    transmissionChance: () => number
    symptomsStartChance: (person: IPerson) => number
    severeStateChance: (person: IPerson) => number
    deathChance: (person: IPerson) => number
    recoverChance: (person: IPerson) => number
    getNextStage: (person: IPerson) => InfectionStage

    characteristics: IVirusCharacteristics
}

export interface IVirusCharacteristics {
    transmissionChance: number,

    averageIncubationDays: number,
    averageMildToHealDays: number,
    averageMildToSevereDays: number,
    averageSevereToHealDays: number,
    averageSevereToDeathDays: number,

    ageSevereChance: number[],


    ageDeathChance: {
        hospitalized: number[],
        home: number[]
    }
}


