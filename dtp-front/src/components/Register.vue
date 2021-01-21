<template>
  <div id="login">
    <h1>Register</h1>
    <input type="text" name="username" v-model="input.username" placeholder="Username"/>
    <input type="text" name="email" v-model="input.email" placeholder="Email"/>
    <input type="password" name="password" v-model="input.password" placeholder="Password"/>
    <input type="password" name="passwordAgain" v-model="input.passwordAgain" placeholder="Password Again"/>
    <button type="button" class="loginButton" v-on:click="register()">Register</button>
    <button  type="button" class="loginButton" v-on:click="back">Go Back</button>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      input: {
        email: "",
        username: "",
        password: "",
        passwordAgain: ""
      }
    }
  },
  methods: {
    register() {
      if (this.input.username != "" && this.input.password != "") {
        console.log("register");
      } else {
        console.log("The username and / or password is incorrect");
      }
    },

    back: function () {

      this.$router.push('/login')
    }
  }

}
</script>

<style scoped>
#login {
  width: 500px;
  border: 1px solid #CCCCCC;
  background-color: #FFFFFF;
  margin: auto;
  margin-top: 200px;
  padding: 20px;
}
</style>