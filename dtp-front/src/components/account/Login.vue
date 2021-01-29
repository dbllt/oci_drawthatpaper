<template>
  <div id="login">
    <h1>Login</h1>
    <p v-if="errorEmpty">Please enter an email and a password</p>
    <p v-if="error">Invalid email or password</p>
    <label>
      <input type="text" name="username" v-model="input.email" placeholder="Email"/>
    </label>
    <label>
      <input type="password" name="password" v-model="input.password" placeholder="Password" v-on:keyup.enter="login()"/>
    </label>
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
      errorEmpty: false,
      error: false,
    }
  },
  methods: {
    login() {
      if (this.input.email !== "" && this.input.password !== "") {
        this.$connection.$emit(this.$network_actions.Login, {
          email: this.input.email,
          password: this.input.password,
        });

      } else {
        this.errorEmpty = true;
      }
    },
    register() {
      this.$router.push('/register');
    },
  },
    created: function() {
      this.$connection.$on(this.$network_events.Login.success, () => {
        this.$router.push('/menu');
      });
      this.$connection.$on(this.$network_events.Login.error, () => {
        this.error=true;
      });
    },


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
  min-width: 150px;
  border-radius: 8px;
}

#login {
  width: 80%;
  max-width: 500px;
  border: 1px solid #CCCCCC;
  background-color: #FFFFFF;
  margin: 200px auto auto;
  padding: 20px;
}

#login h1 {
  color: inherit;
}
</style>
