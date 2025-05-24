import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useTokens } from '@/context/TokenContext';
import { ChevronDown, ArrowDownUp, Info } from 'lucide-react-native';

export default function SwapScreen() {
  const { colors } = useTheme();
  const { tokens } = useTokens();
  
  const [fromToken, setFromToken] = useState(tokens[0]);
  const [toToken, setToToken] = useState(tokens[1]);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [showFromSelect, setShowFromSelect] = useState(false);
  const [showToSelect, setShowToSelect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    
    // Simulate calculation
    if (value && !isNaN(parseFloat(value))) {
      const fromPrice = fromToken.price || 1;
      const toPrice = toToken.price || 1;
      const convertedAmount = (parseFloat(value) * fromPrice) / toPrice;
      setToAmount(convertedAmount.toFixed(6));
    } else {
      setToAmount('');
    }
  };
  
  const switchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };
  
  const selectFromToken = (token: any) => {
    if (token.symbol !== toToken.symbol) {
      setFromToken(token);
      setShowFromSelect(false);
      handleFromAmountChange(fromAmount);
    }
  };
  
  const selectToToken = (token: any) => {
    if (token.symbol !== fromToken.symbol) {
      setToToken(token);
      setShowToSelect(false);
      handleFromAmountChange(fromAmount);
    }
  };
  
  const handleSwap = () => {
    if (!fromAmount || !toAmount || parseFloat(fromAmount) <= 0) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, this would execute the swap
      setFromAmount('');
      setToAmount('');
    }, 2000);
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: 60,
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
      fontFamily: 'Inter-Bold',
    },
    content: {
      padding: 16,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
    },
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    input: {
      flex: 1,
      fontSize: 24,
      fontWeight: '600',
      color: colors.text,
      padding: 8,
      fontFamily: 'Inter-Medium',
    },
    tokenButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
    },
    tokenIcon: {
      width: 24,
      height: 24,
      borderRadius: 12,
      marginRight: 8,
    },
    tokenSymbol: {
      color: colors.text,
      fontWeight: '600',
      marginRight: 4,
      fontFamily: 'Inter-Medium',
    },
    label: {
      color: colors.subText,
      fontSize: 14,
      marginBottom: 4,
      fontFamily: 'Inter-Regular',
    },
    maxButton: {
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      marginRight: 8,
    },
    maxButtonText: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: '500',
      fontFamily: 'Inter-Medium',
    },
    switchButton: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginLeft: -16,
      marginTop: -16,
      backgroundColor: colors.background,
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 4,
      borderColor: colors.card,
      zIndex: 1,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    infoText: {
      color: colors.subText,
      marginLeft: 6,
      fontSize: 14,
      fontFamily: 'Inter-Regular',
    },
    swapButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
    },
    swapButtonDisabled: {
      backgroundColor: colors.primary + '50',
    },
    swapButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      fontFamily: 'Inter-Medium',
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
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Swap</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>From</Text>
          <View style={styles.rowBetween}>
            <TouchableOpacity 
              style={styles.tokenButton} 
              onPress={() => setShowFromSelect(true)}
            >
              <Image source={{ uri: fromToken.logoUrl }} style={styles.tokenIcon} />
              <Text style={styles.tokenSymbol}>{fromToken.symbol}</Text>
              <ChevronDown size={16} color={colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.maxButton}
              onPress={() => handleFromAmountChange(fromToken.balance)}
            >
              <Text style={styles.maxButtonText}>MAX</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="0.0"
              placeholderTextColor={colors.subText}
              value={fromAmount}
              onChangeText={handleFromAmountChange}
              keyboardType="decimal-pad"
            />
          </View>
          
          <View style={styles.infoRow}>
            <Info size={14} color={colors.subText} />
            <Text style={styles.infoText}>
              Balance: {parseFloat(fromToken.balance).toFixed(6)} {fromToken.symbol}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.switchButton} onPress={switchTokens}>
          <ArrowDownUp size={16} color={colors.primary} />
        </TouchableOpacity>
        
        <View style={styles.card}>
          <Text style={styles.label}>To</Text>
          <View style={styles.rowBetween}>
            <TouchableOpacity 
              style={styles.tokenButton} 
              onPress={() => setShowToSelect(true)}
            >
              <Image source={{ uri: toToken.logoUrl }} style={styles.tokenIcon} />
              <Text style={styles.tokenSymbol}>{toToken.symbol}</Text>
              <ChevronDown size={16} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="0.0"
              placeholderTextColor={colors.subText}
              value={toAmount}
              editable={false}
            />
          </View>
          
          <View style={styles.infoRow}>
            <Info size={14} color={colors.subText} />
            <Text style={styles.infoText}>
              Balance: {parseFloat(toToken.balance).toFixed(6)} {toToken.symbol}
            </Text>
          </View>
        </View>
        
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Price</Text>
            <Text style={styles.label}>
              1 {fromToken.symbol} = {((fromToken.price || 1) / (toToken.price || 1)).toFixed(6)} {toToken.symbol}
            </Text>
          </View>
          
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Slippage Tolerance</Text>
            <Text style={styles.label}>0.5%</Text>
          </View>
          
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Estimated Gas</Text>
            <Text style={styles.label}>~0.0005 BNB</Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={[
            styles.swapButton, 
            (!fromAmount || parseFloat(fromAmount) <= 0) && styles.swapButtonDisabled
          ]}
          onPress={handleSwap}
          disabled={!fromAmount || parseFloat(fromAmount) <= 0 || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.swapButtonText}>Swap</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
      
      {/* Token Select Modals */}
      {(showFromSelect || showToSelect) && (
        <TouchableOpacity 
          style={styles.backdrop}
          onPress={() => {
            setShowFromSelect(false);
            setShowToSelect(false);
          }}
        />
      )}
      
      {showFromSelect && (
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Select a token</Text>
          <ScrollView>
            {tokens.map((token) => (
              <TouchableOpacity
                key={token.symbol}
                style={[
                  styles.tokenItem,
                  token.symbol === fromToken.symbol && styles.activeTokenItem
                ]}
                onPress={() => selectFromToken(token)}
              >
                <Image source={{ uri: token.logoUrl }} style={styles.tokenIcon} />
                <View style={styles.tokenItemInfo}>
                  <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                  <Text style={styles.tokenItemName}>{token.name}</Text>
                </View>
                <Text style={styles.label}>
                  {parseFloat(token.balance).toFixed(4)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      
      {showToSelect && (
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Select a token</Text>
          <ScrollView>
            {tokens.map((token) => (
              <TouchableOpacity
                key={token.symbol}
                style={[
                  styles.tokenItem,
                  token.symbol === toToken.symbol && styles.activeTokenItem
                ]}
                onPress={() => selectToToken(token)}
              >
                <Image source={{ uri: token.logoUrl }} style={styles.tokenIcon} />
                <View style={styles.tokenItemInfo}>
                  <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                  <Text style={styles.tokenItemName}>{token.name}</Text>
                </View>
                <Text style={styles.label}>
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