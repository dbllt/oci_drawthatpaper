<template>
  <div id="login">
    <h1>Login</h1>
    <p v-if="error">Please enter an email and a password</p>
    <input type="text" name="username" v-model="input.email" placeholder="Email"/>
    <input type="password" name="password" v-model="input.password" placeholder="Password"/>
    <button type="button" class="loginButton" v-on:click="login()">Login</button>
    <button type="button" class="loginButton" v-on:click="register()">Register</button>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      input: {
        email: "",
        password: ""
      },
      error: false
    }
  },
  methods: {
    login() {
      if (this.input.email != "" && this.input.password != "") {
        this.$router.push('/menu');

      } else {
        this.error=true;
      }
    },
    register() {
      this.$router.push('/register');
    },
  }

}
</script>

<style>
.loginButton {
  display: block;
  text-align: center;
  border: none;
  background-color: #fed766;
  font-size: 20px;
  margin: 5% auto;
  padding: 2% 5% 2% 5%;
  width: 30%;
  border-radius: 8px;
}

#login {
  width: 500px;
  border: 1px solid #CCCCCC;
  background-color: #FFFFFF;
  margin: auto;
  margin-top: 200px;
  padding: 20px;
}
</style>