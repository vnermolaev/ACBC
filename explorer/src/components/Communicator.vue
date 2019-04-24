<template>
    <v-layout row wrap>
        <v-flex xs8 offset-xs2 class="pt-5">
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
                    :headers="txInfoHeaders"
                    :items="txProperties"
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
import Vue from 'vue'
import Component from 'vue-class-component'

import * as Blockchain from '../api/blockchain'

@Component({})
export default class Communicator extends Vue {
    cypher: string =
        'CREATE (:R {name: "Bldr"})-[:GRANTED {slot: "08:00-20:00"}]->(:D {name: "GenOff"})'
    loading = false
    txInfoHeaders = [
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
    txProperties: { key: string; value: string }[] = []
    keys: Blockchain.KeyPair = {
        publicKey: process.env.VUE_APP_EXONUM_PUBLIC_KEY,
        secretKey: process.env.VUE_APP_EXONUM_PRIVATE_KEY,
    }

    sendTx() {
        this.loading = true
        Blockchain.sendTx(this.cypher, this.keys).then(({ tx_hash }) => {
            this.txProperties = [
                {
                    key: 'Hash',
                    value: tx_hash,
                },
                {
                    key: 'Sender public key',
                    value: this.keys.publicKey,
                },
                {
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
            this.loading = true
        })
    }

    mounted() {
        console.log(process.env)
    }
}
</script>
