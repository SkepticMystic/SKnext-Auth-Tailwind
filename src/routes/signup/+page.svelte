<script lang="ts">
  import axios from "axios";
  import TopLabel from "$lib/components/topLabel.svelte";
  import ErrorText from "$lib/components/errorText.svelte";
  import type { AxiosError } from "$lib/interfaces";
  import { getFirstError } from "$lib/utils";

  let email: string;
  let password: string;
  let err = "";

  const signup = async () => {
    try {
      const { data } = await axios.post("/signup", {
        email,
        password,
      });

      console.log(data);
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

<button class="my-4 btn" on:click={async () => await signup()}>Signup</button>
