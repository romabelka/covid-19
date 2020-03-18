import React from 'react'
import {Button} from 'antd'

interface ButtonProps {
    dirty: boolean
    update: () => void
}

export const Update: React.FC<ButtonProps> = ({ dirty, update }) => {
    return dirty ? <Button onClick={update} type="primary">Update chart</Button> : null
}