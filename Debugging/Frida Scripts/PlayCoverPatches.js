Il2Cpp.$config.unityVersion = "6000.0.78f1";
Il2Cpp.$config.moduleName = "UnityFramework";

const whenUnity = fn => {
  if (Process.findModuleByName("UnityFramework")) return setImmediate(fn);
  const obs = Process.attachModuleObserver({
    onAdded(m) {
      if (m.name != "UnityFramework") return;
      setImmediate(() => { obs.detach(); fn(); });
    }
  });
};

(() => {
  const glob = Module.findGlobalExportByName("glob");
  if (!glob) return console.log("[-] glob not found");

  const GLOB_NOMATCH = 3;
  Interceptor.replace(glob, new NativeCallback((pattern, flags, errfunc, pglob) => {
    if (!pglob.isNull()) pglob.writeByteArray(new Uint8Array(96));
    return GLOB_NOMATCH;
  }, "int", ["pointer", "int", "pointer", "pointer"]));

  console.log("[+] jailbreak scan suppressed");
})();

whenUnity(() => Il2Cpp.perform(() => {
  const x = Il2Cpp.exports, u8 = Memory.allocUtf8String;
  const convert = x.classFromName(x.getCorlib(), u8("System"), u8("Convert"));
  const mi = convert.isNull() ? NULL : x.classGetMethodFromName(convert, u8("FromBase64String"), 1);
  if (mi.isNull()) return console.log("[-] base64 guard: FromBase64String not found");

  const empty = x.stringNew(u8(""));
  x.gcHandleNew(empty, 1);

  const read = p => p.isNull() ? null : p.add(0x14).readUtf16String(p.add(0x10).readS32());
  const valid = s => s.length % 4 == 0 && /^[A-Za-z0-9+/]*={0,2}$/.test(s);

  Interceptor.attach(mi.readPointer(), {
    onEnter(args) {
      let s;
      try { s = read(args[0]); } catch (e) { return; }
      if (s == null || valid(s)) return;
      console.log("[fix] neutralized bad base64: " + JSON.stringify(s));
      args[0] = empty;
    }
  });
  console.log("[+] base64 guard active");
}));

const retry = (label, fn, left = 60) => Il2Cpp.perform(() => {
  try {
    fn();
  } catch (e) {
    if (left % 20 == 0) console.log("[.] " + label + " retrying: " + e.message);
    if (left > 0) return setTimeout(() => retry(label, fn, left - 1), 250);
    console.log("[-] " + label + " failed: " + e.message);
  }
});

const installed = new Set();
let classes = null;

const once = (key, fn) => { if (installed.has(key)) return; fn(); installed.add(key); };

const installAll = () => {
  if (!classes) {
    const map = {};
    for (const asm of Il2Cpp.domain.assemblies)
      for (const k of asm.image.classes) map[k.type.name] = k;
    classes = map;
  }

  try {
    let done = 0;
    const klass = classes["GameOnline.Social.GameCenterSocialLoginProvider"];
    if (klass) {
      {
        for (const m of klass.methods) {
          if (!/GetSavedSocialLoginAsync|PerformSocialLoginAsync/.test(m.name)) continue;
          if (m.virtualAddress.isNull()) continue;
          const rt = m.returnType;
          once("gc:" + m.name, () => {
            m.implementation = function () {
              console.log("[fix] skipped GameCenter." + m.name);
              return new Il2Cpp.ValueType(Memory.alloc(rt.class.valueTypeSize), rt);
            };
          });
          done++;
        }
      }
    }
    once("log:gc", () => console.log(done ? "[+] Game Center bypassed (" + done + " methods)"
                     : "[-] Game Center provider not found"));
  } catch (e) {
    throw e;
  }

  const completed = Il2Cpp.corlib.class("System.Threading.Tasks.Task").method("get_CompletedTask").invoke();
  const defaultFor = t => {
    if (t.name == "System.Void") return undefined;
    if (t.name == "System.String") return Il2Cpp.string("");
    if (t.name == "System.Threading.Tasks.Task") return completed;
    const a = t.fridaAlias;
    if (Array.isArray(a)) return new Il2Cpp.ValueType(Memory.alloc(t.class.valueTypeSize), t);
    if (a == "bool") return false;
    if (a == "pointer") return NULL;
    return 0;
  };

  const stub = (className, re, tag) => {
    const k = classes[className];
    if (!k) return console.log("[-] missing " + className);
    let n = 0;
    for (const m of k.methods) {
      if (!re.test(m.name) || m.virtualAddress.isNull() || m.isGeneric) continue;
      try {
        const label = className.split(".").pop() + "." + m.name;
        once("stub:" + label + ":" + m.virtualAddress, () => {
          m.implementation = function () {
            if (tag) console.log("[fix] " + label);
            return defaultFor(m.returnType);
          };
        });
        n++;
      } catch (e) {
        console.log("[-] " + className + "." + m.name + ": " + e);
      }
    }
    if (!installed.has("log:" + className)) { installed.add("log:" + className); console.log("[+] stubbed " + className + " (" + n + ")"); }
  };

  stub("GameOnline.Social.iOS.GameCenterGLSocialLib", /^gameCenterGLSocialLib_/, false);
  stub("GameOnline.Social.GameCenterSocialLoginProvider", /^(Init|OnApplicationPause|CheckIsLoggedInAsync|LogoutAsync|GetPlayerNicknameAsync)$/, true);
  stub("Data.GameCenter.GameCenterIntegration", /^(PostScoresAsync|CheckLoginAsync)$/, true);
  stub("Data.GameCenter.GameCenterLeaderboard", /^(GameCenterLeaderboardPostScore|PostScoreAsync)$/, true);

  stub("GameOnline.Tracking.SingularManager", /^(InitializeAsync|IsSingularEnabled|SendEvent|SendInAppPurchaseEvent|SendAdRevenueEvent|ProcessSnsGift|OnSingularLinkResolved|ProcessSingularLinkParams|SetSingularParams|SetCustomUserId|SetGlobalProperties|SetCompliancyParameters|OnRewardsReceived|InitSnsGifts|ProcessSnsGiftExpiredOrClaimed)$/, false);

  stub("Gameloft.AHKit.AHCoreModule", /^(StartMonitoring|NativeStart|NativeResume|ComputeAndSendInitEvents|AHTrackEvent|Send(Zoro|DylibsStatus|Batman|Thor|Robin)Event|IsDeviceRooted|IsRooted|SetRobinCallback)$/, false);
  stub("Gameloft.AHKit.Platform.iOS.AHCoreDetectionIOS", /^_(Start|Resume|IsRooted|SetRobinCallback)$/, false);
  stub("GameCommon.AntiHacking.AntiHackingManager", /^(Initialize|SetEnabled|LogInfo)$/, false);
  stub("GameOnline.Ads.AdsSubsystem", /^(InitializeAsync|ProcessInterstitialAdAsync|ShowInterstitialAdAsync|ShowIronSourceTestSuite|Update|OnApplicationPause|InitProvider|InitTestMode|ProcessOnConsentStatusChanged|InitAvailabilityProviders|ResetAvailabilityProviders|DisposeAvailabilityProviders|ProcessAdShowed)$/, false);

  (() => {
    const Ads = classes["GameOnline.Ads.AdsSubsystem"];
    for (const n of ["HasAvailableAds", "IsAdAvailable"]) {
      const m = Ads.methods.find(m => m.name == n);
      once("ads:" + n, () => { m.implementation = function () { return true; }; });
    }
    const show = Ads.methods.find(m => m.name == "ShowAdsAsync");
    const rt = show.returnType, H = Il2Cpp.Object.headerSize;
    const resField = rt.class.fields.find(f => f.name == "result");
    const inner = resField.type.class;
    const valueOff = resField.offset - H + inner.fields.find(f => f.name.includes("Value")).offset - H;
    const rewardedOff = resField.offset - H + inner.fields.find(f => f.name.includes("Rewarded")).offset - H;
    const FINISHED = 3;
    once("ads:show", () => {
      show.implementation = function (type, pointcut) {
        let where = "?";
        try { where = pointcut.content; } catch (e) {}
        console.log("[fix] ad shown instantly: " + where);
        const mem = Memory.alloc(rt.class.valueTypeSize);
        mem.add(valueOff).writeS32(FINISHED);
        mem.add(rewardedOff).writeU8(1);
        return new Il2Cpp.ValueType(mem, rt);
      };
    });
    once("log:ads", () => console.log("[+] ads resolve instantly (rewarded)"));
  })();
};

whenUnity(() => setTimeout(() => retry("patches", installAll), 1000));

