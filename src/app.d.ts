/// <reference types="@sveltejs/kit" />
declare global {
  namespace App {
    interface Locals {
      auth: import("lucia-auth").AuthRequest;
    }

    interface PageData {
      user: import("lucia-auth").User | null;
    }
  }
}

/// <reference types="lucia-auth" />
declare global {
  namespace Lucia {
    type Auth = import("$lib/auth/lucia").Auth;
    type UserAttributes = {
      email: string;
      team_id: string;
      role: import("$lib/auth/roles").Role;
      emailVerified: boolean;
      admin?: boolean;
    };
  }
}

// THIS IS IMPORTANT!!!
export {};
