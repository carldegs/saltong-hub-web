"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import {
  LoginActionState,
  loginSchema,
  SignUpActionState,
  signupServerSchema,
} from "./schema";

export async function login(
  from: string,
  prevState: LoginActionState,
  formData: FormData
) {
  const supabase = await createClient();

  const data = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!data.success) {
    return {
      email: "",
      password: "",
      error: "Incorrect email or password",
    };
  }

  const { error } = await supabase.auth.signInWithPassword(data.data);

  if (error) {
    console.error(error);
    return {
      email: "",
      password: "",
      error:
        error.code === "invalid_credentials"
          ? "Incorrect email or password"
          : "An error occurred while logging in. Please try again in a bit.",
    };
  }

  if (from) {
    revalidatePath(from as string, "page");
    redirect(from as string);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(prevState: SignUpActionState, formData: FormData) {
  const supabase = await createClient();

  const data = signupServerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!data.success) {
    return {
      email: "",
      password: "",
      confirmPassword: "",
      errors: {
        ...data.error.flatten().fieldErrors,
        main: [],
      },
    };
  }

  const { error } = await supabase.auth.signUp(data.data);

  if (error) {
    console.error(error);
    return {
      email: "",
      password: "",
      confirmPassword: "",
      errors: {
        email: [],
        password: [],
        confirmPassword: [],
        main: [
          error.code === "invalid_credentials"
            ? "Incorrect email or password"
            : "An error occurred while creating an account. Please try again in a bit.",
        ],
      },
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect("/error");
  }

  redirect("/");
}
