import Vue from 'vue'
import VueRouter from 'vue-router'
import MainMenu from "@/components/MainMenu";
import CreateGame from "@/components/CreateGame";
import JoinGame from "@/components/JoinGame";
import Game from "@/components/Game";
import Login from "@/components/Login";
import Register from "@/components/Register";

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
