"use client";

import { Bell, BellOff, BellRing, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type NotificationPermission = "default" | "granted" | "denied" | "unsupported";

interface ToastState {
  message: string;
  type: "success" | "error" | "info";
  visible: boolean;
}

export function NotificationSubscribe() {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastState>({
    message: "",
    type: "info",
    visible: false,
  });

  const showToast = useCallback((message: string, type: ToastState["type"]) => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  }, []);

  // 初期化: Notification API サポート確認、購読状態確認
  useEffect(() => {
    const initialize = async () => {
      // Notification API サポート確認
      if (!("Notification" in window)) {
        setPermission("unsupported");
        setLoading(false);
        return;
      }

      // Service Worker サポート確認
      if (!("serviceWorker" in navigator)) {
        setPermission("unsupported");
        setLoading(false);
        return;
      }

      // 現在の権限状態を取得
      setPermission(Notification.permission as NotificationPermission);

      // Service Worker 登録確認と購読状態確認
      try {
        const registration =
          await navigator.serviceWorker.getRegistration("/news/sw.js");
        if (registration) {
          const subscription = await registration.pushManager.getSubscription();
          setSubscribed(!!subscription);
        }
      } catch (error) {
        console.error("Failed to check subscription status:", error);
      }

      setLoading(false);
    };

    initialize();
  }, []);

  // 購読処理
  const subscribe = async () => {
    setLoading(true);

    try {
      // 権限リクエスト
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult as NotificationPermission);

      if (permissionResult !== "granted") {
        showToast("通知の権限が拒否されました", "error");
        setLoading(false);
        return;
      }

      // Service Worker 登録
      const registration =
        await navigator.serviceWorker.register("/news/sw.js");
      await navigator.serviceWorker.ready;

      // 公開鍵取得
      const response = await fetch("/news/notifications/public-key");
      if (!response.ok) {
        throw new Error("Failed to fetch public key");
      }
      const { publicKey } = await response.json();

      // Push 購読
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      // サーバーに購読情報を送信
      const subscribeResponse = await fetch(
        "/news/notifications/subscriptions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subscription.toJSON()),
        }
      );

      if (!subscribeResponse.ok) {
        throw new Error("Failed to save subscription");
      }

      setSubscribed(true);
      showToast("通知を購読しました", "success");
    } catch (error) {
      console.error("Failed to subscribe:", error);
      showToast("購読に失敗しました", "error");
    }

    setLoading(false);
  };

  // 購読解除処理
  const unsubscribe = async () => {
    setLoading(true);

    try {
      const registration =
        await navigator.serviceWorker.getRegistration("/news/sw.js");
      if (!registration) {
        throw new Error("Service Worker not found");
      }

      const subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        throw new Error("No subscription found");
      }

      // サーバーから購読を削除
      const response = await fetch("/news/notifications/subscriptions", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete subscription");
      }

      // Push 購読解除
      await subscription.unsubscribe();

      setSubscribed(false);
      showToast("通知を解除しました", "success");
    } catch (error) {
      console.error("Failed to unsubscribe:", error);
      showToast("購読解除に失敗しました", "error");
    }

    setLoading(false);
  };

  // Base64 URL to Uint8Array 変換
  function urlBase64ToUint8Array(
    base64String: string
  ): Uint8Array<ArrayBuffer> {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const buffer = new ArrayBuffer(rawData.length);
    const outputArray = new Uint8Array(buffer);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // ボタンの状態に応じたコンテンツ
  const renderButtonContent = () => {
    if (loading) {
      return (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span>読み込み中...</span>
        </>
      );
    }

    if (permission === "unsupported") {
      return (
        <>
          <BellOff className="size-4" />
          <span>通知非対応</span>
        </>
      );
    }

    if (permission === "denied") {
      return (
        <>
          <BellOff className="size-4" />
          <span>通知がブロックされています</span>
        </>
      );
    }

    if (subscribed) {
      return (
        <>
          <BellRing className="size-4" />
          <span>通知を解除</span>
        </>
      );
    }

    return (
      <>
        <Bell className="size-4" />
        <span>通知を受け取る</span>
      </>
    );
  };

  const isDisabled =
    loading || permission === "unsupported" || permission === "denied";

  return (
    <div className="relative">
      <button
        className={cn(
          "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-all duration-200",
          "hover:bg-muted focus:outline-none focus:ring-2 focus:ring-muted focus:ring-offset-2",
          isDisabled && "cursor-not-allowed opacity-50",
          subscribed && "border-primary bg-primary/10 text-primary"
        )}
        disabled={isDisabled}
        onClick={subscribed ? unsubscribe : subscribe}
        type="button"
      >
        {renderButtonContent()}
      </button>

      {/* Toast */}
      <div
        className={cn(
          "absolute top-full left-0 mt-2 rounded-lg border px-4 py-2 text-sm shadow-lg transition-all duration-300",
          toast.visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0",
          toast.type === "success" &&
            "border-green-500 bg-green-50 text-green-700",
          toast.type === "error" && "border-red-500 bg-red-50 text-red-700",
          toast.type === "info" && "border-blue-500 bg-blue-50 text-blue-700"
        )}
      >
        {toast.message}
      </div>
    </div>
  );
}
