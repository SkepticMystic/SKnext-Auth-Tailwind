<script lang="ts">
  import { set_href } from "$lib/auth/client";
  import Loading from "$lib/components/Loading.svelte";
  import Label from "$lib/components/label.svelte";
  import { App } from "$lib/utils/app";
  import { getActionErrorMsg } from "$lib/utils/errors";
  import { any_loading, Loader } from "$lib/utils/loader";
  import type { ActionResult } from "@sveltejs/kit";
  import axios from "axios";
  import { toast } from "svelte-daisyui-toast";

  const loader = Loader<"reset-pwd">();

  let newPass: string;
  let confirmPass: string;

  const resetPassword = async () => {
    toast.set([]);

    if (newPass !== confirmPass) {
      return toast.error("Passwords do not match");
    }

    loader.load("reset-pwd");

    try {
      const { data } = await axios.postForm<ActionResult>("", { newPass });

      if (data.type === "success") {
        toast.success("Password changed successfully");

        set_href(App.url("/signin", { previous: "reset-password" }));
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

<form on:submit|preventDefault={resetPassword}>
  <Label lbl="New Password">
    <input
      class="input"
      type="password"
      autocomplete="new-password"
      bind:value={newPass}
    />
  </Label>
  <Label lbl="Confirm Password">
    <input
      class="input"
      type="password"
      autocomplete="new-password"
      bind:value={confirmPass}
    />
  </Label>

  <button
    class="btn btn-primary my-4"
    type="submit"
    disabled={!newPass || !confirmPass || any_loading($loader)}
  >
    <Loading loading={$loader["reset-pwd"]} />
    Reset Password
  </button>
</form>
