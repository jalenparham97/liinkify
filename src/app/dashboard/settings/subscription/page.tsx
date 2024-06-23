import ManageSubscriptionButton from "@/components/subscription/manage-subscription-button";
import PricingSection from "@/components/subscription/pricing-section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { api } from "@/trpc/server";
import Link from "next/link";

export default async function SettingsSubscriptionPage() {
  const user = await api.user.getUser.call({});
  const products = await api.payment.getProducts.call({});

  const currentPlan = user?.stripePlan ?? "Free";

  return (
    <div>
      <div className="">
        <div>
          <h2 className="text-lg font-semibold leading-7 text-gray-900">
            Subscription
          </h2>
          <p className="mt-1 leading-6 text-gray-600">
            View and edit your billing details, as well as cancel your
            subscription.
          </p>
        </div>

        <div className="mt-6">
          <Card>
            <div>
              <div className="p-6">
                <div>
                  <h2 className="text-lg font-semibold">Current plan</h2>
                  <p className="mt-2 text-gray-600">
                    Your current plan:{" "}
                    <span className="font-semibold capitalize text-gray-900">
                      {currentPlan}
                    </span>
                  </p>
                </div>
              </div>
              <Divider />
              <div className="p-6">
                <ManageSubscriptionButton />
              </div>
            </div>
          </Card>
        </div>

        {!user?.stripePlan && (
          <div className="mt-10">
            <PricingSection products={products} />
          </div>
        )}

        <div className="mt-10">
          <Card>
            <div>
              <div className="p-6">
                <div>
                  <h2 className="text-lg font-semibold">Need anything else?</h2>
                  <p className="mt-2 text-gray-600">
                    If you need any further help with billing, our support team
                    are here to help.
                  </p>
                </div>
              </div>
              <Divider />
              <div className="p-6">
                <a href="mailto:"></a>
                <Link
                  href="mailto:support@formbox.app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline">Contact support</Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
