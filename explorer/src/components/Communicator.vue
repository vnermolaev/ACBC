<template>
    <v-layout row wrap>
        <v-flex xs10 offset-xs1 class="pt-5">
            <v-card>
                <v-textarea
                    box
                    name="cypher-query"
                    label="Cypher query"
                    value
                    v-model="cypher"
                ></v-textarea>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        class="white--text"
                        color="deep-purple accent-4"
                        depressed
                        center
                        @click="sendTx"
                        >Submit</v-btn
                    >
                </v-card-actions>
            </v-card>
        </v-flex>
        <v-flex xs8 offset-xs2 class="pt-5">
            <v-card>
                <v-data-table
                    :headers="txHeaders"
                    :items="txData"
                    class="elevation-1"
                    hide-actions
                    :loading="loading"
                >
                    <v-progress-linear
                        v-slot:progress
                        color="blue"
                        indeterminate
                    ></v-progress-linear>
                    <template v-slot:items="props">
                        <td>{{ props.item.key }}</td>
                        <td class="text-xs-left">{{ props.item.value }}</td>
                    </template>
                </v-data-table>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

import * as Blockchain from '../api/blockchain'

import { delay } from '../api/convenience'

@Component({})
export default class Communicator extends Vue {
    keys: Blockchain.KeyPair = {
        publicKey: process.env.VUE_APP_EXONUM_PUBLIC_KEY as string,
        secretKey: process.env.VUE_APP_EXONUM_PRIVATE_KEY as string,
    }

    cypher: string =
        'CREATE (:R {name: "Bldr"})-[:GRANTED {slot: "08:00-20:00"}]->(:D {name: "GenOff"})'
    loading = false
    txHeaders = [
        {
            text: 'Transaction information',
            align: 'left',
            sortable: false,
            value: 'name',
        },
        {
            text: '',
            align: 'left',
            sortable: false,
            value: 'name',
        },
    ]

    txData: { key: string; value: string }[] = []

    sendTx() {
        this.loading = true
        Blockchain.sendTx(this.cypher, this.keys)
            .then(({ tx_hash }) => {
                this.txData = [
                    {
                        key: 'Hash',
                        value: tx_hash,
                    },
                    {
                        key: 'Sender public key',
                        value: this.keys.publicKey,
                    },
                    {
                        // HARDCODED, it must be in the 3rd place
                        key: 'Status',
                        value: 'PENDING',
                    },
                    {
                        key: 'Content',
                        value: this.cypher,
                    },
                    {
                        key: 'Error',
                        value: '',
                    },
                ]

                this.cypher = ''
                return tx_hash
            })
            .then(tx_hash => delay(1000, tx_hash))
            .then(tx_hash => Blockchain.getTx(tx_hash))
            .then(value => {
                // console.log(value)

                if (!('status' in value)) {
                    return
                }

                this.txData[2].value = (value.status
                    .type as string).toUpperCase()
                this.txData.push({
                    key: 'Location',
                    value: `Block ${value.location.block_height}`,
                })

                this.loading = false
            })
    }
}
</script>
