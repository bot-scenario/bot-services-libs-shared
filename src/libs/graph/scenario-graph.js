import Graph from 'graph-data-structure'
import { v4 } from 'uuid'
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
  generateNextNodesOfNodeExcludeTypeOfUserInputKey,
  generateNextUserInputNodesOfNodeKey,
} from './build-graph-keys.js'
import { NODE_TYPES } from 'botscenario-shared'

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

const buildOptionsNestedLinks = ({ nodesWithOptionLinks }) => {
  return nodesWithOptionLinks
    .map(({ id, links }) =>
      links.map((link) => ({
        from: generateNextNodesOfNodeKey({ id }),
        to: link,
      })),
    )
    .flat()
}

const buildOptionNodes = ({ nodes }) => {
  return nodes
    .filter(({ data }) => data?.options)
    .map(({ data }) => data?.options)
    .flat()
    .filter(({ links }) => links.length)
}
const USER_INPUT_TYPES = Object.freeze({
  [NODE_TYPES.DATA_TYPE_EXPECTED]: NODE_TYPES.DATA_TYPE_EXPECTED,
})
const buildLinksNodeToNextNodesExcludeTypeOfUserInput = ({
  nodeLinkHash,
  nodesHash,
}) => {
  return Object.entries(nodeLinkHash).reduce((allLinks, [id, links]) => {
    return [
      ...allLinks,
      ...links
        .filter((next) => !USER_INPUT_TYPES[nodesHash[next].type])
        .map((next) => ({
          from: generateNextNodesOfNodeExcludeTypeOfUserInputKey({ id }),
          to: next,
        })),
    ]
  }, [])
}

const buildLinksNodeToNextUserInputTypesNode = ({
  nodeLinkHash,
  nodesHash,
}) => {
  return Object.entries(nodeLinkHash).reduce((allLinks, [id, links]) => {
    return [
      ...allLinks,
      ...links
        .filter((next) => USER_INPUT_TYPES[nodesHash[next].type])
        .map((next) => ({
          from: generateNextUserInputNodesOfNodeKey({ id }),
          to: next,
        })),
    ]
  }, [])
}

export const createEdges = ({ nodes }, { stage = 0 }) => {
  const head = nodes.find(({ head }) => head)
  const nodesHash = buildIdToNodeHash({ nodes })
  const nodeLinkHash = buildNodeLinksHash({ nodes })
  const reversedLinksHash = buildNodeLinksHashReversed({ nodes })
  const nodeNextLinks = buildLinksNodeToNextNodes({ nodeLinkHash })
  const nodeNextUserInputNodesLinks = buildLinksNodeToNextUserInputTypesNode({
    nodeLinkHash,
    nodesHash,
  })
  const nodeNextLinksExcludeTypeOfUserInput =
    buildLinksNodeToNextNodesExcludeTypeOfUserInput({ nodeLinkHash, nodesHash })
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
  const nodesWithOptionLinks = buildOptionNodes({ nodes })

  const optionsNestedLinks = buildOptionsNestedLinks({ nodesWithOptionLinks })

  const links = []
    .concat(nodeNextLinks)
    .concat(nodePreviousLinks)
    .concat(nextPairTypeLinks)
    .concat(pairTypeLinksPrevious)
    .concat(bottomLinks)
    .concat(nextTypesLinks)
    .concat(previousTypesLinks)
    .concat(currentNodeTypeLink)
    .concat(optionsNestedLinks)
    .concat(nodeNextLinksExcludeTypeOfUserInput)
    .concat(nodeNextUserInputNodesLinks)
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

export const convertToMessageWithOption = ({
  answerButtons,
  answerButtonNodesHash,
  id,
  answerButtonOtherNodesLinks,
}) => {
  const messageWithOptionFaked = {
    type: NODE_TYPES.MESSAGE_WITH_OPTION,
    id,
    links: [],
    data: {
      label: 'Select option',
      id,
      options: answerButtons.map((answerButton, index) => {
        const {
          data: { label, value, id: optionId, row, col },
        } = answerButtonNodesHash[answerButton]
        const links = answerButtonOtherNodesLinks[answerButton] || []
        return {
          id: optionId,
          links,
          text: label,
          content: label,
          response: value,
          row: row || index,
          col: col || 0,
        }
      }),
    },
  }

  return messageWithOptionFaked
}

export const groupNodes = ({ nodes, graph }) => {
  const answerButtonNodes = nodes.filter(
    ({ type }) => type === NODE_TYPES.ANSWER_BUTTON,
  )
  const otherNodesIds = nodes
    .filter(({ type }) => type !== NODE_TYPES.ANSWER_BUTTON)
    .reduce((ids, { id }) => ({ ...ids, [id]: id }), {})

  const answerButtonOtherNodesLinks = answerButtonNodes.reduce(
    (allLinks, { id, links }) => {
      if (!links?.length) {
        return allLinks
      }
      const linksFiltered = links.filter((link) => otherNodesIds[link])

      if (!linksFiltered.length) {
        return allLinks
      }

      return {
        ...allLinks,
        [id]: linksFiltered,
      }
    },
    {},
  )

  const answerButtonNodesGrouped = answerButtonNodes.reduce((groups, node) => {
    const previousLinks = graph.adjacent(generatePreviousNodesOfNodeKey(node))
    const all = previousLinks.reduce((previous, link) => {
      return {
        ...previous,
        [link]: (previous[link] || []).concat(node.id),
      }
    }, groups)
    return all
  }, {})

  const answerButtonNodesHash = answerButtonNodes.reduce((hash, node) => {
    return {
      ...hash,
      [node.id]: node,
    }
  }, {})

  const messageWithOptionsByAnswerButtons = Object.entries(
    answerButtonNodesGrouped,
  ).map(([id, answerButtons]) => {
    const nid = v4()
    return {
      id,
      answerButtons,
      messageWithOptionFaked: convertToMessageWithOption({
        id: nid,
        answerButtons,
        answerButtonNodesHash,
        answerButtonOtherNodesLinks,
      }),
    }
  })

  const noneAnswerButtonNodes = nodes
    .filter(({ type }) => type !== NODE_TYPES.ANSWER_BUTTON)
    .map((node) => {
      const linksToRemove = answerButtonNodesGrouped[node.id]
      if (!linksToRemove) {
        return node
      }

      const linksReduced = node.links.filter(
        (link) => !linksToRemove.includes(link),
      )

      const { messageWithOptionFaked } = messageWithOptionsByAnswerButtons.find(
        ({ id }) => id === node.id,
      )
      const links = [].concat(linksReduced).concat(messageWithOptionFaked.id)
      return {
        ...node,
        links,
      }
    })

  const messageWithOptions = messageWithOptionsByAnswerButtons.map(
    ({ messageWithOptionFaked }) => {
      return messageWithOptionFaked
    },
  )

  const messageWithOptionsWithLink = messageWithOptions.map(
    (messageWithOption) => {
      const { data } = messageWithOption
      const { options } = data
      const optionsWithLink = options.map((option) => {
        const { messageWithOptionFaked } =
          messageWithOptionsByAnswerButtons.find(
            ({ id }) => id === option.id,
          ) || {}
        const links = option.links || []
        return {
          ...option,
          id: v4(),
          links: messageWithOptionFaked
            ? links.concat(messageWithOptionFaked.id)
            : links,
        }
      })
      return {
        ...messageWithOption,
        data: {
          ...data,
          options: optionsWithLink,
        },
      }
    },
  )

  const enrichedNodes = []
    .concat(noneAnswerButtonNodes)
    .concat(messageWithOptionsWithLink)

  return enrichedNodes
}
