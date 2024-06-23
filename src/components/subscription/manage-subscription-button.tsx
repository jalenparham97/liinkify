"use client";

import { Button } from "@/components/ui/button";
import { useAuthUser } from "@/queries/user.queries";
import { api } from "@/trpc/react";
import { IconExternalLink } from "@tabler/icons-react";

export default function ManageSubscriptionButton() {
  const user = useAuthUser();

  const portalMutation = api.payment.getBillingPortalSession.useMutation();

  const handleGetBillingPortal = async () => {
    const returnUrl = `${window.location.origin}/dashboard/settings/subscription`;
    const { url } = await portalMutation.mutateAsync({
      stripeCustomerId: user?.stripeCustomerId || "",
      returnUrl,
    });
    window?.location.assign(url);
  };

  return (
    <div>
      <Button
        onClick={handleGetBillingPortal}
        leftIcon={<IconExternalLink size={16} />}
        loading={portalMutation.isPending}
        disabled={!user?.stripePlan}
      >
        Billing portal
      </Button>
    </div>
  );
}
