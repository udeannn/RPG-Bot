import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path'
import { prefix } from '../../../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileName = path.basename(__filename).split('.')[0];

export const setup = {
    permission: 0, // All permission: 0 = all, 1 = owner, 2 = onwer, admin group
    group_required: false, // if true command only work on group
};

export const helping = {
    text: "Gacha untuk memperkuat kekuatanmu",
    use: `${prefix[0]}${fileName} *banner*`
}
  
export async function run(ctx, obj) {
    let userData;
    try {
        const rawData = fs.readFileSync('database/userRpg.json');
        userData = JSON.parse(rawData);
    } catch (error) {
      console.error('Error read JSON file:', error);
      return;
    }

    const user = userData.find((data) => data.id === obj.sender.id)

    if (!user) {
      let teks = 'Belum terdaftar di fitur RPG silakan ketik #rpg untuk mengaktifkan fitur RPG'
      return ctx.sendMessage(
        obj.room.id, 
        { text: teks },
        { quoted: obj.message.rawkey}
      )
    }

    let loginData;
    try {
        const rawData = fs.readFileSync('database/login.json');
        loginData = JSON.parse(rawData);
    } catch (error) {
        console.error('Error reading login data:', error);
        return ctx.sendMessage(
            obj.room.id,
            { text: 'Error reading login data' },
            { quoted: obj.message.rawkey }
        );
    }
  
    const existsLogin = loginData.includes(obj.sender.id);
    if (!existsLogin) {
        return ctx.sendMessage(
            obj.room.id, 
            { text: 'Kamu belum login' },
            { quoted: obj.message.rawkey}
        )
    }

    const m = obj.message.text.toLowerCase()
    const splitMessage = m.split(' ')

    if (!splitMessage[1]) {
      let teks = `╓─── Gacha\n`
      teks += `║ \n`
      teks += `║ Banner yang tersedia :\n`
      teks += `║ - Weapon\n`
      teks += `║ - Armor\n`
      teks += `║ - Artifact\n`
      teks += `║ \n`
      teks += `╙────────────\n\n`
      teks += `Penggunaan : #gacha *namaBanner*`

      return ctx.sendMessage(
        obj.room.id, 
        { text: teks },
        { quoted: obj.message.rawkey }
      )
    }

    // Variasi nama senjata fantasi
    const fantasyWeaponNames = [
      "Excalibur",
      "Oblivion's Edge",
      "Soulreaver",
      "Dragonfang",
      "Shadowstrike",
      "Frostbite",
      "Thunderstrike",
      "Stormbringer",
      "Firestorm",
      "Doombringer",
      "Inferno Blade",
      "Eclipse Scythe",
      "Celestial Staff",
      "Abyssal Trident",
      "Voidrender",
      "Wraith's Dagger",
      "Phoenix Talon",
      "Serpent's Fang",
      "Divine Bow",
      "Skullcrusher Mace",

      "Virtue And Vice",
      "Brocca",
      "Long Horn",
      "Giga stick Drill",
      "Pole Axe",
      "Staff of Destruction",
      "Lich Bone Wand",
      "Avalon Smasher",
      "Broken butterfly",
      "Royal Saber ",
      "Gopinich Wrath",
      "Detaurus Desolator",
      "Twin Edge of Naght Sieger (Frost)",
      "Twin Edge of Naght Sieger (Fire)",
      "Violet Violent Fear",
      "Monkey wrench",
      "Blade of Nidhoggr Shadow",
      "Estun Esma",
      "Bakonawa fang",
      "Elven Bow"
    ];

    // Variasi nama zirah fantasi
    const fantasyArmorNames = [
      "Dragonhide Armor",
      "Sorcerer's Robes",
      "Knight's Plate",
      "Shadow Cloak",
      "Frostbound Mail",
      "Thunderstorm Mantle",
      "Stormcloak",
      "Flameguard",
      "Doomplate",
      "Inferno Vestments",
      "Eclipse Shroud",
      "Celestial Garb",
      "Abyssal Raiment",
      "Voidshroud",
      "Wraith's Garments",
      "Phoenix Feather Cloak",
      "Serpent Scale Mail",
      "Divine Guardian",
      "Skullcrusher Plate",
    ];

    // Variasi nama artefak fantasi
    const fantasyArtifactNames = [
      "Amulet of Wisdom",
      "Ring of Power",
      "Tome of Arcane Knowledge",
      "Orb of the Elements",
      "Mask of Shadows",
      "Frost Crystal",
      "Thunderstone",
      "Storm Totem",
      "Flame Ruby",
      "Doom Pendant",
      "Eclipse Medallion",
      "Celestial Relic",
      "Abyssal Rune",
      "Void Amulet",
      "Wraith's Specter",
      "Phoenix Feather Charm",
      "Serpent Eye Gem",
      "Divine Sigil",
      "Skullcrusher Totem",
    ];

    // Variasi deskripsi senjata
    const weaponDescriptions = [
      "A legendary weapon said to have been forged by the gods themselves.",
      "A cursed sword that hungers for souls.",
      "A dragon's tooth fashioned into a deadly blade.",
      "An ancient artifact imbued with dark powers.",
      "A blade that strikes from the shadows with deadly precision.",
      "A sword enchanted with the power of ice.",
      "A mighty hammer that calls down thunder from the skies.",
      "A sword said to control the fury of storms.",
      "A weapon that burns with the fires of a raging inferno.",
      "A blade that brings doom to its foes.",
      "A weapon of pure fire that scorches all in its path.",
      "A scythe that eclipses the sun with each swing.",
      "A staff said to channel the energy of the cosmos.",
      "A trident forged in the depths of the abyss.",
      "A blade that rends the fabric of reality.",
      "A dagger said to be favored by vengeful spirits.",
      "A talon from a mythical phoenix, ablaze with fire.",
      "A fang from a serpent of legend.",
      "A bow said to be a gift from the gods themselves.",
      "A mace that crushes bones and skulls alike.",

      "Double sword that could  Determine their swordman life",
      "Super lighty spear with unbelievable power that could pierce Adamantite ",
      "A spear made of unicorn horn will give user unbelievable power",
      "A Giant spear with ultra menancing aura",
      "Unique spear that combination of spear and axe give user ability to pierce and chop",
      "A myth say if the staff was used by ancient demon lord to command his army.... It's really had unbelievable aura, nobody could resist it even the user will consumed by it staff",
      "Staff that made by ancient lich bone... Give the user unbelievable power but slowly consuming it user sould and turned it into a permafrost",
      "Legendary myth tell us that if it hammer was killed the ancient demon Avalon, its owned by ancient Hero Rikka",
      "Common handgun of Police Officer, but this one is bit iconic",
      "Ultra strong spear but it could used as a saber too, One weapon of 13 Royal Knights",
      "A legendary rapier came from stomach Mythical creature : Gopinich itself",
      "Such a powerful bastard sword made of Detaurus the dragon emperor horn",
      "One of two Twin Edge of Naght Sieger sword, it has really powerful aura As if user could summon permafrost",
      "One of two Twin Edge of Naght Sieger sword, it has really powerful aura As if user could Summon meteor storm",
      "The real face of Twin Edge of Naght Sieger when it combined, deadly and powerful enough to dominate the world, the sword could consume it user sould when it used really often",
      "It just monkey wrench man, what did you expected?",
      "Haventh hear bout world enemies? Nidhoggr Shadow was your perfect answer, the Legendary dragon that could devour the entire world has been died and his essence Immortalized in it sword",
      "Common book that used by Soul Linker, it had decent power but still it just common weapon what did you expect for?",
      "A blade made of bakonawa fang, the Legendary dragon that Inhabit in dreadful lake, many of skilled adventure slay him but in return they have never return",
      "Ordinary bow that commonly used by an elf"
    ];

    // Variasi deskripsi zirah
    const armorDescriptions = [
      "A legendary armor known for its impenetrable defenses.",
      "A robe that grants its wearer mystical powers.",
      "A knight's plate armor, bearing the insignia of valor.",
      "A cloak that shrouds its wearer in darkness and secrecy.",
      "A suit of mail that can withstand the coldest of winters.",
      "A mantle that crackles with the power of thunderstorms.",
      "A cloak that brings the fury of a storm to its wearer.",
      "Armor enchanted with the essence of fire protection.",
      "A suit of armor that strikes fear into the hearts of enemies.",
      "Vestments that burn with the fires of damnation.",
      "A shroud that obscures the sun and moon alike.",
      "Garb said to be woven from the celestial fabric of the cosmos.",
      "Raiment imbued with the abyssal energies of the underworld.",
      "An amulet that draws power from the void.",
      "Garments that render the wearer ethereal and unseen.",
      "A cloak made from the feathers of a mythical phoenix.",
      "Armor crafted from the scales of a legendary serpent.",
      "An artifact bearing the divine protection of the gods.",
      "A plate that crushes skulls and bones with ease.",
    ];

    // Variasi deskripsi artefak
    const artifactDescriptions = [
      "An amulet that imparts wisdom beyond mortal comprehension.",
      "A ring that grants its wearer unparalleled strength.",
      "A tome filled with arcane secrets and forbidden knowledge.",
      "An orb that harnesses the elemental forces of the world.",
      "A mask that shrouds its wearer in shadows and mystery.",
      "A crystal that radiates an icy chill.",
      "A stone that crackles with the power of thunderstorms.",
      "A totem that calls upon the fury of a storm.",
      "A gem that burns with the fires of eternal flame.",
      "A pendant that brings doom to its wearer's foes.",
      "A medallion that eclipses the world in darkness.",
      "A relic said to hold the power of the cosmos itself.",
      "A rune imbued with the abyssal energies of the underworld.",
      "An amulet that draws power from the void beyond the stars.",
      "A specter that haunts the living and the dead.",
      "A charm made from the feathers of a mythical phoenix.",
      "An eye that sees all and guards against deception.",
      "A sigil that bears the mark of divine protection.",
      "A totem that channels the fury of a skull-crushing mace.",
    ];

    const commonAdjectives = ["Simple", "Ordinary", "Common"];
    const rareAdjectives = ["Fine", "Unusual", "Rare"];
    const epicAdjectives = ["Powerful", "Mystic", "Epic"];
    const legendAdjectives = ["Legendary", "Mythical", "Godly"];

    const items = [];

    const adjectiveMaps = {
      common: commonAdjectives,
      rare: rareAdjectives,
      epic: epicAdjectives,
      legend: legendAdjectives,
    };

    const commonRate = 70;
    const rareRate = 20;
    const epicRate = 8;
    const legendRate = 2;

    function createItem(adjectives, names, descriptions, rarity, type) {

      const randomIndex = Math.floor(Math.random() * names.length);
      const name = names[randomIndex];
      const description = descriptions[randomIndex];

      let power, defense, hp, critDamage, otherStat;
      let rate; 
    

      switch (rarity) {
        case "common":
          rate = commonRate;
          power = type === "weapon" || type === "artifact" ? Math.floor(Math.random() * 30) + 1 : 0;
          defense = type === "armor" || type === "artifact" ? Math.floor(Math.random() * 20) + 1 : 0;
          hp = type === "armor" || type === "artifact" ? Math.floor(Math.random() * 50) + 1 : 0;
          critDamage = type === "weapon" || type === "artifact" ? Math.floor(Math.random() * 10) + 1 : 0;
          otherStat = Math.random() < 0.5 ? "None" : Math.floor(Math.random() * 20) + 1;
          break;
        case "rare":
          rate = rareRate;
          power = type === "weapon" || type === "artifact" ? Math.floor(Math.random() * 50) + 31 : 0;
          defense = type === "armor" || type === "artifact" ? Math.floor(Math.random() * 40) + 21 : 0;
          hp = type === "armor" || type === "artifact" ? Math.floor(Math.random() * 100) + 51 : 0;
          critDamage = type === "weapon" || type === "artifact" ? Math.floor(Math.random() * 20) + 11 : 0;
          otherStat = Math.random() < 0.5 ? "None" : Math.floor(Math.random() * 30) + 1;
          break;
        case "epic":
          rate = epicRate;
          power = type === "weapon" || type === "artifact" ? Math.floor(Math.random() * 70) + 51 : 0;
          defense = type === "armor" || type === "artifact" ? Math.floor(Math.random() * 60) + 41 : 0;
          hp = type === "armor" || type === "artifact" ? Math.floor(Math.random() * 150) + 101 : 0;
          critDamage = type === "weapon" || type === "artifact" ? Math.floor(Math.random() * 30) + 21 : 0;
          otherStat = Math.random() < 0.5 ? "None" : Math.floor(Math.random() * 40) + 1;
          break;
        case "legend":
          rate = legendRate;
          power = type === "weapon" || type === "artifact" ? Math.floor(Math.random() * 100) + 71 : 0;
          defense = type === "armor" || type === "artifact" ? Math.floor(Math.random() * 80) + 61 : 0;
          hp = type === "armor" || type === "artifact" ? Math.floor(Math.random() * 200) + 151 : 0;
          critDamage = type === "weapon" || type === "artifact" ? Math.floor(Math.random() * 40) + 31 : 0;
          otherStat = Math.random() < 0.5 ? "None" : Math.floor(Math.random() * 50) + 1;
          break;
        default:
          rate = 0;
          power = 0;
          defense = 0;
          hp = 0;
          critDamage = 0;
          otherStat = "None";
      }

      return {
        name,
        rarity,
        description,
        power,
        defense,
        hp,
        critDamage,
        otherStat,
        type,
        rate,
      };
    }
    

    for (let i = 0; i < 100; i++) {
      const randomValue = Math.random() * 100;
      if (randomValue < commonRate) {
        items.push(createItem(commonAdjectives, fantasyWeaponNames, weaponDescriptions, "common", "weapon"));
      } else if (randomValue < commonRate + rareRate) {
        items.push(createItem(rareAdjectives, fantasyWeaponNames, weaponDescriptions, "rare", "weapon"));
      } else if (randomValue < commonRate + rareRate + epicRate) {
        items.push(createItem(epicAdjectives, fantasyWeaponNames, weaponDescriptions, "epic", "weapon"));
      } else {
        items.push(createItem(legendAdjectives, fantasyWeaponNames, weaponDescriptions, "legend", "weapon"));
      }
    }

    for (let i = 0; i < 100; i++) {
      const randomValue = Math.random() * 100;
      if (randomValue < commonRate) {
        items.push(createItem(commonAdjectives, fantasyArmorNames, armorDescriptions, "common", "armor"));
      } else if (randomValue < commonRate + rareRate) {
        items.push(createItem(rareAdjectives, fantasyArmorNames, armorDescriptions, "rare", "armor"));
      } else if (randomValue < commonRate + rareRate + epicRate) {
        items.push(createItem(epicAdjectives, fantasyArmorNames, armorDescriptions, "epic", "armor"));
      } else {
        items.push(createItem(legendAdjectives, fantasyArmorNames, armorDescriptions, "legend", "armor"));
      }
    }

    for (let i = 0; i < 100; i++) {
      const randomValue = Math.random() * 100;
      if (randomValue < commonRate) {
        items.push(createItem(commonAdjectives, fantasyArtifactNames, artifactDescriptions, "common", "artifact"));
      } else if (randomValue < commonRate + rareRate) {
        items.push(createItem(rareAdjectives, fantasyArtifactNames, artifactDescriptions, "rare", "artifact"));
      } else if (randomValue < commonRate + rareRate + epicRate) {
        items.push(createItem(epicAdjectives, fantasyArtifactNames, artifactDescriptions, "epic", "artifact"));
      } else {
        items.push(createItem(legendAdjectives, fantasyArtifactNames, artifactDescriptions, "legend", "artifact"));
      }
    }

    function rollWeaponGacha() {
      const weapons = items.filter(item => item.type === "weapon");
      return rollGacha(weapons);
    }

    function rollArmorGacha() {
      const armors = items.filter(item => item.type === "armor");
      return rollGacha(armors);
    }

    function rollArtifactGacha() {
      const artifacts = items.filter(item => item.type === "artifact");
      return rollGacha(artifacts);
    }

    function rollGacha(itemList) {
      const randomNumber = Math.random() * 100;
      let cumulativeRate = 0;

      for (const item of itemList) {
        cumulativeRate += item.rate;

        if (randomNumber < cumulativeRate) {
          return item;
        }
      }
    }

    function generateRandomId() {
      const numbers = '0123456789';
      let randomId = '';
    
      for (let i = 0; i < 12; i++) {
        if (i === 2 || i === 6) {
          randomId += '-';
        } else {
          const randomIndex = Math.floor(Math.random() * numbers.length);
          randomId += numbers.charAt(randomIndex);
        }
      }
    
      return randomId;
    }


    fs.readFile('database/userRpg.json', 'utf8', (error, inven) => {
      if (error) {
        console.error('Error reading JSON file:', error);
        return;
      }
    
      const invenData = JSON.parse(inven);
    
      const inventory = invenData.find(inven => inven.id === obj.sender.id);
    
      let teks = '';
      let stats 
      if (inventory.gold >= 3000) {
        const randomId = generateRandomId()
        if (splitMessage[1] == 'weapon') {
          const randomWeapon = rollWeaponGacha();
    
          teks += `Anda mendapatkan senjata ${randomWeapon.rarity}\nbernama: ${randomWeapon.name}\n`
          teks += `Deskripsi: ${randomWeapon.description}\n`
          teks += `Kekuatan: ${randomWeapon.power}\n`
          teks += `Critical Damage: ${randomWeapon.critDamage}\n`
          teks += `Statistik Tambahan: ${randomWeapon.otherStat}\n`
    
          inventory.gold -= 3000;

          stats = {
            id: randomId,
            name: randomWeapon.name,
            type: 'weapon',
            rarity: randomWeapon.rarity,
            use: false,
            level: 1,
            power: randomWeapon.power,
            crit_damage: randomWeapon.critDamage,
            additional_stat: randomWeapon.otherStat
          }
        } else if (splitMessage[1] == 'armor') {
          const randomArmor = rollArmorGacha();
          teks += `Anda mendapatkan zirah ${randomArmor.rarity}\nbernama: ${randomArmor.name}\n`
          teks += `Deskripsi: ${randomArmor.description}\n`
          teks += `Defense: ${randomArmor.defense}\n`
          teks += `HP: ${randomArmor.hp}\n`
          teks += `Statistik Tambahan: ${randomArmor.otherStat}\n`
    
          inventory.gold -= 3000;

          stats = {
            id: randomId,
            name: randomArmor.name,
            type: 'armor',
            rarity: randomArmor.rarity,
            use: false,
            level: 1,
            hp: randomArmor.hp,
            defense: randomArmor.defense,
            additional_stat: randomArmor.otherStat
          }
        } else if (splitMessage[1] == 'artifact') {
          const randomArtifact = rollArtifactGacha();
          teks += `Anda mendapatkan artefak ${randomArtifact.rarity}\nbernama: ${randomArtifact.name}\n`
          teks += `Deskripsi: ${randomArtifact.description}\n`
          teks += `Kekuatan: ${randomArtifact.power}\n`
          teks += `Critical Damage: ${randomArtifact.critDamage}\n`
          teks += `Defense: ${randomArtifact.defense}\n`
          teks += `HP: ${randomArtifact.hp}\n`
          teks += `Statistik Tambahan: ${randomArtifact.otherStat}\n`
    
          inventory.gold -= 3000;

          stats = {
            id: randomId,
            name: randomArtifact.name,
            type: 'artifact',
            rarity: randomArtifact.rarity,
            use: false,
            level: 1,
            power: randomArtifact.power,
            crit_damage: randomArtifact.critDamage,
            hp: randomArtifact.hp,
            defense: randomArtifact.defense,
            additional_stat: randomArtifact.otherStat
          }
        } else {
          teks += `╓─── Gacha\n`
          teks += `║ \n`
          teks += `║ Banner yang tersedia :\n`
          teks += `║ - Weapon\n`
          teks += `║ - Armor\n`
          teks += `║ - Artifact\n`
          teks += `║ \n`
          teks += `╙────────────\n\n`
          teks += `Penggunaan : #gacha *namaBanner*`
        }

        const updatedData = invenData.map(item => {
          if (item.id === obj.sender.id) {
            return inventory;
          }
          return item;
        });
      
        fs.writeFile('database/userRpg.json', JSON.stringify(updatedData, null, 2), 'utf8', (err) => {
          if (err) {
            console.error('Error updating JSON file:', err);
            return;
          }
          console.log('Gold updated and saved successfully.');
        });

        fs.readFile('database/equipmentRpg.json', 'utf8', (error, data) => {
            if (error) {
                console.error('Error reading JSON file:', error);
                return;
            }
        
            try {
                const equipmentData = JSON.parse(data);
        
                const playerId = obj.sender.id;
                const playerEquipment = equipmentData.find(equipment => equipment.id === playerId);
        
                if (playerEquipment) {
                    playerEquipment.equipment.push(stats);
                } else {
                    const newData = {
                        id: playerId,
                        equipment: [stats] 
                    };
        
                    equipmentData.push(newData); 
                }
        
                fs.writeFile('database/equipmentRpg.json', JSON.stringify(equipmentData, null, 2), 'utf8', (err) => {
                    if (err) {
                        console.error('Error updating JSON file:', err);
                        return;
                    }
                    console.log('Item added and saved successfully.');
                });
            } catch (error) {
                console.error('Error parsing equipment JSON data:', error);
            }
        });

      } else {
        teks = 'Anda tidak memiliki cukup gold untuk melakukan gacha.';
      }
    
      return ctx.sendMessage(
        obj.room.id, 
        { text: teks },
        { quoted: obj.message.rawkey }
      );
    });    
    
    
  }
  