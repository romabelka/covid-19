import React from 'react'

export interface DayData {
    total: number
    incubation: number
    mild: number
    severe: number
    death: number
    healed: number
}

export interface DataChartProps {
    data: DayData[]
}

export const DataChart: React.FC<DataChartProps> = ({ data }) => {
    const width = 1000
    const height = 500
    const itemWidth = Math.floor(width / data.length)

    const normalizedData = data.map(day => ({
        death: day.death / day.total,
        severe: day.severe / day.total,
        mild: day.mild / day.total,
        incubation: day.incubation / day.total,
        healed: day.healed / day.total,
        healthy: (day.total - day.death - day.severe - day.mild - day.incubation - day.healed) /day.total
    }))

    const days = normalizedData.map((day, i) => (
      <React.Fragment key={i}>
          <rect width={itemWidth} height={height * day.healthy} x={i * itemWidth}
                y = {0} fill="grey"/>
          <rect width={itemWidth} height={height * day.healed} x={i * itemWidth}
                y = {day.healthy * height} fill="green"/>
          <rect width={itemWidth} height={height * day.incubation} x={i * itemWidth}
                y = {(day.healthy + day.healed) * height} fill="yellow"/>
          <rect width={itemWidth} height={height * day.mild} x={i * itemWidth}
                y = {(day.healthy + day.healed + day.incubation) * height} fill="orange"/>
          <rect width={itemWidth} height={height * day.severe} x={i * itemWidth}
                y = {(day.healthy + day.healed + day.incubation + day.mild) * height} fill="red"/>
          <rect width={itemWidth} height={height * day.death} x={i * itemWidth}
                y = {(day.healthy + day.healed + day.incubation + day.mild + day.severe) * height} fill="black"/>
      </React.Fragment>
    ))

    return (
        <svg width={width} height={height}>
            {days}
        </svg>
    )
}
