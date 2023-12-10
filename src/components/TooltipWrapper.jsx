
import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

const TooltipWrapper = ({text, side="bottom", Component, ...props}) => {
  return (
    <Tooltip >
        <TooltipTrigger>
        <Component {...props} />
        </TooltipTrigger>
        <TooltipContent side={side}>{text}</TooltipContent>
    </Tooltip>
  )
}

export default TooltipWrapper
