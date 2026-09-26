# PlayCover (Mac)

1. Drag the IPA onto the PlayCover window to install it.
2. Install Frida: `pip3 install frida-tools`
3. From this folder, run:

```sh
frida --no-auto-reload \
  -f ~/Library/Containers/io.playcover.PlayCover/Applications/com.dotxr.MinionRushRevived.app/MinionRush \
  -l frida-il2cpp-bridge.js -l PlayCoverPatches.js
```

Keep the terminal open while you play, because closing it closes the game.

The patches skip the jailbreak check, fix PlayCover's keychain, turn off Game Center and disable ads and tracking.
