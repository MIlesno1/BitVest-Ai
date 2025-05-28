import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useTokens } from '@/context/TokenContext';
import { ArrowRight, ArrowLeft, Info, Lock } from 'lucide-react-native';

export default function MintScreen() {
  const { colors } = useTheme();
  const { tokens } = useTokens();
  const [activeTab, setActiveTab] = useState<'mint' | 'redeem'>('mint');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleMintRedeem = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setIsLoading(true);
    
    try {
      // Implement actual mint/redeem logic here
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAmount('');
    } catch (error) {
      console.error('Error:', error);
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
      padding: 16,
      paddingTop: 60,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
      fontFamily: 'Inter-Bold',
    },
    subtitle: {
      fontSize: 16,
      color: colors.subText,
      fontFamily: 'Inter-Regular',
    },
    tabs: {
      flexDirection: 'row',
      marginTop: 24,
      marginHorizontal: 16,
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 4,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderRadius: 8,
    },
    activeTab: {
      backgroundColor: colors.primary,
    },
    tabText: {
      color: colors.subText,
      fontFamily: 'Inter-Medium',
    },
    activeTabText: {
      color: '#FFFFFF',
    },
    content: {
      flex: 1,
      padding: 16,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      color: colors.text,
      marginBottom: 8,
      fontFamily: 'Inter-Medium',
    },
    input: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 16,
      color: colors.text,
      fontSize: 18,
      fontFamily: 'Inter-Regular',
    },
    infoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    infoText: {
      color: colors.subText,
      marginLeft: 8,
      flex: 1,
      fontFamily: 'Inter-Regular',
    },
    rateCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
    },
    rateRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    rateLabel: {
      color: colors.subText,
      fontFamily: 'Inter-Regular',
    },
    rateValue: {
      color: colors.text,
      fontFamily: 'Inter-Medium',
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
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
    securityNote: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginTop: 16,
    },
    securityText: {
      color: colors.subText,
      marginLeft: 12,
      flex: 1,
      fontFamily: 'Inter-Regular',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>vBTC Portal</Text>
        <Text style={styles.subtitle}>Mint or redeem your vBTC tokens</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'mint' && styles.activeTab]}
          onPress={() => setActiveTab('mint')}
        >
          <Text style={[styles.tabText, activeTab === 'mint' && styles.activeTabText]}>
            Mint vBTC
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'redeem' && styles.activeTab]}
          onPress={() => setActiveTab('redeem')}
        >
          <Text style={[styles.tabText, activeTab === 'redeem' && styles.activeTabText]}>
            Redeem BTC
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>
            {activeTab === 'mint' ? 'BTC Amount to Mint' : 'vBTC Amount to Redeem'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="0.0"
            placeholderTextColor={colors.subText}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
          <View style={styles.infoContainer}>
            <Info size={16} color={colors.subText} />
            <Text style={styles.infoText}>
              {activeTab === 'mint'
                ? 'Enter the amount of BTC you want to convert to vBTC'
                : 'Enter the amount of vBTC you want to convert back to BTC'}
            </Text>
          </View>
        </View>

        <View style={styles.rateCard}>
          <View style={styles.rateRow}>
            <Text style={styles.rateLabel}>Exchange Rate</Text>
            <Text style={styles.rateValue}>1 BTC = 1 vBTC</Text>
          </View>
          <View style={styles.rateRow}>
            <Text style={styles.rateLabel}>Minimum Amount</Text>
            <Text style={styles.rateValue}>0.01 BTC</Text>
          </View>
          <View style={styles.rateRow}>
            <Text style={styles.rateLabel}>Processing Time</Text>
            <Text style={styles.rateValue}>~30 minutes</Text>
          </View>
          <View style={styles.rateRow}>
            <Text style={styles.rateLabel}>Network Fee</Text>
            <Text style={styles.rateValue}>0.0001 BTC</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, (!amount || isLoading) && styles.buttonDisabled]}
          onPress={handleMintRedeem}
          disabled={!amount || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small\" color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.buttonText}>
                {activeTab === 'mint' ? 'Mint vBTC' : 'Redeem BTC'}
              </Text>
              {activeTab === 'mint' ? (
                <ArrowRight size={20} color="#FFFFFF" />
              ) : (
                <ArrowLeft size={20} color="#FFFFFF" />
              )}
            </>
          )}
        </TouchableOpacity>

        <View style={styles.securityNote}>
          <Lock size={24} color={colors.subText} />
          <Text style={styles.securityText}>
            All minting and redemption operations are secured by multi-signature smart contracts and
            undergo thorough verification.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}