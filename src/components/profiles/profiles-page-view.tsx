"use client";

import { Button } from "@/components/ui/button";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { PageTitle } from "@/components/ui/page-title";
import { useDialog } from "@/hooks/use-dialog";
import { IconChevronRight, IconPlus, IconUser } from "@tabler/icons-react";
import { ProfileCreateDialog } from "./profile-create-dialog";
import { useProfiles } from "@/queries/profile.queries";
import { Skeleton } from "../ui/skeleton";
import { Card } from "../ui/card";
import { ProfileCardActionsMenu } from "./profile-card-action-menu";
import { isEmpty } from "radash";
import { EmptyState } from "../ui/empty-state";
import Link from "next/link";

const loadingItems = new Array(4).fill("");

export function ProfilesPageView() {
  const [openCreateProfileDialog, openCreateProfileDialogHandlers] =
    useDialog();

  const profiles = useProfiles();

  return (
    <MaxWidthWrapper className="max-w-3xl py-10">
      <div className="w-full">
        <div className="flex items-center justify-between">
          <PageTitle>Profiles</PageTitle>
          <div>
            <Button
              leftIcon={<IconPlus size={16} />}
              onClick={openCreateProfileDialogHandlers.open}
            >
              Create profile
            </Button>
          </div>
        </div>
      </div>

      {profiles?.isLoading && (
        <div className="mt-6 space-y-4">
          {loadingItems.map((_, index) => (
            <Skeleton key={index} className="h-[70px] w-full rounded-xl" />
          ))}
        </div>
      )}

      {!profiles?.isLoading && (
        <>
          {!isEmpty(profiles?.data?.data) && (
            <div className="mt-6 space-y-4">
              {profiles?.data?.data.map((profile) => (
                <Card
                  key={profile.id}
                  className="cursor-pointer p-5 hover:shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <Link href={`/dashboard/${profile.id}`}>
                        <h3 className="text-xl font-semibold">
                          {profile.name}
                        </h3>
                      </Link>
                    </div>
                    <div>
                      <ProfileCardActionsMenu profile={profile} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {isEmpty(profiles?.data?.data) && (
            <div className="mt-6 rounded-xl border border-gray-300 bg-white p-32">
              <EmptyState
                title="No profiles yet"
                subtitle="Get started by creating a new profile."
                icon={<IconUser size={40} />}
                actionButton={
                  <Button
                    leftIcon={<IconPlus size={16} />}
                    onClick={openCreateProfileDialogHandlers.open}
                  >
                    Create profile
                  </Button>
                }
              />
            </div>
          )}
        </>
      )}

      <ProfileCreateDialog
        open={openCreateProfileDialog}
        onClose={openCreateProfileDialogHandlers.close}
      />
    </MaxWidthWrapper>
  );
}
