import { useEffect, useMemo, useState } from "react";
import { Loader2, Megaphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type PublicNotice = {
  id: number;
  title: string;
  body: string;
  priority: "low" | "normal" | "high";
  isActive: boolean;
  publishedAt: string | null;
  expiresAt: string | null;
  actionLabel: string | null;
  actionUrl: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

function formatTimestamp(value: string | null | undefined): string {
  if (!value) {
    return "N/A";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString();
}

export default function Notices() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notices, setNotices] = useState<PublicNotice[]>([]);

  useEffect(() => {
    let active = true;

    const fetchNotices = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const res = await fetch("/api/notices");
        if (!res.ok) {
          throw new Error("Unable to load notices");
        }

        const payload = (await res.json()) as PublicNotice[];
        if (active) {
          setNotices(payload);
        }
      } catch (error) {
        if (active) {
          setErrorMessage(error instanceof Error ? error.message : "Unable to load notices");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void fetchNotices();

    return () => {
      active = false;
    };
  }, []);

  const activeCount = useMemo(() => notices.filter((notice) => notice.isActive).length, [notices]);

  return (
    <div className="min-h-screen bg-background pb-24 pt-28">
      <div className="container mx-auto space-y-8 px-4">
        <header className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Customer Notice Board</p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">Latest Announcements</h1>
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              {activeCount} Active
            </Badge>
          </div>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Stay updated with service changes, holiday trading hours, promotions, and important operational updates.
          </p>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : errorMessage ? (
          <Card className="border-destructive/40 bg-destructive/10">
            <CardContent className="pt-6 text-sm text-destructive">{errorMessage}</CardContent>
          </Card>
        ) : notices.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Megaphone className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-lg font-semibold text-foreground">No active notices</p>
              <p className="mt-1 text-sm text-muted-foreground">Check back soon for updates from our team.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => (
              <Card key={notice.id} className="border-border/70 shadow-sm">
                <CardHeader className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardTitle className="text-xl">{notice.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={notice.priority === "high" ? "destructive" : "secondary"}>
                        {notice.priority}
                      </Badge>
                      <Badge variant={notice.isActive ? "default" : "outline"}>
                        {notice.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>
                    Published: {formatTimestamp(notice.publishedAt)} | Updated: {formatTimestamp(notice.updatedAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{notice.body}</p>
                  {notice.actionUrl && (
                    <Button asChild size="sm" className="rounded-full">
                      <a href={notice.actionUrl} target="_blank" rel="noreferrer">
                        {notice.actionLabel || "View details"}
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
