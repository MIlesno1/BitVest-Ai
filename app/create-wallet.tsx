import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useWallet } from '@/context/WalletContext';
import { useTheme } from '@/context/ThemeContext';
import { CheckCircle2, Copy, ChevronLeft, ShieldAlert } from 'lucide-react-native';

export default function CreateWalletScreen() {
  const router = useRouter();
  const { createWallet, exportWallet } = useWallet();
  const { colors } = useTheme();
  const [mnemonic, setMnemonic] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [confirmed, setConfirmed] = useState<boolean>(false);

  useEffect(() => {
    const generateWallet = async () => {
      setIsLoading(true);
      try {
        await createWallet();
        const phrase = await exportWallet();
        setMnemonic(phrase);
      } catch (error) {
        console.error('Error creating wallet:', error);
        Alert.alert('Error', 'Failed to create wallet. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    generateWallet();
  }, []);

  const handleCopy = () => {
    // In a real app, use Clipboard.setString(mnemonic)
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    setConfirmed(true);
  };

  const handleContinue = () => {
    router.replace('/(tabs)');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      paddingTop: 48,
    },
    backButton: {
      padding: 8,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginLeft: 16,
      color: colors.text,
      fontFamily: 'Inter-Bold',
    },
    content: {
      flex: 1,
      padding: 24,
    },
    warning: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
      flexDirection: 'row',
      alignItems: 'center',
    },
    warningText: {
      color: colors.text,
      marginLeft: 12,
      flex: 1,
      fontFamily: 'Inter-Regular',
    },
    subtitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
      color: colors.text,
      fontFamily: 'Inter-Medium',
    },
    description: {
      color: colors.subText,
      marginBottom: 24,
      fontFamily: 'Inter-Regular',
    },
    mnemonicContainer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
    },
    mnemonicGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    wordContainer: {
      width: '30%',
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      flexDirection: 'row',
    },
    wordNumber: {
      color: colors.primary,
      marginRight: 4,
      fontWeight: '500',
      fontFamily: 'Inter-Medium',
    },
    word: {
      color: colors.text,
      fontFamily: 'Inter-Regular',
    },
    copyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
    },
    copyText: {
      marginLeft: 8,
      color: colors.text,
      fontWeight: '600',
      fontFamily: 'Inter-Medium',
    },
    confirmContainer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    checkboxFilled: {
      backgroundColor: colors.primary,
    },
    confirmRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    confirmText: {
      color: colors.text,
      flex: 1,
      fontFamily: 'Inter-Regular',
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    buttonDisabled: {
      backgroundColor: colors.card,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      fontFamily: 'Inter-Medium',
    },
    buttonTextDisabled: {
      color: colors.subText,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.subtitle, { marginTop: 16 }]}>Creating your wallet...</Text>
      </View>
    );
  }

  const mnemonicArray = mnemonic.split(' ');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Create New Wallet</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.warning}>
          <ShieldAlert size={24} color={colors.warning} />
          <Text style={styles.warningText}>
            Never share your recovery phrase with anyone. Anyone with this phrase can take your assets.
          </Text>
        </View>

        <Text style={styles.subtitle}>Your Recovery Phrase</Text>
        <Text style={styles.description}>
          Write down these 12 words in order and keep them somewhere safe. You'll need them to recover your wallet.
        </Text>

        <View style={styles.mnemonicContainer}>
          <View style={styles.mnemonicGrid}>
            {mnemonicArray.map((word, index) => (
              <View key={index} style={styles.wordContainer}>
                <Text style={styles.wordNumber}>{index + 1}.</Text>
                <Text style={styles.word}>{word}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
          {copied ? (
            <>
              <CheckCircle2 size={20} color={colors.success} />
              <Text style={styles.copyText}>Copied!</Text>
            </>
          ) : (
            <>
              <Copy size={20} color={colors.text} />
              <Text style={styles.copyText}>Copy to clipboard</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.confirmContainer}>
          <TouchableOpacity style={styles.confirmRow} onPress={handleConfirm}>
            <View style={[styles.checkbox, confirmed && styles.checkboxFilled]}>
              {confirmed && <CheckCircle2 size={16} color="#FFFFFF" />}
            </View>
            <Text style={styles.confirmText}>
              I have written down my recovery phrase and stored it in a safe place.
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, !confirmed && styles.buttonDisabled]}
          disabled={!confirmed}
          onPress={handleContinue}
        >
          <Text style={[styles.buttonText, !confirmed && styles.buttonTextDisabled]}>
            Continue to Wallet
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}