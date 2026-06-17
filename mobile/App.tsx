import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, BackHandler, Platform, SafeAreaView, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { WebView } from "react-native-webview";
import * as Notifications from "expo-notifications";
import { AppWebView } from "./src/components/AppWebView";
import { OnboardingFlow } from "./src/components/OnboardingFlow";
import { ONBOARDING_STORAGE_KEY, WEB_BASE_URL } from "./src/config";

type AppScreen = "boot" | "onboarding" | "webview";

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
  const webRef = useRef<WebView>(null);
  const [screen, setScreen] = useState<AppScreen>("boot");
  const [webUri, setWebUri] = useState(WEB_BASE_URL);
  const [webCanGoBack, setWebCanGoBack] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      try {
        const done = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
        if (!cancelled) {
          setScreen(done === "1" ? "webview" : "onboarding");
        }
      } catch {
        if (!cancelled) setScreen("onboarding");
      }
    }

    void boot();
    return () => {
      cancelled = true;
    };
  }, []);

  const completeOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, "1");
    } catch {
      // ignore storage errors
    }
  }, []);

  const openWeb = useCallback((path = "") => {
    const base = WEB_BASE_URL.replace(/\/$/, "");
    const next = path ? `${base}${path.startsWith("/") ? path : `/${path}`}` : base;
    setWebUri(next);
    setScreen("webview");
  }, []);

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const url = (response.notification.request.content.data as { url?: string })?.url;
      if (typeof url === "string" && url.startsWith("http")) {
        setWebUri(url);
        setScreen("webview");
      }
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (screen === "onboarding") return false;
      if (screen === "webview" && webCanGoBack) {
        webRef.current?.goBack();
        return true;
      }
      return false;
    });

    return () => sub.remove();
  }, [screen, webCanGoBack]);

  return (
    <SafeAreaView style={styles.safe}>
      {screen === "boot" && (
        <View style={styles.boot}>
          <ActivityIndicator size="large" color="#0d9488" />
        </View>
      )}

      {screen === "onboarding" && (
        <OnboardingFlow
          onComplete={() => void completeOnboarding()}
          onLogin={() => openWeb("/giris")}
          onRegister={() => openWeb("/kayit")}
          onBrowse={() => openWeb()}
        />
      )}

      {screen === "webview" && (
        <AppWebView
          uri={webUri}
          webRef={webRef}
          onCanGoBackChange={setWebCanGoBack}
        />
      )}

      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  boot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
