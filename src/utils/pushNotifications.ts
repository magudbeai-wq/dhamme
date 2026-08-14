export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  url?: string;
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      return registration;
    } catch (error) {
      console.warn('Service Worker registration notice:', error);
      return null;
    }
  }
  return null;
}

export function getPushPermissionStatus(): NotificationPermission {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    return Notification.permission;
  }
  return 'denied';
}

export async function requestPushPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      await registerServiceWorker();
      return true;
    }
    return false;
  } catch (error) {
    console.warn('Notification permission request notice:', error);
    return false;
  }
}

export async function triggerWebPushNotification(payload: PushPayload): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    return false;
  }

  try {
    const registration = await registerServiceWorker();

    if (registration && 'showNotification' in registration) {
      const options: any = {
        body: payload.body,
        icon: payload.icon || '/jigjiga-house-1.jpg',
        badge: '/jigjiga-house-1.jpg',
        vibrate: [200, 100, 200],
        data: { url: payload.url || '/' }
      };
      await registration.showNotification(payload.title, options);
      return true;
    } else {
      new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/jigjiga-house-1.jpg'
      });
      return true;
    }
  } catch (error) {
    console.warn('Web Push Notification trigger notice:', error);
    return false;
  }
}
