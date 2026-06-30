import AuthComponents from "@/features/auth/components/block/AuthComponents";
import BGAuth from "@/features/auth/components/ui/auth/BGAuth";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-6">
      <BGAuth />

      <div className="w-full max-w-sm">
        <AuthComponents searchParams={searchParams} />
      </div>
    </div>
  );
}
