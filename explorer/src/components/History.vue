<template>
    <v-layout>
        <v-layout row wrap>
            <v-flex xs8 offset-xs2 class="pt-5">
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
                    <v-data-table
                        :headers="modificationHeaders"
                        :items="modifications"
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
                            <td>{{ props.item.tx }}</td>
                            <td class="text-xs-left">
                                {{ props.item.description }}
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

@Component({})
export default class History extends Vue {
    query = ''

    modificationHeaders = [
        {
            text: 'Node ~~~',
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
    modifications: { tx: string; description: string }[] = []
    loading = false

    search() {
        this.loading = true

        Blockchain.getNodeHistory(this.query).then(history => {
            console.log(history)

            this.loading = false
        })
    }
}
</script>
