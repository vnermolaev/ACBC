import Vue from 'vue'
import Router from 'vue-router'

import Communicator from '@/components/Communicator.vue'
import History from '@/components/History.vue'

Vue.use(Router)

export default new Router({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/communicator',
            name: 'communicator',
            component: Communicator,
        },
        {
            path: '/history',
            name: 'history',
            component: History,
        },
        { path: '/', redirect: { name: 'communicator' } },
    ],
})
