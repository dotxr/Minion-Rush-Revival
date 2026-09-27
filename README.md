# Minion Rush Revival
### This project plans on supporting every major Minion Rush version!

Minion Rush is shutting down. This project keeps it playable: some versions run on our own server, others carry their own server inside the app and play without internet. Every version keeps its own progress, so each one plays like its own game.

Join our Discord for help, updates and bug reports: https://discord.gg/8bqYUns56b

## Download

Every version, with what it is and which devices it runs on, is on the website: **https://dotxr.github.io/minion-rush-revival/**

The site marks each build:

- **Stable**: plays on the revival server.
- **Experimental**: fully offline, with the server built into the app.
- **Deprecated**: still works, but isn't updated anymore. There's a newer build of the same version.

The files are stored in parts in [Minion-Rush-Revival-Builds](https://github.com/dotxr/Minion-Rush-Revival-Builds); the site downloads the parts, checks them and puts the APK or IPA back together in your browser.

<p align="center">
  <img src="Screenshots/screenshot2.png" width="32%" alt="Main menu">
  <img src="Screenshots/legacy-9.7.1b-menu.png" width="32%" alt="Classic main menu">
  <img src="Screenshots/legacy-9.6.1b-run.png" width="32%" alt="Classic run">
</p>

## Android

1. On your phone, open [the website](https://dotxr.github.io/minion-rush-revival/), pick a version and tap **Download APK**. Keep the page open until the download finishes.
2. Open it, allow installing from that app when asked, then tap **Install**.

If it says the app conflicts with one you already have, uninstall the old one first.

## iPhone / iPad

1. Install [Sideloadly](https://sideloadly.io) on your computer.
2. On your computer, download the IPA from [the website](https://dotxr.github.io/minion-rush-revival/). Plug in your phone and drag the IPA into Sideloadly. Sign in with your Apple ID and press **Start**.
3. On your phone, go to **Settings > General > VPN & Device Management** and trust your Apple ID.
4. On iOS 16 or newer, turn on **Settings > Privacy & Security > Developer Mode**.

With a free Apple ID the app stops opening after 7 days. Just sideload it again. Your save won't be lost.

## Mac

Macs with Apple Silicon can play the iPhone builds through [PlayCover](https://playcover.io), with a small extra setup. See `Debugging/Frida Scripts`.

## Good to know

- Online builds need internet the first time you open them so they can download their data. Offline builds already carry it.
- Purchases that cost real money are free. The website says how each build handles them.
- Game Center and Google Play sign-in don't work, so your save is tied to your device.

## Disclaimer

This is an unofficial, non-commercial fan project. It isn't affiliated with or endorsed by Gameloft, Universal, Illumination or NBCUniversal. Minion Rush, Despicable Me and Minions belong to their owners. It's provided as is, with no warranty. Rights holders can open an issue to request changes or removal.
