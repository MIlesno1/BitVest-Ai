import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export const BitcoinIcon = ({ size = 24 }) => {
  const { colors } = useTheme();
  return (
    <View style={{ width: size, height: size, backgroundColor: '#F7931A', borderRadius: size / 2 }} />
  );
};

export const VNSTIcon = ({ size = 24 }) => {
  const { colors } = useTheme();
  return (
    <View style={{ width: size, height: size, backgroundColor: '#00A8E8', borderRadius: size / 2 }} />
  );
};