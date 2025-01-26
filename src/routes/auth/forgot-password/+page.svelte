<script lang="ts">
  import { preventDefault } from "svelte/legacy";

  import Loading from "$lib/components/Loading.svelte";
  import Label from "$lib/components/label.svelte";
  import { getActionErrorMsg } from "$lib/utils/errors";
  import { any_loading, Loader } from "$lib/utils/loader";
  import type { ActionResult } from "@sveltejs/kit";
  import axios from "axios";
  import { toast } from "svelte-daisyui-toast";

  let email = $state("");

  const loader = Loader<"forgot-password">();

  const forgotPassword = async () => {
    loader.load("forgot-password");

    try {
      const { data } = await axios.postForm<ActionResult>("", { email });

      if (data.type === "success") {
        toast.success("Check your email for a link to reset your password.");
      } else {
        toast.warning("There was an error sending the email.");
      }
    } catch (error) {
      console.log(error);
      toast.error(getActionErrorMsg(error));
    }

    loader.reset();
  };
</script>

<form onsubmit={preventDefault(forgotPassword)}>
  <Label lbl="Email">
    <input class="input" type="email" autocomplete="email" bind:value={email} />
  </Label>

  <button
    class="btn btn-primary my-4"
    type="submit"
    disabled={!email || any_loading($loader)}
  >
    <Loading loading={$loader["forgot-password"]} />
    Send Password Reset Email
  </button>
</form>
