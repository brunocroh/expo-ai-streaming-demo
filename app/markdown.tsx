import { ScrollView, StyleSheet, Text } from "react-native";
import Markdown, { MarkdownIt } from "react-native-markdown-display";
import { SafeAreaView } from "react-native-safe-area-context";
import MyPlugin from "@/lib/markdown-plugin";

const copy = `
==This is some **text** that is highlighted.==

^^This is some **text** that is highlighted.^^
`;

const rules = {
  redblock: (node, children, parent, styles) => {
    return (
      <Text key={node.key} style={{ backgroundColor: "red" }}>
        {children}
      </Text>
    );
  },
  blueblock: (node, children, parent, styles) => {
    return (
      <Text key={node.key} style={{ backgroundColor: "#D6DDFD" }}>
        {children}
      </Text>
    );
  },
  bold: (node, children, parent, styles) => {
    return (
      <Text key={node.key} style={{ fontWeight: 700 }}>
        {children}
      </Text>
    );
  },
};

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ height: "100%" }}
      >
        <Markdown
          rules={rules}
          markdownit={MarkdownIt({ typographer: true }).use(MyPlugin)}
        >
          {copy}
        </Markdown>
      </ScrollView>
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
