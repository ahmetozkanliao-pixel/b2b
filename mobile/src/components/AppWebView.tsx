import { useRef, useState, type RefObject } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

type AppMessage = { type: "OPEN_URL"; url: string } | { type: "REQUEST_PUSH_TOKEN" };

type AppWebViewProps = {
  uri: string;
  webRef?: RefObject<WebView | null>;
  onCanGoBackChange?: (canGoBack: boolean) => void;
};

export function AppWebView({ uri, webRef: externalRef, onCanGoBackChange }: AppWebViewProps) {
  const internalRef = useRef<WebView>(null);
  const webRef = externalRef ?? internalRef;
  const [loading, setLoading] = useState(true);

  async function ensurePushPermissionAndGetToken() {
    if (!Device.isDevice) {
      Alert.alert("Push bildirim", "Push bildirimler emülatörde çalışmaz. Gerçek cihazda deneyin.");
      return null;
    }

    const current = await Notifications.getPermissionsAsync();
    let status = current.status;
    if (status !== "granted") {
      const requested = await Notifications.requestPermissionsAsync();
      status = requested.status;
    }

    if (status !== "granted") {
      Alert.alert("Bildirim izni", "Bildirim izni verilmedi.");
      return null;
    }

    const token = await Notifications.getExpoPushTokenAsync();
    return token.data;
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webRef}
        source={{ uri }}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={(nav) => onCanGoBackChange?.(nav.canGoBack)}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#0d9488" />
          </View>
        )}
        onMessage={async (event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data) as AppMessage;
            if (data.type === "OPEN_URL" && data.url) {
              webRef.current?.injectJavaScript(
                `window.location.href = ${JSON.stringify(data.url)}; true;`
              );
            }
            if (data.type === "REQUEST_PUSH_TOKEN") {
              const token = await ensurePushPermissionAndGetToken();
              if (!token) return;
              webRef.current?.postMessage(JSON.stringify({ type: "PUSH_TOKEN", token }));
            }
          } catch {
            // ignore malformed messages
          }
        }}
        allowsBackForwardNavigationGestures={Platform.OS === "ios"}
      />

      {loading && (
        <View style={styles.overlayLoading}>
          <ActivityIndicator size="large" color="#0d9488" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  overlayLoading: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
  },
});
