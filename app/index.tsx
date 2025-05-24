import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useWallet } from '@/context/WalletContext';
import { useTheme } from '@/context/ThemeContext';
import { Shield, Wallet } from 'lucide-react-native';

export default function WelcomeScreen() {
  const router = useRouter();
  const { hasWallet, isLoading } = useWallet();
  const { colors } = useTheme();

  useEffect(() => {
    if (hasWallet && !isLoading) {
      router.replace('/(tabs)');
    }
  }, [hasWallet, isLoading, router]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 32,
    },
    logo: {
      width: 120,
      height: 120,
      marginBottom: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
      fontFamily: 'Inter-Bold',
    },
    subtitle: {
      fontSize: 16,
      color: colors.subText,
      textAlign: 'center',
      marginBottom: 48,
      fontFamily: 'Inter-Regular',
    },
    buttonContainer: {
      width: '100%',
      gap: 16,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    buttonOutline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.border,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
      fontFamily: 'Inter-Medium',
    },
    buttonTextOutline: {
      color: colors.text,
    },
    footer: {
      padding: 24,
      alignItems: 'center',
    },
    footerText: {
      color: colors.subText,
      fontSize: 14,
      fontFamily: 'Inter-Regular',
    },
    loadingContainer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      color: colors.primary,
      marginTop: 16,
      fontSize: 16,
      fontFamily: 'Inter-Medium',
    },
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading your wallet...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg',
            }}
            style={styles.logo}
            borderRadius={60}
          />
          <Text style={styles.title}>VerBit Wallet</Text>
          <Text style={styles.subtitle}>
            Your Gateway to BSC DeFi – Powered by AI
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/create-wallet')}
          >
            <Shield size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Create New Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonOutline]}
            onPress={() => router.push('/import-wallet')}
          >
            <Wallet size={20} color={colors.text} />
            <Text style={[styles.buttonText, styles.buttonTextOutline]}>
              Import Existing Wallet
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Powered by Binance Smart Chain
        </Text>
      </View>
    </View>
  );
}