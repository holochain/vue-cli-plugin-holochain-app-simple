import { Orchestrator } from '@holochain/tryorama'

const orchestrator = new Orchestrator()

require('./thing')(orchestrator)

orchestrator.run()

