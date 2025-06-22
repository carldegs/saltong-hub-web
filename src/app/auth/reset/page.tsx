import { ResetPasswordCard } from "../components/reset-password-card";

export default async function ResetPasswordPage() {
  return (
    <div className="bg-muted flex min-h-screen w-full grid-rows-[auto_1fr] items-center justify-center">
      <ResetPasswordCard />
    </div>
  );
}
