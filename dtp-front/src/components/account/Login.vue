<template>
  <div class="w3-container  w3-margin-top" >
    <h1 class="w3-center">Login</h1>
    <p v-if="errorEmpty">Please enter an email and a password</p>
    <p v-if="error">Invalid email or password</p>
    <div class="w3-center">
    <label>
      <input
          class="w3-input w3-margin-bottom w3-round-large w3-border"
          type="text"
          name="username"
          v-model="input.email"
          placeholder="Email"
      />
    </label>
    <label>
      <input
          class="w3-input w3-round-large w3-border"
          type="password"
          name="password"
          placeholder="Password"
          v-model="input.password"
          v-on:keyup.enter="login()"
      />
    </label>
    </div>
    <div class="w3-container w3-center">
      <div class="w3-button w3-margin myButton  w3-large w3-theme-yellow " v-on:click="login()">
        Login
      </div>
      <br>
      <div class="w3-button w3-margin myButton w3-large w3-theme-yellow" v-on:click="register()">
        Register
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      input: {
        email: "",
        password: "",
      },
      errorEmpty: false,
      error: false,
    };
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
    logout() {
      this.$connection.$emit(this.$network_actions.Logout);
    },
    register() {
      this.$router.push("/register");
    },
    onLogin() {
      this.$router.push("/menu");
    },
    onError() {
      this.error = true;
    },
  },
  created() {
    this.$connection.$on(this.$network_events.Login.success, this.onLogin);
    this.$connection.$on(this.$network_events.Login.error, this.onError);
  },
  beforeDestroy() {
    this.$connection.$off(this.$network_events.Login.success, this.onLogin);
    this.$connection.$off(this.$network_events.Login.error, this.onError);
  },
};
</script>
