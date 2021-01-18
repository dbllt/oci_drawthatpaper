import Vue from 'vue'
import VueRouter from 'vue-router'
import MainMenu from "@/components/MainMenu";
import CreateGame from "@/components/CreateGame";
import JoinGame from "@/components/JoinGame";


Vue.use(VueRouter)

const routes= [
    {
        path: '/',
        name: 'MainMenu',
        component: MainMenu
    },
    {
        path: '/create',
        name: 'Create',
        component: CreateGame
    },
    {
        path: '/join',
        name: 'Join',
        component: JoinGame
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router