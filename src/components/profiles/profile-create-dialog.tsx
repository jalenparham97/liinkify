"use client";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  type DialogProps,
} from "../ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { type ProfileCreateFields } from "@/types/profile.types";
import { profileCreateSchema } from "@/utils/schemas";
import { useProfileAddMutation } from "@/queries/profile.queries";
import { useDebouncedState } from "@/hooks/use-debounced-state";
import { api } from "@/trpc/react";
import { useState } from "react";
import Image from "next/image";
import { useFileUploadUrlMutation } from "@/queries/storage.queries";
import { useAuthUser } from "@/queries/user.queries";
import { nanoid } from "@/libs/nanoid";
import { env } from "@/env";
import { AlertError } from "../ui/alert-error";

interface Props extends DialogProps {
  onClose: () => void;
}

export function ProfileCreateDialog({ open, onClose }: Props) {
  const [username, setUsername] = useDebouncedState("", 250);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewImgUrl, setPreviewImgUrl] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileCreateFields>({
    resolver: zodResolver(profileCreateSchema),
  });

  const user = useAuthUser();

  const usernameCheck = api.profiles.checkUsername.useQuery({ username });

  const profileAddMutation = useProfileAddMutation();
  const uploadUrlMutation = useFileUploadUrlMutation();

  const closeModal = () => {
    clearError();
    setUsername("");
    reset();
    onClose();
  };

  const onSubmit = async (data: ProfileCreateFields) => {
    clearError();
    let image = "";
    if (file) {
      image = await handleFileUpload(file);
    }
    await profileAddMutation.mutateAsync({ ...data, image });
    closeModal();
  };

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    setFile(file);
    setPreviewImgUrl(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setFile(null);
    setPreviewImgUrl("");
  };

  const clearError = () => {
    setError("");
  };

  const handleFileUpload = async (file: File) => {
    const fileKey = `${user?.id}_${nanoid()}_${file.name}`;
    const { uploadUrl } = await uploadUrlMutation.mutateAsync({
      fileKey,
    });
    if (uploadUrl) {
      try {
        await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": "multiport/formdata" },
          body: file,
        });
        return `${env.NEXT_PUBLIC_R2_PUBLIC_BUCKET_URL}/${fileKey}`;
      } catch (error) {
        setError("Something went wrong!");
      }
    }
    return "";
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new profile</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="mt-4">
            <AlertError message={error} />
          </div>
        )}

        <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div className="w-full">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Profile username
              </label>
              <div className="mt-1.5 flex w-full rounded-lg shadow-sm">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
                  liinkify.com/
                </span>
                <Input
                  id="username"
                  {...register("username")}
                  onChange={(event) => setUsername(event.currentTarget.value)}
                  allowAutoComplete={false}
                  className="block w-full flex-1 rounded-none rounded-r-lg border-0 lowercase"
                  classNames={{ root: "w-full" }}
                  placeholder="username"
                  error={errors.username !== undefined}
                />
              </div>
              {errors.username !== undefined && (
                <p className="mt-1 text-sm text-red-500">
                  {errors?.username?.message}
                </p>
              )}
              {username && usernameCheck.data?.isUsernameTaken && (
                <p className="mt-1 text-sm text-red-500">
                  The username <strong>{username.toLowerCase()}</strong> is
                  already taken.
                </p>
              )}
              {username && !usernameCheck.data?.isUsernameTaken && (
                <p className="mt-1 text-sm text-green-500">
                  The username <strong>{username.toLowerCase()}</strong> is
                  available.
                </p>
              )}
              {username && usernameCheck.isPending && (
                <p className="mt-1 text-sm text-gray-500">
                  Checking availability...
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Profile image
              </label>
              <div>
                {previewImgUrl && (
                  <div className="mt-1.5 flex items-center space-x-4">
                    <Image
                      width={100}
                      height={100}
                      src={previewImgUrl}
                      alt="Profile image"
                      className="rounded-xl"
                    />

                    <Button variant="outline" onClick={removeImage}>
                      Change image
                    </Button>
                  </div>
                )}
                {!previewImgUrl && (
                  <label>
                    <div className="mt-1.5 inline-block">
                      <span
                        tabIndex={0}
                        className="inline-flex h-9 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border border-gray-300 bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                      >
                        Upload an image
                      </span>
                    </div>
                    <input
                      hidden
                      type="file"
                      accept="image/png,image/jpeg"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        handleFileChange(file);
                      }}
                    />
                  </label>
                )}
              </div>
            </div>

            <Input
              label="Profile name"
              {...register("name")}
              allowAutoComplete={false}
              error={errors.name !== undefined}
              errorMessage={errors?.name?.message}
            />
            <Textarea
              label="Profile bio"
              {...register("bio")}
              error={errors.bio !== undefined}
              errorMessage={errors?.bio?.message}
            />
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={closeModal} type="button">
              Close
            </Button>
            <Button loading={isSubmitting} type="submit">
              Create profile
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
