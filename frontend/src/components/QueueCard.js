/**
 * Queue Card Component - Display patient in queue
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../styles/theme';

const QueueCard = ({ patient, position }) => {
  return (
    <View style={styles.card}>
      <View style={styles.positionBadge}>
        <Text style={styles.positionText}>{position}</Text>
      </View>
      <Text style={styles.name}>{patient.name}</Text>
      <Text style={styles.queueNumber}>#{patient.queueNumber}</Text>
      <View style={[styles.statusBadge, { backgroundColor: colors.success }]}>
        <Text style={styles.statusText}>{patient.status}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 140,
    marginRight: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  positionBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  positionText: {
    ...typography.title,
    color: colors.white,
  },
  name: {
    ...typography.subheading,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  queueNumber: {
    ...typography.caption,
    color: colors.gray,
    marginBottom: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
  },
  statusText: {
    ...typography.caption,
    color: colors.white,
    fontSize: 12,
  },
});

export default QueueCard;
