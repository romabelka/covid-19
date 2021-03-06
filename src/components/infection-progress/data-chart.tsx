import React from 'react'
import {Divider, Table} from 'antd'

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
    severeNotHospitalized: number
    R0: number
}

export interface DataChartProps {
    data: DayData[]
    totals: {
        byAge: ITotals[]
        general: ITotals
    }
    quarantineTime: number
}

export const DataChart: React.FC<DataChartProps> = ({ data, totals, quarantineTime }) => {
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
          <rect width={1} height={height} x={quarantineTime * itemWidth} y={0} fill="black"/>
      </React.Fragment>
    ))

    const {general, byAge} = totals

    return (
        <div>
            <svg width={width} height={height}>
                {days}
            </svg>
            {getLegend(general)}
            {statsByAge(byAge)}
        </div>
    )
}

function statsByAge(data: ITotals[]) {
    const tableData = data.map((totals, ageGroup) => ({
        key: ageGroup,
        total: 100 * totals.total,
        infected: `${100 * totals.infected} (${Math.round(100 * totals.infected / totals.total)}%)`,
        dead: `${100 * totals.dead} (${Math.round(100 * totals.dead / totals.total)}%)`,
        age: `${ageGroup*10}-${ageGroup*10 + 9}`,
        deathRateAll: `${(100 * totals.dead / totals.infected).toFixed(1)}%`,
        deathRateClosed: `${(100 * totals.dead / (totals.dead + totals.healed)).toFixed(1)}%`,
        mildOnly: `${(100 * totals.onlyMildSymptoms / totals.infected).toFixed(1)}%`
    }))

    const columns = [{
        key: 'age',
        title: 'Age Group',
        dataIndex: 'age'
    }, {
        key: 'infected',
        title: 'Infected',
        dataIndex: 'infected'
    }, {
        key: 'dead',
        title: 'Dead',
        dataIndex: 'dead'
    }, {
        key: 'deathRateAll',
        title: 'Mortality, all cases',
        dataIndex: 'deathRateAll'
    }, {
        key: 'deathRateClosed',
        title: 'Mortality, closed cases',
        dataIndex: 'deathRateClosed'
    }, {
        key: 'mildOnly',
        title: 'Mild cases',
        dataIndex: 'mildOnly'
    }]
    return (
        <Table dataSource={tableData} columns={columns}/>
    )
}

function getLegend(data: ITotals) {
    return (
        <>
            <h3 style={{ color: 'black' }}>
                Dead: {100 * data.dead},
                {(100*data.dead/data.infected).toFixed(1)}% Dead/All Cases,
                {(100*data.dead/(data.healed + data.dead)).toFixed(1)}% Dead/Closed Cases,
                R0: {data.R0.toFixed(2)}
            </h3>
            <h3 style={{ color: 'green' }}>Healed: {100 * data.healed}</h3>
            <h3 style={{ color: 'grey'}}>
                Infected: {100 * data.infected}
                ({(100*(data.infected/data.total)).toFixed(1)}%)
            </h3>
            <h3 style={{ color: 'orange'}}>
                Mild symptoms: {100 * data.onlyMildSymptoms}
                ({(100*data.onlyMildSymptoms/data.infected).toFixed(1)}%)
            </h3>
            <h3 style={{ color: 'red'}}>
                Severe symptoms: {100 * data.hadSevereSymptoms}
                ({(100*data.hadSevereSymptoms/data.infected).toFixed(1)}%);
                Not hospitalized: {100 * data.severeNotHospitalized},
                ({(100*data.severeNotHospitalized/data.hadSevereSymptoms).toFixed(1)}%);
            </h3>
            <h3 style={{ color: 'yellow'}}>Incubation</h3>
            <Divider />
            <h3>Total population: {100 * data.total}</h3>
            <h3>Total cases: {100 * data.infected}</h3>
        </>
    )
}
