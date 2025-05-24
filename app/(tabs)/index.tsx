import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Image, FlatList } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useWallet } from '@/context/WalletContext';
import { useTokens } from '@/context/TokenContext';
import { ArrowDownLeft, ArrowUpRight, Eye, EyeOff, Copy, ExternalLink } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function WalletScreen() {
  const { colors } = useTheme();
  const { address, balance } = useWallet();
  const { tokens, totalBalanceUSD, refreshTokens, isLoading } = useTokens();
  const [hideBalance, setHideBalance] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const truncateAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const formatBalance = (balance: string, decimals: number = 6) => {
    const num = parseFloat(balance);
    if (num === 0) return '0';
    if (num < 0.000001) return '<0.000001';
    return num.toFixed(decimals);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshTokens();
    setRefreshing(false);
  }, [refreshTokens]);

  const handleCopy = () => {
    // In a real app, use Clipboard.setString(address)
    // Show a toast or some feedback
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 16,
      paddingTop: 60,
      backgroundColor: colors.primary,
    },
    addressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    addressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    addressText: {
      color: '#FFFFFF',
      marginRight: 8,
      fontFamily: 'Inter-Medium',
    },
    balanceContainer: {
      alignItems: 'center',
      marginBottom: 16,
    },
    balanceLabel: {
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: 4,
      fontFamily: 'Inter-Regular',
    },
    balanceValue: {
      color: '#FFFFFF',
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 4,
      fontFamily: 'Inter-Bold',
    },
    balanceFiat: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: 16,
      fontFamily: 'Inter-Regular',
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 16,
    },
    actionButton: {
      alignItems: 'center',
      marginHorizontal: 16,
    },
    actionIcon: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    actionText: {
      color: '#FFFFFF',
      fontFamily: 'Inter-Medium',
    },
    content: {
      flex: 1,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: colors.background,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      fontFamily: 'Inter-Medium',
    },
    seeAllText: {
      color: colors.primary,
      fontFamily: 'Inter-Medium',
    },
    tokenContainer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      marginHorizontal: 16,
      marginBottom: 12,
      padding: 16,
    },
    tokenRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    tokenIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
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
    tokenName: {
      color: colors.subText,
      fontSize: 14,
      fontFamily: 'Inter-Regular',
    },
    tokenBalance: {
      alignItems: 'flex-end',
    },
    tokenValue: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      fontFamily: 'Inter-Medium',
    },
    tokenFiat: {
      color: colors.subText,
      fontSize: 14,
      fontFamily: 'Inter-Regular',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  const renderToken = ({ item }: { item: any }) => {
    const fiatValue = parseFloat(item.balance) * item.price;
    
    return (
      <TouchableOpacity style={styles.tokenContainer}>
        <View style={styles.tokenRow}>
          <Image source={{ uri: item.logoUrl }} style={styles.tokenIcon} />
          <View style={styles.tokenInfo}>
            <Text style={styles.tokenSymbol}>{item.symbol}</Text>
            <Text style={styles.tokenName}>{item.name}</Text>
          </View>
          <View style={styles.tokenBalance}>
            <Text style={styles.tokenValue}>
              {hideBalance ? '****' : formatBalance(item.balance)}
            </Text>
            <Text style={styles.tokenFiat}>
              {hideBalance ? '****' : `$${fiatValue.toFixed(2)}`}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.addressRow}>
          <TouchableOpacity style={styles.addressContainer} onPress={handleCopy}>
            <Text style={styles.addressText}>{truncateAddress(address)}</Text>
            <Copy size={16} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setHideBalance(!hideBalance)}>
            {hideBalance ? (
              <EyeOff size={24} color="#FFFFFF" />
            ) : (
              <Eye size={24} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceValue}>
            {hideBalance ? '******' : `$${totalBalanceUSD.toFixed(2)}`}
          </Text>
          <Text style={styles.balanceFiat}>
            {hideBalance ? '******' : `${formatBalance(balance)} BNB`}
          </Text>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/send')}>
            <View style={styles.actionIcon}>
              <ArrowUpRight size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.actionText}>Send</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/receive')}>
            <View style={styles.actionIcon}>
              <ArrowDownLeft size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.actionText}>Receive</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(tabs)/swap')}>
            <View style={styles.actionIcon}>
              <ExternalLink size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.actionText}>Swap</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tokens</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={tokens}
          renderItem={renderToken}
          keyExtractor={(item) => item.symbol}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
        />
      </View>
    </View>
  );
}