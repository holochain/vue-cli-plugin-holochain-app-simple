import { Config, InstallAgentsHapps } from '@holochain/tryorama'
import * as _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import * as path from 'path'

const delay = ms => new Promise(r => setTimeout(r, ms))
const simpleDna = path.join(__dirname, '../../../simple.dna.gz')
console.log('simpleDna', simpleDna)

const installation: InstallAgentsHapps = [
  [
    [simpleDna]
  ]
]

const conductorConfig = Config.gen()

module.exports = (orchestrator) => {
  orchestrator.registerScenario('Create a thing', async (s, t) => {
    const [alice] = await s.players([conductorConfig])
    const [[alice_simple_happ]] = await alice.installAgentsHapps(installation)
    const thing = await alice_simple_happ.cells[0].call('simple', 'create_thing', { uuid: uuidv4(), name: 'Test Client 1', location: 'Australia', parent: 'Things' })
    console.log('thing', thing)
    t.notEqual(thing.entryHash, null)
  })
  orchestrator.registerScenario('Create, then list things', async (s, t) => {
    const [alice] = await s.players([conductorConfig])
    const [[alice_simple_happ]] = await alice.installAgentsHapps(installation)
    const thing1 = await alice_simple_happ.cells[0].call('simple', 'create_thing', { uuid: uuidv4(), name: 'Test Client 1', location: 'Australia', parent: 'Things' });
    const thing2 = await alice_simple_happ.cells[0].call('simple', 'create_thing', { uuid: uuidv4(), name: 'Test Client 2', location: 'Australia', parent: 'Things' });
    console.log('thing1', thing1)
    console.log('thing2', thing2)
    const thingList = await alice_simple_happ.cells[0].call('simple', 'list_things', { parent: 'Things' });
    console.log('thingList', thingList)
    t.deepEqual(thingList.things.length, 2)
  })
  orchestrator.registerScenario('Create then delete a thing', async (s, t) => {
    const [alice] = await s.players([conductorConfig])
    const [[alice_simple_happ]] = await alice.installAgentsHapps(installation)
    const thing = await alice_simple_happ.cells[0].call('simple', 'create_thing', { uuid: uuidv4(), name: 'Test Client 1', location: 'Australia', parent: 'Things' });
    console.log('thing', thing)
    const deletedClient = await alice_simple_happ.cells[0].call('simple', 'delete_thing', thing);
    console.log('deletedClient', deletedClient)
    const thingList = await alice_simple_happ.cells[0].call('simple', 'list_things', { parent: 'Things' });
    console.log('thingList', thingList)
    t.deepEqual(thingList.things.length, 0)
  })
}
