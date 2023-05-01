/// <reference types="@sveltejs/kit" />
declare namespace App {
  type Locals = import("lucia-auth").AuthRequest;
}

/// <reference types="lucia-auth" />
declare namespace Lucia {
  type Auth = import("$lib/auth/lucia").Auth;
  type UserAttributes = {
    email: string;
    role: import("$lib/auth/roles").Role;
    emailVerified: boolean;
    admin?: boolean;
  };
}
