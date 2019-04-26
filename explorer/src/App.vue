<template>
    <v-app>
        <v-content>
            <v-layout row wrap>
                <v-flex xs2>
                    <v-navigation-drawer permanent>
                        <v-toolbar flat>
                            <v-list>
                                <v-list-tile>
                                    <v-list-tile-title class="title"
                                        >Application</v-list-tile-title
                                    >
                                </v-list-tile>
                            </v-list>
                        </v-toolbar>
                        <v-divider></v-divider>
                        <v-list dense class="pt-0">
                            <v-list-tile
                                v-for="item in items"
                                :key="item.title"
                                @click="$router.push(item.route)"
                            >
                                <v-list-tile-action>
                                    <v-icon>{{ item.icon }}</v-icon>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title>
                                        {{ item.title }}
                                    </v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                    </v-navigation-drawer>
                </v-flex>
                <v-flex xs10>
                    <router-view></router-view>
                </v-flex>
            </v-layout>
        </v-content>
    </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({})
export default class App extends Vue {
    name = 'App'
    items = [
        { title: 'Send query', icon: 'format_quote', route: 'communicator' },
        { title: 'Audit history', icon: 'history', route: 'history' },
    ]
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style>