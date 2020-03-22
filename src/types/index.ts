export interface IPerson {
    id: string
    age: number
    immune: boolean
    infected: boolean
    hospitalized: boolean
    severeNotHospitalized: boolean
    infectionDay: number
    infectionSpread: number
    currentStageDay: number
    infectionsStage: InfectionStage
    history: Map<InfectionStage, number>
    nextStage: InfectionStage

    setStage: (stage: InfectionStage) => void
    nextDay: () => void
    heal: () => void
    infect: () => void
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

export interface ISimulation {
    population: IPerson[]
    virus: IVirus
    day: number
    hospitalBeds: number

    nextDay: () => void
    run: (days: number) => ISimulationHistory[]
}

export interface ISimulationHistory {
    total: number
    incubation: number
    mild: number
    severe: number
    death: number
    healed: number
    hospitalBeds: number
}

export interface ISocialContacts {
    quarantineAge: number
    avContactsGeneral: number,
    avContactsQuarantine: number
    quarantineTime: number
}
