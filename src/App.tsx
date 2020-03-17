import React from 'react';
import {AllInfectedDistribution} from './components/all-infected-distribution'
import {Simulation} from './simulation/simulation'
import {Covid19} from './simulation/virus'
import {Person} from './simulation/person'
import {InfectionStage} from './types'

const population = Array(10000)
    .fill(0)
    .map((_, i) => new Person({
        age: Math.floor(i / 100),
        infected: true,
        infectionsStage: InfectionStage.incubation,
        nextStage: InfectionStage.mild
    }))

const simulation = new Simulation(population, new Covid19(), 1000)

function App() {
  return (
    <div>
      <AllInfectedDistribution simulation={simulation}/>
    </div>
  );
}

export default App;
