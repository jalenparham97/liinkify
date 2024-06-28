"use client";

import {
  IconDots,
  IconExternalLink,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/hooks/use-dialog";
import Link from "next/link";
import { type ProfileOutput } from "@/types/profile.types";
import { useProfileDeleteMutation } from "@/queries/profile.queries";
import { ProfileDeleteDialog } from "./profile-delete-dialog";
import { useFileDeleteMutation } from "@/queries/storage.queries";

interface Props {
  profile: Pick<ProfileOutput, "id" | "name" | "image" | "username">;
  disabled?: boolean;
}

export function ProfileCardActionsMenu({ profile, disabled = false }: Props) {
  const [openDialog, openDialogHandlers] = useDialog();

  const deleteFileMutation = useFileDeleteMutation();
  const handleDeleteProfile = useProfileDeleteMutation();

  const onDelete = async () => {
    await deleteProfileImage(profile?.image);
    await handleDeleteProfile.mutateAsync({ id: profile?.id });
    openDialogHandlers.close();
  };

  const deleteProfileImage = async (image: string | null | undefined) => {
    if (!image) return;

    const fileKey = image.split("/").pop() as string;

    try {
      return await deleteFileMutation.mutateAsync({ fileKey });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {profile && (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto p-1.5 text-gray-400 data-[state=open]:bg-accent data-[state=open]:text-gray-900"
              >
                <IconDots size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
              <Link href={`/${profile?.username}`}>
                <DropdownMenuItem>
                  <IconExternalLink className="mr-2 h-4 w-4" />
                  <span>Open profile</span>
                </DropdownMenuItem>
              </Link>
              <Link href={`/dashboard/${profile.id}`}>
                <DropdownMenuItem>
                  <IconPencil className="mr-2 h-4 w-4" />
                  <span>Edit profile</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                className="!text-red-500 hover:!bg-red-500/5"
                onClick={openDialogHandlers.open}
                disabled={disabled}
              >
                <IconTrash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ProfileDeleteDialog
            title={profile?.name}
            open={openDialog}
            onClose={openDialogHandlers.close}
            onDelete={onDelete}
            loading={
              deleteFileMutation.isPending || handleDeleteProfile.isPending
            }
          />
        </div>
      )}
    </div>
  );
}
