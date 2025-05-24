import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useWallet } from '@/context/WalletContext';
import { ChevronLeft, Copy, Share as ShareIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';

export default function ReceiveScreen() {
  const { colors } = useTheme();
  const { address } = useWallet();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    // In a real app, use Clipboard.setString(address)
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleShare = async () => {
    try {
      await Share.share({
        message: `My BSC wallet address: ${address}`,
      });
    } catch (error) {
      console.error('Error sharing address:', error);
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
      alignItems: 'center',
    },
    qrContainer: {
      backgroundColor: '#FFFFFF',
      padding: 24,
      borderRadius: 16,
      marginVertical: 32,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    addressTitle: {
      fontSize: 16,
      color: colors.subText,
      marginBottom: 8,
      fontFamily: 'Inter-Regular',
      textAlign: 'center',
    },
    addressContainer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
      width: '100%',
    },
    address: {
      color: colors.text,
      fontSize: 16,
      textAlign: 'center',
      fontFamily: 'Inter-Medium',
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 8,
    },
    actionText: {
      color: colors.text,
      marginLeft: 8,
      fontWeight: '500',
      fontFamily: 'Inter-Medium',
    },
    infoText: {
      color: colors.subText,
      textAlign: 'center',
      marginTop: 24,
      fontFamily: 'Inter-Regular',
      paddingHorizontal: 24,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Receive</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.addressTitle}>Your Wallet Address</Text>
        
        <View style={styles.qrContainer}>
          <QRCode
            value={address}
            size={200}
            color="#000000"
            backgroundColor="#FFFFFF"
          />
        </View>
        
        <View style={styles.addressContainer}>
          <Text style={styles.address} selectable>
            {address}
          </Text>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
            <Copy size={20} color={colors.primary} />
            <Text style={styles.actionText}>{copied ? 'Copied' : 'Copy'}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <ShareIcon size={20} color={colors.primary} />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.infoText}>
          Use this address to receive VNST, vBTC, and other BSC tokens. Only send Binance Smart Chain (BSC) assets to this address.
        </Text>
      </ScrollView>
    </View>
  );
}