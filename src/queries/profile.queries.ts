import { api } from "@/trpc/react";
import type { ProfileFindInput, ProfilesOutput } from "@/types/profile.types";
import { useRouter } from "next/navigation";
import { isEmpty } from "radash";
import { toast } from "sonner";

type QueryOptions = {
  refetchOnWindowFocus?: boolean;
};

export const useProfiles = () => {
  return api.profiles.getAll.useQuery({ take: 500 });
};

export const useInfiniteProfiles = (
  input: ProfileFindInput,
  initialData?: ProfilesOutput,
) => {
  return api.profiles.getAll.useInfiniteQuery(
    { ...input },
    {
      initialData: () => {
        if (initialData) {
          return {
            pageParams: [undefined],
            pages: [initialData],
          };
        }
      },
      getNextPageParam: (lastPage) => lastPage.cursor || undefined,
    },
  );
};

export const useProfileById = (
  { id }: { id: string },
  options: QueryOptions = { refetchOnWindowFocus: true },
) => {
  return api.profiles.getById.useQuery(
    { id },
    {
      enabled: !isEmpty(id),
      refetchOnWindowFocus: options.refetchOnWindowFocus,
    },
  );
};

export const useProfileAddMutation = () => {
  const router = useRouter();
  const apiUtils = api.useUtils();

  return api.profiles.create.useMutation({
    onMutate: async () => {
      await apiUtils.profiles.getAll.cancel();
      const previousQueryData = apiUtils.profiles.getAll.getInfiniteData();
      return { previousQueryData };
    },
    onSuccess: async (data) => {
      // router.push(`/dashboard/${data.orgId}/profiles/${data.id}/setup`);
    },
    onError: (error, input, ctx) => {
      console.log(error);
      apiUtils.profiles.getAll.setInfiniteData({}, ctx?.previousQueryData);
      toast.error("Error", { description: error.message });
    },
    onSettled: async () => {
      await apiUtils.profiles.getAll.invalidate();
    },
  });
};

export const useProfileUpdateMutation = (
  options: { showToast: boolean; toastMessage: string } = {
    showToast: true,
    toastMessage: "Profile settings updated",
  },
) => {
  const apiUtils = api.useUtils();

  return api.profiles.updateById.useMutation({
    onMutate: async (input) => {
      await apiUtils.profiles.getById.cancel({ id: input.id });
      const previousQueryData = apiUtils.profiles.getById.getData({
        id: input.id,
      });
      return { previousQueryData };
    },
    onSuccess: () => {
      if (options.showToast) {
        return toast.success(options.toastMessage);
      }
    },
    onError: (error, input, ctx) => {
      console.log(error);
      apiUtils.profiles.getById.setData(
        { id: input.id },
        ctx?.previousQueryData,
      );
      toast.error("Error", { description: error.message });
    },
    onSettled: async (data, error, input) => {
      await apiUtils.profiles.getById.invalidate({ id: input.id });
      await apiUtils.profiles.getAll.invalidate();
    },
  });
};

export const useProfileDeleteMutation = () => {
  const apiUtils = api.useUtils();

  return api.profiles.deleteById.useMutation({
    onMutate: async () => {
      await apiUtils.profiles.getAll.cancel();
      const previousQueryData = apiUtils.profiles.getAll.getInfiniteData();
      return { previousQueryData };
    },
    onError: (error, input, ctx) => {
      console.log(error);
      apiUtils.profiles.getAll.setInfiniteData({}, ctx?.previousQueryData);
      toast.error("Error", { description: error.message });
    },
    onSettled: async () => {
      await apiUtils.profiles.getAll.invalidate();
    },
  });
};
