import Vue from 'vue'
import VueRouter from 'vue-router'
import MainMenu from "@/components/MainMenu";
import CreateGame from "@/components/CreateGame";
import JoinGame from "@/components/JoinGame";
import Home from "@/views/Home";
import Game from "@/components/Game";


Vue.use(VueRouter)

const routes= [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/create',
        name: 'CreateGame',
        component: CreateGame
    },
    {
        path: '/join',
        name: 'JoinGame',
        component: JoinGame
    },
    {
        path: '/menu',
        name: 'MainMenu',
        component: MainMenu
    },
    {
        path: '/game/:id',
        name: 'Game',
        component: Game
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router