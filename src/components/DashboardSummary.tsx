import React from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { getPalette } from '../theme/palette';

type Props = {
  open: number;
  inProgress: number;
  resolved: number;
};

export const DashboardSummary = ({ open, inProgress, resolved }: Props): JSX.Element => {
  const palette = getPalette(useColorScheme());
  const blocks = [
    { label: 'Open', value: open, color: palette.accent },
    { label: 'In Progress', value: inProgress, color: palette.warning },
    { label: 'Resolved', value: resolved, color: palette.success },
  ];

  return (
    <View style={styles.row}>
      {blocks.map((block) => (
        <View
          key={block.label}
          style={[
            styles.card,
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
              shadowColor: palette.shadow,
            },
          ]}
        >
          <Text style={[styles.value, { color: block.color }]}>{block.value}</Text>
          <Text style={[styles.label, { color: palette.textMuted }]}>{block.label}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
  },
});

