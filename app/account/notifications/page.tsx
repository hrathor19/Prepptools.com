"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, MessageSquare, CheckCheck } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { getAuthClient } from "@/components/AuthProvider";

type Notification = {
  id: string;
  type: string;
  message: string;
  link: string | null;
  read: boolean;
  created_at: string;
};

export default function NotificationsPage() {
  const { user, loading, refreshUnread } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const client = getAuthClient();
    client
      .from("user_notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setNotifications(data ?? []);
        setFetching(false);
      });
  }, [user]);

  const markAllRead = async () => {
    if (!user) return;
    const client = getAuthClient();
    await client
      .from("user_notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    refreshUnread();
  };

  const markRead = async (id: string) => {
    const client = getAuthClient();
    await client.from("user_notifications").update({ read: true }).eq("id", id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    refreshUnread();
  };

  const unread = notifications.filter((n) => !n.read).length;

  if (loading || fetching) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 flex justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          {unread > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unread}</span>
          )}
        </div>
        {unread > 0 && (
          <button onClick={markAllRead}
            className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline">
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">You'll be notified when someone replies to your Q&A</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => { markRead(n.id); if (n.link) router.push(n.link); }}
              className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                n.read
                  ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
              }`}
            >
              <div className={`mt-0.5 p-2 rounded-lg ${n.read ? "bg-gray-100 dark:bg-gray-700" : "bg-blue-100 dark:bg-blue-900/40"}`}>
                <MessageSquare className={`w-4 h-4 ${n.read ? "text-gray-500" : "text-blue-600 dark:text-blue-400"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${n.read ? "text-gray-600 dark:text-gray-300" : "text-gray-900 dark:text-white font-medium"}`}>
                  {n.message}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {new Date(n.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
