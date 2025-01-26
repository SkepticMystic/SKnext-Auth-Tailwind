<script lang="ts">
  import { preventDefault } from "svelte/legacy";

  import { page } from "$app/stores";
  import { set_href } from "$lib/auth/client";
  import Loading from "$lib/components/Loading.svelte";
  import Label from "$lib/components/label.svelte";
  import { getActionErrorMsg } from "$lib/utils/errors";
  import { any_loading, Loader } from "$lib/utils/loader";
  import type { ActionResult } from "@sveltejs/kit";
  import axios from "axios";
  import { toast } from "svelte-daisyui-toast";

  const loader = Loader<"signin">();

  const previous = $page.url.searchParams.get("previous");
  const email_hint = $page.url.searchParams.get("email_hint");

  let password = $state("");
  let email: string | undefined = $state(email_hint ?? undefined);

  const signin = async () => {
    loader.load("signin");

    try {
      const { data } = await axios.postForm<ActionResult>("", {
        email,
        password,
      });

      email = password = "";
      toast.success("Sign in successful");

      if (data.type === "redirect") set_href(data.location);
    } catch (error) {
      console.log(error);
      toast.error(getActionErrorMsg(error));
    }

    loader.reset();
  };
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

<form onsubmit={preventDefault(signin)}>
  <Label lbl="Email">
    <input class="input" type="email" autocomplete="email" bind:value={email} />
  </Label>
  <Label lbl="Password">
    <input
      class="input"
      type="password"
      autocomplete="current-password"
      bind:value={password}
    />
  </Label>

  <div class="flex flex-wrap items-center gap-3">
    <button
      class="btn btn-primary my-4"
      type="submit"
      disabled={!email || !password || any_loading($loader)}
    >
      <Loading loading={$loader["signin"]} />
      Sign in
    </button>
  </div>
</form>

<p class="my-3">
  <a class="link" href="/forgot-password">Forgot Password?</a>
</p>
<p class="my-3">
  <a class="link" href="/signup">Don't have an account? Sign up</a>
</p>
