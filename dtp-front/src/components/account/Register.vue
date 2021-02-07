<template>
  <div style="height:100%">
    <div class="w3-container w3-margin-top content">
      <div class="w3-center">
        <h1>Register</h1>

        <div class="w3-margin">
          <b class="w3-text-theme-red" v-if="error">
            {{ errorMsg }}
          </b>
        </div>

        <div class="w3-content" style="width:75%">
          <label>
            <input
              class="w3-input w3-round-large w3-border w3-margin-bottom"
              type="text"
              name="username"
              v-model="input.username"
              placeholder="Username"
            />
          </label>
          <label>
            <input
              class="w3-input w3-round-large w3-border w3-margin-bottom"
              type="text"
              name="email"
              v-model="input.email"
              placeholder="Email"
            />
          </label>
          <label>
            <input
              class="w3-input w3-round-large w3-border w3-margin-bottom"
              type="password"
              name="password"
              v-model="input.password"
              placeholder="Password"
            />
          </label>
          <label>
            <input
              class="w3-input w3-round-large w3-border w3-margin-bottom"
              type="password"
              name="passwordAgain"
              v-model="input.passwordAgain"
              placeholder="Password Again"
              v-on:keyup.enter="register()"
            />
          </label>
        </div>

        <div
          class="w3-button w3-margin myButton w3-theme-yellow w3-large"
          v-on:click="register()"
        >
          Register
        </div>
      </div>
    </div>
    <div class="w3-center">
      <div
        class="w3-button myButton w3-margin-bottom w3-theme-red w3-large"
        v-on:click="back"
      >
        Go Back
      </div>
    </div>
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
      errorMsg: "",
    };
  },
  methods: {
    register() {
      if (
        this.input.username === "" ||
        this.input.email === "" ||
        this.input.password === "" ||
        this.input.passwordAgain === ""
      )
        this.displayError("Please fill all the fields");
      else {
        if (this.input.password !== this.input.passwordAgain)
          this.displayError("The passwords don't match");
        else {
          this.$connection.$emit(this.$network_actions.Register, {
            username: this.input.username,
            email: this.input.email,
            password: this.input.password,
          });
        }
      }
    },
    back: function() {
      this.$router.push("/");
    },
    displayError(errorMsg) {
      this.error = false;
      this.errorMsg = errorMsg;
      this.error = true;
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
    onError(err) {
      this.displayError(err)
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
