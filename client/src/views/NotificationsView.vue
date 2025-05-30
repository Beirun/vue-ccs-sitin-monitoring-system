<script setup lang="ts">
import { ref, computed, onMounted, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { setDate } from '@/library/date'; // Your time formatting utility
import type { Notification } from '@/types/Notification';
// Shadcn-vue Components
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useStudentStore, useNotificationStore } from '@/stores/student.store';
import { getNotifications, updateNotification } from '@/api/notification';
const studentStore = useStudentStore();

const notificationStore = useNotificationStore();
// Lucide Icons
import {
  BellRing, Check, Trash2, EllipsisVertical, Archive, MailOpen, Filter, X
} from 'lucide-vue-next';



const router = useRouter(); // Kept for potential future use, though not used with link removal
const isLoading = ref(true);
const notifications = ref<Notification[]>([]);
const activeTab = ref<'all' | 'unread'>('all');

// Mock Data - Replace with actual API call
const fetchNotifications = async () => {
  isLoading.value = true;
  // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

  // Explicitly type the mock data array here
  notificationStore.fetchNotifications(studentStore.user.type === "admin" ? "0" : studentStore.student.idno)
  notifications.value = notificationStore.notifications;
  isLoading.value = false;
};


onBeforeMount(async () => {
  fetchNotifications();
});

const filteredNotifications = computed(() => {
  if (activeTab.value === 'unread') {
    return notifications.value.filter(n => n.status === 'unread');
  }
  return notifications.value;
});

const unreadCount = computed(() => notifications.value.filter(n => n.status === 'unread').length);

const markAsRead = async (notifId: string) => {
  const notification = notifications.value.find(n => n.notif_id === notifId);
  if (notification) {
    notification.status = 'read';
    // API call to mark as read on backend
    await updateNotification(notifId);
    notificationStore.fetchNotifications(studentStore.user.type === "admin" ? "0" : studentStore.student.idno)
    console.log(`Notification ${notifId} marked as read.`);
  }
};

const markAsUnread = async (notifId: string) => {
  const notification = notifications.value.find(n => n.notif_id === notifId);
  if (notification) {
    notification.status = 'unread';
    // API call to mark as unread on backend
    await updateNotification(notifId, 'unread');
    notificationStore.fetchNotifications(studentStore.user.type === "admin" ? "0" : studentStore.student.idno)
    console.log(`Notification ${notifId} marked as unread.`);
     }
}

const markAllAsRead = async() => {
  notifications.value.forEach(async(n) => {
    if (n.status === 'unread') {
      n.status = 'read';
      await updateNotification(n.notif_id);
      notificationStore.fetchNotifications(studentStore.user.type === "admin" ? "0" : studentStore.student.idno)
    }
  });
  // API call to mark all as read on backend
  console.log('All notifications marked as read.');
};

const deleteNotification = async(notifId: string) => {
  notifications.value = notifications.value.filter(n => n.notif_id !== notifId);
  // API call to delete on backend
  await deleteNotification(notifId);
notificationStore.fetchNotifications(studentStore.user.type === "admin" ? "0" : studentStore.student.idno)
  notifications.value = notificationStore.notifications;
  console.log(`Notification ${notifId} deleted.`);
};

const handleItemClick = (notification: Notification) => {
  if (notification.status === 'unread') {
    markAsRead(notification.notif_id);
  }
  // If you want to navigate somewhere based on notification type or other properties,
  // you can add that logic here.
  // e.g., if (notification.type === 'alert' && notification.title.includes('Password')) {
  // router.push('/profile/security');
  // }
  console.log(`Clicked notification: ${notification.title}`);
};

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'alert': return BellRing; // Or ShieldAlert
    case 'update': return Archive; // Or ArrowUpCircle
    case 'message': return MailOpen; // Or MessageSquare
    case 'system': default: return BellRing; // Or Cog
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#181818] text-neutral-100 p-4 md:p-6 lg:p-8">
    <header class="mb-6 md:mb-8 h-15">
      <h1 class="text-3xl md:text-4xl font-bold text-neutral-50">Notifications</h1>
      <p v-if="!isLoading && unreadCount > 0" class="text-sm text-neutral-400 mt-1">
        You have {{ unreadCount }} unread notification{{ unreadCount === 1 ? '' : 's' }}.
      </p>
    </header>

    <div class="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
      <Tabs v-model="activeTab" class="w-full sm:w-auto ">
        <TabsList class="grid w-full h-full grid-cols-2 sm:w-auto bg-[#2a2a2a] border border-[#333333] p-1">
          <TabsTrigger
            value="all"
            class="px-4 py-2 text-sm data-[state=active]:bg-[#00BD7E] data-[state=active]:text-white text-neutral-300 hover:text-neutral-100 transition-colors"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="unread"
            class="px-4 py-2 text-sm data-[state=active]:bg-[#00BD7E] data-[state=active]:text-white text-neutral-300 hover:text-neutral-100 transition-colors"
          >
            Unread <span v-if="unreadCount > 0" class="ml-1.5 bg-opacity-50 bg-[#00BD7E]/70 text-white text-xs px-1.5 py-0.5 rounded-full">{{ unreadCount }}</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Button
        v-if="unreadCount > 0 && !isLoading"
        @click="markAllAsRead"
        variant="outline"
        size="sm"
        class="border-[#00BD7E] text-[#00BD7E] hover:bg-[#00BD7E]/10 hover:text-[#00BD7E] w-full sm:w-auto"
      >
        <Check class="mr-2 h-4 w-4" />
        Mark all as read
      </Button>
    </div>

    <!-- Loading Skeletons -->
    <div v-if="isLoading" class="space-y-4">
      <div v-for="i in 4" :key="`skel-${i}`" class="flex items-start p-4 bg-[#222222] rounded-lg shadow-md border border-[#333333] space-x-4">
        <Skeleton class="h-8 w-8 rounded-full bg-[#333333]" />
        <div class="flex-1 space-y-2">
          <Skeleton class="h-4 w-3/4 bg-[#333333]" />
          <Skeleton class="h-4 w-full bg-[#333333]" />
          <Skeleton class="h-3 w-1/4 bg-[#333333]" />
        </div>
        <Skeleton class="h-6 w-6 bg-[#333333]" />
      </div>
    </div>

    <!-- Notifications List -->
    <div v-else-if="filteredNotifications.length > 0" class="space-y-3 md:space-y-4">
      <div
        v-for="notification in filteredNotifications"
        :key="notification.notif_id"
        @click="handleItemClick(notification)"
        class="flex items-start p-4 bg-[#222222] rounded-lg shadow-sm border transition-all duration-200 ease-in-out cursor-pointer"
        :class="[
          notification.status === 'read' ? 'border-[#333333] hover:border-[#444444]' : 'border-[#00BD7E]/50 hover:border-[#00BD7E]/80 shadow-lg shadow-[#00BD7E]/5',
        ]"
      >
        <!-- Icon -->
        <div
          class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 mt-1"
          :class="notification.status === 'read' ? 'bg-[#333333]' : 'bg-[#00BD7E]/20'"
        >
          <component
            :is="getNotificationIcon(notification.type)"
            class="w-5 h-5"
            :class="notification.status === 'read' ? 'text-neutral-400' : 'text-[#00BD7E]'"
          />
        </div>

        <!-- Content -->
        <div class="flex-grow">
          <div class="flex justify-between items-start">
            <h3 class="font-semibold text-md text-neutral-100 mb-0.5 line-clamp-1" :class="{'!text-neutral-300': notification.status === 'read'}">
              {{ notification.title }}
            </h3>
            <span v-if="notification.status === 'unread'" class="ml-2 mt-1.5 h-2 w-2 bg-[#00BD7E] rounded-full flex-shrink-0" title="Unread"></span>
          </div>
          <p class="text-sm text-neutral-300 line-clamp-2 mb-1" :class="{'!text-neutral-400': notification.status === 'read'}">{{ notification.message }}</p>
          <p class="text-xs text-neutral-500">
            {{ setDate(notification.createdat) }}
            <!-- Removed sender info: <span v-if="notification.sender"> • From: {{ notification.sender.name }}</span> -->
          </p>
        </div>

        <!-- Actions Dropdown -->
        <div class="ml-2 flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button @click.stop  variant="ghost" size="icon" class="h-8 w-8 text-neutral-400 hover:bg-[#333333] hover:text-neutral-100">
                <EllipsisVertical class="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="bg-[#2a2a2a] border-[#444444] text-neutral-100 w-48 shadow-xl">
              <DropdownMenuItem v-if="notification.status === 'read'" @click.stop="markAsUnread(notification.notif_id)" class="hover:!bg-[#333333] focus:!bg-[#333333] cursor-pointer">
                <MailOpen class="mr-2 h-4 w-4 text-[#00BD7E]" />
                <span>Mark as Unread</span>
              </DropdownMenuItem>
              <DropdownMenuItem v-else @click.stop="markAsRead(notification.notif_id)" class="hover:!bg-[#333333] focus:!bg-[#333333] cursor-pointer">
                <Check class="mr-2 h-4 w-4 text-[#00BD7E]" />
                <span>Mark as Read</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator class="bg-[#444444]" />
              <DropdownMenuItem @click.stop="deleteNotification(notification.notif_id)" class="text-red-500 hover:!bg-red-500/10 focus:!bg-red-500/10 hover:!text-red-400 focus:!text-red-400 cursor-pointer">
                <Trash2 class="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16">
      <Filter class="mx-auto h-12 w-12 text-neutral-500 mb-4" />
      <h3 class="text-xl font-semibold text-neutral-300 mb-2">
        {{ activeTab === 'unread' ? 'No Unread Notifications' : 'No Notifications Yet' }}
      </h3>
      <p class="text-neutral-400">
        {{ activeTab === 'unread' ? 'You\'re all caught up!' : 'Check back later for updates.' }}
      </p>
    </div>

  </div>
</template>

<style scoped>
/* For line-clamp to work, @tailwindcss/line-clamp plugin must be installed and configured */
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>