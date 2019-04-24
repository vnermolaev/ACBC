import axios from 'axios'
import { KeyPair } from './keyPair'

const exonum = require('exonum-client/dist/exonum-client.min.js') as any

const API_URL = '/api/services/neo4j_blockchain/v1'
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

    console.log(`signature ${signature}`)

    queriesMessage.signature = signature
    const hash = queriesMessage.hash(data) as string

    return queriesMessage
        .send(
            `${API_URL}/insert_transaction`,
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
    return axios
        .get(`${API_URL}/transaction?hash_string=${hash}`)
        .then(response => response.data)
}

function getNodeHistory(uuid: string): Promise<any> {
    return axios
        .get(`${API_URL}/node_history?node_uuid=${uuid}`)
        .then(response => response.data)
}

function getBlocks(count: number, latest: number, skipEmpty: boolean): void {
    // let suffix = ''
    // if (!isNaN(parseInt(latest))) {
    //     suffix += '&latest=' + latest
    // }
    // if (skipEmpty) {
    //     suffix += '&skip_empty_blocks=true'
    // }
    // return axios.get(EXPLORER_URL + `blocks?count=${count}${suffix}`).then(response => response.data);
}

function getBlock(height: number): Promise<any> {
    return axios
        .get(`${EXPLORER_URL}block?height=${height}`)
        .then(response => response.data)
}

export { sendTx, getTx, getNodeHistory, getBlocks, getBlock }
