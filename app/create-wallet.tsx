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
  const [verificationWords, setVerificationWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [verificationComplete, setVerificationComplete] = useState<boolean>(false);

  useEffect(() => {
    const generateWallet = async () => {
      setIsLoading(true);
      try {
        await createWallet();
        const phrase = await exportWallet();
        setMnemonic(phrase);
        // Select 3 random words for verification
        const words = phrase.split(' ');
        const indices = [];
        while (indices.length < 3) {
          const index = Math.floor(Math.random() * words.length);
          if (!indices.includes(index)) {
            indices.push(index);
          }
        }
        setVerificationWords(indices.map(i => words[i]));
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

  const handleWordSelect = (word: string) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(prev => prev.filter(w => w !== word));
    } else if (selectedWords.length < verificationWords.length) {
      setSelectedWords(prev => [...prev, word]);
    }
  };

  const verifyWords = () => {
    const isCorrect = verificationWords.every(word => selectedWords.includes(word));
    if (isCorrect) {
      setVerificationComplete(true);
      setConfirmed(true);
    } else {
      Alert.alert('Incorrect', 'Please verify your recovery phrase again.');
      setSelectedWords([]);
    }
  };

  const handleContinue = () => {
    if (confirmed && verificationComplete) {
      router.replace('/(tabs)');
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
    verificationContainer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
    },
    verificationTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
      fontFamily: 'Inter-Medium',
    },
    verificationDescription: {
      color: colors.subText,
      marginBottom: 16,
      fontFamily: 'Inter-Regular',
    },
    wordGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      gap: 8,
    },
    wordButton: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
      minWidth: '30%',
      alignItems: 'center',
    },
    wordButtonSelected: {
      backgroundColor: colors.primary,
    },
    wordButtonText: {
      color: colors.text,
      fontFamily: 'Inter-Regular',
    },
    wordButtonTextSelected: {
      color: '#FFFFFF',
    },
    verifyButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      marginTop: 16,
    },
    verifyButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      fontFamily: 'Inter-Medium',
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
  const shuffledWords = [...mnemonicArray].sort(() => Math.random() - 0.5);

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

        {!verificationComplete && (
          <View style={styles.verificationContainer}>
            <Text style={styles.verificationTitle}>Verify Recovery Phrase</Text>
            <Text style={styles.verificationDescription}>
              Select the following words in any order to verify you've saved your recovery phrase:
              {'\n\n'}
              {verificationWords.join(', ')}
            </Text>
            
            <View style={styles.wordGrid}>
              {shuffledWords.map((word, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.wordButton,
                    selectedWords.includes(word) && styles.wordButtonSelected,
                  ]}
                  onPress={() => handleWordSelect(word)}
                >
                  <Text
                    style={[
                      styles.wordButtonText,
                      selectedWords.includes(word) && styles.wordButtonTextSelected,
                    ]}
                  >
                    {word}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.verifyButton}
              onPress={verifyWords}
              disabled={selectedWords.length !== verificationWords.length}
            >
              <Text style={styles.verifyButtonText}>Verify</Text>
            </TouchableOpacity>
          </View>
        )}

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