import Graph from 'graph-data-structure'
import {
  generateNextNodesOfNodeKey,
  generatePreviousNodesOfNodeKey,
  generateNextNodesOfStageKey,
  generatePreviousNodesOfStageKey,
  generateNextNodeTypeOfPairKey,
  generatePreviousNodeTypeOfPairKey,
  generateNextNodesTypeOfNodeKey,
} from './build-graph-keys.js'

const buildLinks = ({ links, id }, { stage }) => {
  const edges = links.reduce(
    (allBottoms, next) => [
      ...allBottoms,
      {
        from: generateNextNodesOfNodeKey({ id }),
        to: next,
      },
      {
        from: generatePreviousNodesOfNodeKey({ id: next }),
        to: id,
      },
      {
        from: generateNextNodesOfStageKey({ stage }),
        to: next,
      },
      {
        from: generatePreviousNodesOfStageKey({ stage }),
        to: id,
      },
    ],
    [],
  )

  return edges
}

const buildLinksToTypeByPair = ({ links, id }, { nodes }) => {
  const edges = links.reduce(
    (allBottoms, next) => [
      ...allBottoms,
      {
        from: generateNextNodeTypeOfPairKey({ id, next }),
        to: nodes[next].type,
      },
      {
        from: generatePreviousNodeTypeOfPairKey({ id, next }),
        to: nodes[id].type,
      },
    ],
    [],
  )

  return edges
}
const buildLinksToNextTypeByNode = ({ links, id }, { nodes }) => {
  const typesEdge = {
    from: generateNextNodesTypeOfNodeKey({ id }),
    to: links.map((id) => nodes[id].type),
  }

  return typesEdge
}

const recursiveBuildBottoms = ({ head, nodes, stage, list }) => {
  return head.links
    .map((linkId) => nodes[linkId])
    .map((head) =>
      buildHierarchyGraph({
        head,
        stage: stage + 1,
        list,
        nodes,
      }),
    )
}

const buildHierarchyGraph = ({ head, nodes, stage = 0, list = [] }) => {
  if (!head?.links?.length) {
    return []
  }

  const links = buildLinks(head, { stage })
  const pairTypeLinks = buildLinksToTypeByPair(head, { nodes })
  const bottomLinks = recursiveBuildBottoms({ head, nodes, stage, list })

  const typeLink = buildLinksToNextTypeByNode(head, { nodes })
  const linksJoinedBottoms = []
    .concat(links)
    .concat(bottomLinks)
    .concat(pairTypeLinks)
    .concat(typeLink)
    .flat()

  return linksJoinedBottoms
}
export const createEdges = ({ nodes, head }, { stage = 0 }) => {
  const edges = buildHierarchyGraph({
    head,
    nodes,
    stage,
    list: [],
  })

  return edges
}

export const createScenarioGraph = ({ nodes, stage }) => {
  const nodesHash = nodes.reduce((hash, node) => {
    return {
      ...hash,
      [node.id]: node,
    }
  }, {})

  const head = nodes.find(({ head }) => head)
  const edges = createEdges({ nodes: nodesHash, head }, { stage })
  const graph = edges.reduce(
    (graph, { from, to }) => graph.addEdge(from, to),
    Graph(),
  )

  return graph
}
