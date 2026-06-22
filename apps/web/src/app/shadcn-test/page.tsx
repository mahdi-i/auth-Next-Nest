import { Button } from "@/shared/components/shadcn/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/shadcn/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/shared/components/shadcn/dialog";
import { Input } from "@/shared/components/shadcn/input";
import { Skeleton } from "@/shared/components/shadcn/skeleton";

export default function ShadcnTestPage() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col gap-6 p-8">
      <h1 className="text-3xl font-bold">Shadcn Test Page</h1>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Card Component</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input placeholder="Email" />

          <div className="flex gap-2">
            <Button>Primary</Button>
            <Button variant="outline">Outline</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-24 w-full max-w-md" />
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>

        <DialogContent>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Dialog Test</h2>
            <p>Dialog component is working correctly.</p>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
