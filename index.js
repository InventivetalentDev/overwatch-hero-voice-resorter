// Sorting of Overwatch extracted voicelines
// To be used with https://github.com/overtools/OWLib and  `DataTool.exe G:\BattleNet\Overwatch extract-hero-voice D:\overwatch-extract *`

const fs = require("fs");
const path = require("path");

const IN = "D:\\overwatch-extract\\HeroVoice";
const OUT = "D:\\overwatch-extract\\HeroVoiceSorted";

// From https://github.com/overtools/OWLib/blob/2a0efcfe25bea381e4471f8a28254a89af011a6c/DataTool/ToolLogic/Extract/ExtractHeroVoiceBetter.cs#L36
const CATEGORY_MAP ={
    "000000000079.08A": "Ultimate",
   "000000000031.079": "Voiceline",
   "0000000001CF.078": "Hello",
   "0000000002D4.078": "Bye",
   "0000000001D2.078": "No",
   "0000000001D1.078": "Yes",
   "000000000045.078": "Healing",
   "0000000002C6.078": "GroupUp",
   "000000000112.078": "Incoming",
   "0000000002F2.078": "Understand",
   "0000000001D0.078": "Thanks",
   "0000000002E7.078": "UltimateReady",
   "00000000002C.078": "Respawn",
   "0000000005E2.078": "NanoBoosted",
   "0000000000CC.078": "DamageBoosted",
   "0000000005ED.078": "Unwell",
   "00000000014B.078": "HeroChange",
   "00000000002B.078": "HeroSelect",
   "0000000002BF.078": "Discorded",
   "00000000047D.078": "VotedEpic",
   "000000000496.078": "VotedLegendary",
   "000000000583.078": "OnFire",
   "00000000002A.078": "HealthPack",
   "00000000011B.078": "EnemyResurrect",
   "00000000005A.078": "Resurrected",
   "000000000008.078": "Elimination",
   "000000000039.078": "KillStreak",
  "00000000001B.078": "TeamElimination" ,
   "000000000036.078": "Revenge",
   "000000000111.078": "Fallback",

  "0000000002F0.078": "EnemyTeleporter",
    "0000000001DF.078": "EnemyTeleporter",
    "0000000001E0.078": "EnemyTeleporter",
    "0000000001E1.078": "EnemyTeleporter",

   "000000000037.078": "EnemyTurret",
    "0000000000D8.078": "EnemyTurret",

   "0000000002E8.078": "GoingIn",
   "00000000010F.078": "ImWithYou",
   "0000000002E9.078": "OnMyWay",
   "0000000002EC.078": "MovePayload",
   "0000000002F1.078": "ImReady",
   "000000000573.078": "GetReady",
   "0000000002C5.078": "GetInThere",
   "0000000000CA.078": "RescueTeammate",
   "000000000A27.078": "Karaoke",
   "0000000002F8.078": "Armor",
    "000000000584.078": "TeamKill",
   "0000000009C6.078" : "UnderAttack",
   "000000000054.078": "Jumping",
   "000000000022.078": "DeathCharged",
   "00000000001E.078": "DeathExplosion",
   "0000000000B7.078": "Stagger",
   "0000000000CD.078": "Cough",
   "000000000027.078": "Payload",
   "000000000283.078": "Damaged",
   "00000000012F.078": "Electrocuted",
   "000000000113.078": "Scream",
   "000000000001.078": "Death",
   "00000000000D.078": "MatchTalk",
   "00000000026F.078": "LevelUp",
   "0000000006A1.078": "Laugh",

   "0000000006BE.078": "Junkenstein"
    , "0000000006AB.078": "Junkenstein",
    "000000000854.078": "Junkenstein",
    "000000000852.078": "Junkenstein",

   "000000000D1C.078": "StormRising",
    "000000000D1F.078": "StormRising",
    "000000000D16.078": "StormRising",
    "000000000D14.078": "StormRising",
    "000000000D15.078": "StormRising",

   "0000000009CC.078": "Retribution",
    "000000000A10.078": "Retribution",
    "000000000968.078": "Retribution",

   "000000000778.078": "Uprising",
    "0000000007F5.078": "Uprising",
    "00000000078E.078": "Uprising",
    "00000000078D.078": "Uprising",
    "000000000789.078": "Uprising",
};

async function processHeroes() {
    if (!fs.existsSync(OUT)) {
        fs.mkdirSync(OUT);
    }

    let heroDirs = fs.readdirSync(IN);
    for (let heroDir of heroDirs) {
        console.log("Processing " + heroDir);
        let outHeroDir = path.join(OUT, heroDir);
        if (!fs.existsSync(outHeroDir)) {
            fs.mkdirSync(outHeroDir);
        }
        let fullHeroDir = path.join(IN, heroDir);

        let heroVariationsDirs = fs.readdirSync(fullHeroDir);
        for (let heroVariationDir of heroVariationsDirs) {
            console.log("  Processing "+heroDir+"/"+heroVariationDir);
            let fullHeroVariationDir = path.join(fullHeroDir, heroVariationDir);

            let firstLevelHeroDirs = fs.readdirSync(fullHeroVariationDir);
            for (let firstLevelDir of firstLevelHeroDirs) {
                let secondLevelHeroDirs = fs.readdirSync(path.join(fullHeroVariationDir, firstLevelDir));
                for (let secondLevelDir of secondLevelHeroDirs) {
                    let heroFiles = fs.readdirSync(path.join(fullHeroVariationDir, firstLevelDir, secondLevelDir));
                    for (let heroFile of heroFiles) {
                        if (!heroFile.endsWith(".ogg")) {
                            continue;
                        }
                        let fullPath = path.join(fullHeroVariationDir, firstLevelDir, secondLevelDir, heroFile);

                        let split = heroFile.split("-");
                        let quoteWithExtension = split[split.length - 1];


                        let category = secondLevelDir;
                        if(CATEGORY_MAP[category]){
                            category = CATEGORY_MAP[category];
                        }else {
                            while (category[0] === "0") {
                                category = category.substr(1);
                            }
                        }

                        let outPath = path.join(outHeroDir, "{"+category+"} [" + heroVariationDir +"] " + quoteWithExtension);

                        fs.copyFileSync(fullPath, outPath);
                    }
                }
            }
        }
    }
}


processHeroes();
