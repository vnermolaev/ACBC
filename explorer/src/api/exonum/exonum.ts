import axios from 'axios'
import { KeyPair } from './keyPair'

const exonum = require('exonum-client/dist/exonum-client.js') as any

const SERVICE_URL = '/api/services/neo4j_blockchain/v1'
const EXPLORER_URL = '/api/explorer/v1'

const PROTOCOL_VERSION = 0
const SERVICE_ID = 144
const TX_INSERT_QUERIES_ID = 0

const ATTEMPTS = 0
const ATTEMPT_TIMEOUT = 500

const queriesMessage = exonum.newMessage({
    protocol_version: PROTOCOL_VERSION,
    service_id: SERVICE_ID,
    message_id: TX_INSERT_QUERIES_ID,
    fields: [
        { name: 'queries', type: exonum.String },
        { name: 'datetime', type: exonum.String },
        { name: 'pub_key', type: exonum.PublicKey },
    ],
})

function sendTx(query: string, keyPair: KeyPair): Promise<{ tx_hash: string }> {
    const data = {
        queries: query,
        datetime: Date.now().toString(),
        pub_key: keyPair.publicKey,
    }

    const signature = queriesMessage.sign(keyPair.secretKey, data)

    queriesMessage.signature = signature
    const hash = queriesMessage.hash(data) as string

    // console.log(`Sending to\n${SERVICE_URL}/insert_transaction`)
    // console.log(queriesMessage)
    // console.log(data)

    return queriesMessage
        .send(
            `${SERVICE_URL}/insert_transaction`,
            `${EXPLORER_URL}/transactions?hash=`,
            data,
            signature,
            ATTEMPTS,
            ATTEMPT_TIMEOUT,
        )
        .then(() => {
            return { tx_hash: hash }
        })
}

function getTx(hash: string): Promise<any> {
    const url = `${EXPLORER_URL}/transactions?hash=${hash}`
    // console.log(`Getting ${url}`)
    return axios.get(url).then(response => response.data)
}

export interface NodeModification {
    transaction_id: string
    description: string
}

function getNodeHistory(uuid: string): Promise<NodeModification[]> {
    const url = `${SERVICE_URL}/node_history?node_uuid=${uuid}`
    // console.log(url)
    return axios.get(url).then(response => response.data)
}

export { sendTx, getTx, getNodeHistory }
