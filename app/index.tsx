import {
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { fetch } from "expo/fetch";
import { SafeAreaView } from "react-native-safe-area-context";

import { HelloWave } from "@/components/HelloWave";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";
import { Redirect } from "expo-router";

export default function HomeScreen() {
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");

  const onSendMessage = async () => {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env["EXPO_PUBLIC_OPENAI_API_KEY"]}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o",
          messages: [{ role: "user", content: message }],
          stream: true,
        }),
      },
    );

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Response body is not readable");
    }

    const decoder = new TextDecoder();
    let buffer = "";
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        while (true) {
          const lineEnd = buffer.indexOf("\n");
          if (lineEnd === -1) break;
          const line = buffer.slice(0, lineEnd).trim();
          buffer = buffer.slice(lineEnd + 1);
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0].delta.content;
              if (content) {
                setAnswer((oldAnswer) => oldAnswer + content);
              }
            } catch (e) {
              // Ignore invalid JSON
            }
          }
        }
      }
    } finally {
      reader.cancel();
    }
  };

  return <Redirect href="/markdown" />;
  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Streaming demo!</ThemedText>
        <HelloWave />
      </ThemedView>
      <View style={styles.contentContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          <Text>{answer}</Text>
        </ThemedText>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          style={styles.input}
        ></TextInput>
        <TouchableOpacity onPress={onSendMessage}>
          <View style={styles.button}>
            <Text style={styles.buttonLabel}>Send</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    paddingHorizontal: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "white",
    padding: 8,
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "white",
    gap: 10,
  },
  input: {
    flex: 1,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 6,
    height: 40,
  },
  button: {
    backgroundColor: "#0088CC",
    height: 40,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonLabel: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});
