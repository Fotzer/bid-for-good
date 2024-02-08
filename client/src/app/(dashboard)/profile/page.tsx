import { ProfileForm } from "@/components/forms/profile";

export default function ProfilePage() {
  return (
    <div>
      <h3 className="text-2xl font-semibold">Profile</h3>

      <p className="text-muted-foreground mt-2 text-sm">
        Here you can edit your personal details.
      </p>

      <hr className="my-4 max-w-[580px]" />

      <ProfileForm className="max-w-xl" />
    </div>
  );
}
