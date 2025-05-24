import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useWallet } from '@/context/WalletContext';
import { useTheme } from '@/context/ThemeContext';
import { ChevronLeft, ShieldAlert } from 'lucide-react-native';

export default function ImportWalletScreen() {
  const router = useRouter();
  const { importWallet } = useWallet();
  const { colors } = useTheme();
  const [mnemonic, setMnemonic] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async () => {
    if (!mnemonic.trim()) {
      setError('Please enter your recovery phrase');
      return;
    }

    const words = mnemonic.trim().split(/\s+/);
    if (words.length !== 12 && words.length !== 24) {
      setError('Recovery phrase must contain 12 or 24 words');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await importWallet(mnemonic.trim());
      if (success) {
        router.replace('/(tabs)');
      } else {
        setError('Invalid recovery phrase. Please check and try again.');
      }
    } catch (error) {
      console.error('Error importing wallet:', error);
      setError('Failed to import wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
    inputContainer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    input: {
      color: colors.text,
      fontFamily: 'Inter-Regular',
      minHeight: 100,
      textAlignVertical: 'top',
    },
    error: {
      color: colors.error,
      marginBottom: 24,
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
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      fontFamily: 'Inter-Medium',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Import Wallet</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.warning}>
          <ShieldAlert size={24} color={colors.warning} />
          <Text style={styles.warningText}>
            Never share your recovery phrase with anyone or enter it on untrusted websites.
          </Text>
        </View>

        <Text style={styles.subtitle}>Recovery Phrase</Text>
        <Text style={styles.description}>
          Enter your 12 or 24-word recovery phrase, separated by spaces.
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter recovery phrase..."
            placeholderTextColor={colors.subText}
            value={mnemonic}
            onChangeText={setMnemonic}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
          />
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleImport}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Import Wallet</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}