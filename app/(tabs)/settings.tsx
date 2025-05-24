import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useWallet } from '@/context/WalletContext';
import { useRouter } from 'expo-router';
import { 
  Moon, 
  Sun, 
  ChevronRight, 
  ShieldCheck, 
  Key, 
  HelpCircle, 
  ExternalLink, 
  Settings as SettingsIcon, 
  LogOut,
  Smartphone
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { colors, theme, setTheme } = useTheme();
  const { disconnectWallet } = useWallet();
  const router = useRouter();
  
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
  };
  
  const handleDisconnect = () => {
    Alert.alert(
      'Disconnect Wallet',
      'Are you sure you want to disconnect your wallet? Make sure you have backed up your recovery phrase.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: async () => {
            await disconnectWallet();
            router.replace('/');
          },
        },
      ]
    );
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
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
      marginBottom: 8,
      marginLeft: 16,
      fontFamily: 'Inter-Medium',
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      marginHorizontal: 16,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    rowLast: {
      borderBottomWidth: 0,
    },
    rowIcon: {
      marginRight: 12,
    },
    rowContent: {
      flex: 1,
    },
    rowTitle: {
      fontSize: 16,
      color: colors.text,
      fontFamily: 'Inter-Medium',
    },
    rowDescription: {
      fontSize: 14,
      color: colors.subText,
      marginTop: 2,
      fontFamily: 'Inter-Regular',
    },
    themeButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      marginTop: 8,
    },
    themeButton: {
      alignItems: 'center',
      padding: 12,
      borderRadius: 8,
      width: '30%',
    },
    themeButtonActive: {
      backgroundColor: colors.primary + '20',
    },
    themeButtonText: {
      marginTop: 4,
      color: colors.text,
      fontFamily: 'Inter-Medium',
    },
    themeButtonTextActive: {
      color: colors.primary,
    },
    disconnectButton: {
      backgroundColor: colors.error + '20',
      marginHorizontal: 16,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 24,
    },
    disconnectText: {
      color: colors.error,
      fontWeight: '600',
      marginLeft: 8,
      fontFamily: 'Inter-Medium',
    },
    version: {
      alignItems: 'center',
      marginTop: 40,
    },
    versionText: {
      color: colors.subText,
      fontFamily: 'Inter-Regular',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>
      
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>Theme</Text>
                <Text style={styles.rowDescription}>Choose your preferred theme</Text>
                
                <View style={styles.themeButtons}>
                  <TouchableOpacity
                    style={[
                      styles.themeButton,
                      theme === 'light' && styles.themeButtonActive,
                    ]}
                    onPress={() => handleThemeChange('light')}
                  >
                    <Sun size={24} color={theme === 'light' ? colors.primary : colors.text} />
                    <Text
                      style={[
                        styles.themeButtonText,
                        theme === 'light' && styles.themeButtonTextActive,
                      ]}
                    >
                      Light
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.themeButton,
                      theme === 'dark' && styles.themeButtonActive,
                    ]}
                    onPress={() => handleThemeChange('dark')}
                  >
                    <Moon size={24} color={theme === 'dark' ? colors.primary : colors.text} />
                    <Text
                      style={[
                        styles.themeButtonText,
                        theme === 'dark' && styles.themeButtonTextActive,
                      ]}
                    >
                      Dark
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.themeButton,
                      theme === 'system' && styles.themeButtonActive,
                    ]}
                    onPress={() => handleThemeChange('system')}
                  >
                    <Smartphone size={24} color={theme === 'system' ? colors.primary : colors.text} />
                    <Text
                      style={[
                        styles.themeButtonText,
                        theme === 'system' && styles.themeButtonTextActive,
                      ]}
                    >
                      System
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <ShieldCheck size={24} color={colors.primary} style={styles.rowIcon} />
              <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>Biometric Authentication</Text>
                <Text style={styles.rowDescription}>Unlock with Face ID or Touch ID</Text>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
            
            <TouchableOpacity style={[styles.row, styles.rowLast]}>
              <Key size={24} color={colors.primary} style={styles.rowIcon} />
              <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>Recovery Phrase</Text>
                <Text style={styles.rowDescription}>View your backup phrase</Text>
              </View>
              <ChevronRight size={20} color={colors.subText} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <SettingsIcon size={24} color={colors.primary} style={styles.rowIcon} />
              <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>Notifications</Text>
                <Text style={styles.rowDescription}>Price alerts and transaction updates</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
            
            <TouchableOpacity style={[styles.row, styles.rowLast]}>
              <ExternalLink size={24} color={colors.primary} style={styles.rowIcon} />
              <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>Default Browser</Text>
                <Text style={styles.rowDescription}>Choose which browser to use for external links</Text>
              </View>
              <ChevronRight size={20} color={colors.subText} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.row}>
              <HelpCircle size={24} color={colors.primary} style={styles.rowIcon} />
              <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>Help Center</Text>
                <Text style={styles.rowDescription}>Get help with your wallet</Text>
              </View>
              <ChevronRight size={20} color={colors.subText} />
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.row, styles.rowLast]}>
              <ExternalLink size={24} color={colors.primary} style={styles.rowIcon} />
              <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>About</Text>
                <Text style={styles.rowDescription}>Learn more about VerBit Wallet</Text>
              </View>
              <ChevronRight size={20} color={colors.subText} />
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity style={styles.disconnectButton} onPress={handleDisconnect}>
          <LogOut size={20} color={colors.error} />
          <Text style={styles.disconnectText}>Disconnect Wallet</Text>
        </TouchableOpacity>
        
        <View style={styles.version}>
          <Text style={styles.versionText}>VerBit Wallet v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}