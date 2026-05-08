import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { getPalette } from '../theme/palette';

type Props = {
  colorScheme: 'light' | 'dark' | null | undefined;
  compact?: boolean;
};

export const AppLogo = ({ colorScheme, compact = false }: Props): JSX.Element => {
  const palette = getPalette(colorScheme);

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.iconBadge,
          compact ? styles.iconBadgeCompact : null,
          { backgroundColor: palette.accentSoft, borderColor: palette.border },
        ]}
      >
        <Image
          source={require('../../assets/app-logo.png')}
          style={compact ? styles.logoImageCompact : styles.logoImage}
          resizeMode="contain"
        />
      </View>
      <View>
        <Text style={[styles.brand, compact ? styles.brandCompact : null, { color: palette.text }]}>
          IssueTracker
        </Text>
        {!compact ? <Text style={[styles.caption, { color: palette.textMuted }]}>Mobile</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iconBadgeCompact: {
    width: 28,
    height: 28,
    borderRadius: 9,
  },
  logoImage: {
    width: 26,
    height: 26,
  },
  logoImageCompact: {
    width: 20,
    height: 20,
  },
  brand: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  brandCompact: {
    fontSize: 16,
  },
  caption: {
    marginTop: 1,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
