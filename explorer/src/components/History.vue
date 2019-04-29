<template>
    <v-layout>
        <v-layout row wrap>
            <v-flex xs10 offset-xs1 class="pt-5">
                <v-text-field
                    label="Search"
                    solo
                    clearable
                    append-icon="search"
                    v-model="query"
                    @click:append="search"
                    @keyup.enter="search"
                ></v-text-field>
                <v-divider></v-divider>
                <v-card>
                    <v-card-title primary-title>
                        <div>
                            <h3 class="headline mb-0">
                                Node History {{ shrink(query) }}
                            </h3>
                        </div>
                    </v-card-title>
                    <v-data-table
                        :headers="modificationHeaders"
                        :items="modifications"
                        class="elevation-1"
                        hide-actions
                        :loading="loading.history"
                    >
                        <v-progress-linear
                            v-slot:progress
                            color="blue"
                            indeterminate
                        ></v-progress-linear>
                        <template v-slot:items="props">
                            <td>
                                <v-btn
                                    depressed
                                    small
                                    v-on:click.native="
                                        getTx(props.item.transaction_id)
                                    "
                                    >{{
                                        shrink(props.item.transaction_id)
                                    }}</v-btn
                                >
                            </td>
                            <td
                                class="text-xs-left"
                                v-html="props.item.description"
                            ></td>
                        </template>
                    </v-data-table>
                </v-card>
                <v-divider></v-divider>
                <v-card>
                    <v-card-title primary-title>
                        <div>
                            <h3 class="headline mb-0">
                                Tx {{ shrink(tx_hash) }}
                            </h3>
                        </div>
                    </v-card-title>
                    <v-data-table
                        :items="txData"
                        class="elevation-1"
                        hide-actions
                        :loading="loading.tx"
                    >
                        <v-progress-linear
                            v-slot:progress
                            color="blue"
                            indeterminate
                        ></v-progress-linear>
                        <template v-slot:items="props">
                            <td>{{ props.item.key }}</td>
                            <td class="text-xs-left">
                                {{ props.item.value }}
                            </td>
                        </template>
                    </v-data-table>
                </v-card>
            </v-flex>
        </v-layout>
    </v-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import * as Blockchain from '../api/blockchain'
import { shorten } from '../api/convenience'

@Component({})
export default class History extends Vue {
    shrink(hash: string) {
        return shorten(hash)
    }

    query = ''

    modificationHeaders = [
        {
            text: `Transaction`,
            align: 'left',
            sortable: false,
            value: 'name',
        },
        {
            text: 'Decription',
            align: 'left',
            sortable: false,
            value: 'name',
        },
    ]

    modifications: Blockchain.NodeModification[] = []

    loading = { history: false, tx: false }

    search() {
        this.loading.history = true

        Blockchain.getNodeHistory(this.query).then(history => {
            this.modifications = history.map(m => {
                return {
                    description: m.description.replace(
                        /<b>([a-f0-9_]+)<\/b>/gi,
                        (full, group) => {
                            // console.log(group)
                            return `<b>${shorten(group)}</b>`
                        },
                    ),
                    transaction_id: m.transaction_id,
                } as Blockchain.NodeModification
            })

            this.loading.history = false
        })
    }

    tx_hash = ''

    txData: { key: string; value: string }[] = []

    getTx(tx_hash: string) {
        this.tx_hash = tx_hash
        this.loading.tx = true

        Blockchain.getTx(tx_hash).then(value => {
            // console.log(value)

            this.txData = [
                {
                    key: 'Hash',
                    value: tx_hash,
                },
                {
                    key: 'Sender public key',
                    value: value.content.body.pub_key as string,
                },
                {
                    key: 'Status',
                    value: (value.status.type as string).toUpperCase(),
                },
                {
                    key: 'Content',
                    value: value.content.body.queries as string,
                },
                {
                    key: 'Error',
                    value: '',
                },
                {
                    key: 'Location',
                    value: `Block ${value.location.block_height}`,
                },
            ]

            this.loading.tx = false
        })
    }
}
</script>
