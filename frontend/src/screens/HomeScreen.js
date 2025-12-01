/**
 * Home Screen - Patient Registration & Queue Status
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import useQueueStore from '../store/queueStore';
import QueueCard from '../components/QueueCard';
import { colors, typography, spacing } from '../styles/theme';

const HomeScreen = () => {
  const {
    queue,
    userName,
    userQueueNumber,
    isLoading,
    error,
    joinQueue,
    fetchQueue,
    loadUserData,
    getUserPosition,
    clearError,
  } = useQueueStore();

  const [name, setName] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUserData();
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000); // Auto-refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleJoinQueue = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    const result = await joinQueue(name);
    if (result) {
      setName('');
      Alert.alert(
        'Success',
        `${result.name}, you are number ${result.queueNumber} in the queue`
      );
    } else {
      Alert.alert('Error', error || 'Failed to join queue');
    }
    clearError();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchQueue();
    setRefreshing(false);
  };

  const userPosition = getUserPosition();

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hospital Queue</Text>
        <Text style={styles.headerSubtitle}>Management System</Text>
      </View>

      {/* User Status */}
      {userQueueNumber && (
        <View style={styles.userStatusCard}>
          <Text style={styles.userStatusLabel}>Your Status</Text>
          <Text style={styles.userStatusName}>{userName}</Text>
          <Text style={styles.userStatusNumber}>Queue #{userQueueNumber}</Text>
          {userPosition && (
            <Text style={styles.userPosition}>
              You are #{userPosition} in line
            </Text>
          )}
        </View>
      )}

      {/* Join Queue Form */}
      {!userQueueNumber && (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Register for Queue</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor={colors.lightGray}
            value={name}
            onChangeText={setName}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleJoinQueue}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>Join Queue</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Error Message */}
      {error && (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Queue List */}
      <View style={styles.queueSection}>
        <Text style={styles.sectionTitle}>
          Queue Status ({queue.length} patients)
        </Text>
        {isLoading && queue.length === 0 ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : queue.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Queue is empty</Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.queueList}
          >
            {queue.map((patient, index) => (
              <QueueCard key={patient.id} patient={patient} position={index + 1} />
            ))}
          </ScrollView>
        )}
      </View>

      {/* Queue Details */}
      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total in Queue</Text>
          <Text style={styles.statValue}>{queue.length}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Estimated Wait</Text>
          <Text style={styles.statValue}>{Math.round(queue.length * 5)}m</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    ...typography.title,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.gray,
  },
  userStatusCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.success,
    borderRadius: 12,
  },
  userStatusLabel: {
    ...typography.caption,
    color: colors.white,
    opacity: 0.8,
  },
  userStatusName: {
    ...typography.subheading,
    color: colors.white,
    marginTop: spacing.sm,
  },
  userStatusNumber: {
    ...typography.display,
    color: colors.white,
    marginTop: spacing.xs,
  },
  userPosition: {
    ...typography.caption,
    color: colors.white,
    marginTop: spacing.sm,
    opacity: 0.9,
  },
  formCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: 12,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formTitle: {
    ...typography.subheading,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    color: colors.text,
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    ...typography.buttonText,
    color: colors.white,
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
  queueSection: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  queueList: {
    marginBottom: spacing.md,
  },
  emptyState: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyStateText: {
    ...typography.body,
    color: colors.gray,
  },
  statsSection: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 1,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  statLabel: {
    ...typography.caption,
    color: colors.gray,
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.subheading,
    color: colors.primary,
  },
});

export default HomeScreen;
