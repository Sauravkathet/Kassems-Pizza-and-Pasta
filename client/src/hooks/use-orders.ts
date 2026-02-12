import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, customerOrdersPath, orderPath, orderStatusPath, type CreateOrderRequest } from "@shared/routes";
import type { OrderStatus } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useCreateOrder() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateOrderRequest) => {
      const res = await fetch(api.orders.create.path, {
        method: api.orders.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.orders.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to place order");
      }
      return api.orders.create.responses[201].parse(await res.json());
    },
    onError: (error) => {
      toast({
        title: "Order Failed",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [api.orders.kitchenList.path],
      });
    },
  });
}

export function useKitchenOrders() {
  return useQuery({
    queryKey: [api.orders.kitchenList.path],
    queryFn: async () => {
      const res = await fetch(api.orders.kitchenList.path);
      if (!res.ok) {
        throw new Error("Failed to fetch kitchen orders");
      }
      return api.orders.kitchenList.responses[200].parse(await res.json());
    },
    staleTime: 0,
    refetchInterval: 15000,
  });
}

export function useCustomerOrders(email?: string, phone?: string) {
  const hasLookup = Boolean(email || phone);

  return useQuery({
    queryKey: [api.orders.customerList.path, email ?? "", phone ?? ""],
    enabled: hasLookup,
    queryFn: async () => {
      const res = await fetch(customerOrdersPath(email, phone));
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.orders.customerList.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to fetch customer orders");
      }
      return api.orders.customerList.responses[200].parse(await res.json());
    },
    staleTime: 0,
    refetchInterval: 5000,
  });
}

type UpdateOrderStatusInput = {
  orderId: number;
  status: OrderStatus;
};

export function useUpdateOrderStatus() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: UpdateOrderStatusInput) => {
      const res = await fetch(orderStatusPath(orderId), {
        method: api.orders.updateStatus.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.orders.updateStatus.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        if (res.status === 404) {
          const error = api.orders.updateStatus.responses[404].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to update order status");
      }

      return api.orders.updateStatus.responses[200].parse(await res.json());
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [api.orders.kitchenList.path],
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteDeliveredOrder() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: number) => {
      const res = await fetch(orderPath(orderId), {
        method: api.orders.deleteDelivered.method,
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.orders.deleteDelivered.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        if (res.status === 404) {
          const error = api.orders.deleteDelivered.responses[404].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to delete order");
      }
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [api.orders.kitchenList.path],
        }),
        queryClient.invalidateQueries({
          queryKey: [api.orders.customerList.path],
        }),
      ]);
    },
    onError: (error) => {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useKitchenRealtime() {
  const queryClient = useQueryClient();
  const [isLive, setIsLive] = useState(false);
  const reconnectTimerRef = useRef<number | null>(null);

  useEffect(() => {
    let socket: WebSocket | null = null;
    let stopped = false;

    const connect = () => {
      if (stopped) return;

      const protocol = window.location.protocol === "https:" ? "wss" : "ws";
      socket = new WebSocket(`${protocol}://${window.location.host}/ws/kitchen`);

      socket.onopen = () => {
        setIsLive(true);
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data) as {
            type?: string;
            data?: unknown;
          };

          if (payload.type !== "kitchen:orders") {
            return;
          }

          const orders = api.orders.kitchenList.responses[200].parse(payload.data);
          queryClient.setQueryData([api.orders.kitchenList.path], orders);
          void queryClient.invalidateQueries({
            queryKey: [api.orders.customerList.path],
          });
        } catch {
          // Ignore malformed payloads; next valid message will sync state.
        }
      };

      socket.onclose = () => {
        setIsLive(false);
        if (!stopped) {
          reconnectTimerRef.current = window.setTimeout(connect, 2000);
        }
      };

      socket.onerror = () => {
        setIsLive(false);
      };
    };

    connect();

    return () => {
      stopped = true;
      setIsLive(false);
      if (reconnectTimerRef.current !== null) {
        window.clearTimeout(reconnectTimerRef.current);
      }
      if (!socket) return;

      // Detach listeners first to avoid state updates after unmount.
      socket.onopen = null;
      socket.onmessage = null;
      socket.onclose = null;
      socket.onerror = null;

      if (socket.readyState === WebSocket.OPEN) {
        socket.close(1000, "kitchen hook cleanup");
        return;
      }

      if (socket.readyState === WebSocket.CONNECTING) {
        // Closing a CONNECTING socket can spam "closed before established" in dev tools.
        socket.addEventListener(
          "open",
          () => {
            socket?.close(1000, "kitchen hook cleanup");
          },
          { once: true },
        );
      }
    };
  }, [queryClient]);

  return { isLive };
}
