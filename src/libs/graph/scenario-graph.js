import Graph from 'graph-data-structure'
export const PREFIXES = {
  NEXT: 'next',
  PREV: 'prev',
}
export const createEdges = ({ scenario }) => {
  const { elements } = scenario
  const edges = elements.reduce((allEdges, element) => {
    const { id, bottom } = element
    const edges = bottom.reduce((allBottoms, next) => {
      return [
        ...allBottoms,
        {
          from: `${PREFIXES.NEXT}-${id}`,
          to: next,
        },
        {
          from: `${PREFIXES.PREV}-${next}`,
          to: id,
        },
      ]
    }, [])

    return [...allEdges, ...edges]
  }, [])

  return edges
}

export const createScenarioGraph = ({ scenario }) => {
  const edges = createEdges({ scenario })
  const graph = edges.reduce(
    (graph, { from, to }) => graph.addEdge(from, to),
    Graph(),
  )

  return graph
}
