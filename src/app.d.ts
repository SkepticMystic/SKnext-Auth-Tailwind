// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Platform {}
	// interface PrivateEnv {}
	// interface PublicEnv {}
	interface PageData {
		_lucia: import("lucia-sveltekit/types").Session | null;
	}
}

declare namespace Lucia {
	interface UserData {
		email: string
		roles: string[]
	}
}