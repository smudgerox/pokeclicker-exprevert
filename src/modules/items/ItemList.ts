/* eslint-disable no-multi-spaces */
import BerryType from '../enums/BerryType';
import KeyItemType from '../enums/KeyItemType';
import MulchType from '../enums/MulchType';
import OakItemType from '../enums/OakItemType';
import BattleItem from './BattleItem';
import BerryItem from './BerryItem';
import BuyKeyItem from './buyKeyItem';
import BuyOakItem from './buyOakItem';
import EnergyRestore from './EnergyRestore';
import Item from './Item';
import MulchItem from './MulchItem';
import PokeballItem from './PokeballItem';
import {
    BattleItemType, Currency, EggItemType, EnergyRestoreSize, MegaStoneType, Pokeball, PokeBlockColor, Region, VitaminType,
} from '../GameConstants';
import { ShovelItem, MulchShovelItem } from './ShovelItem';
import PokeBlock from './PokeBlock';
import MegaStoneItem from './MegaStoneItem';
import Vitamin from './Vitamin';
import EggItem from './EggItem';
import MaxRegionRequirement from '../requirements/MaxRegionRequirement';
import MultiRequirement from '../requirements/MultiRequirement';
import TemporaryBattleRequirement from '../requirements/TemporaryBattleRequirement';
import ObtainedPokemonRequirement from '../requirements/ObtainedPokemonRequirement';
import QuestItem from './QuestItem';

// eslint-disable-next-line import/prefer-default-export
export const ItemList: { [name: string]: Item } = {};

ItemList.xAttack         = new BattleItem(BattleItemType.xAttack, '+50% Bonus to Pokémon attack for 30 seconds', 600, undefined, 'X Attack', 'pokemonAttack', 1.5);
ItemList.xClick          = new BattleItem(BattleItemType.xClick, '+50% Bonus to click attack for 30 seconds', 400, undefined, 'X Click', 'clickAttack', 1.5);
ItemList.Lucky_egg       = new BattleItem(BattleItemType.Lucky_egg, '+50% Bonus to experience gained for 30 seconds', 800, undefined, 'Lucky Egg', 'exp', 1.5);
ItemList.Token_collector = new BattleItem(BattleItemType.Token_collector, '+50% Bonus to Dungeon Tokens gained for 30 seconds', 1000, undefined, 'Token Collector', 'dungeonToken', 1.5);
ItemList.Dowsing_machine = new BattleItem(BattleItemType.Dowsing_machine, 'Increased chance of gaining extra items for 30 seconds', 1500, undefined, 'Dowsing Machine');
ItemList.Lucky_incense   = new BattleItem(BattleItemType.Lucky_incense, '+50% Bonus to Pokédollars gained for 30 seconds', 2000, undefined, 'Lucky Incense', 'money', 1.5);

ItemList.ChopleBerry     = new BerryItem(BerryType.Chople, 10000, Currency.farmPoint, BerryType.Spelon);
ItemList.KebiaBerry      = new BerryItem(BerryType.Kebia, 10000, Currency.farmPoint, BerryType.Pamtre);
ItemList.ShucaBerry      = new BerryItem(BerryType.Shuca, 10000, Currency.farmPoint, BerryType.Watmel);
ItemList.ChartiBerry     = new BerryItem(BerryType.Charti, 10000, Currency.farmPoint, BerryType.Cornn);

ItemList.SmallRestore    = new EnergyRestore(EnergyRestoreSize.SmallRestore, 30000, undefined, 'Small Restore');
ItemList.MediumRestore   = new EnergyRestore(EnergyRestoreSize.MediumRestore, 100000, undefined, 'Medium Restore');
ItemList.LargeRestore    = new EnergyRestore(EnergyRestoreSize.LargeRestore, 400000, undefined, 'Large Restore');

ItemList.Dungeon_ticket = new BuyKeyItem(KeyItemType.Dungeon_ticket, 100, undefined, undefined, 'Dungeon Ticket');
ItemList.Explorer_kit = new BuyKeyItem(KeyItemType.Explorer_kit, 5000, undefined, undefined, 'Explorer Kit');

ItemList.Squirtbottle = new BuyOakItem(OakItemType.Squirtbottle, 5000, Currency.farmPoint);
ItemList.Sprinklotad = new BuyOakItem(OakItemType.Sprinklotad, 10000, Currency.farmPoint);
ItemList.Explosive_Charge = new BuyOakItem(OakItemType.Explosive_Charge, 5000, Currency.questPoint);
ItemList.Treasure_Scanner = new BuyOakItem(OakItemType.Treasure_Scanner, 10000, Currency.questPoint);

ItemList.Boost_Mulch   = new MulchItem(MulchType.Boost_Mulch, 50, 'Boost Mulch', 'Increases Berry growth rate.');
ItemList.Rich_Mulch  = new MulchItem(MulchType.Rich_Mulch, 100, 'Rich Mulch', 'Increases Berry harvest rate and replant chances.');
ItemList.Surprise_Mulch  = new MulchItem(MulchType.Surprise_Mulch, 150, 'Surprise Mulch', 'Increases Berry mutation rate.');
ItemList.Amaze_Mulch = new MulchItem(MulchType.Amaze_Mulch, 200, 'Amaze Mulch', 'A weaker combination of Boost, Rich and Surprise mulch.');
ItemList.Freeze_Mulch = new MulchItem(MulchType.Freeze_Mulch, 350, 'Freeze Mulch', 'Stops Berry growth and auras. Mutations will still occur while berries are frozen.');

ItemList.Pokeball   = new PokeballItem(Pokeball.Pokeball, 100, undefined, undefined, 'Poké Ball');
ItemList.Greatball  = new PokeballItem(Pokeball.Greatball, 500, undefined, undefined, 'Great Ball');
ItemList.Ultraball  = new PokeballItem(Pokeball.Ultraball, 2000, undefined, undefined, 'Ultra Ball');
ItemList.Masterball = new PokeballItem(Pokeball.Masterball, 2500, Currency.questPoint, undefined, 'Master Ball');
// Not sold in shops
ItemList.Fastball = new PokeballItem(Pokeball.Fastball, Infinity, Currency.farmPoint, undefined, 'Fast Ball');
ItemList.Quickball = new PokeballItem(Pokeball.Quickball, Infinity, Currency.farmPoint, undefined, 'Quick Ball');
ItemList.Timerball = new PokeballItem(Pokeball.Timerball, Infinity, Currency.farmPoint, undefined, 'Timer Ball');
ItemList.Duskball = new PokeballItem(Pokeball.Duskball, Infinity, Currency.farmPoint, undefined, 'Dusk Ball');
ItemList.Luxuryball = new PokeballItem(Pokeball.Luxuryball, Infinity, Currency.farmPoint, undefined, 'Luxury Ball');
ItemList.Diveball = new PokeballItem(Pokeball.Diveball, Infinity, Currency.battlePoint, undefined, 'Dive Ball');
ItemList.Lureball = new PokeballItem(Pokeball.Lureball, Infinity, Currency.battlePoint, undefined, 'Lure Ball');
ItemList.Nestball = new PokeballItem(Pokeball.Nestball, Infinity, Currency.battlePoint, undefined, 'Nest Ball');
ItemList.Repeatball = new PokeballItem(Pokeball.Repeatball, Infinity, Currency.battlePoint, undefined, 'Repeat Ball');
ItemList.Beastball = new PokeballItem(Pokeball.Beastball, 500, Currency.questPoint, undefined, 'Beast Ball');

ItemList.Berry_Shovel   = new ShovelItem(300, 'Berry Shovel', 'Removes Berry Plants in the Farm.');
ItemList.Mulch_Shovel = new MulchShovelItem(300, 'Mulch Shovel', 'Removes Mulch from a plot in the Farm.');

ItemList.PokeBlock_Black  = new PokeBlock(PokeBlockColor.Black, Infinity);
ItemList.PokeBlock_Red    = new PokeBlock(PokeBlockColor.Red, Infinity);
ItemList.PokeBlock_Gold   = new PokeBlock(PokeBlockColor.Gold, Infinity);
ItemList.PokeBlock_Purple = new PokeBlock(PokeBlockColor.Purple, Infinity);
ItemList.PokeBlock_Gray   = new PokeBlock(PokeBlockColor.Gray, Infinity);
ItemList.PokeBlock_White  = new PokeBlock(PokeBlockColor.White, Infinity);

// Mega Stones
ItemList.Abomasite			= new MegaStoneItem(MegaStoneType.Abomasite, 'Abomasnow', 10000);
ItemList.Absolite			= new MegaStoneItem(MegaStoneType.Absolite, 'Absol', 10000);
ItemList.Aerodactylite		= new MegaStoneItem(MegaStoneType.Aerodactylite, 'Aerodactyl', 10000);
ItemList.Aggronite			= new MegaStoneItem(MegaStoneType.Aggronite, 'Aggron', 10000);
ItemList.Alakazite			= new MegaStoneItem(MegaStoneType.Alakazite, 'Alakazam', 10000);
//ItemList.Altarianite		= new MegaStoneItem(MegaStoneType.Altarianite, 'Altaria', 10000);
ItemList.Ampharosite		= new MegaStoneItem(MegaStoneType.Ampharosite, 'Ampharos', 10000);
ItemList.Audinite			= new MegaStoneItem(MegaStoneType.Audinite, 'Audino', 10000);
//ItemList.Banettite			= new MegaStoneItem(MegaStoneType.Banettite, 'Banette', 10000);
ItemList.Beedrillite		= new MegaStoneItem(MegaStoneType.Beedrillite, 'Beedrill', 10000);
//ItemList.Blastoisinite		= new MegaStoneItem(MegaStoneType.Blastoisinite, 'Blastoise', 10000);
ItemList.Blazikenite		= new MegaStoneItem(MegaStoneType.Blazikenite, 'Blaziken', 10000, Currency.questPoint,
    { visible: new MultiRequirement([new TemporaryBattleRequirement('Hoenn Stone Salesman'), new ObtainedPokemonRequirement('Blaziken')]) }, 'Blazikenite', 'A Mega Stone for Blaziken.');
ItemList.Blue_Orb           = new MegaStoneItem(MegaStoneType.Blue_Orb, 'Kyogre', 10000);
ItemList.Cameruptite		= new MegaStoneItem(MegaStoneType.Cameruptite, 'Camerupt', 10000);
//ItemList.Charizardite_X		= new MegaStoneItem(MegaStoneType.Charizardite_X, 'Charizard', 10000);
//ItemList.Charizardite_Y		= new MegaStoneItem(MegaStoneType.Charizardite_Y, 'Charizard', 10000);
ItemList.Diancite			= new MegaStoneItem(MegaStoneType.Diancite, 'Diancie', 10000);
ItemList.Galladite			= new MegaStoneItem(MegaStoneType.Galladite, 'Gallade', 10000);
ItemList.Garchompite		= new MegaStoneItem(MegaStoneType.Garchompite, 'Garchomp', 10000);
ItemList.Gardevoirite		= new MegaStoneItem(MegaStoneType.Gardevoirite, 'Gardevoir', 10000);
ItemList.Gengarite			= new MegaStoneItem(MegaStoneType.Gengarite, 'Gengar', 10000);
ItemList.Glalitite			= new MegaStoneItem(MegaStoneType.Glalitite, 'Glalie', 10000);
ItemList.Gyaradosite		= new MegaStoneItem(MegaStoneType.Gyaradosite, 'Gyarados', 10000);
ItemList.Heracronite		= new MegaStoneItem(MegaStoneType.Heracronite, 'Heracross', 10000);
ItemList.Houndoominite		= new MegaStoneItem(MegaStoneType.Houndoominite, 'Houndoom', 10000);
ItemList.Kangaskhanite		= new MegaStoneItem(MegaStoneType.Kangaskhanite, 'Kangaskhan', 10000);
ItemList.Latiasite			= new MegaStoneItem(MegaStoneType.Latiasite, 'Latias', 10000);
ItemList.Latiosite			= new MegaStoneItem(MegaStoneType.Latiosite, 'Latios', 10000);
ItemList.Lopunnite			= new MegaStoneItem(MegaStoneType.Lopunnite, 'Lopunny', 10000);
ItemList.Lucarionite		= new MegaStoneItem(MegaStoneType.Lucarionite, 'Lucario', 10000);
ItemList.Manectite			= new MegaStoneItem(MegaStoneType.Manectite, 'Manectric', 10000);
ItemList.Mawilite			= new MegaStoneItem(MegaStoneType.Mawilite, 'Mawile', 10000);
//ItemList.Medichamite		= new MegaStoneItem(MegaStoneType.Medichamite, 'Medicham', 10000);
ItemList.Metagrossite		= new MegaStoneItem(MegaStoneType.Metagrossite, 'Metagross', 10000);
ItemList.Meteorite          = new MegaStoneItem(MegaStoneType.Meteorite, 'Rayquaza', 10000);
//ItemList.Mewtwonite_X		= new MegaStoneItem(MegaStoneType.Mewtwonite_X, 'Mewtwo', 10000);
//ItemList.Mewtwonite_Y		= new MegaStoneItem(MegaStoneType.Mewtwonite_Y, 'Mewtwo', 10000);
ItemList.Pidgeotite			= new MegaStoneItem(MegaStoneType.Pidgeotite, 'Pidgeot', 10000);
//ItemList.Pinsirite			= new MegaStoneItem(MegaStoneType.Pinsirite, 'Pinsir', 10000);
ItemList.Red_Orb            = new MegaStoneItem(MegaStoneType.Red_Orb, 'Groudon', 10000);
ItemList.Sablenite			= new MegaStoneItem(MegaStoneType.Sablenite, 'Sableye', 10000);
ItemList.Salamencite		= new MegaStoneItem(MegaStoneType.Salamencite, 'Salamence', 10000);
ItemList.Sceptilite			= new MegaStoneItem(MegaStoneType.Sceptilite, 'Sceptile', 10000, Currency.questPoint,
    { visible: new MultiRequirement([new TemporaryBattleRequirement('Hoenn Stone Salesman'), new ObtainedPokemonRequirement('Sceptile')]) }, 'Sceptilite', 'A Mega Stone for Sceptile.');
//ItemList.Scizorite			= new MegaStoneItem(MegaStoneType.Scizorite, 'Scizor', 10000);
ItemList.Sharpedonite		= new MegaStoneItem(MegaStoneType.Sharpedonite, 'Sharpedo', 10000);
ItemList.Slowbronite		= new MegaStoneItem(MegaStoneType.Slowbronite, 'Slowbro', 10000);
ItemList.Steelixite			= new MegaStoneItem(MegaStoneType.Steelixite, 'Steelix', 10000);
ItemList.Swampertite		= new MegaStoneItem(MegaStoneType.Swampertite, 'Swampert', 10000, Currency.questPoint,
    { visible: new MultiRequirement([new TemporaryBattleRequirement('Hoenn Stone Salesman'), new ObtainedPokemonRequirement('Swampert')]) }, 'Swampertite', 'A Mega Stone for Swampert.');
ItemList.Tyranitarite		= new MegaStoneItem(MegaStoneType.Tyranitarite, 'Tyranitar', 10000);
//ItemList.Venusaurite		= new MegaStoneItem(MegaStoneType.Venusaurite, 'Venusaur', 10000);

// Eggs
ItemList.Fire_egg = new EggItem(EggItemType.Fire_egg, 1000, undefined, 'Fire Egg');
ItemList.Water_egg = new EggItem(EggItemType.Water_egg, 1000, undefined, 'Water Egg');
ItemList.Grass_egg = new EggItem(EggItemType.Grass_egg, 1000, undefined, 'Grass Egg');
ItemList.Fighting_egg = new EggItem(EggItemType.Fighting_egg, 1000, undefined, 'Fighting Egg');
ItemList.Electric_egg = new EggItem(EggItemType.Electric_egg, 1000, undefined, 'Electric Egg');
ItemList.Dragon_egg = new EggItem(EggItemType.Dragon_egg, 1000, undefined, 'Dragon Egg');
ItemList.Pokemon_egg = new EggItem(EggItemType.Pokemon_egg, 1000, undefined, 'Pokémon Egg');
ItemList.Mystery_egg = new EggItem(EggItemType.Mystery_egg, 700, undefined, 'Mystery Egg');

// Quest Items
ItemList.Celios_Errand_Ruby = new QuestItem('Celios_Errand_Ruby', 'Ruby', 'A Ruby found in Ruby Path', 'Celio\'s Errand');

// Vitamins
// ItemList.RareCandy = new Vitamin(VitaminType.RareCandy, Infinity, undefined, undefined, 'Rare Candy', 'A rare-to-find candy that currently has no use.');
ItemList.Protein   = new Vitamin(VitaminType.Protein, 1e4, Currency.money, {
    multiplier: 1.1,
    multiplierDecrease: false,
    saveName: `${VitaminType[VitaminType.Protein]}|${Currency[Currency.money]}`,
}, undefined, 'Increases Pokémon attack bonus.<br/><i>(attack gained per breeding cycle)</i><br/>Increases steps required when hatching by 20');
ItemList.Calcium   = new Vitamin(VitaminType.Calcium, 5e4, Currency.money, {
    multiplier: 1.1,
    multiplierDecrease: false,
    saveName: `${VitaminType[VitaminType.Calcium]}|${Currency[Currency.money]}`,
    visible: new MaxRegionRequirement(Region.hoenn),
}, undefined, 'Increases Pokémon attack bonus %.<br/><i>(attack gained per breeding cycle)</i><br/>Increases steps required when hatching by 20');
ItemList.Carbos   = new Vitamin(VitaminType.Carbos, 1e5, Currency.money, {
    multiplier: 1.1,
    multiplierDecrease: false,
    saveName: `${VitaminType[VitaminType.Carbos]}|${Currency[Currency.money]}`,
    visible: new MaxRegionRequirement(Region.unova),
}, undefined, 'Reduces steps required when hatching');
