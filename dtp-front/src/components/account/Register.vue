<template>
  <div id="login">
    <h1>Register</h1>
    <p v-if="error">Invalid something</p>
    <label>
      <input
        type="text"
        name="username"
        v-model="input.username"
        placeholder="Username"
      />
    </label>
    <label>
      <input
        type="text"
        name="email"
        v-model="input.email"
        placeholder="Email"
      />
    </label>
    <label>
      <input
        type="password"
        name="password"
        v-model="input.password"
        placeholder="Password"
      />
    </label>
    <label>
      <input
        type="password"
        name="passwordAgain"
        v-model="input.passwordAgain"
        placeholder="Password Again"
        v-on:keyup.enter="register()"
      />
    </label>
    <button type="button" class="loginButton" v-on:click="register()">
      Register
    </button>
    <button type="button" class="loginButton" v-on:click="back">Go Back</button>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      input: {
        email: "",
        username: "",
        password: "",
        passwordAgain: "",
      },
      error: false,
    };
  },
  methods: {
    register() {
      if (
        this.input.email !== "" &&
        this.input.username !== "" &&
        this.input.password !== "" &&
        this.input.password === this.input.passwordAgain
      ) {
        this.$connection.$emit(this.$network_actions.Register, {
          username: this.input.username,
          email: this.input.email,
          password: this.input.password,
        });
      } else {
        this.error = true;
      }
    },
    back: function() {
      this.$router.push("/");
    },
    onRegister() {
      this.$connection.$emit(this.$network_actions.Login, {
        email: this.input.email,
        password: this.input.password,
      });
    },
    onLogin() {
      this.$router.push("/menu");
    },
    onError() {
      this.error = true;
    },
  },
  created() {
    this.$connection.$on(
      this.$network_events.Register.success,
      this.onRegister
    );
    this.$connection.$on(this.$network_events.Register.error, this.onError);

    this.$connection.$on(this.$network_events.Login.success, this.onLogin);
    this.$connection.$on(this.$network_events.Login.error, this.onError);
  },
  beforeDestroy() {
    this.$connection.$off(
      this.$network_events.Register.success,
      this.onRegister
    );
    this.$connection.$off(this.$network_events.Register.error, this.onError);

    this.$connection.$off(this.$network_events.Login.success, this.onLogin);
    this.$connection.$off(this.$network_events.Login.error, this.onError);
  },
};
</script>

<style scoped>
#login {
  width: 80%;
  max-width: 500px;
  border: 1px solid #cccccc;
  background-color: #ffffff;
  margin: 200px auto auto;
  padding: 20px;
}
</style>
