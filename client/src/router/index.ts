import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ProfileView from '@/views/ProfileView.vue'
import LabRulesView from '@/views/LabRulesView.vue';
import HistoryView from '@/views/HistoryView.vue';
import AnnouncementView from '@/views/AnnouncementView.vue';
import ReservationView from '@/views/ReservationView.vue';
import SearchStudentView from '@/views/StudentsView.vue';
import SitinsView from '@/views/SitinsView.vue';
import CreateAnnouncementView from '@/views/CreateAnnouncementView.vue';
import SitinRecordsView from '@/views/SitinRecordsView.vue';
import FeedbackView from '@/views/FeedbackView.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/lab-rules',
      name: 'lab-rules',
      component: LabRulesView
    },
    {
      path: '/history',
      name: 'history',
      component: HistoryView
    },
    {
      path: '/announcement',
      name: 'announcement',
      component: AnnouncementView
    },
    {
      path: '/reservation',
      name: 'reservation',
      component: ReservationView
    },
    {
      path: '/students',
      name: 'students',
      component: SearchStudentView
    },
    {
      path: '/sitins',
      name: 'sitins',
      component: SitinsView
    },
    {
      path: '/announce',
      name: 'announce',
      component: CreateAnnouncementView
    },
    {
      path: '/records',
      name: 'records',
      component: SitinRecordsView
    },
    {
      path: '/feedbacks',
      name: 'feedbacks',
      component: FeedbackView
    }
  ],
})

export default router
