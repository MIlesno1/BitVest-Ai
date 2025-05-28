import React, { useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useWallet } from '@/context/WalletContext';
import { useTheme } from '@/context/ThemeContext';
import { Shield, Wallet } from 'lucide-react-native';
import { BitcoinIcon, VNSTIcon } from '@/components/Icons';

export default function WelcomeScreen() {
  const router = useRouter();
  const { hasWallet, isLoading } = useWallet();
  const { colors } = useTheme();
  const rotateAnim = new Animated.Value(0);
  const floatAnim = new Animated.Value(0);

  useEffect(() => {
    if (hasWallet && !isLoading) {
      router.replace('/(tabs)');
    }

    // Start animations
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 20000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [hasWallet, isLoading]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

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
      marginBottom: 48,
    },
    animatedContainer: {
      position: 'relative',
      width: 200,
      height: 200,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconContainer: {
      position: 'absolute',
      width: 48,
      height: 48,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
      fontFamily: 'Inter-Bold',
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: colors.subText,
      textAlign: 'center',
      marginBottom: 48,
      fontFamily: 'Inter-Regular',
      maxWidth: 280,
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
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.animatedContainer}>
            <Animated.View
              style={[
                styles.iconContainer,
                {
                  transform: [
                    { rotate },
                    { translateY },
                    { scale: 1.2 },
                  ],
                },
              ]}
            >
              <BitcoinIcon size={48} />
            </Animated.View>
            <Animated.View
              style={[
                styles.iconContainer,
                {
                  transform: [
                    { rotate: rotate },
                    { translateY: Animated.multiply(translateY, -1) },
                    { scale: 1.2 },
                  ],
                },
              ]}
            >
              <VNSTIcon size={48} />
            </Animated.View>
          </View>
          <Text style={styles.title}>BitVest Wallet</Text>
          <Text style={styles.subtitle}>
            Your secure gateway to BSC DeFi – Powered by AI
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