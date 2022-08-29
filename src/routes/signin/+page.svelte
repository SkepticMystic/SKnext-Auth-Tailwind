<script lang="ts">
  import { set_href } from "$lib/auth/client";
  import ErrorText from "$lib/components/errorText.svelte";
  import Loading from "$lib/components/loading.svelte";
  import TopLabel from "$lib/components/topLabel.svelte";
  import type { AxiosError } from "$lib/interfaces";
  import { getFirstError } from "$lib/utils";
  import axios from "axios";

  let email: string;
  let password: string;
  let err = "";
  let loading = false;

  const signin = async () => {
    loading = true;
    try {
      await axios.post("/signin", {
        email,
        password,
      });

      set_href();
    } catch (error) {
      console.log(error);
      err = getFirstError(<AxiosError>error);
    }
    loading = false;
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

<button class="my-4 btn" on:click={async () => await signin()}>
  <Loading {loading}>Sign in</Loading>
</button>
