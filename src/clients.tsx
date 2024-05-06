import { createClient } from "polkadot-api"
import { getSmProvider } from "polkadot-api/sm-provider"
import SmWorker from "polkadot-api/smoldot/worker?worker"
import { startFromWorker } from "polkadot-api/smoldot/from-worker"

const smoldot = startFromWorker(
  new SmWorker()
)

const dotRelayChain = import("polkadot-api/chains/polkadot").then(
  ({ chainSpec }) => smoldot.addChain({ chainSpec })
)


export const polkadotClient = createClient(getSmProvider(dotRelayChain))
