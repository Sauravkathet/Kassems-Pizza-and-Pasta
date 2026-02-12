"use client";

import { FormEvent, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useCustomerOrders } from "@/hooks/use-orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { KitchenOrder, OrderStatus } from "@shared/schema";
import {
  Clock,
  Loader2,
  Package,
  RefreshCcw,
  Search,
  Truck,
  CheckCircle2,
  ChefHat,
  UtensilsCrossed,
  Pizza,
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
} from "lucide-react";

// ============= STATUS CONFIGURATION =============
const STATUS_FLOW: OrderStatus[] = [
  "pending",
  "accepted",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
];

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    description: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  pending: {
    label: "Order Received",
    description: "We've received your order and it's in queue.",
    icon: Clock,
    color: "text-rose-700",
    bgColor: "bg-rose-100",
    borderColor: "border-rose-200",
  },
  accepted: {
    label: "Accepted",
    description: "The kitchen has accepted your order.",
    icon: CheckCircle2,
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-200",
  },
  preparing: {
    label: "Preparing",
    description: "Your food is being freshly prepared.",
    icon: ChefHat,
    color: "text-orange-700",
    bgColor: "bg-orange-100",
    borderColor: "border-orange-200",
  },
  ready: {
    label: "Ready",
    description: "Your order is packed and waiting.",
    icon: Package,
    color: "text-emerald-700",
    bgColor: "bg-emerald-100",
    borderColor: "border-emerald-200",
  },
  out_for_delivery: {
    label: "On The Way",
    description: "Your order is out for delivery.",
    icon: Truck,
    color: "text-indigo-700",
    bgColor: "bg-indigo-100",
    borderColor: "border-indigo-200",
  },
  delivered: {
    label: "Delivered",
    description: "Enjoy your meal! Thank you for ordering.",
    icon: ShoppingBag,
    color: "text-green-700",
    bgColor: "bg-green-100",
    borderColor: "border-green-200",
  },
};

// ============= HELPER FUNCTIONS =============
function formatTime(date: string | null) {
  if (!date) return "--:--";
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(date: string | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

// ============= ORDER PROGRESS TIMELINE =============
function OrderTimeline({ status }: { status: OrderStatus }) {
  const currentIndex = STATUS_FLOW.indexOf(status);

  return (
    <div className="relative mt-6">
      {/* Progress Line Background */}
      <div className="absolute left-0 top-5 h-0.5 w-full bg-muted" />
      
      {/* Progress Line Fill */}
      <div
        className="absolute left-0 top-5 h-0.5 bg-primary transition-all duration-700 ease-out"
        style={{ width: `${(currentIndex / (STATUS_FLOW.length - 1)) * 100}%` }}
      />

      {/* Status Steps */}
      <div className="relative flex justify-between">
        {STATUS_FLOW.map((step, index) => {
          const Icon = STATUS_CONFIG[step].icon;
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step} className="flex flex-col items-center text-center">
              <div
                className={cn(
                  "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-background transition-all duration-300",
                  isCompleted
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/30 text-muted-foreground/50",
                  isCurrent && "scale-110 shadow-lg ring-4 ring-primary/20"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <p
                className={cn(
                  "mt-2 text-xs font-medium md:text-sm",
                  isCompleted ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {STATUS_CONFIG[step].label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============= ORDER ITEM CARD =============
function OrderItem({
  item,
}: {
  item: { id: number; name: string; quantity: number; price?: number; imageUrl?: string | null };
}) {
  // Fallback image based on item name (for prototype)
  const getImageSrc = () => {
    if (item.imageUrl) return item.imageUrl;
    const name = item.name.toLowerCase();
    if (name.includes("pizza"))
      return "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=300";
    if (name.includes("pasta"))
      return "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=300";
    if (name.includes("salad"))
      return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=300";
    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300";
  };

  return (
    <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-2 transition-all hover:bg-muted/50">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-border">
        <img
          src={getImageSrc()}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium">{item.name}</p>
        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
      </div>
      {item.price && (
        <span className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
      )}
    </div>
  );
}

// ============= ORDER CARD =============
function OrderCard({ order }: { order: KitchenOrder }) {
  const statusMeta = STATUS_CONFIG[order.status];
  const StatusIcon = statusMeta.icon;

  // Mock customizations – in a real app, you'd fetch these from order.customizations
  const hasCustomizations = order.status !== "delivered" && order.items.length > 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="group"
    >
      <Card className="overflow-hidden border-2 border-transparent bg-white/90 shadow-md backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-xl">
        <CardContent className="p-0">
          {/* Order Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/60 bg-gradient-to-r from-muted/20 to-transparent p-5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl font-bold">Order #{order.id}</h3>
                <Badge
                  variant="outline"
                  className={cn(
                    "gap-1.5 border px-3 py-1",
                    statusMeta.bgColor,
                    statusMeta.color,
                    statusMeta.borderColor
                  )}
                >
                  <StatusIcon className="h-3.5 w-3.5" />
                  {statusMeta.label}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Placed on {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Estimated total</p>
              <p className="text-2xl font-bold text-primary">
                ${Number(order.totalAmount).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-5">
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Your Items
            </h4>
            <div className="space-y-2">
              {order.items.map((item) => (
                <OrderItem key={item.id} item={item} />
              ))}
            </div>

            {/* Customizations (mock) */}
            {hasCustomizations && (
              <div className="mt-4 rounded-lg bg-muted/20 p-3 text-xs">
                <p className="font-medium text-muted-foreground">Customizations</p>
                <ul className="mt-1 list-inside list-disc space-y-0.5 text-muted-foreground">
                  <li>Size: Medium (12")</li>
                  <li>Crust: Classic Hand-Tossed</li>
                  <li>Extra toppings: Extra Cheese, Mushrooms</li>
                </ul>
              </div>
            )}

            {/* Order Timeline */}
            <div className="mt-6">
              <OrderTimeline status={order.status} />
            </div>

            {/* Delivery Info (if applicable) */}
            {(order.status === "out_for_delivery" || order.status === "delivered") && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50/50 p-3 text-sm text-indigo-800">
                <Truck className="h-4 w-4" />
                <span>Your order is with our delivery partner.</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.article>
  );
}

// ============= SEARCH FORM =============
function SearchForm({
  emailInput,
  phoneInput,
  onEmailChange,
  onPhoneChange,
  onSubmit,
  isFetching,
  onRefresh,
  hasLookup,
}: {
  emailInput: string;
  phoneInput: string;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  isFetching: boolean;
  onRefresh: () => void;
  hasLookup: boolean;
}) {
  return (
    <Card className="border-none bg-white/80 shadow-lg backdrop-blur-md">
      <CardContent className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold">Track Your Order</h2>
            <p className="text-sm text-muted-foreground">
              Enter the email or phone number you used at checkout.
            </p>
          </div>
          <Badge variant="outline" className="gap-2 border-blue-200 bg-blue-50 px-3 py-1.5 text-blue-700">
            <Clock className="h-3.5 w-3.5" />
            Auto-refresh every 5s
          </Badge>
        </div>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email address"
              value={emailInput}
              onChange={(e) => onEmailChange(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Phone number"
              value={phoneInput}
              onChange={(e) => onPhoneChange(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit" size="lg" className="gap-2">
            <Search className="h-4 w-4" />
            Find Orders
          </Button>
        </form>

        {hasLookup && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Showing orders for {emailInput || phoneInput}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isFetching}
              className="gap-2"
            >
              <RefreshCcw className={cn("h-3.5 w-3.5", isFetching && "animate-spin")} />
              Refresh
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============= MAIN COMPONENT =============
export default function TrackOrder() {
  const [location, setLocation] = useLocation();

  const initialQuery = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      email: params.get("email") ?? "",
      phone: params.get("phone") ?? "",
    };
  }, [location]);

  const [emailInput, setEmailInput] = useState(initialQuery.email);
  const [phoneInput, setPhoneInput] = useState(initialQuery.phone);
  const [lookup, setLookup] = useState<{ email?: string; phone?: string }>(() => ({
    email: initialQuery.email || undefined,
    phone: initialQuery.phone || undefined,
  }));

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

  const onSearch = (event: FormEvent) => {
    event.preventDefault();
    const email = emailInput.trim();
    const phone = phoneInput.trim();
    if (!email && !phone) return;

    const params = new URLSearchParams();
    if (email) params.set("email", email);
    if (phone) params.set("phone", phone);
    setLocation(`/track-order?${params.toString()}`);

    setLookup({
      email: email || undefined,
      phone: phone || undefined,
    });
  };

  const hasLookup = !!lookup.email || !!lookup.phone;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 pb-16 pt-28">
      <div className="container mx-auto max-w-5xl px-4">
        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <SearchForm
            emailInput={emailInput}
            phoneInput={phoneInput}
            onEmailChange={setEmailInput}
            onPhoneChange={setPhoneInput}
            onSubmit={onSearch}
            isFetching={isFetching}
            onRefresh={refetch}
            hasLookup={hasLookup}
          />
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {!hasLookup ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white/50 p-16 text-center backdrop-blur-sm"
            >
              <div className="rounded-full bg-muted p-4">
                <Search className="h-8 w-8 text-muted-foreground/60" />
              </div>
              <h3 className="mt-4 font-serif text-xl font-semibold">No search yet</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-md">
                Enter your email or phone number above to track your current and past orders.
              </p>
            </motion.div>
          ) : isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center rounded-2xl bg-white/70 p-16 backdrop-blur-sm"
            >
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-sm text-muted-foreground">Fetching your orders...</p>
            </motion.div>
          ) : isError ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center"
            >
              <AlertCircle className="h-8 w-8 text-destructive" />
              <h3 className="mt-3 font-semibold text-destructive">Something went wrong</h3>
              <p className="mt-1 text-sm text-destructive/80">{error?.message}</p>
              <Button variant="outline" onClick={() => refetch()} className="mt-4">
                Try Again
              </Button>
            </motion.div>
          ) : sortedOrders.length === 0 ? (
            <motion.div
              key="no-orders"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center rounded-2xl border border-border bg-white/70 p-16 text-center backdrop-blur-sm"
            >
              <div className="rounded-full bg-muted p-4">
                <Package className="h-8 w-8 text-muted-foreground/60" />
              </div>
              <h3 className="mt-4 font-serif text-xl font-semibold">No orders found</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-md">
                We couldn't find any orders matching{" "}
                {lookup.email && <span className="font-medium">{lookup.email}</span>}
                {lookup.phone && <span className="font-medium"> {lookup.phone}</span>}.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="orders"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {sortedOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-muted-foreground/70">
            Need help? Contact us at{" "}
            <a href="mailto:support@kassems.com" className="underline hover:text-primary">
              support@kassems.com
            </a>{" "}
            or call (555) 123-4567.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
