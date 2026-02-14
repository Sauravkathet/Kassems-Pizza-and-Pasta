import { useEffect, useMemo, useState, type ElementType } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fallbackImageByName, resolveItemImage } from "@/lib/item-image";
import { cn } from "@/lib/utils";
import {
  useDeleteDeliveredOrder,
  useKitchenOrders,
  useKitchenRealtime,
  useUpdateOrderStatus,
} from "@/hooks/use-orders";
import type { KitchenOrder, OrderStatus } from "@shared/schema";
import {
  AlertCircle,
  CheckCircle2,
  ChefHat,
  Clock3,
  Eye,
  Loader2,
  Mail,
  Package,
  Phone,
  RefreshCcw,
  Search,
  Timer,
  Trash2,
  User,
  Wifi,
  WifiOff,
} from "lucide-react";

type StatusConfig = {
  label: string;
  icon: ElementType;
  badgeClass: string;
  railClass: string;
};

const STATUS_ORDER: OrderStatus[] = [
  "pending",
  "accepted",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
];

const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  pending: {
    label: "Received",
    icon: AlertCircle,
    badgeClass: "border-border bg-muted text-foreground",
    railClass: "bg-border",
  },
  accepted: {
    label: "Accepted",
    icon: CheckCircle2,
    badgeClass: "border-border bg-muted text-foreground",
    railClass: "bg-border",
  },
  preparing: {
    label: "Preparing",
    icon: Timer,
    badgeClass: "border-border bg-muted text-foreground",
    railClass: "bg-border",
  },
  ready: {
    label: "Ready",
    icon: Package,
    badgeClass: "border-border bg-muted text-foreground",
    railClass: "bg-border",
  },
  out_for_delivery: {
    label: "On The Way",
    icon: Package,
    badgeClass: "border-border bg-muted text-foreground",
    railClass: "bg-border",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    badgeClass: "border-border bg-muted/70 text-muted-foreground",
    railClass: "bg-border",
  },
};

type OrderTableProps = {
  orders: KitchenOrder[];
  status: OrderStatus;
  nowMs: number;
  onStatusUpdate: (orderId: number, nextStatus: OrderStatus) => void;
  onViewDetails: (order: KitchenOrder) => void;
  onDeleteDeliveredOrder: (orderId: number) => void;
  isUpdating: boolean;
  updatingOrderId: number | null;
  isDeleting: boolean;
  deletingOrderId: number | null;
};

function OrderTable({
  orders,
  status,
  nowMs,
  onStatusUpdate,
  onViewDetails,
  onDeleteDeliveredOrder,
  isUpdating,
  updatingOrderId,
  isDeleting,
  deletingOrderId,
}: OrderTableProps) {
  const config = STATUS_CONFIG[status];
  const StatusIcon = config.icon;

  if (orders.length === 0) {
    return (
      <div className="flex h-56 flex-col items-center justify-center rounded-2xl border border-dashed bg-card px-4 text-center">
        <Package className="h-8 w-8 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">No {config.label.toLowerCase()} orders</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border bg-card lg:block">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-[86px]">Order</TableHead>
              <TableHead className="w-[190px]">Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="w-[110px]">Time</TableHead>
              <TableHead className="w-[92px]">Total</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const nextStatus = getNextStatus(status);
              return (
                <TableRow key={order.id} className="align-top hover:bg-muted/20">
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>
                    <p className="text-sm font-medium">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{order.customerEmail}</p>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1.5">
                      {order.items.slice(0, 2).map((item) => (
                        <div key={item.id} className="flex items-center gap-2 rounded-md border bg-background px-2 py-1.5">
                          <div className="h-8 w-8 shrink-0 overflow-hidden rounded border bg-muted">
                            <img
                              src={resolveItemImage(item.name, item.imageUrl)}
                              alt={item.name}
                              className="h-full w-full object-cover"
                              loading="lazy"
                              onError={(event) => {
                                event.currentTarget.onerror = null;
                                event.currentTarget.src = fallbackImageByName(item.name);
                              }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium">{item.name}</p>
                            <p className="text-[11px] text-muted-foreground">Qty {item.quantity}</p>
                          </div>
                          <p className="text-xs font-semibold">
                            ${(Number(item.priceAtTime) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-xs text-muted-foreground">+{order.items.length - 2} more items</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="inline-flex items-center gap-1 text-sm font-medium">
                      <Clock3 className="h-3.5 w-3.5 text-muted-foreground" />
                      {formatOrderTime(order.createdAt)}
                    </p>
                  </TableCell>
                  <TableCell className="font-semibold">${Number(order.totalAmount).toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full gap-1.5"
                        onClick={() => onViewDetails(order)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Button>
                      {status !== "delivered" ? (
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => onStatusUpdate(order.id, nextStatus)}
                          disabled={isUpdating && updatingOrderId === order.id}
                        >
                          {isUpdating && updatingOrderId === order.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            getActionLabel(status)
                          )}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full gap-1.5"
                          onClick={() => onDeleteDeliveredOrder(order.id)}
                          disabled={isDeleting && deletingOrderId === order.id}
                        >
                          {isDeleting && deletingOrderId === order.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <>
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
        {orders.map((order) => {
          const nextStatus = getNextStatus(status);
          const orderItemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
          const orderAgeMinutes = getOrderAgeMinutes(order.createdAt, nowMs);

          return (
            <Card
              key={order.id}
              className={cn(
                "overflow-hidden rounded-2xl border bg-card shadow-sm",
                status !== "delivered" && orderAgeMinutes !== null && orderAgeMinutes >= 25 && "ring-1 ring-border",
              )}
            >
              <CardContent className="p-0">
                <div className="flex">
                  <div className={cn("w-1.5 shrink-0", config.railClass)} />
                  <div className="flex-1 space-y-3 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">Order #{order.id}</p>
                        <p className="text-xs text-muted-foreground">{formatOrderDateTime(order.createdAt)}</p>
                      </div>
                      <Badge variant="outline" className={cn("gap-1", config.badgeClass)}>
                        <StatusIcon className="h-3 w-3" />
                        {config.label}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2 text-[11px]">
                      <span className="rounded-full border bg-muted/40 px-2.5 py-1">{formatOrderTime(order.createdAt)}</span>
                      <span className="rounded-full border bg-muted/40 px-2.5 py-1">{orderItemCount} items</span>
                      <span className="rounded-full border bg-muted px-2.5 py-1 font-semibold text-foreground">
                        ${Number(order.totalAmount).toFixed(2)}
                      </span>
                    </div>

                    <div className="space-y-1 rounded-xl border bg-muted/20 p-3">
                      <p className="inline-flex items-center gap-2 text-xs font-medium">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="truncate">{order.customerName}</span>
                      </p>
                      <p className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        {order.customerPhone}
                      </p>
                    </div>

                    <div className="space-y-2">
                      {order.items.slice(0, 2).map((item) => (
                        <div key={item.id} className="flex items-center gap-2 rounded-lg border bg-background p-2">
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border bg-muted">
                            <img
                              src={resolveItemImage(item.name, item.imageUrl)}
                              alt={item.name}
                              className="h-full w-full object-cover"
                              loading="lazy"
                              onError={(event) => {
                                event.currentTarget.onerror = null;
                                event.currentTarget.src = fallbackImageByName(item.name);
                              }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium">{item.name}</p>
                            <p className="text-[11px] text-muted-foreground">Qty {item.quantity}</p>
                          </div>
                          <p className="text-xs font-semibold">
                            ${(Number(item.priceAtTime) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-xs text-muted-foreground">+{order.items.length - 2} more items</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <Button size="sm" variant="outline" className="gap-1.5" onClick={() => onViewDetails(order)}>
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Button>
                      {status !== "delivered" ? (
                        <Button
                          size="sm"
                          onClick={() => onStatusUpdate(order.id, nextStatus)}
                          disabled={isUpdating && updatingOrderId === order.id}
                        >
                          {isUpdating && updatingOrderId === order.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            getActionLabel(status)
                          )}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5"
                          onClick={() => onDeleteDeliveredOrder(order.id)}
                          disabled={isDeleting && deletingOrderId === order.id}
                        >
                          {isDeleting && deletingOrderId === order.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <>
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}

function getNextStatus(status: OrderStatus): OrderStatus {
  const flow: Record<OrderStatus, OrderStatus> = {
    pending: "accepted",
    accepted: "preparing",
    preparing: "ready",
    ready: "out_for_delivery",
    out_for_delivery: "delivered",
    delivered: "delivered",
  };
  return flow[status];
}

function getActionLabel(status: OrderStatus): string {
  const actions: Record<OrderStatus, string> = {
    pending: "Accept",
    accepted: "Start Prep",
    preparing: "Mark Ready",
    ready: "Dispatch",
    out_for_delivery: "Mark Delivered",
    delivered: "Completed",
  };
  return actions[status];
}

function parseCreatedAt(createdAt: string | null): Date | null {
  if (!createdAt) return null;
  const date = new Date(createdAt);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatOrderDateTime(createdAt: string | null): string {
  const date = parseCreatedAt(createdAt);
  if (!date) return "Time unavailable";

  return `${date.toLocaleDateString([], { month: "short", day: "numeric" })} • ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

function formatOrderTime(createdAt: string | null): string {
  const date = parseCreatedAt(createdAt);
  if (!date) return "Time unavailable";
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getOrderAgeMinutes(createdAt: string | null, nowMs: number): number | null {
  const date = parseCreatedAt(createdAt);
  if (!date) return null;

  const minutes = Math.floor((nowMs - date.getTime()) / 60000);
  return Math.max(0, minutes);
}

function formatOrderAge(createdAt: string | null, nowMs: number): string {
  const minutes = getOrderAgeMinutes(createdAt, nowMs);
  if (minutes === null) return "Unknown";
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) {
    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;
    return remainder === 0 ? `${hours}h ago` : `${hours}h ${remainder}m ago`;
  }

  const days = Math.floor(minutes / 1440);
  const remHours = Math.floor((minutes % 1440) / 60);
  return remHours === 0 ? `${days}d ago` : `${days}d ${remHours}h ago`;
}

function fallbackItemImage(name: string): string {
  const normalized = name.toLowerCase();
  if (normalized.includes("pizza")) {
    return "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=300";
  }
  if (normalized.includes("pasta")) {
    return "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=300";
  }
  if (normalized.includes("salad")) {
    return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=300";
  }
  return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300";
}

export default function Kitchen() {
  const { data: orders = [], isLoading, isError, error, refetch, isFetching } = useKitchenOrders();
  const { isLive } = useKitchenRealtime();
  const { mutate: updateOrderStatus, isPending: isStatusUpdating } = useUpdateOrderStatus();
  const { mutate: deleteDeliveredOrder, isPending: isDeleting } = useDeleteDeliveredOrder();

  const [activeTab, setActiveTab] = useState<OrderStatus>("pending");
  const [selectedOrder, setSelectedOrder] = useState<KitchenOrder | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);
  const [nowMs, setNowMs] = useState(() => Date.now());

  const metrics = useMemo(() => {
    const pending = orders.filter((order) => order.status === "pending").length;
    const accepted = orders.filter((order) => order.status === "accepted").length;
    const preparing = orders.filter((order) => order.status === "preparing").length;
    const ready = orders.filter((order) => order.status === "ready").length;
    const out_for_delivery = orders.filter((order) => order.status === "out_for_delivery").length;
    const delivered = orders.filter((order) => order.status === "delivered").length;

    return {
      total: orders.length,
      active: pending + accepted + preparing + ready + out_for_delivery,
      pending,
      accepted,
      preparing,
      ready,
      out_for_delivery,
      delivered,
    };
  }, [orders]);

  const groupedOrders = useMemo(() => {
    const grouped: Record<OrderStatus, KitchenOrder[]> = {
      pending: [],
      accepted: [],
      preparing: [],
      ready: [],
      out_for_delivery: [],
      delivered: [],
    };

    for (const order of orders) {
      grouped[order.status].push(order);
    }

    STATUS_ORDER.forEach((status) => {
      grouped[status].sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return aTime - bTime;
      });
    });

    return grouped;
  }, [orders]);

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const filteredOrders = useMemo(() => {
    const stageOrders = groupedOrders[activeTab];
    if (!normalizedSearch) return stageOrders;

    return stageOrders.filter((order) => {
      const itemNames = order.items.map((item) => item.name).join(" ");
      const haystack = `${order.id} ${order.customerName} ${order.customerPhone} ${order.customerEmail} ${itemNames}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [activeTab, groupedOrders, normalizedSearch]);

  useEffect(() => {
    setVisibleCount(20);
  }, [activeTab, normalizedSearch]);

  const visibleOrders = useMemo(
    () => filteredOrders.slice(0, visibleCount),
    [filteredOrders, visibleCount],
  );

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNowMs(Date.now());
    }, 30000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const handleStatusUpdate = (orderId: number, nextStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    updateOrderStatus(
      { orderId, status: nextStatus },
      {
        onSettled: () => {
          setUpdatingOrderId(null);
        },
      },
    );
  };

  const handleDeleteDeliveredOrder = (orderId: number) => {
    const confirmed = window.confirm(`Delete delivered order #${orderId}? This action cannot be undone.`);
    if (!confirmed) return;

    setDeletingOrderId(orderId);
    deleteDeliveredOrder(orderId, {
      onSettled: () => {
        setDeletingOrderId(null);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Loading kitchen orders...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md border-border">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-foreground" />
            <h3 className="mt-2 font-semibold">Failed to load orders</h3>
            <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
            <Button onClick={() => refetch()} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12 pt-20">
      <div className="container mx-auto max-w-7xl space-y-5 px-4">
        <header className="rounded-2xl border bg-card p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border bg-muted p-2">
                <ChefHat className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold md:text-2xl">Kitchen Panel</h1>
                <p className="text-sm text-muted-foreground">Live order workflow with photo previews</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "gap-1.5 px-3 py-1.5",
                  isLive
                    ? "border-green-300 bg-green-50 text-green-700"
                    : "border-border bg-muted text-foreground",
                )}
              >
                {isLive ? <Wifi className="h-3.5 w-3.5 text-green-600" /> : <WifiOff className="h-3.5 w-3.5" />}
                {isLive ? "Connected" : "Reconnecting"}
              </Badge>
              <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}>
                <RefreshCcw className={cn("h-4 w-4", isFetching && "animate-spin")} />
              </Button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-5">
            <Metric label="Active" value={metrics.active} />
            <Metric label="Pending" value={metrics.pending} emphasize />
            <Metric label="Preparing" value={metrics.preparing} />
            <Metric label="Ready" value={metrics.ready} />
            <Metric label="Delivered" value={metrics.delivered} />
          </div>

          <div className="relative mt-4 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search order, customer, phone, item..."
              className="h-10 pl-9"
            />
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as OrderStatus)} className="space-y-4">
          <div className="rounded-2xl border bg-card p-2">
            <div className="overflow-x-auto">
              <TabsList className="h-auto w-max min-w-full bg-transparent p-0 md:grid md:w-full md:grid-cols-6 md:gap-1">
                {STATUS_ORDER.map((status) => {
                  const config = STATUS_CONFIG[status];
                  const count = groupedOrders[status].length;
                  const Icon = config.icon;
                  return (
                    <TabsTrigger
                      key={status}
                      value={status}
                      className={cn(
                        "mr-1 inline-flex h-10 min-w-[132px] items-center justify-between rounded-lg border border-transparent px-3 text-xs font-medium",
                        "md:mr-0 md:min-w-0",
                        "data-[state=active]:border-border data-[state=active]:bg-muted data-[state=active]:text-foreground",
                      )}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5" />
                        {config.label}
                      </span>
                      <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        {count}
                      </span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>
          </div>

          {normalizedSearch.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Showing {visibleOrders.length} of {filteredOrders.length} result{filteredOrders.length === 1 ? "" : "s"} in{" "}
              <span className="font-medium text-foreground">{STATUS_CONFIG[activeTab].label}</span>
            </p>
          )}

          <OrderTable
            orders={visibleOrders}
            status={activeTab}
            nowMs={nowMs}
            onStatusUpdate={handleStatusUpdate}
            onViewDetails={setSelectedOrder}
            onDeleteDeliveredOrder={handleDeleteDeliveredOrder}
            isUpdating={isStatusUpdating}
            updatingOrderId={updatingOrderId}
            isDeleting={isDeleting}
            deletingOrderId={deletingOrderId}
          />

          {filteredOrders.length > visibleOrders.length && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setVisibleCount((prev) => prev + 20)}
              >
                Load More Orders ({filteredOrders.length - visibleOrders.length} remaining)
              </Button>
            </div>
          )}
        </Tabs>

        <Dialog
          open={Boolean(selectedOrder)}
          onOpenChange={(open) => {
            if (!open) setSelectedOrder(null);
          }}
        >
          <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl">
            {selectedOrder && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <span>Order #{selectedOrder.id}</span>
                    <Badge variant="outline" className={STATUS_CONFIG[selectedOrder.status].badgeClass}>
                      {STATUS_CONFIG[selectedOrder.status].label}
                    </Badge>
                  </DialogTitle>
                  <DialogDescription>Placed {formatOrderDateTime(selectedOrder.createdAt)}</DialogDescription>
                </DialogHeader>

                <div className="grid gap-2 sm:grid-cols-3">
                  <div className="rounded-lg border bg-muted/20 p-3 text-sm">
                    <p className="flex items-center gap-2 font-medium">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {selectedOrder.customerName}
                    </p>
                  </div>
                  <div className="rounded-lg border bg-muted/20 p-3 text-sm">
                    <p className="flex items-center gap-2 font-medium">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {selectedOrder.customerPhone}
                    </p>
                  </div>
                  <div className="rounded-lg border bg-muted/20 p-3 text-sm">
                    <p className="flex items-center gap-2 truncate font-medium">
                      <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="truncate">{selectedOrder.customerEmail}</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {selectedOrder.items.map((item) => {
                    const unitPrice = Number(item.priceAtTime);
                    return (
                      <div key={item.id} className="flex items-center gap-3 rounded-lg border bg-muted/20 p-2.5">
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border bg-muted">
                          <img
                            src={resolveItemImage(item.name, item.imageUrl)}
                            alt={item.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            onError={(event) => {
                              event.currentTarget.onerror = null;
                              event.currentTarget.src = fallbackImageByName(item.name);
                            }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qty {item.quantity} • ${unitPrice.toFixed(2)} each</p>
                        </div>
                        <p className="text-sm font-semibold">${(unitPrice * item.quantity).toFixed(2)}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between rounded-lg border bg-muted/20 px-3 py-2">
                  <span className="text-sm text-muted-foreground">
                    Total ({selectedOrder.items.reduce((sum, item) => sum + item.quantity, 0)} items)
                  </span>
                  <span className="text-lg font-semibold text-foreground">${Number(selectedOrder.totalAmount).toFixed(2)}</span>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function Metric({ label, value, emphasize = false }: { label: string; value: string | number; emphasize?: boolean }) {
  return (
    <div className="rounded-xl border bg-muted/20 px-3 py-2">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={cn("text-lg font-semibold", emphasize && "text-foreground")}>{value}</p>
    </div>
  );
}
