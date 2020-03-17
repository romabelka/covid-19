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
        infected: !!(i % 2),
        infectionsStage: i % 2 ? InfectionStage.incubation : InfectionStage.healthy,
        nextStage: i % 2 ? InfectionStage.mild : InfectionStage.healthy
    }))

const simulation = new Simulation(population, new Covid19(), 100)

function App() {
  return (
    <div>
      <AllInfectedDistribution simulation={simulation}/>
    </div>
  );
}

export default App;
