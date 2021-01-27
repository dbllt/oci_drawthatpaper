import Vue from 'vue'
import VueRouter from 'vue-router'
import MainMenu from "@/components/game/MainMenu";
import CreateGame from "@/components/game/CreateGame";
import JoinGame from "@/components/game/JoinGame";
import Game from "@/components/game/Game";
import Login from "@/components/account/Login";
import Register from "@/components/account/Register";
import ExampleUseConnection from "@/components/ExampleUseConnection";

Vue.use(VueRouter)

const routes= [
    {
        path: '/',
        name: 'Home',
        component: ExampleUseConnection
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
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
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
