"use client";

import { LoginCard } from "@/features/auth/components/block/LoginCard";
import SectionLayout from "@/shared/components/custom/ui/wrapper/SectionLayout";

export default function LoginPage() {
  return (
    <SectionLayout classname=" w-full min-h-screen relative flex justify-center items-center p-4 bg-landing-gradient">
      <LoginCard />
    </SectionLayout>
  );
}
