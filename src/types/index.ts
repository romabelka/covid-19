export interface Person {
    id: string
    age: number
    immune: boolean
    infected: boolean
    hospitalized: boolean
    infectionDay: number
    currentStageDay: number
    infectionsStage: InfectionStage
}

export enum InfectionStage {
    incubation,
    mild,
    severe,
    death,
    healed

}

export interface Virus {
    transmissionChance: () => number
    severeStateChance: (person: Person) => number
    deathChance: (person: Person) => number
    recoverChance: (person: Person) => number
}

export interface VirusCharacteristics {
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


