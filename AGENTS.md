# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

# ビルドポリシー

**AndroidビルドはローカルのGradleで行う。EASクラウドビルドは使用禁止（料金がかかるため）。**
**`eas build --local` はWindows非対応なので使わない。**

## Windowsでのローカルビルド手順

```powershell
# 1. Androidネイティブコード生成（初回・依存変更時のみ）
npx expo prebuild --platform android --clean

# 2. Gradleでリリースビルド（apk）
cd android
.\gradlew.bat assembleRelease

# 出力先: android\app\build\outputs\apk\release\app-release.apk
```

必要環境:
- Java JDK 17 (設定済み: F:\Program\Java\jdk11\jdk-17.0.0.1)
- Android SDK (設定済み: ANDROID_HOME=F:\android_sdk)
