import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  useDeleteDeliveredOrder,
  useKitchenOrders,
  useKitchenRealtime,
  useUpdateOrderStatus,
} from "@/hooks/use-orders";
import type { KitchenOrder, OrderStatus } from "@shared/schema";
import {
  ChefHat,
  Clock3,
  Loader2,
  RefreshCcw,
  Wifi,
  WifiOff,
  CheckCircle2,
  Timer,
  AlertCircle,
  Package,
  Trash2,
  Eye,
  Mail,
  Phone,
  User,
} from "lucide-react";

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    badgeVariant: "default" | "secondary" | "destructive" | "outline";
    color: string;
    icon: React.ElementType;
  }
> = {
  pending: {
    label: "Received",
    badgeVariant: "destructive",
    color: "text-rose-600 bg-rose-50",
    icon: AlertCircle,
  },
  accepted: {
    label: "Accepted",
    badgeVariant: "secondary",
    color: "text-blue-600 bg-blue-50",
    icon: CheckCircle2,
  },
  preparing: {
    label: "Preparing",
    badgeVariant: "default",
    color: "text-orange-600 bg-orange-50",
    icon: Timer,
  },
  ready: {
    label: "Ready",
    badgeVariant: "outline",
    color: "text-emerald-600 bg-emerald-50",
    icon: Package,
  },
  out_for_delivery: {
    label: "On The Way",
    badgeVariant: "secondary",
    color: "text-indigo-600 bg-indigo-50",
    icon: Package,
  },
  delivered: {
    label: "Delivered",
    badgeVariant: "outline",
    color: "text-green-700 bg-green-50",
    icon: CheckCircle2,
  },
};

interface OrderTableProps {
  orders: KitchenOrder[];
  status: OrderStatus;
  onStatusUpdate: (orderId: number, nextStatus: OrderStatus) => void;
  onViewDetails: (order: KitchenOrder) => void;
  onDeleteDeliveredOrder: (orderId: number) => void;
  isUpdating: boolean;
  updatingOrderId: number | null;
  isDeleting: boolean;
  deletingOrderId: number | null;
}

function OrderTable({
  orders,
  status,
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
      <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/10 p-8 text-center">
        <Package className="h-8 w-8 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">No {config.label.toLowerCase()} orders</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden pt-3 rounded-lg border">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[100px]">Order #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead className="w-[120px]">Time</TableHead>
            <TableHead className="w-[100px]">Total</TableHead>
            <TableHead className="w-[140px]">Status</TableHead>
            <TableHead className="w-[110px]">Details</TableHead>
            <TableHead className="w-[170px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="group hover:bg-muted/30">
              <TableCell className="font-medium">#{order.id}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-[280px] space-y-1">
                  {order.items.slice(0, 2).map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="h-7 w-7 shrink-0 overflow-hidden rounded-md border bg-muted">
                          <img
                            src={item.imageUrl || fallbackItemImage(item.name)}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="truncate">{item.name}</span>
                      </div>
                      <span className="font-medium">x{item.quantity}</span>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-xs text-muted-foreground">+{order.items.length - 2} more</p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm">
                    {new Date(order.createdAt!).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </TableCell>
              <TableCell className="font-medium">${Number(order.totalAmount).toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant={config.badgeVariant} className={cn("gap-1", config.color)}>
                  <StatusIcon className="h-3 w-3" />
                  {config.label}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full gap-1.5"
                  onClick={() => onViewDetails(order)}
                >
                  <Eye className="h-3.5 w-3.5" />
                  View
                </Button>
              </TableCell>
              <TableCell>
                {status !== "delivered" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => onStatusUpdate(order.id, getNextStatus(status))}
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
                    variant="destructive"
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
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
    pending: "Accept Order",
    accepted: "Start Prep",
    preparing: "Mark Ready",
    ready: "Dispatch",
    out_for_delivery: "Mark Delivered",
    delivered: "Completed",
  };
  return actions[status];
}

function formatOrderDateTime(createdAt: string | null): string {
  if (!createdAt) return "Time unavailable";
  const date = new Date(createdAt);
  return `${date.toLocaleDateString([], { month: "short", day: "numeric" })} • ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
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
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<KitchenOrder | null>(null);
  const [activeTab, setActiveTab] = useState<OrderStatus>("pending");

  const metrics = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "pending").length;
    const accepted = orders.filter((o) => o.status === "accepted").length;
    const preparing = orders.filter((o) => o.status === "preparing").length;
    const ready = orders.filter((o) => o.status === "ready").length;
    const out_for_delivery = orders.filter((o) => o.status === "out_for_delivery").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    const avgPrepTime = calculateAveragePrepTime(orders);

    return { total, pending, accepted, preparing, ready, out_for_delivery, delivered, avgPrepTime };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => order.status === activeTab)
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return aTime - bTime;
      });
  }, [orders, activeTab]);

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
    const confirmed = window.confirm(
      `Delete delivered order #${orderId}? This action cannot be undone.`,
    );
    if (!confirmed) return;

    setDeletingOrderId(orderId);
    deleteDeliveredOrder(orderId, {
      onSettled: () => {
        setDeletingOrderId(null);
      },
    });
  };

  const handleViewDetails = (order: KitchenOrder) => {
    setSelectedOrder(order);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Loading kitchen orders...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-[400px] border-destructive">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
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
    <div className="min-h-screen bg-muted/20 pb-10 py-16 pt-20">
      <div className="container mx-auto max-w-7xl space-y-6 px-4">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <ChefHat className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Kitchen Display System</h1>
              <p className="text-sm text-muted-foreground">Real-time order management</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Connection Status */}
            <Badge
              variant="outline"
              className={cn(
                "gap-2 px-3 py-1.5",
                isLive ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700",
              )}
            >
              {isLive ? (
                <>
                  <Wifi className="h-3.5 w-3.5" />
                  <span>Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3.5 w-3.5" />
                  <span>Reconnecting...</span>
                </>
              )}
            </Badge>

            {/* Metrics */}
            <div className="flex items-center divide-x rounded-lg border bg-white">
              <div className="px-3 py-1.5">
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="text-lg font-bold">
                  {metrics.pending + metrics.accepted + metrics.preparing + metrics.ready + metrics.out_for_delivery}
                </p>
              </div>
              <div className="px-3 py-1.5">
                <p className="text-xs text-muted-foreground">Delivered</p>
                <p className="text-lg font-bold text-emerald-600">{metrics.delivered}</p>
              </div>
              <div className="px-3 py-1.5">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-bold">{metrics.total}</p>
              </div>
            </div>

            <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCcw className={cn("h-4 w-4", isFetching && "animate-spin")} />
            </Button>
          </div>
        </div>

        {/* Status Tabs */}
        <Tabs defaultValue="pending" value={activeTab} onValueChange={(v) => setActiveTab(v as OrderStatus)}>
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full max-w-4xl grid-cols-3 md:grid-cols-6">
              {Object.entries(STATUS_CONFIG).map(([status, config]) => {
                const Icon = config.icon;
                const count = metrics[status as keyof typeof metrics] as number;
                return (
                  <TabsTrigger key={status} value={status} className="gap-2">
                    <Icon className="h-4 w-4" />
                    {config.label}
                    {count > 0 && <Badge className="ml-1 h-5 px-1.5 text-xs">{count}</Badge>}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {activeTab === "ready" && metrics.ready > 0 && (
              <Badge variant="outline" className="bg-emerald-50 px-3 py-1.5 text-emerald-700">
                <Package className="mr-1.5 h-3.5 w-3.5" />
                {metrics.ready} orders ready for pickup
              </Badge>
            )}
            {activeTab === "out_for_delivery" && metrics.out_for_delivery > 0 && (
              <Badge variant="outline" className="bg-indigo-50 px-3 py-1.5 text-indigo-700">
                <Package className="mr-1.5 h-3.5 w-3.5" />
                {metrics.out_for_delivery} orders on the way
              </Badge>
            )}
          </div>

          {/* Tab Content */}
          {Object.keys(STATUS_CONFIG).map((status) => (
            <TabsContent key={status} value={status} className="mt-4">
              <OrderTable
                orders={filteredOrders}
                status={status as OrderStatus}
                onStatusUpdate={handleStatusUpdate}
                onViewDetails={handleViewDetails}
                onDeleteDeliveredOrder={handleDeleteDeliveredOrder}
                isUpdating={isStatusUpdating}
                updatingOrderId={updatingOrderId}
                isDeleting={isDeleting}
                deletingOrderId={deletingOrderId}
              />
            </TabsContent>
          ))}
        </Tabs>

        <Dialog
          open={Boolean(selectedOrder)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedOrder(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-2xl">
            {selectedOrder && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <span>Order #{selectedOrder.id}</span>
                    <Badge
                      variant={STATUS_CONFIG[selectedOrder.status].badgeVariant}
                      className={cn("gap-1", STATUS_CONFIG[selectedOrder.status].color)}
                    >
                      {(() => {
                        const SelectedStatusIcon = STATUS_CONFIG[selectedOrder.status].icon;
                        return <SelectedStatusIcon className="h-3 w-3" />;
                      })()}
                      {STATUS_CONFIG[selectedOrder.status].label}
                    </Badge>
                  </DialogTitle>
                  <DialogDescription>
                    Placed {formatOrderDateTime(selectedOrder.createdAt)}
                  </DialogDescription>
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
                            src={item.imageUrl || fallbackItemImage(item.name)}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Qty {item.quantity} • ${unitPrice.toFixed(2)} each
                          </p>
                        </div>
                        <p className="text-sm font-semibold">
                          ${(unitPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
                  <span className="text-sm text-muted-foreground">
                    Total ({selectedOrder.items.reduce((sum, item) => sum + item.quantity, 0)} items)
                  </span>
                  <span className="text-lg font-semibold text-primary">
                    ${Number(selectedOrder.totalAmount).toFixed(2)}
                  </span>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Summary Footer */}
        {metrics.preparing > 0 && (
          <div className="rounded-lg border bg-blue-50/30 p-3 text-sm text-blue-700">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4" />
              <span className="font-medium">In Progress:</span>
              <span>{metrics.preparing} orders being prepared</span>
            </div>
          </div>
        )}
        {metrics.out_for_delivery > 0 && (
          <div className="rounded-lg border bg-indigo-50/40 p-3 text-sm text-indigo-700">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="font-medium">Delivery:</span>
              <span>{metrics.out_for_delivery} orders currently on the way</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to calculate average preparation time
function calculateAveragePrepTime(orders: KitchenOrder[]): string {
  const completedOrders = orders.filter((o) => o.status === "delivered" && o.createdAt);
  if (completedOrders.length === 0) return "N/A";

  const totalTime = completedOrders.reduce((acc, order) => {
    if (order.createdAt) {
      const prepTime = Date.now() - new Date(order.createdAt).getTime();
      return acc + prepTime;
    }
    return acc;
  }, 0);

  const avgMinutes = Math.floor(totalTime / completedOrders.length / 60000);
  return `${avgMinutes} min`;
}
