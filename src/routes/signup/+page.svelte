<script lang="ts">
  import { set_href } from "$lib/auth/client";
  import ResultText from "$lib/components/resultText.svelte";
  import Label from "$lib/components/label.svelte";
  import { getActionErrorMsg } from "$lib/utils/errors";
  import axios from "axios";
  import { getProps } from "$lib/utils";

  let email: string;
  let password: string;
  let { err, loading, suc } = getProps();

  const signup = async () => {
    loading = true;
    err = suc = "";

    try {
      await axios.postForm("", {
        email,
        password,
      });

      email = password = "";
      suc = "Sign up successful";
      set_href();
    } catch (error) {
      console.log(error);
      err = getActionErrorMsg(error);
    }
    loading = false;
  };

  $: if (email || password) err = "";
</script>

<form on:submit|preventDefault={signup}>
  <Label lbl="Email">
    <input
      class="input input-sm"
      class:input-err={err}
      class:input-success={suc}
      type="email"
      autocomplete="email"
      bind:value={email}
    />
  </Label>
  <Label lbl="Password">
    <input
      class="input input-sm"
      class:input-err={err}
      class:input-success={suc}
      type="password"
      autocomplete="new-password"
      bind:value={password}
    />
  </Label>

  <button
    class="my-4 btn btn-primary"
    class:loading
    type="submit"
    disabled={!email || !password || loading}
  >
    Signup
  </button>

  <ResultText {err} />

  <p class="my-3">
    <a class="link" href="/forgot-password">Forgot Password?</a>
  </p>
</form>
