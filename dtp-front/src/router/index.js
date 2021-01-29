import Vue from "vue"
import VueRouter from "vue-router"
import MainMenu from "@/components/game/MainMenu";
import Room from "@/components/game/Room";
import JoinGame from "@/components/game/JoinGame";
import Game from "@/components/game/Game";
import Login from "@/components/account/Login";
import Register from "@/components/account/Register";
// import ExampleUseConnection from "@/components/ExampleUseConnection";
import authentication from "@/network/authentication"

Vue.use(VueRouter)

const homeRoute = "Home"

const routes = [{
        path: "/",
        name: homeRoute,
        component: Login
    },
    {
        path: "/room/:id",
        name: "Room",
        component: Room
    },
    {
        path: "/join",
        name: "JoinGame",
        component: JoinGame
    },
    {
        path: "/menu",
        name: "MainMenu",
        component: MainMenu
    },
    // {
    //     path: "/example",
    //     name: "Example",
    //     component: ExampleUseConnection
    // },
    {
        path: "/register",
        name: "Register",
        component: Register
    },
    {
        path: "/game/:id",
        name: "Game",
        component: Game
    }
]

const router = new VueRouter({
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    // Redirect to login page if not logged in
    if (to.name != homeRoute && to.name != "Register" && !authentication.isConnected()) {
        if (from.name == homeRoute) return
        return router.push({
            name: homeRoute
        })
    }

    // Can"t go to login page if logged in
    if (authentication.isConnected() && to.name == homeRoute) {
        if (from.name == "MainMenu") return
        return router.push({
            name: "MainMenu"
        })
    }

    return next()
})

export default router