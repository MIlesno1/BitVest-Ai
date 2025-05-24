import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAI } from '@/context/AIContext';
import { Send, Bot, Command, History } from 'lucide-react-native';

export default function AssistantScreen() {
  const { colors } = useTheme();
  const { messages, isLoading, sendMessage, commandHistory } = useAI();
  const [input, setInput] = useState('');
  const [showCommands, setShowCommands] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim().length === 0) return;
    sendMessage(input);
    setInput('');
    setShowCommands(false);
    setShowHistory(false);
  };

  const handleCommandPress = (command: string) => {
    setInput(command);
    setShowCommands(false);
  };

  const handleHistoryPress = (command: string) => {
    setInput(command);
    setShowHistory(false);
  };

  const commands = [
    { command: '/send', description: 'Send tokens to an address' },
    { command: '/receive', description: 'Show your receiving address/QR' },
    { command: '/swap', description: 'Swap between tokens' },
    { command: '/bridge', description: 'Bridge assets to/from another chain' },
    { command: '/createwallet', description: 'Create a new local wallet' },
    { command: '/importwallet', description: 'Import wallet using seed phrase' },
    { command: '/balance', description: 'Show current token balances' },
    { command: '/transactions', description: 'List past transactions' },
    { command: '/portfolio', description: 'Show total wallet value in USD' },
    { command: '/price', description: 'Show price of a token' },
    { command: '/chart', description: 'View token chart' },
    { command: '/gas', description: 'Show BSC gas price and fees' },
    { command: '/explorer', description: 'Open token/block explorer' },
    { command: '/learn', description: 'Start a structured lesson' },
    { command: '/ask', description: 'Ask anything about crypto' },
    { command: '/tip', description: 'Random crypto or security tip' },
    { command: '/term', description: 'Explain a crypto term' },
    { command: '/guide', description: 'Step-by-step how-to guide' },
    { command: '/news', description: 'Latest crypto news' },
  ];

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
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerIcon: {
      backgroundColor: colors.primary,
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      fontFamily: 'Inter-Bold',
    },
    headerSubtitle: {
      fontSize: 14,
      color: colors.subText,
      fontFamily: 'Inter-Regular',
    },
    chatContainer: {
      flex: 1,
      padding: 16,
    },
    messageContainer: {
      marginBottom: 16,
      maxWidth: '80%',
    },
    userMessage: {
      alignSelf: 'flex-end',
      backgroundColor: colors.primary,
      borderRadius: 16,
      borderBottomRightRadius: 4,
      padding: 12,
    },
    assistantMessage: {
      alignSelf: 'flex-start',
      backgroundColor: colors.card,
      borderRadius: 16,
      borderBottomLeftRadius: 4,
      padding: 12,
    },
    userMessageText: {
      color: '#FFFFFF',
      fontFamily: 'Inter-Regular',
    },
    assistantMessageText: {
      color: colors.text,
      fontFamily: 'Inter-Regular',
    },
    commandMessage: {
      backgroundColor: colors.accent + '20',
    },
    timestamp: {
      fontSize: 12,
      color: colors.subText,
      marginTop: 4,
      fontFamily: 'Inter-Regular',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    input: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 24,
      paddingHorizontal: 16,
      paddingVertical: 12,
      color: colors.text,
      fontFamily: 'Inter-Regular',
    },
    sendButton: {
      marginLeft: 12,
      backgroundColor: colors.primary,
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    commandButton: {
      marginLeft: 12,
      backgroundColor: colors.card,
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    commandsContainer: {
      position: 'absolute',
      bottom: 80,
      left: 0,
      right: 0,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      maxHeight: 300,
    },
    commandItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    commandText: {
      fontWeight: '600',
      color: colors.primary,
      marginRight: 8,
      fontFamily: 'Inter-Medium',
    },
    commandDescription: {
      color: colors.subText,
      flex: 1,
      fontFamily: 'Inter-Regular',
    },
    loadingText: {
      fontStyle: 'italic',
      color: colors.subText,
      alignSelf: 'flex-start',
      marginBottom: 16,
      fontFamily: 'Inter-Regular',
    },
    historyButton: {
      marginLeft: 12,
      backgroundColor: colors.card,
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }: { item: any }) => (
    <View
      style={[
        styles.messageContainer,
        item.role === 'user' ? styles.userMessage : styles.assistantMessage,
        item.isCommand && styles.commandMessage,
      ]}
    >
      <Text
        style={item.role === 'user' ? styles.userMessageText : styles.assistantMessageText}
      >
        {item.content}
      </Text>
      <Text style={styles.timestamp}>{formatTime(new Date(item.timestamp))}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Bot size={24} color="#FFFFFF" />
        </View>
        <View>
          <Text style={styles.headerTitle}>Chat AI</Text>
          <Text style={styles.headerSubtitle}>Your crypto assistant</Text>
        </View>
      </View>

      <View style={styles.chatContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 16 }}
        />

        {isLoading && <Text style={styles.loadingText}>AI is thinking...</Text>}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Message AI Assistant..."
            placeholderTextColor={colors.subText}
            value={input}
            onChangeText={setInput}
            onFocus={() => {
              setShowCommands(false);
              setShowHistory(false);
            }}
          />

          <TouchableOpacity
            style={styles.commandButton}
            onPress={() => {
              setShowCommands(!showCommands);
              setShowHistory(false);
            }}
          >
            <Command size={20} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => {
              setShowHistory(!showHistory);
              setShowCommands(false);
            }}
          >
            <History size={20} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            disabled={input.trim().length === 0 || isLoading}
          >
            <Send size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {showCommands && (
          <View style={styles.commandsContainer}>
            <ScrollView>
              {commands.map((cmd) => (
                <TouchableOpacity
                  key={cmd.command}
                  style={styles.commandItem}
                  onPress={() => handleCommandPress(cmd.command)}
                >
                  <Text style={styles.commandText}>{cmd.command}</Text>
                  <Text style={styles.commandDescription}>{cmd.description}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {showHistory && commandHistory.length > 0 && (
          <View style={styles.commandsContainer}>
            <ScrollView>
              {commandHistory.map((cmd, index) => (
                <TouchableOpacity
                  key={index.toString()}
                  style={styles.commandItem}
                  onPress={() => handleHistoryPress(cmd)}
                >
                  <Text style={styles.commandText}>{cmd}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}