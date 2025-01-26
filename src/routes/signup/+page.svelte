<script lang="ts">
  import { preventDefault } from "svelte/legacy";

  import { page } from "$app/stores";
  import { set_href } from "$lib/auth/client";
  import Label from "$lib/components/label.svelte";
  import Loading from "$lib/components/Loading.svelte";
  import { getActionErrorMsg } from "$lib/utils/errors";
  import { any_loading, Loader } from "$lib/utils/loader";
  import type { ActionResult } from "@sveltejs/kit";
  import axios from "axios";
  import { toast } from "svelte-daisyui-toast";

  const loader = Loader<"signup">();

  const team_token = $page.url.searchParams.get("team_token");
  const email_hint = $page.url.searchParams.get("email_hint");

  let password = $state("");
  let email: string | undefined = $state(email_hint ?? undefined);

  const signup = async () => {
    toast.set([]);
    loader.load("signup");

    try {
      const { data } = await axios.postForm<ActionResult>("", {
        email,
        password,
      });

      if (data.type === "redirect") {
        email = password = "";
        toast.success("Sign up successful");
        set_href(data.location);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error(getActionErrorMsg(error));
    }

    loader.reset();
  };
</script>

{#if team_token}
  <p class="my-3">
    You've been invited to join a team. Please signup to continue.
  </p>
{/if}

<form onsubmit={preventDefault(signup)}>
  <Label lbl="Email">
    <input
      class="input"
      type="email"
      autocomplete="email"
      disabled={!!email_hint}
      bind:value={email}
    />
  </Label>
  <Label lbl="Password">
    <input
      class="input"
      type="password"
      autocomplete="new-password"
      bind:value={password}
    />
  </Label>

  <div class="flex flex-wrap items-center gap-3">
    <button
      class="btn btn-primary my-4"
      type="submit"
      disabled={!email || !password || any_loading($loader)}
    >
      <Loading loading={$loader["signup"]} />
      Signup
    </button>
  </div>
</form>

<p class="my-3">
  <a class="link" href="/signin">Sign in instead</a>
</p>
