import { SettingProfileView } from "@/components/settings/settings-profile-view";
import { COMPANY_NAME } from "@/utils/constants";

export const metadata = {
  title: `Settings - ${COMPANY_NAME}`,
};

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function SettingsProfilePage({ searchParams }: Props) {
  return <SettingProfileView searchParams={searchParams} />;
}
