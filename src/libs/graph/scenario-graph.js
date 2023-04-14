import Graph from 'graph-data-structure'
export const PREFIXES = {
  NEXT: 'next',
  PREV: 'prev',
  STAGE: 'stage',
}

const buildLinks = ({ links, id }, { stage }) => {
  const edges = links.reduce(
    (allBottoms, next) => [
      ...allBottoms,
      {
        from: `${PREFIXES.NEXT}-${id}`,
        to: next,
      },
      {
        from: `${PREFIXES.PREV}-${next}`,
        to: id,
      },
      {
        from: `${PREFIXES.STAGE}-${stage}-${PREFIXES.NEXT}`,
        to: next,
      },
      {
        from: `${PREFIXES.STAGE}-${stage}-${PREFIXES.PREV}`,
        to: id,
      },
    ],
    [],
  )
  return edges
}

const recursiveBuildBottoms = ({ head, nodes, stage, list }) => {
  return head.links
    .map((linkId) => nodes.find((el) => el.id === linkId))
    .map((head) =>
      buildHierarchyGraph({
        head,
        stage: stage + 1,
        list,
        nodes,
      }),
    )
}

const buildHierarchyGraph = ({ head, stage = 0, list = [], nodes }) => {
  if (!head?.links?.length) {
    return []
  }

  return buildLinks(head, { stage })
    .concat(recursiveBuildBottoms({ head, nodes, stage, list }))
    .flat()
}
export const createEdges = ({ nodes }, { stage = 0 }) => {
  const head = nodes.find(({ head }) => head)
  const edges = buildHierarchyGraph({
    head,
    nodes,
    stage,
    list: [],
  })

  return edges
}

export const createScenarioGraph = ({ nodes, stage }) => {
  const edges = createEdges({ nodes }, { stage })
  const graph = edges.reduce(
    (graph, { from, to }) => graph.addEdge(from, to),
    Graph(),
  )

  return graph
}
