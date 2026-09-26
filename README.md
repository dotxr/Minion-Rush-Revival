# Minion Rush Revival

Minion Rush is shutting down. This is a revived build of the game that talks to our own server instead of Gameloft's, so you can keep playing! 

The only data that caries over from the real Minion Rush are the leaderboards. But all new progress saves!

<p align="center">
  <img src="Screenshots/screenshot2.png" width="32%" alt="Main menu">
  <img src="Screenshots/screenshot.png" width="32%" alt="Maxed-out profile">
  <img src="Screenshots/screenshot3.png" width="32%" alt="Fresh profile">
</p>

There are two builds:
- `MinionRushRevived-13.3.0.apk` for Android
- `MinionRushRevived-13.3.0.ipa` for iPhone, iPad, and Macs with Apple Silicon


## Android

The APK is 64-bit only (arm64), which covers pretty much every phone from the
last several years.

1. Download `MinionRushRevived-13.3.0.apk` onto your phone.
2. Open it. Android will ask you to allow installing apps from that source
   (your browser or file manager). Allow it, then tap **Install**.
3. Open **Minion Rush** from your app drawer.

Or, from a computer with USB debugging turned on:

```sh
adb install MinionRushRevived-13.3.0.apk
```

If Android says the app conflicts with an existing package, uninstall any older
revived build first. Builds signed with a different key can't update over each
other.

## iPhone / iPad (Sideloadly)

1. Install [Sideloadly](https://sideloadly.io) on your Windows PC or Mac, plus
   iTunes/iCloud from Apple's site if you're on Windows.
2. Plug in your iPhone or iPad and trust the computer when it asks.
3. Drag `MinionRushRevived-13.3.0.ipa` into Sideloadly, enter your Apple ID and
   press **Start**.
4. On the device, go to **Settings > General > VPN & Device Management**, tap
   your Apple ID and trust it.
5. On iOS 16 and newer, turn on **Settings > Privacy & Security > Developer
   Mode** and restart when asked.
6. Open **Minion Rush**.

With a free Apple ID the app stops launching after 7 days. Open Sideloadly and
sideload it again to refresh it; your save is on our server, so nothing is lost.

## Mac (PlayCover)

The game runs on Apple Silicon Macs through [PlayCover](https://playcover.io),
but PlayCover needs a few runtime patches, applied with
[Frida](https://frida.re).

1. Install the IPA in PlayCover (drag it onto the PlayCover window).
2. Install Frida: `pip3 install frida-tools`
3. From this repo's `Debugging/Frida Scripts` folder, launch the game with the
   patches:

```sh
frida --no-auto-reload \
  -f ~/Library/Containers/io.playcover.PlayCover/Applications/com.dotxr.MinionRushRevived.app/MinionRush \
  -l frida-il2cpp-bridge.js -l PlayCoverPatches.js
```

Keep the terminal open while you play; closing it closes the game. Load both
files in that order, since the patches depend on the bridge.

What the patches do: skip the jailbreak check (it crashes under PlayCover),
work around PlayCover's keychain handing back bad data, turn off Game Center
(PlayCover apps can't use it), and disable the ad and tracking SDKs.

## Important Info

- You need an internet connection for at LEAST the first launch so it can download the AssetBundles (Game Data)
- Real-money purchases in the store are free on our server. After clicking a purchase button, restart the game to see the items.
- Game Center and Google Play Games sign-in aren't available in the revived build, so your progress is tied to the device you play on.

## Disclaimer

Minion Rush Revival is an unofficial, non-commercial fan preservation project.
It is not endorsed by, affiliated with, sponsored by or approved by Gameloft SE,
Universal City Studios LLC, Universal Pictures, Illumination Entertainment,
NBCUniversal or any of their subsidiaries or affiliates.

Minion Rush, Despicable Me, Minions and all related names, characters, artwork,
audio and other content are trademarks and/or copyrighted works of their
respective owners. All rights to them remain with those owners. No ownership of
any of it is claimed.

This project is provided as is, with no warranty of any kind. Use it at your own
risk. If you are a rights holder and want something changed or taken down,
please open an issue in this repository.
