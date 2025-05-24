import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { ExternalLink } from 'lucide-react-native';

const DAPPS = [
  {
    name: 'PancakeSwap',
    description: 'Leading DEX on BSC',
    category: 'DEX',
    url: 'https://pancakeswap.finance',
    icon: 'https://assets.coingecko.com/coins/images/12632/small/pancakeswap-cake-logo.png',
  },
  {
    name: 'Venus Protocol',
    description: 'Lending and Borrowing',
    category: 'DeFi',
    url: 'https://venus.io',
    icon: 'https://assets.coingecko.com/coins/images/12677/small/venus.png',
  },
  {
    name: 'Alpaca Finance',
    description: 'Leveraged Yield Farming',
    category: 'DeFi',
    url: 'https://alpaca.finance',
    icon: 'https://assets.coingecko.com/coins/images/14165/small/alpaca.png',
  },
  // Add more dApps here
];

export default function DAppsScreen() {
  const { colors } = useTheme();

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
    content: {
      padding: 16,
    },
    categoryTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
      marginTop: 24,
      fontFamily: 'Inter-Medium',
    },
    dappCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    dappIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginRight: 12,
    },
    dappInfo: {
      flex: 1,
    },
    dappName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
      fontFamily: 'Inter-Medium',
    },
    dappDescription: {
      fontSize: 14,
      color: colors.subText,
      fontFamily: 'Inter-Regular',
    },
    dappLink: {
      padding: 8,
    },
  });

  const groupedDapps = DAPPS.reduce((acc, dapp) => {
    if (!acc[dapp.category]) {
      acc[dapp.category] = [];
    }
    acc[dapp.category].push(dapp);
    return acc;
  }, {} as Record<string, typeof DAPPS>);

  const handleDappPress = (url: string) => {
    // In a real app, implement WalletConnect integration here
    console.log('Connect to:', url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>DApps</Text>
        <Text style={styles.subtitle}>Connect to your favorite BSC applications</Text>
      </View>

      <ScrollView style={styles.content}>
        {Object.entries(groupedDapps).map(([category, dapps]) => (
          <View key={category}>
            <Text style={styles.categoryTitle}>{category}</Text>
            {dapps.map((dapp) => (
              <TouchableOpacity
                key={dapp.name}
                style={styles.dappCard}
                onPress={() => handleDappPress(dapp.url)}
              >
                <Image source={{ uri: dapp.icon }} style={styles.dappIcon} />
                <View style={styles.dappInfo}>
                  <Text style={styles.dappName}>{dapp.name}</Text>
                  <Text style={styles.dappDescription}>{dapp.description}</Text>
                </View>
                <TouchableOpacity style={styles.dappLink}>
                  <ExternalLink size={20} color={colors.primary} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}