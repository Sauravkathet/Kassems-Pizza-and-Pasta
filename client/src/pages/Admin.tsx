import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Loader2, LogOut, Megaphone, RefreshCcw, Save, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import type { KitchenOrder, OrderStatus } from "@shared/schema";

type AdminSession = {
  username: string;
  expiresAt: string;
};

type AdminDashboardSummary = {
  counts: {
    menuItems: number;
    categories: number;
    orders: number;
    activeNotices: number;
    cateringInquiries: number;
  };
  recentOrders: KitchenOrder[];
};

type AdminCategory = {
  id: number;
  name: string;
  slug: string;
  sortOrder: number;
  items: AdminMenuItem[];
};

type AdminMenuItem = {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  price: string | number;
  imageUrl: string;
  isPopular: boolean;
  isVegetarian: boolean;
  isSpicy: boolean;
};

type AdminCategoryRow = {
  id: number;
  name: string;
  slug: string;
  sortOrder: number;
};

type AdminNotice = {
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

type AdminCateringInquiry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  guestCount: number;
  message: string | null;
  createdAt: string | null;
};

type MenuDraft = {
  categoryId: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  isPopular: boolean;
  isVegetarian: boolean;
  isSpicy: boolean;
};

type NewMenuDraft = MenuDraft;

type NoticeDraft = {
  title: string;
  body: string;
  priority: "low" | "normal" | "high";
  isActive: boolean;
  publishedAt: string;
  expiresAt: string;
  actionLabel: string;
  actionUrl: string;
};

const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "accepted",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
];

function formatTimestamp(value: string | null | undefined): string {
  if (!value) {
    return "N/A";
  }

  const timestamp = new Date(value);
  if (Number.isNaN(timestamp.getTime())) {
    return value;
  }

  return timestamp.toLocaleString();
}

function toPriceInputValue(value: string | number): string {
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) {
    return "0.00";
  }
  return numeric.toFixed(2);
}

function toDatetimeLocalValue(value: string | null | undefined): string {
  if (!value) {
    return "";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  const hour = String(parsed.getHours()).padStart(2, "0");
  const minute = String(parsed.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

function fromDatetimeLocalValue(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed.toISOString();
}

function createMenuDraft(item: AdminMenuItem): MenuDraft {
  return {
    categoryId: item.categoryId,
    name: item.name,
    description: item.description,
    price: toPriceInputValue(item.price),
    imageUrl: item.imageUrl ?? "",
    isPopular: item.isPopular,
    isVegetarian: item.isVegetarian,
    isSpicy: item.isSpicy,
  };
}

function createNoticeDraft(notice: AdminNotice): NoticeDraft {
  return {
    title: notice.title,
    body: notice.body,
    priority: notice.priority,
    isActive: notice.isActive,
    publishedAt: toDatetimeLocalValue(notice.publishedAt),
    expiresAt: toDatetimeLocalValue(notice.expiresAt),
    actionLabel: notice.actionLabel ?? "",
    actionUrl: notice.actionUrl ?? "",
  };
}

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [session, setSession] = useState<AdminSession | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const [dashboard, setDashboard] = useState<AdminDashboardSummary | null>(null);
  const [menuCategories, setMenuCategories] = useState<AdminCategory[]>([]);
  const [categoryRows, setCategoryRows] = useState<AdminCategoryRow[]>([]);
  const [menuDrafts, setMenuDrafts] = useState<Record<number, MenuDraft>>({});
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [orderStatusDrafts, setOrderStatusDrafts] = useState<Record<number, OrderStatus>>({});
  const [notices, setNotices] = useState<AdminNotice[]>([]);
  const [noticeDrafts, setNoticeDrafts] = useState<Record<number, NoticeDraft>>({});
  const [cateringInquiries, setCateringInquiries] = useState<AdminCateringInquiry[]>([]);

  const [savingMenuItemId, setSavingMenuItemId] = useState<number | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [savingNoticeId, setSavingNoticeId] = useState<number | null>(null);
  const [deletingNoticeId, setDeletingNoticeId] = useState<number | null>(null);
  const [creatingMenuItem, setCreatingMenuItem] = useState(false);
  const [creatingNotice, setCreatingNotice] = useState(false);

  const [newMenuDraft, setNewMenuDraft] = useState<NewMenuDraft>({
    categoryId: 0,
    name: "",
    description: "",
    price: "0.00",
    imageUrl: "",
    isPopular: false,
    isVegetarian: false,
    isSpicy: false,
  });

  const [newNoticeDraft, setNewNoticeDraft] = useState<NoticeDraft>({
    title: "",
    body: "",
    priority: "normal",
    isActive: true,
    publishedAt: "",
    expiresAt: "",
    actionLabel: "",
    actionUrl: "",
  });

  const adminFetchJson = useCallback(
    async <T,>(url: string, init?: RequestInit): Promise<T> => {
      const headers = new Headers(init?.headers ?? {});
      if (init?.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }

      const response = await fetch(url, {
        ...init,
        headers,
        credentials: "include",
      });

      if (response.status === 401) {
        setLocation("/admin/login");
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payload?.message ?? `Request failed (${response.status})`);
      }

      if (response.status === 204) {
        return undefined as T;
      }

      return (await response.json()) as T;
    },
    [setLocation],
  );

  const mapMenuDrafts = useCallback((categoriesPayload: AdminCategory[]) => {
    const draftMap: Record<number, MenuDraft> = {};
    for (const category of categoriesPayload) {
      for (const item of category.items) {
        draftMap[item.id] = createMenuDraft(item);
      }
    }
    return draftMap;
  }, []);

  const mapNoticeDrafts = useCallback((noticesPayload: AdminNotice[]) => {
    const draftMap: Record<number, NoticeDraft> = {};
    for (const notice of noticesPayload) {
      draftMap[notice.id] = createNoticeDraft(notice);
    }
    return draftMap;
  }, []);

  const mapOrderStatusDrafts = useCallback((orderPayload: KitchenOrder[]) => {
    return orderPayload.reduce<Record<number, OrderStatus>>((map, order) => {
      map[order.id] = order.status;
      return map;
    }, {});
  }, []);

  const loadAdminData = useCallback(
    async (showRefreshIndicator: boolean) => {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      }

      try {
        const [dashboardPayload, categoriesPayload, categoryRowsPayload, noticesPayload, ordersPayload, cateringPayload] =
          await Promise.all([
            adminFetchJson<AdminDashboardSummary>("/api/admin/dashboard"),
            adminFetchJson<AdminCategory[]>("/api/admin/menu"),
            adminFetchJson<AdminCategoryRow[]>("/api/admin/categories"),
            adminFetchJson<AdminNotice[]>("/api/admin/notices"),
            adminFetchJson<KitchenOrder[]>("/api/admin/orders"),
            adminFetchJson<AdminCateringInquiry[]>("/api/admin/catering"),
          ]);

        setDashboard(dashboardPayload);
        setMenuCategories(categoriesPayload);
        setCategoryRows(categoryRowsPayload);
        setNotices(noticesPayload);
        setOrders(ordersPayload);
        setCateringInquiries(cateringPayload);

        setMenuDrafts(mapMenuDrafts(categoriesPayload));
        setNoticeDrafts(mapNoticeDrafts(noticesPayload));
        setOrderStatusDrafts(mapOrderStatusDrafts(ordersPayload));

        setNewMenuDraft((previous) => {
          if (previous.categoryId > 0) {
            return previous;
          }
          return {
            ...previous,
            categoryId: categoryRowsPayload[0]?.id ?? 0,
          };
        });
      } finally {
        if (showRefreshIndicator) {
          setIsRefreshing(false);
        }
      }
    },
    [adminFetchJson, mapMenuDrafts, mapNoticeDrafts, mapOrderStatusDrafts],
  );

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      setIsBootstrapping(true);
      setPageError(null);

      try {
        const sessionPayload = await adminFetchJson<AdminSession>("/api/admin/session");
        if (!active) {
          return;
        }

        setSession(sessionPayload);
        await loadAdminData(false);
      } catch (error) {
        if (!active) {
          return;
        }
        if (error instanceof Error && error.message === "Unauthorized") {
          return;
        }
        setPageError(error instanceof Error ? error.message : "Unable to load admin dashboard");
      } finally {
        if (active) {
          setIsBootstrapping(false);
        }
      }
    };

    void bootstrap();

    return () => {
      active = false;
    };
  }, [adminFetchJson, loadAdminData]);

  const totalMenuItems = useMemo(
    () => menuCategories.reduce((total, category) => total + category.items.length, 0),
    [menuCategories],
  );

  const handleLogout = async () => {
    try {
      await adminFetchJson<void>("/api/admin/logout", {
        method: "POST",
      });
      setLocation("/admin/login");
    } catch (error) {
      toast({
        title: "Logout failed",
        description: error instanceof Error ? error.message : "Unable to sign out",
        variant: "destructive",
      });
    }
  };

  const handleMenuDraftChange = (itemId: number, key: keyof MenuDraft, value: MenuDraft[keyof MenuDraft]) => {
    setMenuDrafts((previous) => ({
      ...previous,
      [itemId]: {
        ...previous[itemId],
        [key]: value,
      },
    }));
  };

  const handleMenuImageUpload = (itemId: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const encoded = typeof reader.result === "string" ? reader.result : "";
      handleMenuDraftChange(itemId, "imageUrl", encoded);
    };
    reader.readAsDataURL(file);
  };

  const saveMenuItem = async (itemId: number) => {
    const draft = menuDrafts[itemId];
    if (!draft) {
      return;
    }

    setSavingMenuItemId(itemId);
    try {
      await adminFetchJson(`/api/admin/menu-items/${itemId}`, {
        method: "PATCH",
        body: JSON.stringify({
          categoryId: draft.categoryId,
          name: draft.name,
          description: draft.description,
          price: Number(draft.price),
          imageUrl: draft.imageUrl,
          isPopular: draft.isPopular,
          isVegetarian: draft.isVegetarian,
          isSpicy: draft.isSpicy,
        }),
      });

      toast({
        title: "Menu item updated",
        description: "Changes were saved successfully.",
      });

      await loadAdminData(false);
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Unable to save menu item",
        variant: "destructive",
      });
    } finally {
      setSavingMenuItemId(null);
    }
  };

  const handleNewMenuImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const encoded = typeof reader.result === "string" ? reader.result : "";
      setNewMenuDraft((previous) => ({
        ...previous,
        imageUrl: encoded,
      }));
    };
    reader.readAsDataURL(file);
  };

  const createMenuItem = async () => {
    if (newMenuDraft.categoryId <= 0) {
      toast({
        title: "Select a category",
        description: "Pick a category before creating a new menu item.",
        variant: "destructive",
      });
      return;
    }

    setCreatingMenuItem(true);
    try {
      await adminFetchJson("/api/admin/menu-items", {
        method: "POST",
        body: JSON.stringify({
          categoryId: newMenuDraft.categoryId,
          name: newMenuDraft.name,
          description: newMenuDraft.description,
          price: Number(newMenuDraft.price),
          imageUrl: newMenuDraft.imageUrl,
          isPopular: newMenuDraft.isPopular,
          isVegetarian: newMenuDraft.isVegetarian,
          isSpicy: newMenuDraft.isSpicy,
        }),
      });

      toast({
        title: "Menu item created",
        description: "The new menu item is now available.",
      });

      setNewMenuDraft((previous) => ({
        ...previous,
        name: "",
        description: "",
        price: "0.00",
        imageUrl: "",
        isPopular: false,
        isVegetarian: false,
        isSpicy: false,
      }));

      await loadAdminData(false);
    } catch (error) {
      toast({
        title: "Create failed",
        description: error instanceof Error ? error.message : "Unable to create menu item",
        variant: "destructive",
      });
    } finally {
      setCreatingMenuItem(false);
    }
  };

  const handleNoticeDraftChange = (
    noticeId: number,
    key: keyof NoticeDraft,
    value: NoticeDraft[keyof NoticeDraft],
  ) => {
    setNoticeDrafts((previous) => ({
      ...previous,
      [noticeId]: {
        ...previous[noticeId],
        [key]: value,
      },
    }));
  };

  const saveNotice = async (noticeId: number) => {
    const draft = noticeDrafts[noticeId];
    if (!draft) {
      return;
    }

    setSavingNoticeId(noticeId);
    try {
      await adminFetchJson(`/api/admin/notices/${noticeId}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: draft.title,
          body: draft.body,
          priority: draft.priority,
          isActive: draft.isActive,
          publishedAt: fromDatetimeLocalValue(draft.publishedAt),
          expiresAt: fromDatetimeLocalValue(draft.expiresAt) ?? null,
          actionLabel: draft.actionLabel || null,
          actionUrl: draft.actionUrl || null,
        }),
      });

      toast({
        title: "Notice updated",
        description: "Notice changes have been saved.",
      });

      await loadAdminData(false);
    } catch (error) {
      toast({
        title: "Notice update failed",
        description: error instanceof Error ? error.message : "Unable to update notice",
        variant: "destructive",
      });
    } finally {
      setSavingNoticeId(null);
    }
  };

  const createNotice = async () => {
    setCreatingNotice(true);
    try {
      await adminFetchJson("/api/admin/notices", {
        method: "POST",
        body: JSON.stringify({
          title: newNoticeDraft.title,
          body: newNoticeDraft.body,
          priority: newNoticeDraft.priority,
          isActive: newNoticeDraft.isActive,
          publishedAt: fromDatetimeLocalValue(newNoticeDraft.publishedAt),
          expiresAt: fromDatetimeLocalValue(newNoticeDraft.expiresAt) ?? null,
          actionLabel: newNoticeDraft.actionLabel || null,
          actionUrl: newNoticeDraft.actionUrl || null,
        }),
      });

      toast({
        title: "Notice created",
        description: "Notice is now available in the public notice board.",
      });

      setNewNoticeDraft({
        title: "",
        body: "",
        priority: "normal",
        isActive: true,
        publishedAt: "",
        expiresAt: "",
        actionLabel: "",
        actionUrl: "",
      });

      await loadAdminData(false);
    } catch (error) {
      toast({
        title: "Create notice failed",
        description: error instanceof Error ? error.message : "Unable to create notice",
        variant: "destructive",
      });
    } finally {
      setCreatingNotice(false);
    }
  };

  const deleteNotice = async (noticeId: number) => {
    setDeletingNoticeId(noticeId);
    try {
      await adminFetchJson(`/api/admin/notices/${noticeId}`, {
        method: "DELETE",
      });

      toast({
        title: "Notice deleted",
        description: "Notice was removed successfully.",
      });

      await loadAdminData(false);
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Unable to delete notice",
        variant: "destructive",
      });
    } finally {
      setDeletingNoticeId(null);
    }
  };

  const updateOrderStatus = async (orderId: number) => {
    const status = orderStatusDrafts[orderId];
    if (!status) {
      return;
    }

    setUpdatingOrderId(orderId);
    try {
      await adminFetchJson(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      toast({
        title: "Order updated",
        description: `Order #${orderId} status changed to ${status.replaceAll("_", " ")}.`,
      });

      await loadAdminData(false);
    } catch (error) {
      toast({
        title: "Order update failed",
        description: error instanceof Error ? error.message : "Unable to update order",
        variant: "destructive",
      });
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const deleteDeliveredOrder = async (orderId: number) => {
    setUpdatingOrderId(orderId);
    try {
      await adminFetchJson(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
      });

      toast({
        title: "Delivered order deleted",
        description: `Order #${orderId} has been deleted.`,
      });

      await loadAdminData(false);
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Unable to delete order",
        variant: "destructive",
      });
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100/70 via-background to-slate-100/40 pb-10 pt-6 sm:pt-8">
      <div className="container mx-auto max-w-7xl space-y-5 px-4 sm:space-y-6">
        <header className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card/95 p-4 shadow-sm sm:p-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Kassems Admin Console</p>
            <h1 className="text-3xl font-bold text-foreground">Operations Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Signed in as <span className="font-semibold text-foreground">{session?.username ?? "Admin"}</span>
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
            <Button
              type="button"
              variant="outline"
              onClick={() => void loadAdminData(true)}
              disabled={isRefreshing}
              className="w-full sm:w-auto"
            >
              {isRefreshing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing
                </>
              ) : (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Refresh
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={handleLogout} className="w-full sm:w-auto">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>

        {pageError && (
          <Card className="border-destructive/40 bg-destructive/10">
            <CardContent className="pt-6 text-sm text-destructive">{pageError}</CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="flex h-auto w-full justify-start gap-1.5 overflow-x-auto rounded-xl border border-border/60 bg-card p-1.5">
            <TabsTrigger value="overview" className="shrink-0 rounded-lg px-3 py-2 text-xs sm:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="menu" className="shrink-0 rounded-lg px-3 py-2 text-xs sm:text-sm">Menu Control</TabsTrigger>
            <TabsTrigger value="orders" className="shrink-0 rounded-lg px-3 py-2 text-xs sm:text-sm">Order Control</TabsTrigger>
            <TabsTrigger value="notices" className="shrink-0 rounded-lg px-3 py-2 text-xs sm:text-sm">Notice Control</TabsTrigger>
            <TabsTrigger value="catering" className="shrink-0 rounded-lg px-3 py-2 text-xs sm:text-sm">Catering</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Menu Items</CardDescription>
                  <CardTitle className="text-3xl">{dashboard?.counts.menuItems ?? totalMenuItems}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Categories</CardDescription>
                  <CardTitle className="text-3xl">{dashboard?.counts.categories ?? categoryRows.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Orders</CardDescription>
                  <CardTitle className="text-3xl">{dashboard?.counts.orders ?? 0}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Active Notices</CardDescription>
                  <CardTitle className="text-3xl">{dashboard?.counts.activeNotices ?? 0}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Catering Inquiries</CardDescription>
                  <CardTitle className="text-3xl">{dashboard?.counts.cateringInquiries ?? 0}</CardTitle>
                </CardHeader>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Recent Orders</CardTitle>
                <CardDescription>Live operational snapshot of latest customer orders.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {dashboard?.recentOrders?.length ? (
                  dashboard.recentOrders.map((order) => (
                    <div key={order.id} className="rounded-lg border border-border/70 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-semibold text-foreground">Order #{order.id}</p>
                          <p className="text-xs text-muted-foreground">{order.customerName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{order.status.replaceAll("_", " ")}</Badge>
                          <span className="text-sm font-semibold text-primary">${order.totalAmount}</span>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">{formatTimestamp(order.createdAt)}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No recent orders yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menu" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Create Menu Item</CardTitle>
                <CardDescription>Add a new menu item and publish it instantly.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <select
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                      value={newMenuDraft.categoryId}
                      onChange={(event) =>
                        setNewMenuDraft((previous) => ({
                          ...previous,
                          categoryId: Number(event.target.value),
                        }))
                      }
                    >
                      {categoryRows.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={newMenuDraft.name}
                      onChange={(event) =>
                        setNewMenuDraft((previous) => ({
                          ...previous,
                          name: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Price</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newMenuDraft.price}
                      onChange={(event) =>
                        setNewMenuDraft((previous) => ({
                          ...previous,
                          price: event.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={newMenuDraft.description}
                    onChange={(event) =>
                      setNewMenuDraft((previous) => ({
                        ...previous,
                        description: event.target.value,
                      }))
                    }
                  />
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Image URL or Data URL</Label>
                    <Input
                      value={newMenuDraft.imageUrl}
                      onChange={(event) =>
                        setNewMenuDraft((previous) => ({
                          ...previous,
                          imageUrl: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Upload Image</Label>
                    <Input type="file" accept="image/*" onChange={handleNewMenuImageUpload} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-5">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={newMenuDraft.isPopular}
                      onCheckedChange={(checked) =>
                        setNewMenuDraft((previous) => ({
                          ...previous,
                          isPopular: checked,
                        }))
                      }
                    />
                    <span className="text-sm">Popular</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={newMenuDraft.isVegetarian}
                      onCheckedChange={(checked) =>
                        setNewMenuDraft((previous) => ({
                          ...previous,
                          isVegetarian: checked,
                        }))
                      }
                    />
                    <span className="text-sm">Vegetarian</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={newMenuDraft.isSpicy}
                      onCheckedChange={(checked) =>
                        setNewMenuDraft((previous) => ({
                          ...previous,
                          isSpicy: checked,
                        }))
                      }
                    />
                    <span className="text-sm">Spicy</span>
                  </div>
                </div>

                <Button type="button" onClick={createMenuItem} disabled={creatingMenuItem}>
                  {creatingMenuItem ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Menu Item"
                  )}
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {menuCategories.map((category) => (
                <details
                  key={category.id}
                  className="rounded-xl border border-border/70 bg-card shadow-sm"
                  open={category.items.length <= 6}
                >
                  <summary className="cursor-pointer px-5 py-4 text-base font-semibold text-foreground">
                    {category.name} ({category.items.length})
                  </summary>
                  <div className="space-y-4 border-t border-border/60 p-4">
                    {category.items.map((item) => {
                      const draft = menuDrafts[item.id];
                      if (!draft) {
                        return null;
                      }

                      return (
                        <Card key={item.id} className="border-border/70">
                          <CardContent className="space-y-4 pt-6">
                            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                              <div className="space-y-2">
                                <Label>Name</Label>
                                <Input
                                  value={draft.name}
                                  onChange={(event) => handleMenuDraftChange(item.id, "name", event.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Price</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={draft.price}
                                  onChange={(event) => handleMenuDraftChange(item.id, "price", event.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Category</Label>
                                <select
                                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                  value={draft.categoryId}
                                  onChange={(event) =>
                                    handleMenuDraftChange(item.id, "categoryId", Number(event.target.value))
                                  }
                                >
                                  {categoryRows.map((categoryRow) => (
                                    <option key={categoryRow.id} value={categoryRow.id}>
                                      {categoryRow.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="space-y-2">
                                <Label>Upload New Image</Label>
                                <Input type="file" accept="image/*" onChange={(event) => handleMenuImageUpload(item.id, event)} />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Textarea
                                value={draft.description}
                                onChange={(event) => handleMenuDraftChange(item.id, "description", event.target.value)}
                              />
                            </div>

                            <div className="grid gap-3 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label>Image URL or Data URL</Label>
                                <Input
                                  value={draft.imageUrl}
                                  onChange={(event) => handleMenuDraftChange(item.id, "imageUrl", event.target.value)}
                                />
                              </div>
                              <div className="overflow-hidden rounded-lg border border-border/70 bg-muted/30 p-2">
                                <img
                                  src={draft.imageUrl || "/logo.png"}
                                  alt={draft.name}
                                  className="h-28 w-full rounded-md object-cover"
                                  onError={(event) => {
                                    event.currentTarget.src = "/logo.png";
                                  }}
                                />
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-5">
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={draft.isPopular}
                                  onCheckedChange={(checked) => handleMenuDraftChange(item.id, "isPopular", checked)}
                                />
                                <span className="text-sm">Popular</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={draft.isVegetarian}
                                  onCheckedChange={(checked) => handleMenuDraftChange(item.id, "isVegetarian", checked)}
                                />
                                <span className="text-sm">Vegetarian</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={draft.isSpicy}
                                  onCheckedChange={(checked) => handleMenuDraftChange(item.id, "isSpicy", checked)}
                                />
                                <span className="text-sm">Spicy</span>
                              </div>
                            </div>

                            <Button
                              type="button"
                              onClick={() => void saveMenuItem(item.id)}
                              disabled={savingMenuItemId === item.id}
                            >
                              {savingMenuItemId === item.id ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Save className="mr-2 h-4 w-4" />
                                  Save Item
                                </>
                              )}
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </details>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            {orders.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-sm text-muted-foreground">No orders available.</CardContent>
              </Card>
            ) : (
              orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <CardTitle className="text-xl">Order #{order.id}</CardTitle>
                        <CardDescription>
                          {order.customerName} | {order.customerEmail} | {order.customerPhone}
                        </CardDescription>
                      </div>
                        <div className="text-left sm:text-right">
                          <p className="text-sm font-semibold text-primary">${order.totalAmount}</p>
                          <p className="text-xs text-muted-foreground">{formatTimestamp(order.createdAt)}</p>
                        </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 rounded-lg border border-border/60 p-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
                          <span className="text-foreground">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-medium text-muted-foreground">${item.priceAtTime.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        className="h-10 min-w-[180px] rounded-md border border-input bg-background px-3 text-sm"
                        value={orderStatusDrafts[order.id] ?? order.status}
                        onChange={(event) =>
                          setOrderStatusDrafts((previous) => ({
                            ...previous,
                            [order.id]: event.target.value as OrderStatus,
                          }))
                        }
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status.replaceAll("_", " ")}
                          </option>
                        ))}
                      </select>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => void updateOrderStatus(order.id)}
                        disabled={updatingOrderId === order.id}
                      >
                        {updatingOrderId === order.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Update Status"
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => void deleteDeliveredOrder(order.id)}
                        disabled={updatingOrderId === order.id || order.status !== "delivered"}
                      >
                        Delete Delivered
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="notices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Megaphone className="h-5 w-5 text-primary" />
                  Create Notice
                </CardTitle>
                <CardDescription>
                  Publish announcements for customers. Active notices appear on the public notice board.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={newNoticeDraft.title}
                      onChange={(event) =>
                        setNewNoticeDraft((previous) => ({
                          ...previous,
                          title: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <select
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                      value={newNoticeDraft.priority}
                      onChange={(event) =>
                        setNewNoticeDraft((previous) => ({
                          ...previous,
                          priority: event.target.value as NoticeDraft["priority"],
                        }))
                      }
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Body</Label>
                  <Textarea
                    value={newNoticeDraft.body}
                    onChange={(event) =>
                      setNewNoticeDraft((previous) => ({
                        ...previous,
                        body: event.target.value,
                      }))
                    }
                  />
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Publish At</Label>
                    <Input
                      type="datetime-local"
                      value={newNoticeDraft.publishedAt}
                      onChange={(event) =>
                        setNewNoticeDraft((previous) => ({
                          ...previous,
                          publishedAt: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Expires At</Label>
                    <Input
                      type="datetime-local"
                      value={newNoticeDraft.expiresAt}
                      onChange={(event) =>
                        setNewNoticeDraft((previous) => ({
                          ...previous,
                          expiresAt: event.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Action Label</Label>
                    <Input
                      value={newNoticeDraft.actionLabel}
                      onChange={(event) =>
                        setNewNoticeDraft((previous) => ({
                          ...previous,
                          actionLabel: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Action URL</Label>
                    <Input
                      value={newNoticeDraft.actionUrl}
                      onChange={(event) =>
                        setNewNoticeDraft((previous) => ({
                          ...previous,
                          actionUrl: event.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={newNoticeDraft.isActive}
                    onCheckedChange={(checked) =>
                      setNewNoticeDraft((previous) => ({
                        ...previous,
                        isActive: checked,
                      }))
                    }
                  />
                  <span className="text-sm">Active notice</span>
                </div>

                <Button type="button" onClick={createNotice} disabled={creatingNotice}>
                  {creatingNotice ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Notice"
                  )}
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {notices.map((notice) => {
                const draft = noticeDrafts[notice.id];
                if (!draft) {
                  return null;
                }

                return (
                  <Card key={notice.id}>
                    <CardHeader>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <CardTitle className="text-lg">Notice #{notice.id}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant={draft.priority === "high" ? "destructive" : "secondary"}>
                            {draft.priority}
                          </Badge>
                          <Badge variant={draft.isActive ? "default" : "outline"}>
                            {draft.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription>
                        Created: {formatTimestamp(notice.createdAt)} | Updated: {formatTimestamp(notice.updatedAt)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={draft.title}
                            onChange={(event) => handleNoticeDraftChange(notice.id, "title", event.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Priority</Label>
                          <select
                            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                            value={draft.priority}
                            onChange={(event) =>
                              handleNoticeDraftChange(notice.id, "priority", event.target.value as NoticeDraft["priority"])
                            }
                          >
                            <option value="low">Low</option>
                            <option value="normal">Normal</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Body</Label>
                        <Textarea
                          value={draft.body}
                          onChange={(event) => handleNoticeDraftChange(notice.id, "body", event.target.value)}
                        />
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Publish At</Label>
                          <Input
                            type="datetime-local"
                            value={draft.publishedAt}
                            onChange={(event) => handleNoticeDraftChange(notice.id, "publishedAt", event.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Expires At</Label>
                          <Input
                            type="datetime-local"
                            value={draft.expiresAt}
                            onChange={(event) => handleNoticeDraftChange(notice.id, "expiresAt", event.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Action Label</Label>
                          <Input
                            value={draft.actionLabel}
                            onChange={(event) => handleNoticeDraftChange(notice.id, "actionLabel", event.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Action URL</Label>
                          <Input
                            value={draft.actionUrl}
                            onChange={(event) => handleNoticeDraftChange(notice.id, "actionUrl", event.target.value)}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Switch
                          checked={draft.isActive}
                          onCheckedChange={(checked) => handleNoticeDraftChange(notice.id, "isActive", checked)}
                        />
                        <span className="text-sm">Active notice</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          onClick={() => void saveNotice(notice.id)}
                          disabled={savingNoticeId === notice.id}
                        >
                          {savingNoticeId === notice.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Notice
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => void deleteNotice(notice.id)}
                          disabled={deletingNoticeId === notice.id}
                        >
                          {deletingNoticeId === notice.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="catering" className="space-y-4">
            {cateringInquiries.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-sm text-muted-foreground">
                  No catering inquiries yet.
                </CardContent>
              </Card>
            ) : (
              cateringInquiries.map((inquiry) => (
                <Card key={inquiry.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{inquiry.name}</CardTitle>
                    <CardDescription>
                      {inquiry.email} | {inquiry.phone}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>
                      <span className="font-semibold text-foreground">Event Date:</span>{" "}
                      <span className="text-muted-foreground">{formatTimestamp(inquiry.eventDate)}</span>
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Guest Count:</span>{" "}
                      <span className="text-muted-foreground">{inquiry.guestCount}</span>
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Submitted:</span>{" "}
                      <span className="text-muted-foreground">{formatTimestamp(inquiry.createdAt)}</span>
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Message:</span>{" "}
                      <span className="text-muted-foreground">{inquiry.message || "No message provided."}</span>
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
