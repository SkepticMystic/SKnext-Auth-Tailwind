<script lang="ts">
  import { set_href } from "$lib/auth/client";
  import ErrorText from "$lib/components/errorText.svelte";
  import Label from "$lib/components/label.svelte";
  import Loading from "$lib/components/loading.svelte";
  import type { HTTPError } from "$lib/interfaces";
  import axios from "axios";

  let email: string;
  let password: string;
  let err = "";
  let loading = false;

  const signup = async () => {
    loading = true;
    try {
      await axios.post(
        "/signup",
        new URLSearchParams({
          email,
          password,
        }).toString()
      );

      set_href();
    } catch (error) {
      console.log(error);
      err = (<HTTPError>error).response.data.message;
    }
    loading = false;
  };
</script>

<form on:submit|preventDefault={async () => await signup()}>
  <Label lbl="Email">
    <input class="input" type="email" autocomplete="email" bind:value={email} />
  </Label>
  <Label lbl="Password">
    <input
      class="input"
      type="password"
      autocomplete="new-password"
      bind:value={password}
    />
  </Label>

  <ErrorText {err} />

  <button class="my-4 btn" type="submit">
    <Loading {loading}>Signup</Loading>
  </button>
</form>
