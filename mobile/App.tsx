import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

type AppMessage = { type: "OPEN_URL"; url: string } | { type: "REQUEST_PUSH_TOKEN" };

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {
  const baseUrl = useMemo(() => "https://b2b212.vercel.app", []);
  const webRef = useRef<WebView>(null);
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

    // Expo Push Token (Expo managed). Store tarafında EAS/FCM/APNs kurulumu ile native tokenlara da geçilir.
    const token = await Notifications.getExpoPushTokenAsync();
    return token.data;
  }

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      webRef.current?.goBack();
      return true;
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    // Foreground notif click behavior could be handled later for deep links.
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const url = (response.notification.request.content.data as any)?.url;
      if (typeof url === "string" && url.startsWith("http")) {
        webRef.current?.injectJavaScript(
          `window.location.href = ${JSON.stringify(url)}; true;`
        );
      }
    });
    return () => sub.remove();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <WebView
          ref={webRef}
          source={{ uri: baseUrl }}
          onLoadEnd={() => setLoading(false)}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loading}>
              <ActivityIndicator size="large" />
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

                // Web'e token'ı verelim; web tarafında /api/... endpoint'ine kaydedilebilir.
                webRef.current?.postMessage(
                  JSON.stringify({ type: "PUSH_TOKEN", token })
                );
              }
            } catch {
              // ignore malformed messages
            }
          }}
        />

        {loading && (
          <View style={styles.overlayLoading}>
            <ActivityIndicator size="large" />
          </View>
        )}
      </View>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  overlayLoading: {
    position: "absolute",
    inset: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
  },
});
