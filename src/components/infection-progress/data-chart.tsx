import React from 'react'
import {Divider} from 'antd'
import {InfectionStage} from '../../types'

export interface DayData {
    total: number
    incubation: number
    mild: number
    severe: number
    death: number
    healed: number
    hospitalBeds: number
}

export interface ITotals {
    total: number,
    dead: number,
    healed: number,
    infected: number,
    onlyMildSymptoms: number,
    hadSevereSymptoms: number
}

export interface DataChartProps {
    data: DayData[]
    totals: ITotals
}

export const DataChart: React.FC<DataChartProps> = ({ data, totals }) => {
    const width = 1000
    const height = 500
    const itemWidth = Math.floor(width / data.length)

    const normalizedData = data.map(day => ({
        death: day.death / day.total,
        severe: day.severe / day.total,
        mild: day.mild / day.total,
        incubation: day.incubation / day.total,
        healed: day.healed / day.total,
        healthy: (day.total - day.death - day.severe - day.mild - day.incubation - day.healed) /day.total,
        beds: day.hospitalBeds / day.total
    }))

    const days = normalizedData.map((day, i) => (
      <React.Fragment key={i}>
          <rect width={itemWidth} height={height * day.death} x={i * itemWidth}
                y = {0} fill="black"/>
          <rect width={itemWidth} height={height * day.healthy} x={i * itemWidth}
                y = {day.death * height} fill="grey"/>
          <rect width={itemWidth} height={height * day.healed} x={i * itemWidth}
                y = {(day.death + day.healthy) * height} fill="green"/>
          <rect width={itemWidth} height={height * day.incubation} x={i * itemWidth}
                y = {(day.death + day.healthy + day.healed) * height} fill="yellow"/>
          <rect width={itemWidth} height={height * day.mild} x={i * itemWidth}
                y = {(day.death + day.healthy + day.healed + day.incubation) * height} fill="orange"/>
          <rect width={itemWidth} height={height * day.severe} x={i * itemWidth}
                y = {(day.death + day.healthy + day.healed + day.incubation + day.mild) * height} fill="red"/>
          <rect width={itemWidth} height={2}  x={i * itemWidth} y={height - height * day.beds} fill="blue"/>
      </React.Fragment>
    ))

    return (
        <div>
            <svg width={width} height={height}>
                {days}
            </svg>
            <h3 style={{ color: 'black' }}>
                Dead: {totals.dead},
                {(100*totals.dead/totals.infected).toFixed(1)}% Dead/All Cases,
                {(100*totals.dead/(totals.healed + totals.dead)).toFixed(1)}% Dead/Closed Cases,
            </h3>
            <h3 style={{ color: 'green' }}>Healed: {totals.healed}</h3>
            <h3 style={{ color: 'grey'}}>
                Not Infected: {totals.total - totals.infected}
                ({(100*(1 - totals.infected/totals.total)).toFixed(1)}%)
            </h3>
            <h3 style={{ color: 'orange'}}>
                Mild symptoms: {totals.onlyMildSymptoms}
                ({(100*totals.onlyMildSymptoms/totals.infected).toFixed(1)}%)
            </h3>
            <h3 style={{ color: 'red'}}>
                Severe symptoms: {totals.hadSevereSymptoms}
                ({(100*totals.hadSevereSymptoms/totals.infected).toFixed(1)}%)
            </h3>
            <h3 style={{ color: 'yellow'}}>Incubation</h3>
            <Divider />
            <h3>Total population: {totals.total}</h3>
            <h3>Total cases: {totals.infected}</h3>
        </div>
    )
}
