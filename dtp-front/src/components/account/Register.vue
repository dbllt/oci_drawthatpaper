<template>
  <div id="login">
    <h1>Register</h1>
    <p v-if="error">Invalid something</p>
    <label>
      <input type="text" name="username" v-model="input.username" placeholder="Username"/>
    </label>
    <label>
      <input type="text" name="email" v-model="input.email" placeholder="Email"/>
    </label>
    <label>
      <input type="password" name="password" v-model="input.password" placeholder="Password"/>
    </label>
    <label>
      <input type="password" name="passwordAgain" v-model="input.passwordAgain" placeholder="Password Again" v-on:keyup.enter="register()"/>
    </label>
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
      },
      error:false,
    }
  },
  methods: {
    register() {
      if (this.input.email !== "" && this.input.username !== "" && this.input.password !== "" && this.input.password === this.input.passwordAgain) {
        this.$connection.$emit(this.$network_actions.Register, {
          username: this.input.username,
          email: this.input.email,
          password: this.input.password
        });
      } else {
        this.error=true;
      }
    },

    back: function () {

      this.$router.push('/')
    },},
    created :function(){

      this.$connection.$on(this.$network_events.Register.success, () => {

        this.$connection.$emit(this.$network_actions.Login, {
          email: this.input.email,
          password: this.input.password,
        });
      });
      this.$connection.$on(this.$network_events.Register.error, () => {
        this.error=true;

      });
      this.$connection.$on(this.$network_events.Login.success, () => {
        this.$router.push('/menu');
      });
      this.$connection.$on(this.$network_events.Login.error, () => {
        this.error=true;
      });
    }


}
</script>

<style scoped>
#login {
  width: 500px;
  border: 1px solid #CCCCCC;
  background-color: #FFFFFF;
  margin: 200px auto auto;
  padding: 20px;
}
</style>