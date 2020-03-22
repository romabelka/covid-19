import React from 'react'
import {Button} from 'antd'

interface ButtonProps {
    update: () => void
}

export const Update: React.FC<ButtonProps> = ({ update }) => {
    return <Button onClick={update} type="primary">Run Simulation</Button>
}
