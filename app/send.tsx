import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useTokens } from '@/context/TokenContext';
import { useWallet } from '@/context/WalletContext';
import { ChevronLeft, ChevronDown, Scan, ArrowRight, Info } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ethers } from 'ethers';

export default function SendScreen() {
  const { colors } = useTheme();
  const { tokens } = useTokens();
  const { wallet } = useWallet();
  const router = useRouter();
  
  const [selectedToken, setSelectedToken] = useState(tokens[0]);
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [showTokenSelect, setShowTokenSelect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleTokenSelect = (token: any) => {
    setSelectedToken(token);
    setShowTokenSelect(false);
  };
  
  const handleSend = async () => {
    if (!amount || !address) {
      setError('Please enter an amount and address');
      return;
    }
    
    if (!ethers.isAddress(address)) {
      setError('Invalid address format');
      return;
    }
    
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Invalid amount');
      return;
    }
    
    const balance = parseFloat(selectedToken.balance);
    if (amountNum > balance) {
      setError('Insufficient balance');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      // In a real app, this would use wallet.sendTransaction
      // For demo purposes, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Transaction Sent',
        `Successfully sent ${amount} ${selectedToken.symbol} to ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error sending transaction:', error);
      setError('Failed to send transaction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMax = () => {
    setAmount(selectedToken.balance);
  };
  
  const handleScan = () => {
    // In a real app, this would open a QR code scanner
    Alert.alert('Scan QR Code', 'QR code scanning would be implemented here.');
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
      paddingTop: 60,
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
      padding: 16,
    },
    section: {
      marginBottom: 24,
    },
    label: {
      fontSize: 16,
      color: colors.text,
      marginBottom: 8,
      fontFamily: 'Inter-Medium',
    },
    tokenSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 12,
    },
    tokenIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: 8,
    },
    tokenInfo: {
      flex: 1,
    },
    tokenSymbol: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      fontFamily: 'Inter-Medium',
    },
    tokenBalance: {
      fontSize: 14,
      color: colors.subText,
      fontFamily: 'Inter-Regular',
    },
    inputContainer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
    },
    amountContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    input: {
      flex: 1,
      fontSize: 18,
      color: colors.text,
      padding: 8,
      fontFamily: 'Inter-Regular',
    },
    maxButton: {
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
    },
    maxButtonText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '500',
      fontFamily: 'Inter-Medium',
    },
    addressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    scanButton: {
      padding: 8,
    },
    valueContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    valueText: {
      color: colors.subText,
      fontFamily: 'Inter-Regular',
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      marginTop: 24,
    },
    buttonDisabled: {
      backgroundColor: colors.primary + '50',
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      marginRight: 8,
      fontFamily: 'Inter-Medium',
    },
    errorText: {
      color: colors.error,
      marginTop: 8,
      fontFamily: 'Inter-Regular',
    },
    modal: {
      backgroundColor: colors.background,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      padding: 16,
      maxHeight: '70%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
      zIndex: 10,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
      fontFamily: 'Inter-Medium',
    },
    tokenItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 8,
    },
    activeTokenItem: {
      backgroundColor: colors.primary + '20',
    },
    tokenItemInfo: {
      flex: 1,
      marginLeft: 12,
    },
    tokenItemName: {
      color: colors.subText,
      fontSize: 14,
      fontFamily: 'Inter-Regular',
    },
    backdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 5,
    },
    feeContainer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginTop: 16,
    },
    feeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    feeLabel: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    feeLabelText: {
      color: colors.text,
      marginLeft: 4,
      fontFamily: 'Inter-Regular',
    },
    feeValue: {
      color: colors.text,
      fontWeight: '500',
      fontFamily: 'Inter-Medium',
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 8,
      marginTop: 8,
    },
    totalLabel: {
      color: colors.text,
      fontWeight: '600',
      fontFamily: 'Inter-Medium',
    },
    totalValue: {
      color: colors.text,
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
        <Text style={styles.title}>Send {selectedToken.symbol}</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Token</Text>
          <TouchableOpacity
            style={styles.tokenSelector}
            onPress={() => setShowTokenSelect(true)}
          >
            <Image source={{ uri: selectedToken.logoUrl }} style={styles.tokenIcon} />
            <View style={styles.tokenInfo}>
              <Text style={styles.tokenSymbol}>{selectedToken.symbol}</Text>
              <Text style={styles.tokenBalance}>
                Balance: {parseFloat(selectedToken.balance).toFixed(6)}
              </Text>
            </View>
            <ChevronDown size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.label}>Amount</Text>
          <View style={styles.inputContainer}>
            <View style={styles.amountContainer}>
              <TextInput
                style={styles.input}
                placeholder="0.0"
                placeholderTextColor={colors.subText}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />
              <TouchableOpacity style={styles.maxButton} onPress={handleMax}>
                <Text style={styles.maxButtonText}>MAX</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>
                ≈ ${amount ? (parseFloat(amount) * selectedToken.price).toFixed(2) : '0.00'}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.label}>To Address</Text>
          <View style={styles.inputContainer}>
            <View style={styles.addressContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter BSC address"
                placeholderTextColor={colors.subText}
                value={address}
                onChangeText={setAddress}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
                <Scan size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <View style={styles.feeContainer}>
          <View style={styles.feeRow}>
            <View style={styles.feeLabel}>
              <Info size={16} color={colors.subText} />
              <Text style={styles.feeLabelText}>Network Fee</Text>
            </View>
            <Text style={styles.feeValue}>~0.0005 BNB</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>
              {amount ? parseFloat(amount).toFixed(6) : '0'} {selectedToken.symbol}
            </Text>
          </View>
        </View>
        
        {error && <Text style={styles.errorText}>{error}</Text>}
        
        <TouchableOpacity
          style={[styles.button, (!amount || !address) && styles.buttonDisabled]}
          onPress={handleSend}
          disabled={!amount || !address || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.buttonText}>Send</Text>
              <ArrowRight size={20} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
      
      {/* Token Select Modal */}
      {showTokenSelect && (
        <TouchableOpacity
          style={styles.backdrop}
          onPress={() => setShowTokenSelect(false)}
        />
      )}
      
      {showTokenSelect && (
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Select a token</Text>
          <ScrollView>
            {tokens.map((token) => (
              <TouchableOpacity
                key={token.symbol}
                style={[
                  styles.tokenItem,
                  token.symbol === selectedToken.symbol && styles.activeTokenItem
                ]}
                onPress={() => handleTokenSelect(token)}
              >
                <Image source={{ uri: token.logoUrl }} style={styles.tokenIcon} />
                <View style={styles.tokenItemInfo}>
                  <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                  <Text style={styles.tokenItemName}>{token.name}</Text>
                </View>
                <Text style={styles.tokenBalance}>
                  {parseFloat(token.balance).toFixed(4)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}