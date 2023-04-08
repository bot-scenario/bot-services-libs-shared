import scenario from '../data/scenario-db-data-mock.json' assert { type: 'json' }
import { createScenarioGraph } from '../../src/libs/graph/scenario-graph.js'

const scenarioGraph = createScenarioGraph({ scenario })

console.log(scenarioGraph)
