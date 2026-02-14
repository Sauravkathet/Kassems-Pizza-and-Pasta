import { FormEvent, useMemo, useState } from "react";
import { useCustomerOrders } from "@/hooks/use-orders";
import { useMenu } from "@/hooks/use-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { KitchenOrder, OrderStatus } from "@shared/schema";
import {
  AlertCircle,
  CheckCircle2,
  ChefHat,
  Clock,
  Loader2,
  Mail,
  Package,
  Phone,
  RefreshCcw,
  Search,
  ShoppingBag,
  Truck,
} from "lucide-react";

type TrackOrderDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const STATUS_FLOW: OrderStatus[] = [
  "pending",
  "accepted",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
];

const STATUS_META: Record<
  OrderStatus,
  {
    label: string;
    description: string;
    icon: React.ElementType;
    badgeClassName: string;
  }
> = {
  pending: {
    label: "Order Received",
    description: "We've received your order and added it to the kitchen queue.",
    icon: Clock,
    badgeClassName: "bg-primary/10 text-primary border-primary/25",
  },
  accepted: {
    label: "Accepted",
    description: "The kitchen has accepted your order.",
    icon: CheckCircle2,
    badgeClassName: "bg-orange-100 text-orange-700 border-orange-300",
  },
  preparing: {
    label: "Preparing",
    description: "Your food is being freshly prepared.",
    icon: ChefHat,
    badgeClassName: "bg-yellow-100 text-yellow-800 border-yellow-300",
  },
  ready: {
    label: "Ready",
    description: "Your order is packed and waiting for dispatch.",
    icon: Package,
    badgeClassName: "bg-green-100 text-green-700 border-green-300",
  },
  out_for_delivery: {
    label: "On The Way",
    description: "Your order is out for delivery.",
    icon: Truck,
    badgeClassName: "bg-secondary/10 text-secondary border-secondary/30",
  },
  delivered: {
    label: "Delivered",
    description: "Your order has been delivered. Enjoy your meal.",
    icon: ShoppingBag,
    badgeClassName: "bg-green-100 text-green-700 border-green-300",
  },
};

function formatPlacedAt(date: string | null) {
  if (!date) return "Time unavailable";
  const d = new Date(date);
  return `${d.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  })} • ${d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

function OrderStatusTimeline({ status }: { status: OrderStatus }) {
  const currentIndex = STATUS_FLOW.indexOf(status);

  return (
    <div className="mt-3 rounded-lg border border-border/60 bg-background/80 p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold text-foreground">Kitchen Progress</p>
        <p className="text-xs text-muted-foreground">
          Step {currentIndex + 1} / {STATUS_FLOW.length}
        </p>
      </div>

      <div className="space-y-2">
        {STATUS_FLOW.map((step, index) => {
          const StepIcon = STATUS_META[step].icon;
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step} className="flex items-start gap-2.5">
              <div
                className={cn(
                  "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                  isCompleted && "border-primary bg-primary text-primary-foreground",
                  isCurrent && "border-primary bg-primary/10 text-primary",
                  !isCompleted && !isCurrent && "border-border text-muted-foreground/60"
                )}
              >
                <StepIcon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <p
                  className={cn(
                    "text-xs font-medium",
                    isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {STATUS_META[step].label}
                </p>
                {isCurrent && (
                  <p className="text-[11px] text-muted-foreground">
                    {STATUS_META[step].description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function fallbackItemImage(name: string) {
  const n = name.toLowerCase();
  if (n.includes("pizza")) {
    return "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=300";
  }
  if (n.includes("pasta")) {
    return "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=300";
  }
  if (n.includes("salad")) {
    return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=300";
  }
  return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300";
}

function DrawerOrderItem({
  item,
  imageUrl,
}: {
  item: KitchenOrder["items"][number];
  imageUrl?: string;
}) {
  const unitPrice = Number(item.priceAtTime);
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 p-2">
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-border/60 bg-muted">
        <img
          src={imageUrl || fallbackItemImage(item.name)}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
        <p className="text-xs text-muted-foreground">
          Qty {item.quantity} • ${unitPrice.toFixed(2)} each
        </p>
      </div>
      <p className="text-sm font-semibold text-foreground">
        ${(unitPrice * item.quantity).toFixed(2)}
      </p>
    </div>
  );
}

function DrawerOrderCard({
  order,
  imageByMenuItemId,
}: {
  order: KitchenOrder;
  imageByMenuItemId: Map<number, string>;
}) {
  const status = STATUS_META[order.status];
  const StatusIcon = status.icon;
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <article className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-foreground">Order #{order.id}</h3>
          <p className="text-xs text-muted-foreground">{formatPlacedAt(order.createdAt)}</p>
        </div>
        <Badge variant="outline" className={cn("gap-1.5", status.badgeClassName)}>
          <StatusIcon className="h-3.5 w-3.5" />
          {status.label}
        </Badge>
      </div>

      <div className="mt-3 rounded-lg border border-border/60 bg-muted/10 p-2 text-xs text-muted-foreground">
        <p className="truncate">{order.customerEmail}</p>
        <p>{order.customerPhone}</p>
      </div>

      <OrderStatusTimeline status={order.status} />

      <div className="mt-3 space-y-2">
        {order.items.map((item) => (
          <DrawerOrderItem
            key={item.id}
            item={item}
            imageUrl={imageByMenuItemId.get(item.menuItemId)}
          />
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
        <span className="text-xs text-muted-foreground">Total ({itemCount} items)</span>
        <span className="text-sm font-semibold text-primary">
          ${Number(order.totalAmount).toFixed(2)}
        </span>
      </div>
    </article>
  );
}

export function TrackOrderDrawer({ open, onOpenChange }: TrackOrderDrawerProps) {
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [lookup, setLookup] = useState<{ email?: string; phone?: string }>({});
  const { data: categories = [] } = useMenu();

  const { data: orders = [], isLoading, isFetching, isError, error, refetch } = useCustomerOrders(
    lookup.email,
    lookup.phone
  );

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });
  }, [orders]);

  const hasLookup = Boolean(lookup.email || lookup.phone);
  const imageByMenuItemId = useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach((category) => {
      category.items.forEach((item) => {
        map.set(item.id, item.imageUrl);
      });
    });
    return map;
  }, [categories]);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const email = emailInput.trim();
    const phone = phoneInput.trim();
    if (!email && !phone) return;

    setLookup({
      email: email || undefined,
      phone: phone || undefined,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md bg-background flex flex-col h-full border-l-border/50">
        <SheetHeader className="space-y-2 pb-4 border-b border-border/40">
          <SheetTitle className="font-serif text-2xl text-primary">Track Order</SheetTitle>
          <SheetDescription>
            Find live order updates using email or phone. Status syncs every 5 seconds.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSearch} className="space-y-3 py-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email address"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Phone number"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" className="flex-1 gap-2">
              <Search className="h-4 w-4" />
              Find Orders
            </Button>
            <Button type="button" variant="outline" size="icon" onClick={() => refetch()} disabled={!hasLookup || isFetching}>
              <RefreshCcw className={cn("h-4 w-4", isFetching && "animate-spin")} />
            </Button>
          </div>
        </form>

        <ScrollArea className="flex-1 -mx-6 px-6 pb-6">
          {!hasLookup ? (
            <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed border-border text-center">
              <Search className="h-8 w-8 text-muted-foreground/50" />
              <p className="mt-3 text-sm text-muted-foreground">Enter email or phone to start tracking.</p>
            </div>
          ) : isLoading ? (
            <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-border/60 bg-muted/20">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">Fetching your orders...</p>
            </div>
          ) : isError ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Could not load orders</span>
              </div>
              <p className="mt-2 text-destructive/90">{error?.message}</p>
            </div>
          ) : sortedOrders.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-border/60 bg-muted/10 text-center">
              <Package className="h-8 w-8 text-muted-foreground/50" />
              <p className="mt-3 text-sm text-muted-foreground">No orders found for that contact.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedOrders.map((order) => (
                <DrawerOrderCard
                  key={order.id}
                  order={order}
                  imageByMenuItemId={imageByMenuItemId}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
