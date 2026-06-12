"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  profileSchema,
  passwordSchema,
  type PasswordFormData,
  type ProfileFormData,
} from "@/validations/settings.validation";

type PasswordFormInputs = PasswordFormData;

export function SettingsPanel() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const passwordForm = useForm<PasswordFormInputs>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (session?.user) {
      profileForm.reset({
        name: session.user.name ?? "",
        email: session.user.email ?? "",
      });
    }
  }, [session, profileForm]);

  async function onSaveProfile(data: ProfileFormData) {
    setIsSavingProfile(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        toast.error(result.error || "Failed to update profile.");
        return;
      }
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error("An unexpected error occurred while updating your profile.");
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function onChangePassword(data: PasswordFormInputs) {
    setIsChangingPassword(true);
    try {
      const response = await fetch("/api/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        toast.error(result.error || "Failed to update password.");
        return;
      }
      toast.success("Password changed successfully.");
      passwordForm.reset();
    } catch (error) {
      toast.error("An unexpected error occurred while changing password.");
    } finally {
      setIsChangingPassword(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card className="rounded-3xl border border-border bg-card">
        <CardHeader className="p-6">
          <CardTitle>Profile settings</CardTitle>
          <CardDescription>Manage your account name, email, and personalization settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="grid gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...profileForm.register("name")} />
                {profileForm.formState.errors.name && (
                  <p className="mt-2 text-sm text-destructive">{profileForm.formState.errors.name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...profileForm.register("email")} />
                {profileForm.formState.errors.email && (
                  <p className="mt-2 text-sm text-destructive">{profileForm.formState.errors.email.message}</p>
                )}
              </div>
            </div>
            <Button type="submit" disabled={isSavingProfile}>
              {isSavingProfile ? "Saving profile..." : "Save profile"}
            </Button>
          </form>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-border bg-muted p-5">
              <p className="text-sm font-semibold">Theme</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {['light', 'dark', 'system'].map((option) => (
                  <Button
                    key={option}
                    variant={theme === option ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme(option as 'light' | 'dark' | 'system')}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-border bg-muted p-5">
              <p className="text-sm font-semibold">Account</p>
              <p className="mt-2 text-sm text-muted-foreground">Signed in as {session?.user?.email ?? 'unknown'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border border-border bg-card">
        <CardHeader className="p-6">
          <CardTitle>Security</CardTitle>
          <CardDescription>Change your password and protect your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="grid gap-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="currentPassword">Current password</Label>
                <Input id="currentPassword" type="password" {...passwordForm.register("currentPassword")} />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="mt-2 text-sm text-destructive">{passwordForm.formState.errors.currentPassword.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="newPassword">New password</Label>
                <Input id="newPassword" type="password" {...passwordForm.register("newPassword")} />
                {passwordForm.formState.errors.newPassword && (
                  <p className="mt-2 text-sm text-destructive">{passwordForm.formState.errors.newPassword.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input id="confirmPassword" type="password" {...passwordForm.register("confirmPassword")} />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="mt-2 text-sm text-destructive">{passwordForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
            <Button type="submit" disabled={isChangingPassword}>
              {isChangingPassword ? "Changing password..." : "Change password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border border-border bg-card">
        <CardHeader className="p-6">
          <CardTitle>Usage and quotas</CardTitle>
          <CardDescription>Track your AI usage and plan details.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 p-6 sm:grid-cols-3">
          {[
            { label: "API requests", value: "120" },
            { label: "Content saved", value: "37" },
            { label: "Next reset", value: "30 days" },
          ].map((item) => (
            <div key={item.label} className="rounded-3xl border border-border bg-muted p-4">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold">{item.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
