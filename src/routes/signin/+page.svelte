<script lang="ts">
  import { page } from "$app/stores";
  import { set_href } from "$lib/auth/client";
  import Label from "$lib/components/label.svelte";
  import ResultText from "$lib/components/resultText.svelte";
  import { getProps } from "$lib/utils";
  import { getActionErrorMsg } from "$lib/utils/errors";
  import type { ActionResult } from "@sveltejs/kit";
  import axios from "axios";

  const emailHint = $page.url.searchParams.get("email_hint");
  const previous = $page.url.searchParams.get("previous");

  let email: string | undefined = emailHint ?? undefined;
  let password: string;
  let { err, loading, suc } = getProps();

  const signin = async () => {
    (loading = true), (err = suc = "");

    try {
      const { data } = await axios.postForm<ActionResult>("", {
        email,
        password,
      });

      email = password = "";
      suc = "Sign in successful";
      if (data.type === "redirect") set_href(data.location);
    } catch (error) {
      console.log(error);
      err = getActionErrorMsg(error);
    }

    loading = false;
  };

  $: if (email || password) err = suc = "";
</script>

{#if previous === "team-invite"}
  <p class="my-3 text-success">
    Team invite accepted, please sign in to continue.
  </p>
{:else if previous === "reset-password"}
  <p class="my-3 text-success">
    Password reset successful, please sign in to continue.
  </p>
{/if}

<form on:submit|preventDefault={signin}>
  <Label lbl="Email">
    <input
      class="input"
      class:input-error={err}
      class:input-success={suc}
      type="email"
      autocomplete="email"
      bind:value={email}
    />
  </Label>
  <Label lbl="Password">
    <input
      class="input"
      class:input-error={err}
      class:input-success={suc}
      type="password"
      autocomplete="current-password"
      bind:value={password}
    />
  </Label>

  <div class="flex flex-wrap gap-3 items-center">
    <button
      class="my-4 btn btn-primary"
      class:loading
      type="submit"
      disabled={!email || !password || loading}
    >
      Sign in
    </button>

    <ResultText {err} />
  </div>
</form>

<p class="my-3">
  <a class="link" href="/forgot-password">Forgot Password?</a>
</p>
<p class="my-3">
  <a class="link" href="/signup">Don't have an account? Sign up</a>
</p>
