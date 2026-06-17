import { useRef, useState } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ONBOARDING_SLIDES } from "../content/onboarding";

const { width } = Dimensions.get("window");

type OnboardingFlowProps = {
  onLogin: () => void;
  onRegister: () => void;
  onBrowse: () => void;
  onComplete: () => void;
};

export function OnboardingFlow({ onLogin, onRegister, onBrowse, onComplete }: OnboardingFlowProps) {
  const scrollRef = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);
  const isLastSlide = page === ONBOARDING_SLIDES.length - 1;

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const next = Math.round(event.nativeEvent.contentOffset.x / width);
    if (next !== page) setPage(next);
  }

  function goNext() {
    if (isLastSlide) return;
    scrollRef.current?.scrollTo({ x: (page + 1) * width, animated: true });
    setPage(page + 1);
  }

  function skipToEnd() {
    const last = ONBOARDING_SLIDES.length - 1;
    scrollRef.current?.scrollTo({ x: last * width, animated: true });
    setPage(last);
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>B2</Text>
        </View>
        <Text style={styles.brand}>Üretim Platformu</Text>
        {!isLastSlide && (
          <Pressable onPress={skipToEnd} hitSlop={12} style={styles.skipBtn}>
            <Text style={styles.skipText}>Atla</Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.pager}
      >
        {ONBOARDING_SLIDES.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            <View style={styles.emojiCircle}>
              <Text style={styles.emoji}>{slide.emoji}</Text>
            </View>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {ONBOARDING_SLIDES.map((slide, index) => (
            <View
              key={slide.id}
              style={[styles.dot, index === page && styles.dotActive]}
            />
          ))}
        </View>

        {isLastSlide ? (
          <View style={styles.actions}>
            <Text style={styles.welcomeTitle}>Hazırsanız başlayalım</Text>
            <Text style={styles.welcomeSubtitle}>
              Hesabınız varsa giriş yapın, yoksa birkaç dakikada kayıt olun.
            </Text>
            <Pressable
              style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
              onPress={() => {
                onComplete();
                onRegister();
              }}
            >
              <Text style={styles.primaryBtnText}>Kayıt Ol</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.secondaryBtn, pressed && styles.btnPressed]}
              onPress={() => {
                onComplete();
                onLogin();
              }}
            >
              <Text style={styles.secondaryBtnText}>Giriş Yap</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                onComplete();
                onBrowse();
              }}
              style={styles.ghostBtn}
            >
              <Text style={styles.ghostBtnText}>Siteye göz at</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
            onPress={goNext}
          >
            <Text style={styles.primaryBtnText}>Devam</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
    gap: 10,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#0d9488",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 12,
  },
  brand: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  skipText: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "600",
  },
  pager: {
    flex: 1,
  },
  slide: {
    width,
    paddingHorizontal: 28,
    paddingTop: 24,
    alignItems: "center",
  },
  emojiCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#99f6e4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  emoji: {
    fontSize: 44,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
    textAlign: "center",
    lineHeight: 32,
    marginBottom: 14,
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
    color: "#475569",
    textAlign: "center",
    maxWidth: 340,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 28,
    paddingTop: 8,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#cbd5e1",
  },
  dotActive: {
    width: 22,
    backgroundColor: "#0d9488",
  },
  actions: {
    gap: 10,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center",
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 8,
  },
  primaryBtn: {
    backgroundColor: "#0d9488",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#0d9488",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryBtn: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  secondaryBtnText: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "700",
  },
  ghostBtn: {
    paddingVertical: 10,
    alignItems: "center",
  },
  ghostBtnText: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "600",
  },
  btnPressed: {
    opacity: 0.88,
  },
});
