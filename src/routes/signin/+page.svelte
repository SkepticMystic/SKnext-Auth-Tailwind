<script lang="ts">
  import { setLocation } from "$lib/auth/client";
  import ErrorText from "$lib/components/errorText.svelte";
  import TopLabel from "$lib/components/topLabel.svelte";
  import type { AxiosError } from "$lib/interfaces";
  import { getFirstError } from "$lib/utils";
  import axios from "axios";

  let email: string;
  let password: string;
  let err = "";

  const signin = async () => {
    try {
      await axios.post("/signin", {
        email,
        password,
      });

      setLocation();
    } catch (error) {
      console.log(error);
      err = getFirstError(<AxiosError>error);
    }
  };
</script>

<TopLabel label="Email">
  <input class="input" type="email" autocomplete="email" bind:value={email} />
</TopLabel>
<TopLabel label="Password">
  <input
    class="input"
    type="password"
    autocomplete="current-password"
    bind:value={password}
  />
</TopLabel>

<ErrorText {err} />

<button class="my-4 btn" on:click={async () => await signin()}>Signin</button>
