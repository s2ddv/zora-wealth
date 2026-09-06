"use client";

import Image from "next/image";

interface TopbarProps {
  userName?: string;
  avatarUrl?: string;
  hasUnreadNotifications?: boolean;
  onSearch?: () => void;
  onNotifications?: () => void;
  onAvatarClick?: () => void;
}

export function Topbar({
  userName = "User",
  avatarUrl,
  hasUnreadNotifications = false,
  onSearch,
  onNotifications,
  onAvatarClick,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-auto w-full items-end justify-between bg-background/80 px-8 py-4 backdrop-blur-md">
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <button
          onClick={onSearch}
          aria-label="Search"
          className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-variant/50 hover:text-primary"
        >
          <span className="material-symbols-outlined">search</span>
        </button>

        <button
          onClick={onNotifications}
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-variant/50 hover:text-primary"
        >
          <span className="material-symbols-outlined">notifications</span>
          {hasUnreadNotifications && (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
          )}
        </button>

        <button
          onClick={onAvatarClick}
          aria-label={`${userName} account`}
          className="ml-2 h-10 w-10 overflow-hidden rounded-full border border-outline-variant/50 bg-surface-container-high"
        >
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={userName}
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-body-sm font-medium text-on-surface-variant">
              {userName[0]?.toUpperCase()}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}