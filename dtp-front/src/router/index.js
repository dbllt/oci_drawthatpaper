import Vue from 'vue'
import VueRouter from 'vue-router'
import MainMenu from "@/components/game/MainMenu";
import Room from "@/components/game/Room";
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
        component: Login
    },
    {
        path: '/room/:id',
        name: 'Room',
        component: Room
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
        component: ExampleUseConnection
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
    base: process.env.BASE_URL,
    routes
})

export default router
