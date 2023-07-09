import Graph from 'graph-data-structure'
import {
  generateNextNodesOfNodeKey,
  generatePreviousNodesOfNodeKey,
  generateNextNodesOfStageKey,
  generatePreviousNodesOfStageKey,
  generateNextNodeTypeOfPairKey,
  generatePreviousNodeTypeOfPairKey,
  generateNextNodesTypeOfNodeKey,
  generatePreviousNodesTypeOfNodeKey,
  generateCurrentNodeTypeKey,
} from './build-graph-keys.js'

const buildStageLinks = ({ links, id }, { stage }) => {
  const edges = links.reduce(
    (allBottoms, next) => [
      ...allBottoms,
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

const buildLinksNodeToNextNodes = ({ nodeLinkHash }) => {
  return Object.entries(nodeLinkHash).reduce((allLinks, [id, links]) => {
    return [
      ...allLinks,
      ...links.map((next) => ({
        from: generateNextNodesOfNodeKey({ id }),
        to: next,
      })),
    ]
  }, [])
}

const buildLinksNodeToPreviousNodes = ({ reversedLinksHash }) => {
  return Object.entries(reversedLinksHash).reduce((allLinks, [id, links]) => {
    return [
      ...allLinks,
      ...links.map((next) => ({
        from: generatePreviousNodesOfNodeKey({ id }),
        to: next,
      })),
    ]
  }, [])
}

const buildLinksNodeToNextTypeByPair = ({ nodeLinkHash, nodesHash }) => {
  const edges = Object.entries(nodeLinkHash).reduce((allLinks, [id, links]) => {
    return [
      ...allLinks,
      ...links.map((next) => ({
        from: generateNextNodeTypeOfPairKey({ id, next }),
        to: nodesHash[next].type,
      })),
    ]
  }, [])

  return edges
}

const buildLinksNodeToPreviousTypeByPair = ({
  reversedLinksHash,
  nodesHash,
}) => {
  const edges = Object.entries(reversedLinksHash).reduce(
    (allLinks, [id, links]) => {
      return [
        ...allLinks,
        ...links.map((next) => ({
          from: generatePreviousNodeTypeOfPairKey({ id, next }),
          to: nodesHash[next].type,
        })),
      ]
    },
    [],
  )

  return edges
}

const buildLinksToNextTypesByNode = ({ nodesHash }) => {
  const linksToNextTypes = Object.entries(nodesHash)
    .map(([id, { links }]) => ({
      from: generateNextNodesTypeOfNodeKey({ id }),
      to: links.map((id) => nodesHash[id].type),
    }))
    .filter(({ to }) => !!to.length)

  return linksToNextTypes
}

const buildLinksToPreviousTypesByNode = ({ reversedLinksHash, nodesHash }) => {
  const linksToPreviousTypes = Object.entries(reversedLinksHash)
    .map(([id, links]) => ({
      from: generatePreviousNodesTypeOfNodeKey({ id }),
      to: links.map((id) => nodesHash[id].type),
    }))
    .filter(({ to }) => !!to.length)

  return linksToPreviousTypes
}

const buildHierarchyGraph = ({ head, stage = 0 }) => {
  if (!head?.links?.length) {
    return []
  }

  const links = buildStageLinks(head, { stage })
  const linksJoinedBottoms = [].concat(links).flat()
  return linksJoinedBottoms
}

const recursiveBuildStageLinks = ({ head, nodesHash, stage, list }) => {
  return head.links
    .map((linkId) => nodesHash[linkId])
    .map((head) =>
      buildHierarchyGraph({
        head,
        stage: stage + 1,
        list,
        nodesHash,
      }),
    )
    .flat()
}

const buildNodeLinksHash = ({ nodes }) => {
  const nodesReversedHash = nodes.reduce((hash, { id, links }) => {
    if (!links.length) {
      return hash
    }

    return {
      ...hash,
      [id]: links,
    }
  }, {})

  return nodesReversedHash
}

const buildNodeLinksHashReversed = ({ nodes }) => {
  const nodesReversedHash = nodes.reduce((hash, { id, links }) => {
    const objLinks = links.reduce(
      (allLinks, link) => ({
        ...allLinks,
        [link]: (hash[link] || []).concat(id),
      }),
      {},
    )
    return {
      ...hash,
      ...objLinks,
    }
  }, {})

  return nodesReversedHash
}

export const buildIdToNodeHash = ({ nodes }) => {
  const nodesHash = nodes.reduce((hash, node) => {
    return {
      ...hash,
      [node.id]: node,
    }
  }, {})
  return nodesHash
}

const buildLinksToCurrentNodeType = ({ nodesHash }) => {
  const linksToNextTypes = Object.entries(nodesHash)
    .map(([id, { type }]) => ({
      from: generateCurrentNodeTypeKey({ id }),
      to: type,
    }))
    .filter(({ to }) => !!to.length)

  return linksToNextTypes
}

export const createEdges = ({ nodes }, { stage = 0 }) => {
  const head = nodes.find(({ head }) => head)
  const nodesHash = buildIdToNodeHash({ nodes })
  const nodeLinkHash = buildNodeLinksHash({ nodes })
  const reversedLinksHash = buildNodeLinksHashReversed({ nodes })
  const nodeNextLinks = buildLinksNodeToNextNodes({ nodeLinkHash })
  const nodePreviousLinks = buildLinksNodeToPreviousNodes({ reversedLinksHash })
  const nextPairTypeLinks = buildLinksNodeToNextTypeByPair({
    nodeLinkHash,
    nodesHash,
  })

  const pairTypeLinksPrevious = buildLinksNodeToPreviousTypeByPair({
    reversedLinksHash,
    nodesHash,
  })

  const bottomLinks = recursiveBuildStageLinks({
    head,
    nodesHash,
    stage,
    list: [],
  })

  const nextTypesLinks = buildLinksToNextTypesByNode({ nodesHash })

  const previousTypesLinks = buildLinksToPreviousTypesByNode({
    reversedLinksHash,
    nodesHash,
  })

  const currentNodeTypeLink = buildLinksToCurrentNodeType({ nodesHash })

  const links = []
    .concat(nodeNextLinks)
    .concat(nodePreviousLinks)
    .concat(nextPairTypeLinks)
    .concat(pairTypeLinksPrevious)
    .concat(bottomLinks)
    .concat(nextTypesLinks)
    .concat(previousTypesLinks)
    .concat(currentNodeTypeLink)
    .flat()

  return links
}

export const createScenarioGraph = ({ nodes, stage }) => {
  const edges = createEdges({ nodes }, { stage })
  const graph = edges.reduce(
    (graph, { from, to }) => graph.addEdge(from, to),
    Graph(),
  )

  return graph
}
