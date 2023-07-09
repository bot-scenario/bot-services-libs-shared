export const generateNextNodesOfNodeKey = ({ id }) => {
  return `next-nodes-of-${id}`
}

export const generatePreviousNodesOfNodeKey = ({ id }) => {
  return `previous-nodes-of-${id}`
}

export const generateNextNodesOfStageKey = ({ stage }) => {
  return `next-nodes-of-stage-${stage}`
}

export const generatePreviousNodesOfStageKey = ({ stage }) => {
  return `previous-nodes-of-stage-${stage}`
}

export const generateNextNodeTypeOfPairKey = ({ id, next }) => {
  return `next-type-of-pair-from-${id}-to-${next}`
}

export const generatePreviousNodeTypeOfPairKey = ({ id, next }) => {
  return `previous-type-of-pair-from-${id}-to-${next}`
}

export const generateNextNodesTypeOfNodeKey = ({ id }) => {
  return `next-types-of-${id}`
}

export const generatePreviousNodesTypeOfNodeKey = ({ id }) => {
  return `previous-types-of-${id}`
}

export const generateNextNodesByFreeTextKey = ({ text }) => {
  return `next-nodes-of-free-text-${text}`
}

export const generateCurrentNodeTypeKey = ({ id }) => {
  return `current-node-type-of-${id}`
}
