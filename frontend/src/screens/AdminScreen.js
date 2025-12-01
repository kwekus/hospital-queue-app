/**
 * Admin Screen - Queue Management Dashboard
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TextInput,
  Modal,
  RefreshControl,
} from 'react-native';
import useQueueStore from '../store/queueStore';
import QueueCard from '../components/QueueCard';
import { colors, typography, spacing } from '../styles/theme';

const AdminScreen = () => {
  const {
    queue,
    isLoading,
    error,
    serveNext,
    resetQueue,
    fetchQueue,
    adminMode,
    setAdminMode,
  } = useQueueStore();

  const [refreshing, setRefreshing] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(!adminMode);
  const [authAttempts, setAuthAttempts] = useState(0);

  useEffect(() => {
    if (adminMode) {
      fetchQueue();
      const interval = setInterval(fetchQueue, 5000);
      return () => clearInterval(interval);
    }
  }, [adminMode]);

  const handleAdminAuth = () => {
    if (adminKey === 'admin-secret-key') {
      setAdminMode(true);
      setShowAuthModal(false);
      setAdminKey('');
      Alert.alert('Success', 'Admin mode activated');
    } else {
      setAuthAttempts(authAttempts + 1);
      Alert.alert('Error', 'Invalid admin key');
      if (authAttempts >= 3) {
        setShowAuthModal(false);
        Alert.alert('Security', 'Too many attempts. Please try again later.');
      }
    }
  };

  const handleServeNext = () => {
    if (queue.length === 0) {
      Alert.alert('Info', 'Queue is empty');
      return;
    }

    Alert.alert('Confirm', 'Serve the next patient?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      {
        text: 'Serve',
        onPress: async () => {
          const result = await serveNext(adminKey);
          if (result) {
            Alert.alert(
              'Success',
              `${result.name} has been served. Queue updated.`
            );
          } else {
            Alert.alert('Error', 'Failed to serve next patient');
          }
        },
      },
    ]);
  };

  const handleResetQueue = () => {
    Alert.alert(
      'Warning',
      'Are you sure you want to reset the entire queue? This cannot be undone.',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Reset',
          onPress: async () => {
            const result = await resetQueue(adminKey);
            if (result) {
              Alert.alert('Success', 'Queue has been reset');
            } else {
              Alert.alert('Error', 'Failed to reset queue');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleLogout = () => {
    setAdminMode(false);
    setShowAuthModal(true);
    setAdminKey('');
    Alert.alert('Info', 'Admin mode deactivated');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchQueue();
    setRefreshing(false);
  };

  if (!adminMode) {
    return (
      <Modal visible={showAuthModal} animationType="slide">
        <View style={styles.authContainer}>
          <View style={styles.authCard}>
            <Text style={styles.authTitle}>Admin Authentication</Text>
            <Text style={styles.authSubtitle}>
              Enter your admin key to access the dashboard
            </Text>

            <TextInput
              style={styles.authInput}
              placeholder="Enter admin key"
              placeholderTextColor={colors.lightGray}
              secureTextEntry
              value={adminKey}
              onChangeText={setAdminKey}
            />

            <TouchableOpacity
              style={styles.authButton}
              onPress={handleAdminAuth}
            >
              <Text style={styles.authButtonText}>Authenticate</Text>
            </TouchableOpacity>

            <Text style={styles.authHint}>
              Default admin key: admin-secret-key
            </Text>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>Queue Management</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Control Panel */}
      <View style={styles.controlPanel}>
        <TouchableOpacity
          style={[styles.controlButton, styles.serveButton]}
          onPress={handleServeNext}
          disabled={isLoading || queue.length === 0}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Text style={styles.controlButtonText}>Serve Next</Text>
              <Text style={styles.controlButtonSubtext}>Remove & Recalculate</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.resetButton]}
          onPress={handleResetQueue}
          disabled={isLoading}
        >
          <Text style={styles.controlButtonText}>Reset Queue</Text>
          <Text style={styles.controlButtonSubtext}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Queue Statistics */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statBoxLabel}>Patients</Text>
          <Text style={styles.statBoxValue}>{queue.length}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statBoxLabel}>Est. Time</Text>
          <Text style={styles.statBoxValue}>{Math.round(queue.length * 5)}m</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statBoxLabel}>Status</Text>
          <Text style={styles.statBoxValue}>
            {queue.length === 0 ? 'Empty' : 'Active'}
          </Text>
        </View>
      </View>

      {/* Error Message */}
      {error && (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Queue List */}
      <View style={styles.queueSection}>
        <Text style={styles.sectionTitle}>Current Queue</Text>
        {queue.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Queue is empty</Text>
          </View>
        ) : (
          queue.map((patient, index) => (
            <View key={patient.id} style={styles.queueItem}>
              <View style={styles.queueItemNumber}>
                <Text style={styles.queueItemNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.queueItemContent}>
                <Text style={styles.queueItemName}>{patient.name}</Text>
                <Text style={styles.queueItemMeta}>
                  Queue #{patient.queueNumber} • {patient.status}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  authCard: {
    width: '80%',
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: 12,
    elevation: 3,
  },
  authTitle: {
    ...typography.title,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  authSubtitle: {
    ...typography.body,
    color: colors.gray,
    marginBottom: spacing.lg,
  },
  authInput: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    color: colors.text,
  },
  authButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  authButtonText: {
    ...typography.buttonText,
    color: colors.white,
  },
  authHint: {
    ...typography.caption,
    color: colors.gray,
    textAlign: 'center',
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    ...typography.title,
    color: colors.primary,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.gray,
  },
  logoutButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.error,
    borderRadius: 6,
  },
  logoutButtonText: {
    ...typography.caption,
    color: colors.white,
  },
  controlPanel: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  controlButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serveButton: {
    backgroundColor: colors.success,
  },
  resetButton: {
    backgroundColor: colors.warning,
  },
  controlButtonText: {
    ...typography.buttonText,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  controlButtonSubtext: {
    ...typography.caption,
    color: colors.white,
    opacity: 0.8,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  statBox: {
    flex: 1,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 1,
  },
  statBoxLabel: {
    ...typography.caption,
    color: colors.gray,
  },
  statBoxValue: {
    ...typography.title,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  queueSection: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  queueItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: spacing.md,
    overflow: 'hidden',
    elevation: 1,
  },
  queueItemNumber: {
    width: 60,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  queueItemNumberText: {
    ...typography.title,
    color: colors.white,
  },
  queueItemContent: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
  },
  queueItemName: {
    ...typography.subheading,
    color: colors.text,
  },
  queueItemMeta: {
    ...typography.caption,
    color: colors.gray,
    marginTop: spacing.xs,
  },
  emptyState: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyStateText: {
    ...typography.body,
    color: colors.gray,
  },
  errorCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.error,
    borderRadius: 8,
  },
  errorText: {
    ...typography.caption,
    color: colors.white,
  },
});

export default AdminScreen;
