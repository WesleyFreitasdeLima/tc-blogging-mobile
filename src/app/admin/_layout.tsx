
import { Slot, router, usePathname } from 'expo-router';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import {
  FileText,
  GraduationCap,
  LayoutDashboard,
  Users,
} from 'lucide-react-native';

import {
  currentUser,
  getInitials,
} from '../../data/user';

import { useAuth } from '@/shared/contexts/auth';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';


const menuItems = [
  { label: 'Início', route: '/admin', icon: LayoutDashboard },
  { label: 'Posts', route: '/admin/posts', icon: FileText },
  { label: 'Professores', route: '/admin/teachers', icon: Users },
  { label: 'Alunos', route: '/admin/students', icon: GraduationCap },
];

export default function AdminLayout() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isMobile = width < 600;
  const isAdmin = user?.role === 'ADMIN';
  const isTeachersRoute = pathname.startsWith('/admin/teachers');
  const visibleMenuItems = menuItems.filter(
    (item) => item.route !== '/admin/teachers' || isAdmin,
  );

  useEffect(() => {
    if (!loading && isTeachersRoute && !isAdmin) {
      router.replace('/admin');
    }
  }, [isAdmin, isTeachersRoute, loading]);

  function isActive(route: string) {
    if (route === '/admin') {
      return pathname === '/admin';
    }

    return (
      pathname === route ||
      pathname.startsWith(`${route}/`)
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.main} edges={['top', 'left', 'right']}>
        {isTeachersRoute && (loading || !isAdmin) ? (
          <View style={styles.accessLoading}>
            <ActivityIndicator size="large" color="#4F46E5" />
          </View>
        ) : (
          <Slot />
        )}
      </SafeAreaView>

      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        {visibleMenuItems.map((item) => {
          const active = isActive(item.route);
          const Icon = item.icon;

          return (
            <Pressable
              key={item.route}
              onPress={() => router.navigate(item.route as never)}
              style={styles.navItem}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.4 : 1.8}
                color={active ? '#4F46E5' : '#64748B'}
              />

              <Text
                numberOfLines={1}
                style={[
                  styles.navLabel,
                  active && styles.activeText,
                  isMobile && styles.mobileLabel,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}

        <Pressable
          onPress={() => router.navigate('/admin/profile')}
          style={styles.navItem}
        >
          <View
            style={[
              styles.avatar,
              pathname.startsWith('/admin/perfil') &&
                styles.avatarActive,
            ]}
          >
            <Text style={styles.avatarText}>
              {getInitials(currentUser.name)}
            </Text>
          </View>

          <Text
            numberOfLines={1}
            style={[
              styles.navLabel,
              pathname.startsWith('/admin/perfil') &&
                styles.activeText,
              isMobile && styles.mobileLabel,
            ]}
          >
            Perfil
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  main: {
    flex: 1,
    minHeight: 0,
  },

  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 6,
  },

  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 2,
    minWidth: 0,
  },

  navIcon: {
    color: '#64748B',
    fontSize: 21,
  },

  navLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '500',
  },

  mobileLabel: {
    fontSize: 9,
  },

  activeText: {
    color: '#4F46E5',
    fontWeight: '700',
  },

  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarActive: {
    backgroundColor: '#4F46E5',
  },

  avatarText: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '800',
  },

  backToSite: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },

  backToSiteText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },

  pageContent: {
    flex: 1,
    minHeight: 0,
  },
  accessLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
