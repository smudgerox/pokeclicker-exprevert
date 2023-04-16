/**
 * Static class used to handle Quest Lines
 */
class QuestLineHelper {

    // Kanto QuestLines
    public static createTutorial() {
        const tutorial = new QuestLine('Tutorial Quests', 'A short set of quests to get you going.');

        //Defeat Starter
        const defeatStarter = new CustomQuest(1, 10,
            'Defeat the Pokémon. Click to deal damage!',
            () => App.game.statistics.totalPokemonDefeated(),
            0 // Initial of 0 so it auto completes if bugged
        );
        tutorial.addQuest(defeatStarter);

        //Capture 1 pokemon
        const captureOne = new CustomQuest(1, 20,
            'Capture 1 Pokémon. When you defeat a Pokémon, a Poké Ball is thrown and you have a chance to capture it.',
            () => App.game.statistics.totalPokemonCaptured(),
            1 // Initial of 1 so it auto completes if bugged
        );
        tutorial.addQuest(captureOne);

        //Kill 10 on route 2
        const routeTwo = new CustomQuest(10, 20,
            'Defeat 10 Pokémon on Route 2. Click Route 2 on the map to move there and begin fighting.',
            () => App.game.statistics.routeKills[GameConstants.Region.kanto]['2'](),
            0 // Initial of 0 so it auto completes if bugged
        );
        tutorial.addQuest(routeTwo);

        //Say bye to mom
        const talkToMom = new TalkToNPCQuest(PalletMom1, 'Go back to Pallet Town and say bye to mom.');
        tutorial.addQuest(talkToMom);

        //Buy pokeballs
        const buyPokeballs = new CustomQuest(10, 20,
            'Buy 10 Poké Balls. You can find these in the Viridian City Shop.',
            () => App.game.statistics.pokeballsPurchased[GameConstants.Pokeball.Pokeball](),
            0 // Initial of 0 so it auto completes if bugged
        );
        tutorial.addQuest(buyPokeballs);

        //Learn about catching from old man
        const OldManReward = () => {
            $('#npc-modal').one('hidden.bs.modal', () => {
                Information.show({
                    steps: [
                        {
                            element: document.getElementById('pokeballSelector'),
                            intro: 'Select which Poké Ball types to catch Pokémon with based on their caught/shiny status.<br/><i><sup>Hover over the column titles for more info.</sup></i><br/><br/>Capturing Pokémon gains you <img title="Dungeon Tokens\nGained by capturing Pokémon" src="assets/images/currency/dungeonToken.svg" height="25px"> Dungeon Tokens.<br/><br/>Try now by clicking the "Caught" selector to change it.',
                        },
                    ],
                    exitOnEsc: false,
                    showButtons: false,
                });
                const caughtSelector: HTMLElement = document.querySelector('.pokeball-small.clickable.pokeball-selected');
                caughtSelector.addEventListener('click', () => {
                    Information.hide();
                    $('#pokeballSelectorModal').one('shown.bs.modal', null, () => {
                        // Need to set a timeout, otherwise it messes up the modal layout
                        setTimeout(() => {
                            Information.show({
                                steps: [
                                    {
                                        element: document.querySelector('#pokeballSelectorModal .modal-body'),
                                        intro: 'Select the <img title="Poké Ball" src="assets/images/pokeball/Pokeball.svg" height="25px"> Poké Ball to use this type of ball to capture already caught Pokémon, which will give you <img title="Dungeon Tokens\nGained by capturing Pokémon" src="assets/images/currency/dungeonToken.svg" height="25px"> Dungeon Tokens when captured.',
                                    },
                                ],
                                // Needed for IntroJs on modals
                                overlayOpacity: 0,
                            });
                        }, 100);

                        // Hide the IntroJS overlay once the user selects the Pokeball
                        const selectPokeball = document.querySelectorAll('#pokeballSelectorModal .clickable')[1];
                        selectPokeball.addEventListener('click', () => {
                            Information.hide();
                        }, {
                            once: true,
                        });
                    });
                }, {
                    once: true,
                });
            });
        };
        const talkToOldMan = new TalkToNPCQuest(ViridianCityOldMan2, 'Talk to the Old Man in Viridian City to learn about catching.', OldManReward);
        tutorial.addQuest(talkToOldMan);

        const catch5Pidgey = new CustomQuest(5, 30, 'Use what you\'ve learned to catch 5 Pidgey. Talk to the Old Man again if you need a reminder.', () => App.game.statistics.pokemonCaptured[PokemonHelper.getPokemonByName('Pidgey').id]());
        tutorial.addQuest(catch5Pidgey);

        //Buy Dungeon ticket
        const buyDungeonTicket = new CustomQuest(1, 50,
            'Buy the Dungeon Ticket from Viridian City Shop.',
            () => +App.game.keyItems.hasKeyItem(KeyItemType.Dungeon_ticket),
            0
        );
        tutorial.addQuest(buyDungeonTicket);

        //Clear Viridian Forest
        const clearViridianForest = new CustomQuest(1, 50,
            'Gather 50 Dungeon Tokens by (re)capturing Pokémon, then clear the Viridian Forest dungeon.',
            () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Viridian Forest')](),
            0
        );
        tutorial.addQuest(clearViridianForest);

        //Defeat Pewter Gym
        const pewterReward = () => {
            Notifier.notify({ message: 'Tutorial completed!', type: NotificationConstants.NotificationOption.success });
            Information.show({
                steps: [
                    {
                        element: document.getElementById('questDisplayContainer'),
                        intro: 'Click "List" to see the current quests that can be completed for <img title="Quest points" src="assets/images/currency/questPoint.svg" height="24px"> Quest Points.',
                    },
                    {
                        element: document.getElementById('startMenu'),
                        intro: 'See the badges you\'ve earned in the Badge Case. Badges influence the max level of your Pokémon.',
                    },
                ],
            });
        };
        const pewter = new CustomQuest(1, pewterReward,
            'Defeat Pewter City Gym. Click the town on the map to move there, then click the Gym button to start the battle.',
            () => App.game.statistics.gymsDefeated[GameConstants.getGymIndex('Pewter City')](),
            0
        );
        tutorial.addQuest(pewter);

        App.game.quests.questLines().push(tutorial);
    }

    // Started upon talking with Bill's Grandpa.
    public static createBillsGrandpaQuestLine() {
        const BillsGrandpaQuestLine = new QuestLine('Bill\'s Grandpa Treasure Hunt', 'Check the hints and bring Bill\'s Grandpa the Pokémon he wants to see.', new RouteKillRequirement(10, GameConstants.Region.kanto, 25), GameConstants.BulletinBoards.Kanto);

        const talkToBillsGrandpa1 = new TalkToNPCQuest(BillsGrandpa1, 'Talk to Bill\'s Grandpa in Bill\'s House.');
        BillsGrandpaQuestLine.addQuest(talkToBillsGrandpa1);

        const pinkBalloon = new CaptureSpecificPokemonQuest('Jigglypuff', 'Catch the desired Pokémon.', 1);
        const punchNormal = new CustomQuest(100, 0, 'Defeat 100 Normal-type Pokémon.', () => {
            return pokemonMap.filter(p => p.type.includes(PokemonType.Normal)).map(p => App.game.statistics.pokemonDefeated[p.id]()).reduce((a,b) => a + b, 0);
        });

        BillsGrandpaQuestLine.addQuest(new MultipleQuestsQuest([
            pinkBalloon,
            punchNormal,
        ],'Bill\'s Grandpa wants you to catch a Pokémon that is pink and like a balloon.'));

        // Talk to Bill's Grandpa after catching a Jigglypuff
        const MoonStoneReward = () => {
            player.gainItem('Moon_stone', 1);
            Notifier.notify({
                title: BillsGrandpaQuestLine.name,
                message: 'Bill\'s Grandpa has given you a Moon Stone.',
                type: NotificationConstants.NotificationOption.success,
                sound: NotificationConstants.NotificationSound.Quests.quest_ready_to_complete,
            });
        };

        const talkToBillsGrandpa2 = new TalkToNPCQuest(BillsGrandpa2, 'Show your Jigglypuff to Bill\'s Grandpa.', MoonStoneReward);
        BillsGrandpaQuestLine.addQuest(talkToBillsGrandpa2);

        const blueRound = new CaptureSpecificPokemonQuest('Oddish', 'Catch the desired Pokémon.', 1);
        const punchGrass = new CustomQuest(100, 0, 'Defeat 100 Grass-type Pokémon.', () => {
            return pokemonMap.filter(p => p.type.includes(PokemonType.Grass)).map(p => App.game.statistics.pokemonDefeated[p.id]()).reduce((a,b) => a + b, 0);
        });

        BillsGrandpaQuestLine.addQuest(new MultipleQuestsQuest([
            blueRound,
            punchGrass,
        ],'Bill\'s Grandpa wants you to catch a Pokémon that is round, blue, and has leaves growing on its head.'));

        // Talk to Bill's Grandpa after catching an Oddish
        const LeafStoneReward = () => {
            player.gainItem('Leaf_stone', 1);
            Notifier.notify({
                title: BillsGrandpaQuestLine.name,
                message: 'Bill\'s Grandpa has given you a Leaf Stone.',
                type: NotificationConstants.NotificationOption.success,
                sound: NotificationConstants.NotificationSound.Quests.quest_ready_to_complete,
            });
        };

        const talkToBillsGrandpa3 = new TalkToNPCQuest(BillsGrandpa3, 'Show your Oddish to Bill\'s Grandpa.', LeafStoneReward);
        BillsGrandpaQuestLine.addQuest(talkToBillsGrandpa3);

        const redSphere = new CaptureSpecificPokemonQuest('Staryu', 'Catch the desired Pokémon.', 1);
        const punchWater = new CustomQuest(100, 0, 'Defeat 100 Water-type Pokémon.', () => {
            return pokemonMap.filter(p => p.type.includes(PokemonType.Water)).map(p => App.game.statistics.pokemonDefeated[p.id]()).reduce((a,b) => a + b, 0);
        });

        BillsGrandpaQuestLine.addQuest(new MultipleQuestsQuest([
            redSphere,
            punchWater,
        ],'Bill\'s Grandpa wants you to catch a Pokémon that it has a red sphere in its body and is shaped like a star.'));

        // Talk to Bill's Grandpa after catching a Staryu
        const WaterStoneReward = () => {
            player.gainItem('Water_stone', 1);
            Notifier.notify({
                title: BillsGrandpaQuestLine.name,
                message: 'Bill\'s Grandpa has given you a Water Stone.',
                type: NotificationConstants.NotificationOption.success,
                sound: NotificationConstants.NotificationSound.Quests.quest_ready_to_complete,
            });
        };

        const talkToBillsGrandpa4 = new TalkToNPCQuest(BillsGrandpa4, 'Show your Staryu to Bill\'s Grandpa.', WaterStoneReward);
        BillsGrandpaQuestLine.addQuest(talkToBillsGrandpa4);

        const loyalRoar = new CaptureSpecificPokemonQuest('Growlithe', 'Catch the desired Pokémon.', 1);
        const punchFire = new CustomQuest(100, 0, 'Defeat 100 Fire-type Pokémon.', () => {
            return pokemonMap.filter(p => p.type.includes(PokemonType.Fire)).map(p => App.game.statistics.pokemonDefeated[p.id]()).reduce((a,b) => a + b, 0);
        });

        BillsGrandpaQuestLine.addQuest(new MultipleQuestsQuest([
            loyalRoar,
            punchFire,
        ],'Bill\'s Grandpa wants you to catch a Pokémon that is very loyal and supposedly roars pretty well.'));

        // Talk to Bill's Grandpa after catching a Growlithe
        const FireStoneReward = () => {
            player.gainItem('Fire_stone', 1);
            Notifier.notify({
                title: BillsGrandpaQuestLine.name,
                message: 'Bill\'s Grandpa has given you a Fire Stone.',
                type: NotificationConstants.NotificationOption.success,
                sound: NotificationConstants.NotificationSound.Quests.quest_ready_to_complete,
            });
        };

        const talkToBillsGrandpa5 = new TalkToNPCQuest(BillsGrandpa5, 'Show your Growlithe to Bill\'s Grandpa.', FireStoneReward);
        BillsGrandpaQuestLine.addQuest(talkToBillsGrandpa5);

        const yellowAndRed = new CaptureSpecificPokemonQuest('Pikachu', 'Catch the desired Pokémon.', 1);
        const punchElectric = new CustomQuest(100, 0, 'Defeat 100 Electric-type Pokémon.', () => {
            return pokemonMap.filter(p => p.type.includes(PokemonType.Electric)).map(p => App.game.statistics.pokemonDefeated[p.id]()).reduce((a,b) => a + b, 0);
        });

        BillsGrandpaQuestLine.addQuest(new MultipleQuestsQuest([
            yellowAndRed,
            punchElectric,
        ],'Bill\'s Grandpa wants you to catch a Pokémon that has a yellow body and red cheeks.'));

        // Talk to Bill's Grandpa after catching a Pikachu
        const ThunderStoneReward = () => {
            player.gainItem('Thunder_stone', 1);
            Notifier.notify({
                title: BillsGrandpaQuestLine.name,
                message: 'Bill\'s Grandpa has given you a Thunder Stone.',
                type: NotificationConstants.NotificationOption.success,
                sound: NotificationConstants.NotificationSound.Quests.quest_ready_to_complete,
            });
        };

        const talkToBillsGrandpa6 = new TalkToNPCQuest(BillsGrandpa6, 'Show your Pikachu to Bill\'s Grandpa.', ThunderStoneReward);
        BillsGrandpaQuestLine.addQuest(talkToBillsGrandpa6);

        const fightBillsGrandpa = new CustomQuest(1, 0, 'Bill\'s Grandpa would like to have a battle with you!', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Bill\'s Grandpa')]());
        BillsGrandpaQuestLine.addQuest(fightBillsGrandpa);

        // Talk to Bill's Grandpa after battling him
        const EeveeReward = () => {
            App.game.party.gainPokemonByName('Eevee');
            Notifier.notify({
                title: BillsGrandpaQuestLine.name,
                message: 'Bill\'s Grandpa has given you an Eevee, treat it well!',
                type: NotificationConstants.NotificationOption.success,
                sound: NotificationConstants.NotificationSound.General.new_catch,
                timeout: 3e4,
            });
        };

        const talkToBillsGrandpa7 = new TalkToNPCQuest(BillsGrandpa7, 'Talk to Bill\'s Grandpa one last time.', EeveeReward);
        BillsGrandpaQuestLine.addQuest(talkToBillsGrandpa7);

        App.game.quests.questLines().push(BillsGrandpaQuestLine);
    }

    // Started upon defeating Cerulean City's gym.
    public static createRocketKantoQuestLine() {
        const rocketKantoQuestLine = new QuestLine('Team Rocket', 'Some nasty villains are up to no good.');

        const clearRocketGameCorner = new CustomQuest(1, 0, 'Illegal activity is afoot. Clear the Rocket Game Corner in Celadon City.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Rocket Game Corner')](), undefined, undefined,
            {
                clearedMessage: 'I see that you raise Pokémon with utmost care. A child like you would never understand what I hope to achieve. I shall step aside this time! I hope we meet again...',
                npcDisplayName: 'Team Rocket Boss Giovanni',
                npcImageName: 'Team Rocket Boss Giovanni',
            });
        rocketKantoQuestLine.addQuest(clearRocketGameCorner);

        const clearSilphCo1 = new CustomQuest(1, 0, 'Team Rocket has occupied Silph Co. Clear Silph Co. in Saffron City to find the Card Key.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Silph Co.')](), undefined, undefined,
            {
                clearedMessage: 'What kept you $playername$? Hahaha! I thought you\'d turn up if I waited here! I guess Team Rocket slowed you down! Not that I care! I saw you in Saffron, so I decided to see if you got better!',
                npcDisplayName: 'Rival Blue',
                npcImageName: 'Rival Blue',
            });
        rocketKantoQuestLine.addQuest(clearSilphCo1);

        const clearBlue = new CustomQuest(1, 0, 'Blue is getting in your way. Defeat him in Silph Co.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Blue 5')]());
        rocketKantoQuestLine.addQuest(clearBlue);

        const clearSilphCo2 = new CustomQuest(1, 0, 'Team Rocket has occupied Silph Co. Clear Silph Co. in Saffron City once more to foil their plans.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Silph Co.')](), undefined, undefined,
            {
                clearedMessage: 'Arrgh!! I lost again!? Blast it all! You ruined our plans for Silph! But Team Rocket will never fall! $playername$, never forget that all Pokémon exist for Team Rocket! I must go, but I shall return!',
                npcDisplayName: 'Team Rocket Boss Giovanni',
                npcImageName: 'Team Rocket Boss Giovanni',
            });
        rocketKantoQuestLine.addQuest(clearSilphCo2);

        const ViridianGymReward = () => {
            App.game.pokeballs.gainPokeballs(GameConstants.Pokeball.Masterball, 1, false);
            Notifier.notify({
                title: rocketKantoQuestLine.name,
                message: 'The President of Silph Co. has rewarded you with a Master Ball!',
                type: NotificationConstants.NotificationOption.success,
                timeout: 3e4,
            });
        };

        const clearViridianGym = new CustomQuest(1, ViridianGymReward, 'If you take down Team Rocket\'s leader one more time they will surely never come back from this! Clear Viridian City Gym.', () => App.game.statistics.gymsDefeated[GameConstants.getGymIndex('Viridian City')]());
        rocketKantoQuestLine.addQuest(clearViridianGym);

        App.game.quests.questLines().push(rocketKantoQuestLine);
    }

    // Started upon defeating Fuchsia City's gym.
    public static createUndergroundQuestLine() {
        const undergroundQuestLine = new QuestLine('Mining Expedition', 'Explore the underground!');

        //Buy Explorer Kit (no reward)
        const buyExplorerKit = new CustomQuest(1, () => {}, 'Buy the Explorer Kit from Cinnabar Island Shop.', () => +App.game.keyItems.hasKeyItem(KeyItemType.Explorer_kit), 0);
        undergroundQuestLine.addQuest(buyExplorerKit);

        // Mine 5 layers in the Unerground
        const oldAmberReward = () => {
            // Gain an Old Amber
            const oldAmber = UndergroundItems.list.find(item => item.name == 'Old Amber');
            if (!oldAmber) {
                return console.error('Unable to find item Old Amber');
            }
            Underground.gainMineItem(oldAmber.id);
            Notifier.notify({
                title: undergroundQuestLine.name,
                message: 'You have gained an Old Amber fossil!\n<i>You can breed this in the hatchery.</i>',
                type: NotificationConstants.NotificationOption.success,
                timeout: GameConstants.MINUTE,
            });
        };
        const mineLayers = new CustomQuest(5, oldAmberReward, 'Mine 5 layers in the Underground.', App.game.statistics.undergroundLayersMined);
        undergroundQuestLine.addQuest(mineLayers);

        App.game.quests.questLines().push(undergroundQuestLine);
    }

    // Started upon defeating Cinnabar Island's gym.
    public static createBillSeviiQuestLine() {
        const billSeviiQuestLine = new QuestLine('Bill\'s Errand', 'Bill has asked you to journey to the Sevii Islands with him to set up a digital connection to mainland Kanto.');

        const talktoCelio1 = new TalkToNPCQuest(OneIslandCelio1, 'Use the Subregional Travel button at the top of the map to travel to the Sevii Islands and speak with Celio on One Island.');
        billSeviiQuestLine.addQuest(talktoCelio1);

        const talktoGameCornerOwner1 = new TalkToNPCQuest(TwoIslandGameCornerOwner1, 'Ask the Game Corner owner on Two Island about the meteorite.');
        billSeviiQuestLine.addQuest(talktoGameCornerOwner1);

        const clearBikerGangTemporaryBattles = new CustomQuest(3, 0, 'A biker gang has invaded Three island. They will not let you continue to Berry Forest. Defeat the Biker Goons.', () =>
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Biker Goon 1')]() +
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Biker Goon 2')]() +
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Biker Goon 3')]()
        );
        billSeviiQuestLine.addQuest(clearBikerGangTemporaryBattles);

        const clearCueBallPaxtonTemporaryBattle = new CustomQuest(1, 0, 'Defeat the biker gang\'s leader.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Cue Ball Paxton')]());
        billSeviiQuestLine.addQuest(clearCueBallPaxtonTemporaryBattle);

        const clearBerryForest = new CustomQuest(1, 0, 'Find Lostelle. Clear Berry Forest.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Berry Forest')]());
        billSeviiQuestLine.addQuest(clearBerryForest);

        const talktoGameCornerOwner2 = new TalkToNPCQuest(TwoIslandGameCornerOwner2, 'Lostelle has been found. Return to the Game Corner owner on Two Island.');
        billSeviiQuestLine.addQuest(talktoGameCornerOwner2);

        const BillsErrandReward = () => {
            App.game.wallet.gainQuestPoints(1000, true);
            Notifier.notify({
                title: billSeviiQuestLine.name,
                message: 'Celio has rewarded you with 1,000 Quest Points!',
                type: NotificationConstants.NotificationOption.success,
                timeout: 3e4,
            });
        };

        const talktoCelio2 = new TalkToNPCQuest(OneIslandCelio2, 'Deliver the meteorite to Celio on One Island.', BillsErrandReward);
        billSeviiQuestLine.addQuest(talktoCelio2);

        App.game.quests.questLines().push(billSeviiQuestLine);
    }

    // Started upon defeating Viridian City's gym.
    public static createPersonsofInterestQuestLine() {
        const personsofInterestQuestLine = new QuestLine('Persons of Interest', 'Some people want to talk to you.');

        const talktoBreeder = new TalkToNPCQuest(SaffronBreeder, 'Talk to the Breeder in Saffron City.', 250);
        personsofInterestQuestLine.addQuest(talktoBreeder);

        const talktoGemScientist = new TalkToNPCQuest(PewterScientist, 'Talk to the Gem Scientist in Pewter City.', 250);
        personsofInterestQuestLine.addQuest(talktoGemScientist);

        App.game.quests.questLines().push(personsofInterestQuestLine);
    }

    // Johto QuestLines
    // Started upon defeating Ecruteak City's gym.
    public static createRocketJohtoQuestLine() {
        const rocketJohtoQuestLine = new QuestLine('Team Rocket Again', 'Team Rocket is up to no good again!');

        const defeatRedGyarados = new CustomQuest(1, 0, 'Defeat the rampaging Red Gyarados!', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Red Gyarados')]());
        rocketJohtoQuestLine.addQuest(defeatRedGyarados);

        const clearTeamRocketHideout = new CustomQuest(1, 0, 'Clear the Team Rocket\'s Hideout dungeon in Mahogany Town', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Team Rocket\'s Hideout')]());
        rocketJohtoQuestLine.addQuest(clearTeamRocketHideout);

        const radioTowerReward = () => {
            App.game.pokeballs.gainPokeballs(GameConstants.Pokeball.Masterball, 1, false);
            Notifier.notify({
                title: rocketJohtoQuestLine.name,
                message: 'The grateful radio director gave you a Master Ball!',
                type: NotificationConstants.NotificationOption.success,
                timeout: 3e4,
            });
        };

        const clearRadioTower = new CustomQuest(1, radioTowerReward, 'Clear the Radio Tower dungeon in Goldenrod City', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Radio Tower')]());
        rocketJohtoQuestLine.addQuest(clearRadioTower);

        App.game.quests.questLines().push(rocketJohtoQuestLine);
    }

    public static createJohtoBeastsQuestLine() {
        const johtoBeastsQuestLine = new QuestLine('The Legendary Beasts', 'Investigate the legends surrounding the strange Burned Tower in Ecruteak City.', new RouteKillRequirement(10, GameConstants.Region.johto, 37), GameConstants.BulletinBoards.Johto);

        const talktoEusine1 = new TalkToNPCQuest(EcruteakEusine, 'Talk to Eusine in Ecruteak City.');
        johtoBeastsQuestLine.addQuest(talktoEusine1);

        const clearBurnedTower = new CustomQuest(1, 0, 'Clear the Burned Tower.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Burned Tower')]());
        johtoBeastsQuestLine.addQuest(clearBurnedTower);

        const clearSilver = new CustomQuest(1, 0, 'Defeat Silver.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Silver 3')]());
        johtoBeastsQuestLine.addQuest(clearSilver);

        const talktoPokéfanDerek = new TalkToNPCQuest(EcruteakPokéfan, 'Talk to Pokéfan Derek in Ecruteak City.', () => App.game.quests.getQuestLine('Eusine\'s Chase').beginQuest());
        johtoBeastsQuestLine.addQuest(talktoPokéfanDerek);

        const catchRaikou = new CaptureSpecificPokemonQuest('Raikou', 'Catch or hatch Raikou', 1, true);

        const catchEntei = new CaptureSpecificPokemonQuest('Entei', 'Catch or hatch Entei', 1, true);

        const catchSuicune = new CaptureSpecificPokemonQuest('Suicune', 'Catch Suicune.');

        johtoBeastsQuestLine.addQuest(new MultipleQuestsQuest(
            [
                catchRaikou,
                catchEntei,
                catchSuicune,
            ], 'Catch the Legendary Beasts.'));

        App.game.quests.questLines().push(johtoBeastsQuestLine);
    }

    public static createJohtoSuicuneQuestLine() {
        const johtoSuicuneQuestLine = new QuestLine('Eusine\'s Chase', 'Eusine is looking for Suicune.');

        const clearCianwoodSuicune = new CustomQuest(1, 0, 'Find Suicune.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Suicune 1')]());
        johtoSuicuneQuestLine.addQuest(clearCianwoodSuicune);

        const talktoEusine2 = new TalkToNPCQuest(CianwoodEusine, 'Talk to Eusine in Cianwood City.');
        johtoSuicuneQuestLine.addQuest(talktoEusine2);

        const clearEusine = new CustomQuest(1, 0, 'Defeat Eusine.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Eusine')]());
        johtoSuicuneQuestLine.addQuest(clearEusine);

        const clearRoute42Suicune = new CustomQuest(1, 0, 'Find Suicune.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Suicune 2')]());
        johtoSuicuneQuestLine.addQuest(clearRoute42Suicune);

        const talktoEusine3 = new TalkToNPCQuest(MahoganyEusine, 'Talk to Eusine in Mahogany Town.');
        johtoSuicuneQuestLine.addQuest(talktoEusine3);

        const clearVermilionSuicune = new CustomQuest(1, 0, 'Find Suicune.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Suicune 3')]());
        johtoSuicuneQuestLine.addQuest(clearVermilionSuicune);

        const talktoEusine4 = new TalkToNPCQuest(VermilionEusine, 'Talk to Eusine in Vermilion City.');
        johtoSuicuneQuestLine.addQuest(talktoEusine4);

        const clearRoute14Suicune = new CustomQuest(1, 0, 'Find Suicune.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Suicune 4')]());
        johtoSuicuneQuestLine.addQuest(clearRoute14Suicune);

        const talktoEusine5 = new TalkToNPCQuest(FuchsiaEusine, 'Talk to Eusine in Fuchsia City.');
        johtoSuicuneQuestLine.addQuest(talktoEusine5);

        const clearRoute25Suicune = new CustomQuest(1, 0, 'Find Suicune.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Suicune 5')]());
        johtoSuicuneQuestLine.addQuest(clearRoute25Suicune);

        const talktoEusine6 = new TalkToNPCQuest(BillsHouseEusine, 'Talk to Eusine in Bill\'s House.');
        johtoSuicuneQuestLine.addQuest(talktoEusine6);

        const catchRoute25Suicune = new CaptureSpecificPokemonQuest('Suicune', 'Catch Suicune.');

        johtoSuicuneQuestLine.addQuest(catchRoute25Suicune);

        App.game.quests.questLines().push(johtoSuicuneQuestLine);
    }

    // Lugia Quest
    public static createlugiaJohtoQuestLine() {
        const lugiaJohtoQuestLine = new QuestLine('Whirl Guardian', 'The Kimono Girls of Ecruteak City need help.', new QuestLineCompletedRequirement('Team Rocket Again'), GameConstants.BulletinBoards.Johto);

        const talktoZuki = new TalkToNPCQuest(Zuki, 'Talk to Kimono Girl Zuki in Violet City.');
        lugiaJohtoQuestLine.addQuest(talktoZuki);

        const helpZuki = new HatchEggsQuest(25, 0);
        lugiaJohtoQuestLine.addQuest(helpZuki);

        const talktoNaoko = new TalkToNPCQuest(Naoko, 'Talk to Kimono Girl Naoko in the Ilex Forest.');
        lugiaJohtoQuestLine.addQuest(talktoNaoko);

        const helpNaoko = new CustomQuest(1, 0, 'Clear Ilex Forest to lead Naoko to safety.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Ilex Forest')]());
        lugiaJohtoQuestLine.addQuest(helpNaoko);

        const kimonoReward = () => {
            App.game.pokeballs.gainPokeballs(GameConstants.Pokeball.Ultraball, 50, false);
            Notifier.notify({
                title: lugiaJohtoQuestLine.name,
                message: 'Kimono Girl Miki has given you a package containing 50 Ultra Balls.',
                type: NotificationConstants.NotificationOption.success,
                timeout: 3e4,
            });
        };

        const talktoMiki = new TalkToNPCQuest(Miki, 'Talk to Kimono Girl Miki at the Ecruteak City Dance Theatre.', kimonoReward);
        lugiaJohtoQuestLine.addQuest(talktoMiki);

        const talktoSayo = new TalkToNPCQuest(Sayo, 'Talk to Kimono Girl Sayo in the Ice Path.');
        lugiaJohtoQuestLine.addQuest(talktoSayo);

        const helpSayo = new CustomQuest(1, 0, 'Clear the Ice Path to give Sayo a push.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Ice Path')]());
        lugiaJohtoQuestLine.addQuest(helpSayo);

        const talktoKuni = new TalkToNPCQuest(Kuni, 'Talk to Kimono Girl Kuni in Goldenrod City.');
        lugiaJohtoQuestLine.addQuest(talktoKuni);

        const helpKuni = new CustomQuest(1, 0, 'Clear the Radio Tower to get rid of any lingering Team Rocket activity.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Radio Tower')]());
        lugiaJohtoQuestLine.addQuest(helpKuni);

        const talktoKimonoGirlsWhirl = new TalkToNPCQuest(KimonoGirlsWhirl, 'Meet the Kimono Girls at the Whirl Islands.');
        lugiaJohtoQuestLine.addQuest(talktoKimonoGirlsWhirl);

        const LugiaCatch = new CaptureSpecificPokemonQuest(
            'Lugia',
            'Catch Lugia in the Whirl Islands.',
            1,
            false,
            undefined,
            undefined
        );
        lugiaJohtoQuestLine.addQuest(LugiaCatch);

        App.game.quests.questLines().push(lugiaJohtoQuestLine);
    }

    // Ho-Oh Quest
    public static createhoohJohtoQuestLine() {
        const hoohJohtoQuestLine = new QuestLine('Rainbow Guardian', 'The Kimono Girls of Ecruteak City wish to speak with you again.', new MultiRequirement([new QuestLineStepCompletedRequirement('Whirl Guardian', 9), new ObtainedPokemonRequirement('Raikou'), new ObtainedPokemonRequirement('Entei'), new ObtainedPokemonRequirement('Suicune')]), GameConstants.BulletinBoards.Johto);
        const talkKimonoGirlsEcruteak = new TalkToNPCQuest(KimonoGirlsEcruteak, 'Meet the Kimono Girls at the Ecruteak Dance Theatre.');
        hoohJohtoQuestLine.addQuest(talkKimonoGirlsEcruteak);

        const clearKimonoGirls = new CustomQuest (1, 0, 'Prove your abilities as a trainer to the Kimono Girls of Ecruteak City.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Kimono Girls')]());
        hoohJohtoQuestLine.addQuest(clearKimonoGirls);

        const HoohCatch = new CaptureSpecificPokemonQuest(
            'Ho-Oh',
            'Catch Ho-Oh in the Tin Tower.',
            1,
            false,
            undefined,
            undefined
        );
        hoohJohtoQuestLine.addQuest(HoohCatch);

        App.game.quests.questLines().push(hoohJohtoQuestLine);
    }

    public static createCelebiJohtoQuestLine() {
        const celebiJohtoQuestLine = new QuestLine('Unfinished Business', 'A request from Professor Oak.', new QuestLineCompletedRequirement('Bill\'s Errand'), GameConstants.BulletinBoards.Kanto);

        const talktoProfOak1 = new TalkToNPCQuest(PalletCelebiProfOak1, 'Talk to Professor Oak in Pallet Town.');
        celebiJohtoQuestLine.addQuest(talktoProfOak1);

        const talktoProfIvy = new TalkToNPCQuest(CelebiProfIvy, 'Talk to Professor Ivy in her lab in the Sevii Islands.');
        celebiJohtoQuestLine.addQuest(talktoProfIvy);

        const talktoProfOak2 = new TalkToNPCQuest(PalletCelebiProfOak2, 'Deliver the GS Ball to Professor Oak in Pallet Town.');
        celebiJohtoQuestLine.addQuest(talktoProfOak2);

        const talktoKurt1 = new TalkToNPCQuest(AzaleaCelebiKurt2, 'Deliver the GS Ball to Kurt in Azalea Town in Johto.');
        celebiJohtoQuestLine.addQuest(talktoKurt1);

        const talktoKurt2 = new TalkToNPCQuest(AzaleaCelebiKurt4, 'Talk to Kurt again after becoming Champion of Johto.');
        celebiJohtoQuestLine.addQuest(talktoKurt2);

        const talktoProfOak3 = new TalkToNPCQuest(AzaleaCelebiOak1, 'Talk to Professor Oak in Azalea Town.');
        celebiJohtoQuestLine.addQuest(talktoProfOak3);

        const talktoIlexForestShrine1 = new TalkToNPCQuest(IlexForestShrine1, 'Investigate the shrine in Ilex Forest.');
        celebiJohtoQuestLine.addQuest(talktoIlexForestShrine1);

        const SpikyEaredPichuReward = () => {
            App.game.party.gainPokemonByName('Spiky-eared Pichu');
            Notifier.notify({
                title: celebiJohtoQuestLine.name,
                message: 'You captured the Spiky-eared Pichu!',
                type: NotificationConstants.NotificationOption.success,
                timeout: 3e4,
            });
        };

        const clearSpikyEaredPichu = new CustomQuest(1, SpikyEaredPichuReward, 'Defeat the strange Pichu.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Spiky-eared Pichu')]());
        celebiJohtoQuestLine.addQuest(clearSpikyEaredPichu);

        const talktoProfOak4 = new TalkToNPCQuest(AzaleaCelebiOak2, 'Talk to Professor Oak in Azalea Town.');
        celebiJohtoQuestLine.addQuest(talktoProfOak4);

        const talktoTohjoFallsTimeDistortion = new TalkToNPCQuest(TohjoFallsCelebiTimeDistortion, 'Investigate the Time Distortion in Tohjo Falls.');
        celebiJohtoQuestLine.addQuest(talktoTohjoFallsTimeDistortion);

        const clearGiovanni = new CustomQuest(1, 0, 'Defeat Giovanni.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Rocket Boss Giovanni')]());
        celebiJohtoQuestLine.addQuest(clearGiovanni);

        const talktoProfOak5 = new TalkToNPCQuest(AzaleaCelebiOak3, 'Talk to Professor Oak in Azalea Town.');
        celebiJohtoQuestLine.addQuest(talktoProfOak5);

        const talktoIlexForestShrine2 = new TalkToNPCQuest(IlexForestShrine2, 'Investigate the shrine in Ilex Forest.');
        celebiJohtoQuestLine.addQuest(talktoIlexForestShrine2);

        const CelebiCatch = new CaptureSpecificPokemonQuest('Celebi', 'Play with the Celebi in Ilex Forest.');

        celebiJohtoQuestLine.addQuest(CelebiCatch);

        const talktoProfOak6 = new TalkToNPCQuest(AzaleaCelebiOak5, 'Talk to Professor Oak in Azalea Town.');
        celebiJohtoQuestLine.addQuest(talktoProfOak6);

        App.game.quests.questLines().push(celebiJohtoQuestLine);
    }

    // Hoenn QuestLines
    // Started upon defeating Mauville City's gym.
    public static createAquaMagmaHoennQuestLine() {
        const aquaMagmaHoennQuestLine = new QuestLine('Land vs. Water', 'Put a stop to the schemes of Team Aqua and Team Magma!');

        const clearMtChimney = new CustomQuest(1, 0, 'Stop Team Magma at Mt. Chimney Crater.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Mt. Chimney Crater')]());
        aquaMagmaHoennQuestLine.addQuest(clearMtChimney);

        const clearWeatherInstitute = new CustomQuest(1, 0, 'Stop Team Aqua at the Weather Institute.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Weather Institute')]());
        aquaMagmaHoennQuestLine.addQuest(clearWeatherInstitute);

        const clearMagmaHideout = new CustomQuest(1, 0, 'Raid the Team Magma hideout.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Magma Hideout')]());
        aquaMagmaHoennQuestLine.addQuest(clearMagmaHideout);

        const clearAquaHideout = new CustomQuest(1, 0, 'Raid the Team Aqua hideout.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Aqua Hideout')]());
        aquaMagmaHoennQuestLine.addQuest(clearAquaHideout);

        const seafloorCavernReward = () => {
            App.game.pokeballs.gainPokeballs(GameConstants.Pokeball.Masterball, 1, false);
            Notifier.notify({
                title: aquaMagmaHoennQuestLine.name,
                message: 'You found a Master Ball!',
                type: NotificationConstants.NotificationOption.success,
                timeout: 3e4,
            });
        };

        const clearSeafloorCavern = new CustomQuest(1, seafloorCavernReward, 'Team Aqua\'s leader Archie escaped from their hideout. Find him in the Seafloor Cavern and put a stop to this once and for all!', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Seafloor Cavern')]());
        aquaMagmaHoennQuestLine.addQuest(clearSeafloorCavern);

        App.game.quests.questLines().push(aquaMagmaHoennQuestLine);
    }

    // Weather Trio
    public static createWeatherTrioQuestLine() {
        const weatherTrioQuestLine = new QuestLine('The Weather Trio', 'Put an ancient battle to rest.', new QuestLineCompletedRequirement('Land vs. Water'), GameConstants.BulletinBoards.Hoenn);

        const weatherBattle1 = new TalkToNPCQuest(WeatherBattle1, 'Investigate the commotion in Sootopolis City.');
        weatherTrioQuestLine.addQuest(weatherBattle1);

        const clearCaveOfOrigin = new CustomQuest(1, 0, 'Explore the Cave of Origin to find Wallace.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Cave of Origin')]());
        weatherTrioQuestLine.addQuest(clearCaveOfOrigin);

        const talkToWallace1 = new TalkToNPCQuest(Wallace1, 'Talk to Wallace in the Cave of Origin to learn how to stop Kyogre and Groudon from fighting.');
        weatherTrioQuestLine.addQuest(talkToWallace1);

        const clearSkyPillar = new CustomQuest(1, 0, 'Climb the Sky Pillar to find the super-ancient Pokémon Rayquaza.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Sky Pillar')]());
        weatherTrioQuestLine.addQuest(clearSkyPillar);

        const weatherBattle2 = new TalkToNPCQuest(WeatherBattle2, 'Return to Sootopolis City to see what Rayquaza will do.');
        weatherTrioQuestLine.addQuest(weatherBattle2);

        const talkToWallace2 = new TalkToNPCQuest(Wallace2, 'Talk to Wallace in the Cave of Origin about the aftermath of the battle.');
        weatherTrioQuestLine.addQuest(talkToWallace2);

        const catchRayquaza = new CaptureSpecificPokemonQuest('Rayquaza', 'Catch Rayquaza');

        const catchKyogre = new CaptureSpecificPokemonQuest('Kyogre', 'Catch Kyogre');

        const catchGroudon = new CaptureSpecificPokemonQuest('Groudon', 'Catch Groudon');

        weatherTrioQuestLine.addQuest(new MultipleQuestsQuest(
            [
                catchRayquaza,
                catchKyogre,
                catchGroudon,
            ], 'Catch the Weather Trio.'));


        App.game.quests.questLines().push(weatherTrioQuestLine);
    }

    // Deoxys
    public static createDeoxysQuestLine() {
        const deoxysQuestLine = new QuestLine('Mystery of Deoxys', 'Discover the mystery of Deoxys.', new GymBadgeRequirement(BadgeEnums.Elite_HoennChampion), GameConstants.BulletinBoards.Hoenn);

        // Defeat 50 Pokemon on route 129
        const route129 = new DefeatPokemonsQuest(50, 0, 129, GameConstants.Region.hoenn);
        deoxysQuestLine.addQuest(route129);

        // Defeat 500 Psychic type Pokemon
        const psychicGemReward = () => {
            App.game.gems.gainGems(500, PokemonType.Psychic);
            Notifier.notify({
                title: deoxysQuestLine.name,
                message: 'You have gained 500 Psychic gems!',
                type: NotificationConstants.NotificationOption.success,
            });
        };
        const defeatPsychic = new CustomQuest(500, psychicGemReward, 'Defeat 500 Psychic-type Pokémon.', () => {
            return pokemonMap.filter(p => p.type.includes(PokemonType.Psychic)).map(p => App.game.statistics.pokemonDefeated[p.id]()).reduce((a,b) => a + b, 0);
        });
        deoxysQuestLine.addQuest(defeatPsychic);

        // Capture 200 Psychic type Pokemon
        const mindPlateReward = () => {
            const mindPlate = UndergroundItems.list.find(item => item.name == 'Mind Plate');
            if (!mindPlate) {
                return console.error('Unable to find item Mind Plate');
            }
            Underground.gainMineItem(mindPlate.id, 20);
            Notifier.notify({
                title: deoxysQuestLine.name,
                message: `You have gained 20 ${mindPlate.name}s!`,
                type: NotificationConstants.NotificationOption.success,
            });
        };
        const catchPsychic = new CustomQuest(200, mindPlateReward, 'Capture or hatch 200 Psychic-type Pokémon.', () => {
            return pokemonMap.filter(p => p.type.includes(PokemonType.Psychic)).map(p => App.game.statistics.pokemonCaptured[p.id]()).reduce((a,b) => a + b, 0);
        });
        deoxysQuestLine.addQuest(catchPsychic);

        // Reach stage 100 in battle frontier
        const reachStage100Reward = () => {
            Notifier.notify({
                title: deoxysQuestLine.name,
                message: 'Quest line completed!\n<i>You have uncovered the Mystery of Deoxys!</i>',
                type: NotificationConstants.NotificationOption.success,
                timeout: 3e4,
            });
        };
        const reachStage100 = new CustomQuest(100, reachStage100Reward, 'Defeat stage 100 in the Battle Frontier.', App.game.statistics.battleFrontierHighestStageCompleted, 0);
        deoxysQuestLine.addQuest(reachStage100);

        App.game.quests.questLines().push(deoxysQuestLine);
    }
    // Eon Duo
    public static createEonDuoQuestLine() {
        const eonDuoQuestLine = new QuestLine('The Eon Duo', 'Track down the elusive Eon Duo.', new GymBadgeRequirement(BadgeEnums.Elite_HoennChampion), GameConstants.BulletinBoards.Hoenn);

        const television1 = new TalkToNPCQuest(Television1, 'Watch a news report in Littleroot Town about a mysterious Pokémon.');
        eonDuoQuestLine.addQuest(television1);

        const television2 = new TalkToNPCQuest(Television2, 'Change channels to watch a different TV station in Littleroot town.');
        eonDuoQuestLine.addQuest(television2);

        const ticketClaim = new TalkToNPCQuest(TicketClaim, 'Go to Hoenn Pokémon League to claim your Eon ticket.');
        eonDuoQuestLine.addQuest(ticketClaim);

        const southernIslandClearing = new TalkToNPCQuest(SouthernIsland1, 'Claim your Eon Ticket in the Start Menu and investigate the Southern Island.');
        eonDuoQuestLine.addQuest(southernIslandClearing);

        const catchLatias = new CaptureSpecificPokemonQuest('Latias', 'Catch or Hatch Latias', 1, true);

        const catchLatios = new CaptureSpecificPokemonQuest('Latios', 'Catch or Hatch Latios', 1, true);

        eonDuoQuestLine.addQuest(new MultipleQuestsQuest(
            [
                catchLatias,
                catchLatios,
            ], 'Catch or hatch the Eon Duo.'));

        App.game.quests.questLines().push(eonDuoQuestLine);
    }

    public static createRubySapphireSeviiQuestLine() {
        const rubySapphireSeviiQuestLine = new QuestLine('Celio\'s Errand', 'Celio has asked you to help him set up a digital connection between the Sevii Islands and Hoenn.', new GymBadgeRequirement(BadgeEnums.Elite_HoennChampion), GameConstants.BulletinBoards.Hoenn);

        const talktoCelio3 = new TalkToNPCQuest(OneIslandCelio4, 'Speak with Celio on One Island in Sevii.');
        rubySapphireSeviiQuestLine.addQuest(talktoCelio3);

        const talktoRocketGrunts = new TalkToNPCQuest(SeviiRocketGrunts, 'Eavesdrop on the Team Rocket Grunts at Mt. Ember.');
        rubySapphireSeviiQuestLine.addQuest(talktoRocketGrunts);

        const clearSeviiRocketGrunts1 = new CustomQuest(2, 0, 'Two Team Rocket Grunts are blocking the entrance to Ruby Path. Defeat them.', () =>
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Sevii Rocket Grunt 1')]() +
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Sevii Rocket Grunt 2')]()
        );
        rubySapphireSeviiQuestLine.addQuest(clearSeviiRocketGrunts1);

        const clearRubyPath = new CustomQuest(1, 0, 'Locate the Ruby. Clear Ruby Path in Mt. Ember.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Ruby Path')]());
        rubySapphireSeviiQuestLine.addQuest(clearRubyPath);

        const talktoRuby = new TalkToNPCQuest(SeviiRuby, 'Take the Ruby in Ruby Path', () => ItemList.Celios_Errand_Ruby.gain(1));
        rubySapphireSeviiQuestLine.addQuest(talktoRuby);

        const talktoCelio4 = new TalkToNPCQuest(OneIslandCelio5, 'Return the Ruby to Celio on One Island');
        rubySapphireSeviiQuestLine.addQuest(talktoCelio4);

        const clearIcefallCave = new CustomQuest(1, 0, 'Help Lorelei with Team Rocket Grunts by clearing Icefall Cave on Four Island.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Icefall Cave')]());
        rubySapphireSeviiQuestLine.addQuest(clearIcefallCave);

        const talktoLorelei = new TalkToNPCQuest(SeviiLorelei, 'Talk to Lorelei in Icefall Cave');
        rubySapphireSeviiQuestLine.addQuest(talktoLorelei);

        const talktoGideon = new TalkToNPCQuest(SeviiGideon2, 'Talk to Gideon in Dotted Hole');
        rubySapphireSeviiQuestLine.addQuest(talktoGideon);

        const clearSeviiRocketGrunts2 = new CustomQuest(3, 0, 'Defeat the Three Team Rocket Grunts in Rocket Warehouse.', () =>
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Sevii Rocket Grunt 3')]() +
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Sevii Rocket Grunt 4')]() +
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Sevii Rocket Grunt 5')]()
        );
        rubySapphireSeviiQuestLine.addQuest(clearSeviiRocketGrunts2);

        const clearSeviiAriana = new CustomQuest(1, 0, 'Defeat Team Rocket Executive Ariana in Rocket Warehouse.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Sevii Rocket Ariana')]());
        rubySapphireSeviiQuestLine.addQuest(clearSeviiAriana);

        const clearSeviiArcher = new CustomQuest(1, 0, 'Defeat Team Rocket Executive Archer in Rocket Warehouse.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Sevii Rocket Archer')]());
        rubySapphireSeviiQuestLine.addQuest(clearSeviiArcher);

        const clearSeviiGideon = new CustomQuest(1, 0, 'Defeat Scientist Gideon to reclaim the Sapphire.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Scientist Gideon')]());
        rubySapphireSeviiQuestLine.addQuest(clearSeviiGideon);

        const talktoCelio5 = new TalkToNPCQuest(OneIslandCelio6, 'Return the Sapphire to Celio on One Island');
        rubySapphireSeviiQuestLine.addQuest(talktoCelio5);

        App.game.quests.questLines().push(rubySapphireSeviiQuestLine);
    }

    public static createPinkanThemeparkQuestLine() {
        const pinkanThemeparkQuestLine = new QuestLine('Team Rocket\'s Pinkan Theme Park', 'Help Team Rocket build a theme park on Pinkan Island?', new GymBadgeRequirement(BadgeEnums.Elite_OrangeChampion), GameConstants.BulletinBoards.Sevii4567);

        const talktoTeamRocket = new TalkToNPCQuest(ThemeparkTeamRocket1, 'Talk to Team Rocket on Pinkan Island to hear about their plans.');
        pinkanThemeparkQuestLine.addQuest(talktoTeamRocket);

        const farmPinkan = new HarvestBerriesQuest(1, undefined, BerryType.Pinkan);
        pinkanThemeparkQuestLine.addQuest(farmPinkan);

        const defeatPinkans = new MultipleQuestsQuest(
            [
                new DefeatPokemonsQuest(500, 0, 41, GameConstants.Region.kanto),
                new DefeatPokemonsQuest(500, 0, 42, GameConstants.Region.kanto),
            ], 'Help Team Rocket recruit some Pinkan Pokémon', () => App.game.farming.gainBerry(BerryType.Pinkan, 20));
        pinkanThemeparkQuestLine.addQuest(defeatPinkans);

        const collectPinkanMaterials = new MultipleQuestsQuest(
            [
                new GainGemsQuest(1000, 0, PokemonType.Fairy),
                new CustomQuest(10, undefined, 'Gain 10 Pixie Plates', () => player.mineInventory().find(item => item.name == 'Pixie Plate')?.amount() ?? 0),
            ], 'Collect Fairy Gems and Pixie Plates');
        pinkanThemeparkQuestLine.addQuest(collectPinkanMaterials);

        const talktoTeamRocket2 = new TalkToNPCQuest(ThemeparkTeamRocket4, 'Talk to Team Rocket on Pinkan Island to open the theme park!');
        pinkanThemeparkQuestLine.addQuest(talktoTeamRocket2);

        const clearPinkanTeamRocket = new CustomQuest(1, 0, 'Defeat Team Rocket Jessie & James on Pinkan Island.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Pinkan Jessie & James')]());
        pinkanThemeparkQuestLine.addQuest(clearPinkanTeamRocket);

        const clearPinkanOfficerJenny = new CustomQuest(1, 0, 'Oh no! Officer Jenny has showed up. She\'s not happy! No time to plead your case, it\'s time to battle!', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Pinkan Officer Jenny')]());
        pinkanThemeparkQuestLine.addQuest(clearPinkanOfficerJenny);

        App.game.quests.questLines().push(pinkanThemeparkQuestLine);
    }

    //Regi Trio Quest
    public static createRegiTrioQuestLine() {
        const regiTrioQuestLine = new QuestLine('The Three Golems', 'Discover the secrets of the Sealed Chamber.', new GymBadgeRequirement(BadgeEnums.Mind), GameConstants.BulletinBoards.Hoenn);

        const clearSealedChamber = new CustomQuest(1, 0, 'Enter the Sealed Chamber to find clues.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Sealed Chamber')]());
        regiTrioQuestLine.addQuest(clearSealedChamber);

        const readEntranceSign = new TalkToNPCQuest(SCEntrance, 'Investigate the strange markings in the Sealed Chamber.');
        regiTrioQuestLine.addQuest(readEntranceSign);

        const mazeStep1 = new TalkToNPCQuest(SCMazeLeft, 'Navigate the maze inside the Sealed Chamber.');
        regiTrioQuestLine.addQuest(mazeStep1);

        const mazeStep2 = new TalkToNPCQuest(SCMazeLeft, 'Navigate the maze inside the Sealed Chamber.');
        regiTrioQuestLine.addQuest(mazeStep2);

        const mazeStep3 = new TalkToNPCQuest(SCMazeStraight, 'Navigate the maze inside the Sealed Chamber.');
        regiTrioQuestLine.addQuest(mazeStep3);

        const mazeStep4 = new TalkToNPCQuest(SCMazeStraight, 'Navigate the maze inside the Sealed Chamber.');
        regiTrioQuestLine.addQuest(mazeStep4);

        const mazeStep5 = new TalkToNPCQuest(SCMazeRight, 'Navigate the maze inside the Sealed Chamber.');
        regiTrioQuestLine.addQuest(mazeStep5);

        const readSCHints = new TalkToNPCQuest(SCHints, 'Investigate the hidden message at the end of the Sealed Chamber maze.');
        regiTrioQuestLine.addQuest(readSCHints);

        const regiHint1 = new DefeatPokemonsQuest(100, 0, 111, GameConstants.Region.hoenn, 'Release Regirock');

        const regiHint2 = new DefeatPokemonsQuest(100, 0, 105, GameConstants.Region.hoenn, 'Release Regice');

        const regiHint3 = new DefeatPokemonsQuest(100, 0, 120, GameConstants.Region.hoenn, 'Release Registeel');

        regiTrioQuestLine.addQuest(new MultipleQuestsQuest(
            [
                regiHint1,
                regiHint2,
                regiHint3,
            ], 'Explore Hoenn by defeating Pokémon on the hinted routes to release the Regi Trio.'));

        const catchRegirock = new CaptureSpecificPokemonQuest('Regirock', 'Catch Regirock');

        const catchRegice = new CaptureSpecificPokemonQuest('Regice', 'Catch Regice');

        const catchRegisteel = new CaptureSpecificPokemonQuest('Registeel', 'Catch Registeel');

        regiTrioQuestLine.addQuest(new MultipleQuestsQuest(
            [
                catchRegirock,
                catchRegice,
                catchRegisteel,
            ], 'Catch the Regi Trio.'));

        App.game.quests.questLines().push(regiTrioQuestLine);
    }

    //Jirachi Quest
    public static createJirachiQuestLine() {
        const jirachiQuestLine = new QuestLine('Wish Maker', 'Harness the power of the Millennium Comet and make a wish!', new GymBadgeRequirement(BadgeEnums.Elite_HoennChampion), GameConstants.BulletinBoards.Hoenn);

        const millenniumFest = new TalkToNPCQuest(MillenniumFest, 'Attend the opening ceremony of the Millennium Festival near Lavaridge Town.');
        jirachiQuestLine.addQuest(millenniumFest);

        const clownRocket = new CustomQuest(1, 0, 'Defeat Team Rocket Jessie & James at the Millennium Festival near Lavaridge Town.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Clown Jessie & James')]());
        jirachiQuestLine.addQuest(clownRocket);

        const talkToButler1 = new TalkToNPCQuest(Butler1, 'Learn the legend of the Millennium Comet from Butler near Lavaridge Town.');
        jirachiQuestLine.addQuest(talkToButler1);

        const clearMtChimney2 = new CustomQuest(1, 0, 'Climb to the Mt. Chimney Crater to get a better view of the Millennium Comet as it passes.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Mt. Chimney Crater')]());
        jirachiQuestLine.addQuest(clearMtChimney2);

        const catchAbsol = new CaptureSpecificPokemonQuest('Absol', 'You are being stalked by Absol, the Disaster Pokémon. Capture it or hatch your own to befriend it.', 1, true);
        jirachiQuestLine.addQuest(catchAbsol);

        const cocoonHatch = new TalkToNPCQuest(CocoonHatch, 'Examine the crystalline cocoon Butler gave you while at the Mt. Chimney Crater.');
        jirachiQuestLine.addQuest(cocoonHatch);

        const fightButler1 = new CustomQuest(1, 0, 'Butler has followed you to the Mt. Chimney Crater and is trying to kidnap Jirachi!', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Butler 1')]());
        jirachiQuestLine.addQuest(fightButler1);

        const fightButler2 = new CustomQuest(1, 0, 'Butler has escaped through the Jagged Pass and hooked Jirachi up to some sort of machine. Fight him to free Jirachi.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Butler 2')]());
        jirachiQuestLine.addQuest(fightButler2);

        const fightMetaGroudon1 = new CustomQuest(1, 0, 'Butler\'s attempts to resurrect Groudon have gone terribly wrong! Fight the resulting abomination!', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Meta Groudon')]());
        jirachiQuestLine.addQuest(fightMetaGroudon1);

        const catchJirachi = new CaptureSpecificPokemonQuest('Jirachi', 'Jirachi has escaped in the chaos and is roaming Hoenn. Catch or hatch Jirachi.', 1, true);

        jirachiQuestLine.addQuest(catchJirachi);

        App.game.quests.questLines().push(jirachiQuestLine);
    }

    //Meta Groudon Quest
    public static createMetaGroudonQuestLine() {
        const metaGroudonQuestLine = new QuestLine('A Meta Discovery', 'Help Butler\'s wish come true, responsibly.', new MultiRequirement([new ObtainedPokemonRequirement('Groudon'), new QuestLineCompletedRequirement('Wish Maker')]), GameConstants.BulletinBoards.Hoenn);

        const talkToButler2 = new TalkToNPCQuest(Butler2, 'Talk to Butler in the Jagged Pass to learn about his new plan.');
        metaGroudonQuestLine.addQuest(talkToButler2);

        const butlerMaterials1 = new CaptureSpecificPokemonQuest('Electrode', 'Catch or hatch 100 Electrode', 100, true);

        const butlerMaterials2 = new MineLayersQuest(25, 0);

        const butlerMaterials3 = new CatchShiniesQuest(3, 0);

        metaGroudonQuestLine.addQuest(new MultipleQuestsQuest(
            [
                butlerMaterials1,
                butlerMaterials2,
                butlerMaterials3,
            ], 'Gather the materials Butler needs to rebuild his resurrection machine.'));

        const calibrateMachine = new CaptureSpecificPokemonQuest('Groudon', 'Calibrate the machine by catching or hatching 5 Groudon', 5, true);
        metaGroudonQuestLine.addQuest(calibrateMachine);

        const MetaGroudonReward = () => {
            App.game.party.gainPokemonByName('Meta Groudon');
            Notifier.notify({
                title: metaGroudonQuestLine.name,
                message: 'Butler turns control of Meta Groudon over to you!',
                type: NotificationConstants.NotificationOption.success,
                timeout: 3e4,
            });
        };

        const talkToButler3 = new TalkToNPCQuest(Butler3, 'Deliver the materials to Butler in the Jagged Pass and start the resurrection machine.', MetaGroudonReward);
        metaGroudonQuestLine.addQuest(talkToButler3);

        App.game.quests.questLines().push(metaGroudonQuestLine);
    }

    // Sinnoh QuestLines
    // Started upon defeating Oreburgh City's gym.
    public static createGalacticSinnohQuestLine() {
        const galacticSinnohQuestLine = new QuestLine('A New World', 'End Team Galactic\'s plan to destroy the world and create a new one in its place.');

        const clearValleyWindworks = new CustomQuest(1, 0, 'Team Galactic is stealing energy. Clear Valley Windworks.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Valley Windworks')]());
        galacticSinnohQuestLine.addQuest(clearValleyWindworks);

        const clearTeamGalacticEternaBuilding = new CustomQuest(1, 0, 'Team Galactic is kidnapping Pokémon now. Clear Team Galactic Eterna Building in Eterna City.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Team Galactic Eterna Building')]());
        galacticSinnohQuestLine.addQuest(clearTeamGalacticEternaBuilding);

        const clearPastoriaCityGym = new CustomQuest(1, 0, 'All is quiet. Team Galactic isn\'t doing anything. Maybe they learned their lesson. Just keep traveling, I guess. Clear the Pastoria City Gym.', () => App.game.statistics.gymsDefeated[GameConstants.getGymIndex('Pastoria City')]());
        galacticSinnohQuestLine.addQuest(clearPastoriaCityGym);

        const clearCyrus1TemporaryBattle = new CustomQuest(1, 0, 'The boss of Team Galactic has been spotted in Celestic Town!', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Galactic Boss Cyrus')]());
        galacticSinnohQuestLine.addQuest(clearCyrus1TemporaryBattle);

        const clearCanalaveCityGym = new CustomQuest(1, 0, 'Cyrus is gone. Nothing to do but proceed. Adventure awaits! Clear the Canalave City Gym.', () => App.game.statistics.gymsDefeated[GameConstants.getGymIndex('Canalave City')]());
        galacticSinnohQuestLine.addQuest(clearCanalaveCityGym);

        const clearLakeValor = new CustomQuest(1, 0, 'A commotion was heard at Lake Valor. You must protect the lake\'s guardian! Clear Lake Valor.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Lake Valor')]());
        galacticSinnohQuestLine.addQuest(clearLakeValor);

        const clearLakeVerity = new CustomQuest(1, 0, 'Lake Valor\'s guardian was taken. Better try again at the next lake. Clear Lake Verity.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Lake Verity')]());
        galacticSinnohQuestLine.addQuest(clearLakeVerity);

        const clearLakeAcuity = new CustomQuest(1, 0, 'Lake Verity\'s guardian was also taken. Only one lake remains. Clear Lake Acuity.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Lake Acuity')]());
        galacticSinnohQuestLine.addQuest(clearLakeAcuity);

        const clearTeamGalacticHQ = new CustomQuest(1, 0, 'You failed to protect any of the lake guardians. They have been taken to Veilstone City. So that\'s what that strange building was... Clear Team Galactic HQ in Veilstone City.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Team Galactic HQ')]());
        galacticSinnohQuestLine.addQuest(clearTeamGalacticHQ);

        const clearSpearPillar = new CustomQuest(1, 0, 'The lake guardians have been rescued, but Cyrus has used them to forge the Red Chain. He is taking it to the top of Mount Coronet. Follow him! Clear Spear Pillar.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Spear Pillar')]());
        galacticSinnohQuestLine.addQuest(clearSpearPillar);

        const DistortionWorldReward = () => {
            App.game.pokeballs.gainPokeballs(GameConstants.Pokeball.Masterball, 1, false);
            MapHelper.moveToTown('Mt. Coronet');
            Notifier.notify({
                title: galacticSinnohQuestLine.name,
                message: 'You found a Master Ball!',
                type: NotificationConstants.NotificationOption.success,
                timeout: 3e4,
            });
        };

        const clearDistortionWorld = new CustomQuest(1, DistortionWorldReward, 'Cyrus planned to use the Red Chain to enslave Dialga and Palkia, but he accidentally angered Giratina and has been taken to its realm. A portal has appeared on top of Mount Coronet. Use it to follow Cyrus and end his threat once and for all. Clear Distortion World.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Distortion World')]());
        galacticSinnohQuestLine.addQuest(clearDistortionWorld);

        App.game.quests.questLines().push(galacticSinnohQuestLine);
    }

    //Manaphy Quest
    public static createManaphyQuestLine() {
        const manaphyQuestLine = new QuestLine('Recover the Precious Egg!', 'A rare egg is at the Sandgem Lab! Surely it should be easy to hatch one little egg, right?', new GymBadgeRequirement(BadgeEnums.Forest), GameConstants.BulletinBoards.Sinnoh);

        const talkHastings1 = new TalkToNPCQuest(ManaphyHastings1, 'Speak to Professor Hastings in Sandgem Town.');
        manaphyQuestLine.addQuest(talkHastings1);

        const investigateBoulders = new TalkToNPCQuest(ManaphyBoulders, 'Search for clues in Eterna Forest.');
        manaphyQuestLine.addQuest(investigateBoulders);

        const catchPolitoedSubstitutes = new CustomQuest(50, undefined, 'Catch or hatch 50 Water-type Pokémon, and see if those boulders are really just boulders.', () => {

            return pokemonMap.filter(p => p.type.includes(PokemonType.Water)).map(p => App.game.statistics.pokemonCaptured[p.id]()).reduce((a,b) => a + b, 0);
        });
        manaphyQuestLine.addQuest(catchPolitoedSubstitutes);

        const clearManaphyGoRock1 = new CustomQuest(1, 0, 'Time to give those mysterious boulders the soaking of their life! Return to the Eterna Forest, and prepare for a battle.', () =>
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Manaphy Go-Rock MGrunt 1')]());
        manaphyQuestLine.addQuest(clearManaphyGoRock1);

        const talkGoRockCommander1 = new TalkToNPCQuest(ManaphyGoRockCommander, 'Speak to the Go-Rock Commander in the Eterna Forest.');
        manaphyQuestLine.addQuest(talkGoRockCommander1);

        const clearManaphyGoRock2 = new CustomQuest(1, 0, 'Chase the fleeing Go-Rock Squad through the Eterna Forest!', () =>
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Manaphy Go-Rock FGrunt 1')]());
        manaphyQuestLine.addQuest(clearManaphyGoRock2);

        const clearManaphyGoRock3 = new CustomQuest(3, 0, 'Keep chasing the Go-Rock Squad through the Eterna Forest, but... didn\'t they already pass that tree?', () =>
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Manaphy Go-Rock MGrunt 2')]() +
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Manaphy Go-Rock MGrunt 3')]() +
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Manaphy Go-Rock FGrunt 2')]()
        );
        manaphyQuestLine.addQuest(clearManaphyGoRock3);

        const talkGoRockGrunt1 = new TalkToNPCQuest(ManaphyGoRock, 'The Go-Rock Squad are definitely going in circles, but they\'re too dumb to realise it. Interrogate one on their method of navigating the Eterna Forest!');
        manaphyQuestLine.addQuest(talkGoRockGrunt1);

        const clearEternaParasect = new CustomQuest(1, 0, 'They\'re using Parasect to navigate the Eterna Forest. Clear out a Parasect and they should get trapped!', () =>
            App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Eterna Forest')]());
        manaphyQuestLine.addQuest(clearEternaParasect);

        const clearManaphyGoRock4 = new CustomQuest(1, 0, 'Now you\'ve muddied the path, continue the Eterna Forest chase!', () =>
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Manaphy Go-Rock MGrunt 4')]());
        manaphyQuestLine.addQuest(clearManaphyGoRock4);

        const clearManaphyCommander1 = new CustomQuest(1, 0, 'You\'ve cornered the Go-Rock Commander outside the Old Chateau! Time to finish this.', () =>
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Manaphy Go-Rock Commander')]());
        manaphyQuestLine.addQuest(clearManaphyCommander1);

        const talkHastings2 = new TalkToNPCQuest(ManaphyHastings2, 'Return the egg to Professor Hastings in Sandgem Town. ');
        manaphyQuestLine.addQuest(talkHastings2);

        const talkHastings3 = new TalkToNPCQuest(ManaphyHastings3, 'Professor Hastings has headed off to Canalave to do more research on Manaphy. Check in on him when you can!');
        manaphyQuestLine.addQuest(talkHastings3);

        const happinyChase1 = new TalkToNPCQuest(HappinyWitness1, 'A little girl\'s Happiny stole the egg! Search for witnesses east of Canalave!');
        manaphyQuestLine.addQuest(happinyChase1);

        const happinyChase2 = new TalkToNPCQuest(HappinyWitness2, 'The Happiny headed north out of Jubilife! Ask for witnesses in the next town.');
        manaphyQuestLine.addQuest(happinyChase2);

        const happinyChase3 = new TalkToNPCQuest(HappinyWitness3, 'The Happiny went north, through the Eterna Forest. Ask if anyone\'s seen it in Eterna City.');
        manaphyQuestLine.addQuest(happinyChase3);

        const happinyChase4 = new TalkToNPCQuest(HappinyWitness4, 'Search for someone who\'s seen the Happiny Egg-napper! It was last seen heading east across Route 211.');
        manaphyQuestLine.addQuest(happinyChase4);

        const happinyChase5 = new TalkToNPCQuest(HappinyWitness5, 'Keep asking around and following the Happiny Egg-thief! It was heading south, towards Solaceon Town.');
        manaphyQuestLine.addQuest(happinyChase5);

        const happinyChase6 = new TalkToNPCQuest(HappinyWitness6, 'Hopefully you can finally catch up to this Happiny at Hearthome City. Ask around for any witnesses.');
        manaphyQuestLine.addQuest(happinyChase6);

        const happinyChase7 = new TalkToNPCQuest(HappinyWitness7, 'The Happiny went through Mt. Coronet again? This time it went west through the Southern path. Ask around for witnesses on the other side.');
        manaphyQuestLine.addQuest(happinyChase7);

        const happinyChase8 = new TalkToNPCQuest(HappinyWitness8, 'The Happiny fled from Oreburgh and headed west, through the Oreburgh Gate. Search for another witness on the far side.');

        manaphyQuestLine.addQuest(happinyChase8);

        const happinyChase9 = new TalkToNPCQuest(HappinyWitness9, 'Search for evidence of the Happiny\'s path after turning south from Jubilife City.');
        manaphyQuestLine.addQuest(happinyChase9);

        const clearManaphyGoRock5 = new CustomQuest(1, 0, 'An ex-Go-Rock in Sandgem Town has turned to Pokémon Pinching, and wants to steal the egg first. But after all you\'ve been through to get it, he\'s in for a rude awakening', () =>
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Manaphy Go-Rock Pincher')]());
        manaphyQuestLine.addQuest(clearManaphyGoRock5);

        const happinyChase10 = new TalkToNPCQuest(HappinyBoulders, 'After leaving Sandgem, the Happiny went south-east, across the water. There\'s only one place it could be now...');
        manaphyQuestLine.addQuest(happinyChase10);

        const catchBunearySubstitutes = new CustomQuest(50, undefined, 'Oh no, you\'re not gonna let more boulders stop you now. Catch or hatch 50 Fighting-types and smash right through them.', () => {

            return pokemonMap.filter(p => p.type.includes(PokemonType.Fighting)).map(p => App.game.statistics.pokemonCaptured[p.id]()).reduce((a,b) => a + b, 0);
        });
        manaphyQuestLine.addQuest(catchBunearySubstitutes);

        const clearManaphyHappiny = new CustomQuest(1, 0, 'Time to head back to Pal Park and teach this little pink snot not to steal important eggs!', () =>
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Manaphy Egg Protectors')]());
        manaphyQuestLine.addQuest(clearManaphyHappiny);

        const talkHastings4 = new TalkToNPCQuest(ManaphyHastings4, 'The egg hatched after your battle with the egg-nappers! Bring Manaphy back to Hastings in Canalave City, and close off this mission for good.');

        manaphyQuestLine.addQuest(talkHastings4);

        App.game.quests.questLines().push(manaphyQuestLine);
    }

    //Giratina quest
    public static createGiratinaQuestLine() {
        const giratinaQuestLine = new QuestLine('Zero\'s Ambition', 'Help Zero find an entrance to the Distortion World.', new MultiRequirement([new ObtainedPokemonRequirement('Uxie'), new ObtainedPokemonRequirement('Mesprit'), new ObtainedPokemonRequirement('Azelf'), new GymBadgeRequirement(BadgeEnums.Elite_SinnohChampion)]), GameConstants.BulletinBoards.Sinnoh);

        const talktoZero1 = new TalkToNPCQuest(FightAreaZero1, 'Talk to Zero in the Fight Area.');
        giratinaQuestLine.addQuest(talktoZero1);

        const readSinnohMyth = new TalkToNPCQuest(CanalaveSinnohMyth, 'Read the recently discovered book in Canalave City.');
        giratinaQuestLine.addQuest(readSinnohMyth);

        const talktoZero2 = new TalkToNPCQuest(FightAreaZero2, 'Report to Zero what was in the book.');
        giratinaQuestLine.addQuest(talktoZero2);

        const talktoMesprit = new TalkToNPCQuest(VerityMesprit, 'Ask Mesprit about the Distortion World in Lake Verity.');
        giratinaQuestLine.addQuest(talktoMesprit);

        const obtain10PurpleShards = new CustomQuest(10, undefined, 'Obtain 10 Purple Shards.', () => player.mineInventory().find(item => item.name == 'Purple Shard')?.amount() ?? 0);
        giratinaQuestLine.addQuest(obtain10PurpleShards);

        const talktoAzelf = new TalkToNPCQuest(ValorAzelf, 'Ask Azelf about the Distortion World in Lake Valor.');
        giratinaQuestLine.addQuest(talktoAzelf);

        const obtain10OchreShards = new CustomQuest(10, undefined, 'Obtain 10 Ochre Shards.', () => player.mineInventory().find(item => item.name == 'Ochre Shard')?.amount() ?? 0);
        giratinaQuestLine.addQuest(obtain10OchreShards);

        const talktoUxie = new TalkToNPCQuest(AcuityUxie, 'Ask Uxie about the Distortion World in Lake Acuity.');
        giratinaQuestLine.addQuest(talktoUxie);

        const obtain10CrimsonShards = new CustomQuest(10, undefined, 'Obtain 10 Crimson Shards.', () => player.mineInventory().find(item => item.name == 'Crimson Shard')?.amount() ?? 0);
        giratinaQuestLine.addQuest(obtain10CrimsonShards);

        const clearSendoffSpring = new CustomQuest(1, 0, 'Clear Sendoff Spring to meet the Lake Trio.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Sendoff Spring')]());
        giratinaQuestLine.addQuest(clearSendoffSpring);

        const talktoLakeTrio = new TalkToNPCQuest(SendoffSpringLakeTrio, 'Talk to the Lake Trio in Sendoff Spring.');
        giratinaQuestLine.addQuest(talktoLakeTrio);

        const chargeDistortionKey = new MultipleQuestsQuest(
            [
                new GainGemsQuest(500, 0, PokemonType.Ghost),
                new CustomQuest(1, undefined, 'Gain 1 Spooky Plate.', () => player.mineInventory().find(item => item.name == 'Spooky Plate')?.amount() ?? 0),
            ], 'Charge the key to the Distortion World.');
        giratinaQuestLine.addQuest(chargeDistortionKey);

        const talktoZero3 = new TalkToNPCQuest(SendoffSpringZero1, 'Talk to Zero in Sendoff Spring.');
        giratinaQuestLine.addQuest(talktoZero3);

        const clearZero = new CustomQuest (1, 0, 'Defeat Zero to protect the key.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Zero')]());
        giratinaQuestLine.addQuest(clearZero);

        const catchGiratina = new CaptureSpecificPokemonQuest('Giratina (Altered)', 'Catch the ruler of the Distortion World.', 1, false, 0, undefined);
        giratinaQuestLine.addQuest(catchGiratina);

        const talktoZero4 = new TalkToNPCQuest(SendoffSpringZero2, 'Talk to Zero in Sendoff Spring.');
        giratinaQuestLine.addQuest(talktoZero4);

        App.game.quests.questLines().push(giratinaQuestLine);
    }

    // Unova QuestLines
    // Started upon defeating Virbank City's gym.
    public static createPlasmaUnovaQuestLine() {
        const plasmaUnovaQuestLine = new QuestLine('Quest for the DNA Splicers', 'Prevent Team Plasma from using these dangerous Splicers.');

        const clearVirbankGrunt = new CustomQuest (1, 0, 'A Team Plasma Grunt in Virbank City would like to steal your Pokémon. Defeat the grunt.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Team Plasma Grunt 1')]());
        plasmaUnovaQuestLine.addQuest(clearVirbankGrunt);

        const clearCastliaSewers = new CustomQuest (1, 0, 'Some Team Plasma Grunts were seen entering the Castelia Sewers. Clear Castelia Sewers.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Castelia Sewers')]());
        plasmaUnovaQuestLine.addQuest(clearCastliaSewers);

        const talktoPlasmaGrunt1 = new TalkToNPCQuest(PlasmaGrunt1, 'Investigate the Perfectly Ordinary Frigate.');
        plasmaUnovaQuestLine.addQuest(talktoPlasmaGrunt1);

        const clearNimbasaGym = new CustomQuest (1, 0, 'Seems there\'s nothing suspicious going on in Castelia City. Time to continue your journey. Clear the Nimbasa Gym.', () => App.game.statistics.gymsDefeated[GameConstants.getGymIndex('Nimbasa City')]());
        plasmaUnovaQuestLine.addQuest(clearNimbasaGym);

        const clearNimbasaGrunts = new CustomQuest (2, 0, 'Hugh thinks some Team Plasma Grunts in Nimbasa City are stealing Pokémon. Defeat the grunts.', () =>
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Team Plasma Grunt 2')]() +
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Team Plasma Grunt 3')]()
        );
        plasmaUnovaQuestLine.addQuest(clearNimbasaGrunts);

        const talktoPlasmaGrunt2 = new TalkToNPCQuest(PlasmaGrunt2, 'They are definitely stealing Pokémon. Investigate the Totally Unsuspicious Frigate.');
        plasmaUnovaQuestLine.addQuest(talktoPlasmaGrunt2);

        const clearDriftveilGrunts = new CustomQuest (4, 0, 'Defeat the Team Plasma Grunts on the Totally Unsuspicious Frigate.', () =>
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Team Plasma Grunt 4')]() +
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Team Plasma Grunt 5')]() +
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Team Plasma Grunts 1')]() +
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Team Plasma Grunts 2')]()
        );
        plasmaUnovaQuestLine.addQuest(clearDriftveilGrunts);

        const talktoZinzolinReward = () => {
            MapHelper.moveToTown('Driftveil City');
        };

        const talktoZinzolin = new TalkToNPCQuest(DriftveilZinzolin, 'Talk to Zinzolin.', talktoZinzolinReward);
        plasmaUnovaQuestLine.addQuest(talktoZinzolin);

        const unovaRoute13 = new CustomQuest(10, 0, 'The Frigate is gone. Nothing to do but move forward. Clear route 13.', () => App.game.statistics.routeKills[GameConstants.Region.unova]['13']());
        plasmaUnovaQuestLine.addQuest(unovaRoute13);

        const clearLacunosaGrunt = new CustomQuest (1, 0, 'You have stumbled upon Zinzolin and a Team Plasma Grunt in Lacunosa Town. Defeat the grunt.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Team Plasma Grunt 6')]());
        plasmaUnovaQuestLine.addQuest(clearLacunosaGrunt);

        const clearZinzolin1 = new CustomQuest (1, 0, 'Defeat Zinzolin.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Zinzolin 1')]());
        plasmaUnovaQuestLine.addQuest(clearZinzolin1);

        const clearOpelucidGym = new CustomQuest(1, 0, 'Defeat the Opelucid City gym leader to obtain the DNA Splicers before Team Plasma does!', () => App.game.statistics.gymsDefeated[GameConstants.getGymIndex('Opelucid City')]());
        plasmaUnovaQuestLine.addQuest(clearOpelucidGym);

        const clearOpelucidGrunts = new CustomQuest (3, 0, 'Team Plasma has stolen the DNA Splicers and is assaulting the city with an army of grunts and shadows! Defend against the Team Plasma Assault!', () =>
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Team Plasma Grunt 7')]() +
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Team Plasma Grunt 8')]() +
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Team Plasma Grunt 9')]()
        );
        plasmaUnovaQuestLine.addQuest(clearOpelucidGrunts);

        const clearZinzolin2 = new CustomQuest (1, 0, 'Defeat Zinzolin.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Zinzolin 2')]());
        plasmaUnovaQuestLine.addQuest(clearZinzolin2);

        const clearPlasmaShadow1Reward = () => {
            MapHelper.moveToTown('Opelucid City');
        };

        const clearPlasmaShadow1 = new CustomQuest (1, clearPlasmaShadow1Reward, 'Defeat the Plasma Shadow.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Plasma Shadow 1')]());
        plasmaUnovaQuestLine.addQuest(clearPlasmaShadow1);

        const clearPlasmaFrigateReward = () => {
            MapHelper.moveToTown('Humilau City');
        };

        const clearPlasmaFrigate = new CustomQuest(1, clearPlasmaFrigateReward, 'Team Plasma has fled the scene with the stolen DNA Splicers. Find and clear out the Plasma Frigate.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Plasma Frigate')]());
        plasmaUnovaQuestLine.addQuest(clearPlasmaFrigate);

        const clearGiantChasm = new CustomQuest(1, 0, 'Team Plasma\'s leader Ghetsis plans on using the DNA Splicers on Kyurem in Giant Chasm. Clear the dungeon to end his evil plans.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Giant Chasm')]());
        plasmaUnovaQuestLine.addQuest(clearGiantChasm);

        const talktoColress = new TalkToNPCQuest(GiantChasmColress, 'Talk to Colress.');
        plasmaUnovaQuestLine.addQuest(talktoColress);

        const clearColress = new CustomQuest (1, 0, 'Defeat Colress.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Colress 3')]());
        plasmaUnovaQuestLine.addQuest(clearColress);

        const clearPlasmaShadow2 = new CustomQuest (3, 0, 'Defeat the Plasma Shadows.', () =>
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Plasma Shadow 2')]() +
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Plasma Shadow 3')]() +
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Plasma Shadow 4')]()
        );
        plasmaUnovaQuestLine.addQuest(clearPlasmaShadow2);

        const talktoShadowTriad = new TalkToNPCQuest(GiantChasmShadowTriad, 'Talk to the Shadow Triad.');
        plasmaUnovaQuestLine.addQuest(talktoShadowTriad);

        const clearGhetsis1 = new CustomQuest (1, 0, 'Ghetsis has done something to the legendary Dragon-type Pokémon!', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Ghetsis 1')]());
        plasmaUnovaQuestLine.addQuest(clearGhetsis1);

        const ghetsisReward = () => {
            App.game.pokeballs.gainPokeballs(GameConstants.Pokeball.Masterball, 1, false);
            Notifier.notify({
                title: plasmaUnovaQuestLine.name,
                message: 'You found a Master Ball!',
                type: NotificationConstants.NotificationOption.success,
                timeout: 3e4,
            });
            App.game.keyItems.gainKeyItem(KeyItemType.DNA_splicers, true);
            $('#temporaryBattleWonModal').one('hidden.bs.modal', () => {
                KeyItemController.showGainModal(KeyItemType.DNA_splicers);
            });
        };

        const clearGhetsis2 = new CustomQuest (1, ghetsisReward, 'Defeat Ghetsis one final time!', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Ghetsis 2')]());
        plasmaUnovaQuestLine.addQuest(clearGhetsis2);

        App.game.quests.questLines().push(plasmaUnovaQuestLine);
    }

    // Kalos QuestLines
    // Started upon defeating Professor Sycamore in Lumiose City.
    public static createFlareKalosQuestLine() {
        const flareKalosQuestLine = new QuestLine('A Beautiful World', 'End Team Flare\'s plan to destroy the world and create a new one in its place.');

        const talkToLysandre1 = new TalkToNPCQuest(Lysandre1, 'Talk to Lysandre inside Professor Sycamore\'s lab in Lumiose City.');
        flareKalosQuestLine.addQuest(talkToLysandre1);

        const talkToKalem1 = new TalkToNPCQuest(Calem1, 'Well, that was definitely a weird guy... Seems like Calem wants to meet you somewhere in Lumiose City, go talk with him.');
        flareKalosQuestLine.addQuest(talkToKalem1);

        const talkToKalem2 = new TalkToNPCQuest(Calem2, 'Meet Calem in Ambrette Town.');
        flareKalosQuestLine.addQuest(talkToKalem2);

        const clearGlitteringCave = new CustomQuest(1, 0, 'Clear Glittering Cave and find the scientist.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Glittering Cave')](), undefined, undefined,
            {
                clearedMessage: 'What\'s this? Well, well. What do we have here? A nosy little trainer has come poking around. Listen up! We\'re the fashionable team whose very name makes people tremble in fear: Team Flare! Team Flare\'s goal is to make it so we\'re the only ones who are happy! We don\'t care one bit about what happens to other trainers or Pokémon. Get out of here, kid. Don\'t you know not to play with fire? We\'ll obliterate you!',
                npcDisplayName: 'Team Flare Grunt',
                npcImageName: 'Team Flare Grunt (male)',
            });
        flareKalosQuestLine.addQuest(clearGlitteringCave);

        const battleTeamFlareGrunt1 = new CustomQuest (1, 0,  'It seems that Team Flare Grunt is holding the scientist captive, free him!', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Team Flare Grunt 1')]());
        flareKalosQuestLine.addQuest(battleTeamFlareGrunt1);

        // Talk to Fossil Scientist after beating Team Flare Grunt
        const KalosFossilReward = () => {
            const item = Rand.boolean() ? 'Sail Fossil' : 'Jaw Fossil';

            Underground.gainMineItem(UndergroundItems.getByName(item).id, 1);
            Notifier.notify({
                title: flareKalosQuestLine.name,
                message: `Fossil Scientist has given you a ${GameConstants.humanifyString(item)}!`,
                type: NotificationConstants.NotificationOption.success,
                sound: NotificationConstants.NotificationSound.Quests.quest_ready_to_complete,
                setting: NotificationConstants.NotificationSetting.Dungeons.rare_dungeon_item_found,
            });
        };

        const talkToFossilScientist = new TalkToNPCQuest(FossilScientist, 'From what you gathered, Team Flare wanted to sell fossils for money. Talk with the fossil scientist you just rescued in Glittering Cave.', KalosFossilReward);
        flareKalosQuestLine.addQuest(talkToFossilScientist);

        const clearCyllageCityGym = new CustomQuest(1, 0, 'With interesting thoughts about Team Flare in your head, you decide to challenge the Cyllage City Gym to become stronger.', () => App.game.statistics.gymsDefeated[GameConstants.getGymIndex('Cyllage City')]());
        flareKalosQuestLine.addQuest(clearCyllageCityGym);

        const talkToTeamFlareGrunt1 = new TalkToNPCQuest(TeamFlareGrunt1, 'You can see in Geosenge Town the Team Flare Grunt you battled earlier. Approach him once more.');
        flareKalosQuestLine.addQuest(talkToTeamFlareGrunt1);

        const battleTeamFlareGrunt2 = new CustomQuest (1, 0,  'Beat the Team Flare Grunt once more!', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Team Flare Grunt 2')]());
        flareKalosQuestLine.addQuest(battleTeamFlareGrunt2);

        const talkToDiantha1 = new TalkToNPCQuest(Diantha1, 'You heard rumors of Diantha being in Coumarine City. Go there to check if you can see her.');
        flareKalosQuestLine.addQuest(talkToDiantha1);

        const talkToLysandre2 = new TalkToNPCQuest(Lysandre2, 'Lysandre is calling you while you are standing in Coumarine City, pick up the phone.');
        flareKalosQuestLine.addQuest(talkToLysandre2);

        const clearKalosPowerPlant = new CustomQuest(1, 0, 'Well, that was extremely awkward... But ignoring that, Lumiose City still hasn\'t fixed the power outage, go clear the Kalos Power Plant.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Kalos Power Plant')](), undefined, undefined,
            {
                clearedMessage: 'You\'re quite strong. Oh yes... very strong, indeed. I certainly didn\'t expect you to be so interesting. But it matters not, we already have enough energy to power the device. I do hope we can meet again!',
                npcDisplayName: 'Team Flare Aliana',
                npcImageName: 'Team Flare Aliana',
            });
        flareKalosQuestLine.addQuest(clearKalosPowerPlant);

        const clearLumioseCityGym = new CustomQuest(1, 0, 'You\'ve helped with the power outage problem, now the gym in Lumiose City is back up and you can challenge it!', () => App.game.statistics.gymsDefeated[GameConstants.getGymIndex('Lumiose City')]());
        flareKalosQuestLine.addQuest(clearLumioseCityGym);

        const talkToLysandre3 = new TalkToNPCQuest(Lysandre3, 'Professor Sycamore wants to meet you in Lumiose City. He\'s with Lysandre, go say hi.');
        flareKalosQuestLine.addQuest(talkToLysandre3);

        const clearPokéBallFactory = new CustomQuest(1, 0, 'For someone so obsessed with beauty he seems to really care about filth... Anyway, the Poké Ball Factory sounds like a fun place, let\'s go check it out.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Poké Ball Factory')](), undefined, undefined,
            {
                clearedMessage: 'No way you beat us! Wow, we are lame. Probability is just probability after all... Absolutes do not exist. But enough already! We\'ve already stolen the Poké Balls, Great Balls, and Ultra Balls. Let\'s call it good and leave.',
                npcDisplayName: 'Team Flare Bryony',
                npcImageName: 'Team Flare Bryony',
            });
        flareKalosQuestLine.addQuest(clearPokéBallFactory);

        // Talk to Poké Ball Factory Director after talking with Team Flare Bryony
        const KalosMasterBallReward = () => {
            App.game.pokeballs.gainPokeballs(GameConstants.Pokeball.Masterball, 1, false);
            Notifier.notify({
                title: flareKalosQuestLine.name,
                message: 'Poké Ball Factory Director has given you a Master Ball!',
                type: NotificationConstants.NotificationOption.success,
                sound: NotificationConstants.NotificationSound.Quests.quest_ready_to_complete,
                setting: NotificationConstants.NotificationSetting.Dungeons.rare_dungeon_item_found,
            });
        };

        const talkToPokéBallFactoryDirector = new TalkToNPCQuest(PokéBallFactoryDirector, 'Now that Team Flare is not in the Poké Ball Factory anymore, talk with the Director that you just saved.', KalosMasterBallReward);
        flareKalosQuestLine.addQuest(talkToPokéBallFactoryDirector);

        const talkToProfessorSycamore1 = new TalkToNPCQuest(ProfessorSycamore1, 'Professor Sycamore is waiting for you in Dendemille Town. He has some important things to say about the legendary Pokémon of Kalos.');
        flareKalosQuestLine.addQuest(talkToProfessorSycamore1);

        const clearFrostCavern = new CustomQuest(1, 0, 'You were going to Frost Cavern for Pokémon, but what you found there is Team Flare instead! Clear it!', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Frost Cavern')](), undefined, undefined,
            {
                clearedMessage: 'Not just strong... TOO strong! Not ordinary, indeed. Whatever, it doesn\'t matter, we already tested what we wanted to know. The Abomasnow from this cavern is a fine specimen. The more we agitate it, the stronger its Snow Warning ability becomes, making the snow fall even more furiously. Whoever has the most energy will come out on top! And it\'s Team Flare, and only Team Flare who will survive!',
                npcDisplayName: 'Team Flare Mable',
                npcImageName: 'Team Flare Mable',
            });
        flareKalosQuestLine.addQuest(clearFrostCavern);

        const clearAnistarCityGym = new CustomQuest(1, 0, 'So everything is over now, right? Right? Go beat Anistar City Gym!', () => App.game.statistics.gymsDefeated[GameConstants.getGymIndex('Anistar City')]());
        flareKalosQuestLine.addQuest(clearAnistarCityGym);

        const talkToKalosTVNews = new TalkToNPCQuest(KalosTVNews, 'Lysandre is giving an important speech through the TV News. Watch it in Anistar City.');
        flareKalosQuestLine.addQuest(talkToKalosTVNews);

        const talkToLysandre4 = new TalkToNPCQuest(Lysandre4, 'Wow! Absolutely no one could have seen this coming! You think you might find Lysandre in Lumiose City where you first met him. Look for him!');
        flareKalosQuestLine.addQuest(talkToLysandre4);

        const battleTeamFlareLysandre1 = new CustomQuest (1, 0,  'Show Team Flare Lysandre the strength of your convictions in Lumiose City!', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Team Flare Lysandre 1')]());
        flareKalosQuestLine.addQuest(battleTeamFlareLysandre1);

        const talkToAZ1 = new TalkToNPCQuest(AZ1, 'You run after Lysandre and while going through the Labs you find a jailed mysterious man in Lumiose City. It seems like he has a story to tell...');
        flareKalosQuestLine.addQuest(talkToAZ1);

        const battleTeamFlareXerosic = new CustomQuest (1, 0,  'Now that you learnt what the ultimate weapon is able to do, you need to stop it. Team Flare Xerosic is in the way in Lumiose City, defeat him!', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Team Flare Xerosic')]());
        flareKalosQuestLine.addQuest(battleTeamFlareXerosic);

        const talkToBlueButton = new TalkToNPCQuest(BlueButton, 'Press the blue button!');
        const talkToRedButton = new TalkToNPCQuest(RedButton, 'Press the red button!');

        flareKalosQuestLine.addQuest(new MultipleQuestsQuest([
            talkToBlueButton,
            talkToRedButton,
        ],'Xerosic offers you the possibility to stop the ultimate weapon in Lumiose City. Blue or Red Button, press one!', 0, 1)); //Step 24

        const clearTeamFlareSecretHQ1 = new CustomQuest(1, 0, 'The ultimate weapon was activated in Geosenge Town! Go to the Team Flare Secret HQ to put a stop to it! First step: Beating Team Flare Aliana.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Team Flare Secret HQ')](), undefined, undefined,
            {
                clearedMessage: 'I had fun at the Kalos Power Plant. Of course, we could have generated electricity with Team Flare\'s technology, too, you know. We just didn\'t think it justified the cost. To create a world for us and us alone, we have to play it smart, you see.',
                npcDisplayName: 'Team Flare Aliana',
                npcImageName: 'Team Flare Aliana',
            });
        flareKalosQuestLine.addQuest(clearTeamFlareSecretHQ1);

        const clearTeamFlareSecretHQ2 = new CustomQuest(1, 0, 'Continue traversing through the Team Flare Secret HQ! Second step: Beating Team Flare Celosia.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Team Flare Secret HQ')](), undefined, undefined,
            {
                clearedMessage: 'In reality, those stones that line Route 10 are the graves of Pokémon. When the ultimate weapon was used to end that horrible war over 3,000 years ago, it stole the lives of all those Pokémon. Their lives were the price of peace then. And if we want to make our own wishes come true today, we in Team Flare also have to sacrifice something precious.',
                npcDisplayName: 'Team Flare Celosia',
                npcImageName: 'Team Flare Celosia',
            });
        flareKalosQuestLine.addQuest(clearTeamFlareSecretHQ2);

        const clearTeamFlareSecretHQ3 = new CustomQuest(1, 0, 'You should be halfway through. Go further in the Team Flare Secret HQ! Third step: Beating Team Flare Bryony.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Team Flare Secret HQ')](), undefined, undefined,
            {
                clearedMessage: 'We\'ve been using the electricity we stole from the Power Plant to get everything prepared for activating the ultimate weapon. But it\'s not like that\'s all we\'ll need to use it. Are you following me? We\'ll need energy absorbed from Pokémon to power the device! Yes! It\'s the stones on Route 10 that will steal that energy for us and power the ultimate weapon.',
                npcDisplayName: 'Team Flare Bryony',
                npcImageName: 'Team Flare Bryony',
            });
        flareKalosQuestLine.addQuest(clearTeamFlareSecretHQ3);

        const clearTeamFlareSecretHQ4 = new CustomQuest(1, 0, 'You are getting close. Resume delving into the Team Flare Secret HQ! Fourth step: Beating Team Flare Mable.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Team Flare Secret HQ')](), undefined, undefined,
            {
                clearedMessage: 'The power of the Legendary Pokémon... The power to grant life to all around it... The power to steal life from all around it... It\'s a mysterious ability that even scientists like us haven\'t been able to really decode. What d\'you think will happen to the world if we fuel the ultimate weapon with something like that?',
                npcDisplayName: 'Team Flare Mable',
                npcImageName: 'Team Flare Mable',
            });
        flareKalosQuestLine.addQuest(clearTeamFlareSecretHQ4);

        const clearTeamFlareSecretHQ5 = new CustomQuest(1, 0, 'You are almost there! One more time traversing through the Team Flare Secret HQ and you\'ll get to the end! Fifth step: Beating Team Flare Lysandre.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Team Flare Secret HQ')]());
        flareKalosQuestLine.addQuest(clearTeamFlareSecretHQ5);

        const talkToTeamFlareLysandre1 = new TalkToNPCQuest(TeamFlareLysandre1, 'This is it, you\'ve beaten Lysandre at the top of his game in Team Flare Secret HQ, right? He might have something else to say...');
        flareKalosQuestLine.addQuest(talkToTeamFlareLysandre1);

        const battleXerneas = new CustomQuest (1, 0,  'Calm Xerneas down!', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Xerneas')]());
        const battleYveltal = new CustomQuest (1, 0,  'Calm Yveltal down!', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Yveltal')]());

        flareKalosQuestLine.addQuest(new MultipleQuestsQuest([
            battleXerneas,
            battleYveltal,
        ],'You go to the lowest level of the Team Flare Secret HQ as Lysandre told you to. There you find Xerneas and Yveltal fighting each other! Fight them yourself and calm them down!'));

        const talkToTeamFlareBossLysandre1 = new TalkToNPCQuest(TeamFlareBossLysandre1, 'Lysandre appears menacingly in front of you in Team Flare Secret HQ. He doesn\'t seem fazed about you subsiding both legendary Pokémon.');
        flareKalosQuestLine.addQuest(talkToTeamFlareBossLysandre1);

        const battleTeamFlareBossLysandre1 = new CustomQuest (1, 0,  'Stop Team Flare Boss Lysandre in Team Flare Secret HQ once and for all!!', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Team Flare Boss Lysandre 1')]());
        flareKalosQuestLine.addQuest(battleTeamFlareBossLysandre1);

        const clearKalosLeague = new CustomQuest(1, 0, 'You did it! You saved Kalos! There is nothing else to do except to continue your journey to beat the Kalos Pokémon League!', () => App.game.statistics.gymsDefeated[GameConstants.getGymIndex('Champion Diantha')]());
        flareKalosQuestLine.addQuest(clearKalosLeague);

        // Battle AZ and finish the quest
        const KalosKeyStoneReward = () => {
            player.gainItem('Key_stone', 1);
            Notifier.notify({
                message: 'You got a Key Stone for completing the quest!',
                type: NotificationConstants.NotificationOption.success,
                sound: NotificationConstants.NotificationSound.Quests.quest_ready_to_complete,
            });
        };

        const battleAZ1 = new CustomQuest (1, KalosKeyStoneReward,  'What an amazing trainer! You became Kalos Champion! There is a parade in your honor in Lumiose City. But wait, AZ is there asking you for a battle. Show him what being a Pokémon trainer is like!', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Storyline AZ')]());
        flareKalosQuestLine.addQuest(battleAZ1);

        App.game.quests.questLines().push(flareKalosQuestLine);
    }


    public static createDeltaEpisodeQuestLine() {
        const deltaEpisodeQuestLine = new QuestLine('The Delta Episode', 'A catastrophe is on the horizon! Work with the people of Hoenn to stop it.', new GymBadgeRequirement(BadgeEnums.Rumble), GameConstants.BulletinBoards.Kalos);

        const talkToCozmo1 = new TalkToNPCQuest(Cozmo1, 'Talk to Dr. Cozmo in Fallarbor Town.');
        deltaEpisodeQuestLine.addQuest(talkToCozmo1);

        const talkToZinnia1 = new TalkToNPCQuest(Zinnia1, 'Talk to the mysterious figure at the Sky Pillar.');
        deltaEpisodeQuestLine.addQuest(talkToZinnia1);

        const talkToDeltaMay1 = new TalkToNPCQuest(DeltaMay1, 'Travel with Zinnia to Littleroot Town and talk to May.');
        deltaEpisodeQuestLine.addQuest(talkToDeltaMay1);

        const talkToNewsBirch = new TalkToNPCQuest(NewsBirch, 'Discuss the news with Professor Birch in Littleroot Town.');
        deltaEpisodeQuestLine.addQuest(talkToNewsBirch);

        const talkToDeltaMay2 = new TalkToNPCQuest(DeltaMay2, 'Find out why May is so mad in Littleroot Town.');
        deltaEpisodeQuestLine.addQuest(talkToDeltaMay2);

        const fightCourtney1 = new CustomQuest (1, 0, 'Defeat Courtney', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Courtney 1')]());

        const fightMatt1 = new CustomQuest (1, 0, 'Defeat Matt', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Matt 1')]());

        deltaEpisodeQuestLine.addQuest(new MultipleQuestsQuest(
            [
                fightCourtney1,
                fightMatt1,
            ], 'Follow Zinnia to Petalburg City.'));

        const talkToDeltaSteven1 = new TalkToNPCQuest(DeltaSteven1, 'Answer your ringing Holo Caster.');

        const talkToDeltaWally1 = new TalkToNPCQuest(DeltaWally1, 'Talk to Wally.');

        deltaEpisodeQuestLine.addQuest(new MultipleQuestsQuest(
            [
                talkToDeltaSteven1,
                talkToDeltaWally1,
            ], 'Talk to Wally and answer your ringing Holo Caster in Petalburg City.'));

        const clearGranite = new CustomQuest(10, 0, 'Clear Granite Cave 10 times.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Granite Cave')]());

        const findStars = new CustomQuest(1, undefined, 'Find a Star Piece.', () => player.mineInventory().find(item => item.name == 'Star Piece')?.amount() ?? 0);

        deltaEpisodeQuestLine.addQuest(new MultipleQuestsQuest(
            [
                clearGranite,
                findStars,
            ], 'Search Granite Cave and look for Star Pieces.'));

        const talkToZinnia2 = new TalkToNPCQuest(Zinnia2, 'Talk to Zinnia in Granite Cave.');
        deltaEpisodeQuestLine.addQuest(talkToZinnia2);

        const fightZinnia1 = new CustomQuest (1, 0, 'Defeat Zinnia in Granite Cave', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Zinnia 1')]());
        deltaEpisodeQuestLine.addQuest(fightZinnia1);

        const talkToZinnia3 = new TalkToNPCQuest(Zinnia3, 'Talk to Zinnia in Granite Cave.');
        deltaEpisodeQuestLine.addQuest(talkToZinnia3);

        const talkToCozmo2 = new TalkToNPCQuest(Cozmo2, 'Talk to Dr. Cozmo at the Mossdeep Space Center.');
        deltaEpisodeQuestLine.addQuest(talkToCozmo2);

        const talkToZinnia4 = new TalkToNPCQuest(Zinnia4, 'Talk to Zinnia at the Mossdeep Space Center.');
        deltaEpisodeQuestLine.addQuest(talkToZinnia4);

        const talkToCozmo3 = new TalkToNPCQuest(Cozmo3, 'Talk to Dr. Cozmo at the Mossdeep Space Center.');
        deltaEpisodeQuestLine.addQuest(talkToCozmo3);

        const clearMeteor = new CustomQuest(10, 0, 'Clear Meteor Falls 10 times to search for the Meteor Shard.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Meteor Falls')]());
        deltaEpisodeQuestLine.addQuest(clearMeteor);

        const talkToDracElder1 = new TalkToNPCQuest(DraconidElder1, 'Talk to the Draconid Elder in Meteor Falls.');
        deltaEpisodeQuestLine.addQuest(talkToDracElder1);

        const fightDracElder = new CustomQuest (1, 0, 'Defeat the Draconid Elder in Meteor Falls.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Draconid Elder')]());
        deltaEpisodeQuestLine.addQuest(fightDracElder);

        const talkToDracElder2 = new TalkToNPCQuest(DraconidElder2, 'Talk to the Draconid Elder in Meteor Falls.');
        deltaEpisodeQuestLine.addQuest(talkToDracElder2);

        const fightAquaGrunts = new CustomQuest (1, 0, 'Defeat the Aqua Grunt.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Aqua Grunt')]());

        const fightMagmaGrunts = new CustomQuest (1, 0, 'Defeat the Magma Grunt.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Magma Grunt')]());

        deltaEpisodeQuestLine.addQuest(new MultipleQuestsQuest(
            [
                fightAquaGrunts,
                fightMagmaGrunts,
            ], 'Defeat the Team Aqua and Magma Grunts attacking the Mossdeep Space Center.'));

        const fightCourtney2 = new CustomQuest (1, 0, 'Defeat Courtney', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Courtney 2')]());

        const fightMatt2 = new CustomQuest (1, 0, 'Defeat Matt', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Matt 2')]());

        deltaEpisodeQuestLine.addQuest(new MultipleQuestsQuest(
            [
                fightCourtney2,
                fightMatt2,
            ], 'Defeat the admins trying to take over the Mossdeep Space Center.'));

        const talkToZinnia5 = new TalkToNPCQuest(Zinnia5, 'Talk to Zinnia at the Mossdeep Space Center.');
        deltaEpisodeQuestLine.addQuest(talkToZinnia5);

        const clearAquaHideoutDelta = new CustomQuest(1, 0, 'Follow Zinnia to the Aqua hideout and search for her.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Aqua Hideout')]());
        deltaEpisodeQuestLine.addQuest(clearAquaHideoutDelta);

        const talkToArchie = new TalkToNPCQuest(Archie, 'Talk to Archie in the Team Aqua Hideout.');
        deltaEpisodeQuestLine.addQuest(talkToArchie);

        const clearMagmaHideoutDelta = new CustomQuest(1, 0, 'Follow Zinnia to the Magma Hideout and search for her.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Magma Hideout')]());
        deltaEpisodeQuestLine.addQuest(clearMagmaHideoutDelta);

        const talkToMaxie = new TalkToNPCQuest(Maxie, 'Talk to Maxie in the Team Magma Hideout.');
        deltaEpisodeQuestLine.addQuest(talkToMaxie);

        const talkToWallace3 = new TalkToNPCQuest(Wallace3, 'Talk to Wallace in Sootopolis City.');
        deltaEpisodeQuestLine.addQuest(talkToWallace3);

        const fightDeltaWallace = new CustomQuest (1, 0, 'Defeat Wallace in Sootopolis City.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Delta Wallace')]());
        deltaEpisodeQuestLine.addQuest(fightDeltaWallace);

        const fightZinnia2 = new CustomQuest (1, 0, 'Defeat Zinnia at the Sky Pillar.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Zinnia 2')]());
        deltaEpisodeQuestLine.addQuest(fightZinnia2);

        const catchDeltaRayquaza = new CaptureSpecificPokemonQuest('Rayquaza', 'Catch or hatch Rayquaza.', 1, true, 0, undefined);
        deltaEpisodeQuestLine.addQuest(catchDeltaRayquaza);

        const MeteoriteReward = () => {
            App.game.party.getPokemonByName('Rayquaza').giveMegastone();
            Notifier.notify({
                title: deltaEpisodeQuestLine.name,
                message: 'Your Meteorite Shards combine into a Meteorite!',
                type: NotificationConstants.NotificationOption.success,
                timeout: 3e4,
            });
        };

        const talkToZinnia6 = new TalkToNPCQuest(Zinnia6, 'Talk to Zinnia at the Sky Pillar.', MeteoriteReward);
        deltaEpisodeQuestLine.addQuest(talkToZinnia6);

        const catchMegaRayquaza = new CaptureSpecificPokemonQuest('Mega Rayquaza', 'Mega Evolve Rayquaza.', 1, false, 0, undefined);
        deltaEpisodeQuestLine.addQuest(catchMegaRayquaza);

        const talkToZinnia7 = new TalkToNPCQuest(Zinnia7, 'Talk to Zinnia at the Sky Pillar.');
        deltaEpisodeQuestLine.addQuest(talkToZinnia7);

        const fightDeoxys = new CustomQuest (1, 0, 'Fly Mega Rayquaza into space to destroy the Meteor.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Deoxys')]());
        deltaEpisodeQuestLine.addQuest(fightDeoxys);

        const talkToCozmo4 = new TalkToNPCQuest(Cozmo4, 'Talk to Dr. Cozmo at the Mossdeep Space Center.');
        deltaEpisodeQuestLine.addQuest(talkToCozmo4);

        App.game.quests.questLines().push(deltaEpisodeQuestLine);
    }


    public static createDetectivePikachuQuestLine() {
        const detectivePikachuQuestLine = new QuestLine('Detective Pikachu', 'Detective Pikachu\'s partner has gone missing, and he needs your help!', new MultiRequirement([new ObtainedPokemonRequirement('Detective Pikachu'), new GymBadgeRequirement(BadgeEnums.Bug)]) , GameConstants.BulletinBoards.Kalos);

        const searchForClues1 = new TalkToNPCQuest(searchForClues, 'Search Goldenrod City for clues.');
        detectivePikachuQuestLine.addQuest(searchForClues1);

        const aipomAlley = new CustomQuest(1, 0, 'Defeat the Aipoms', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Aipom Alley')]());
        detectivePikachuQuestLine.addQuest(aipomAlley);

        const searchForClues2 = new CustomQuest(1, 0, 'The Aipoms dropped some sort of vial while they were running away. It looks like they were headed towards the Radio Tower. Find it!', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Radio Tower')]());
        detectivePikachuQuestLine.addQuest(searchForClues2);

        const searchForClues3 = new TalkToNPCQuest(Informant1, 'Detective Pikachu has an informant who knows more about the mysterious vial. Meet with him in Saffron City.');
        detectivePikachuQuestLine.addQuest(searchForClues3);

        const mimeInterview = new CustomQuest(1, 0, 'The informant is proving hard to convince. Time to get physical!', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Mime Interview')]());
        detectivePikachuQuestLine.addQuest(mimeInterview);

        const searchForClues4 = new TalkToNPCQuest(Informant2, 'The informant is finally willing to "talk", find out what he has to say.');
        detectivePikachuQuestLine.addQuest(searchForClues4);

        const undergroundFightingRing = new CustomQuest(1, 0, 'Infiltrate the underground fighting ring.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Underground Fighting Ring')]());
        detectivePikachuQuestLine.addQuest(undergroundFightingRing);

        const searchForClues5 = new TalkToNPCQuest(HowardClifford1, 'Go to Clifford Industries in Goldenrod City to demand some answers.');
        detectivePikachuQuestLine.addQuest(searchForClues5);

        const searchForClues6 = new TalkToNPCQuest(LucyStevens1, 'Meet up with investigative journalist Lucy Stevens in Hearthome City');
        detectivePikachuQuestLine.addQuest(searchForClues6);

        const searchForClues7 = new CustomQuest(1, 0, 'Search the research laboratory for clues.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('P2 Laboratory')]());
        detectivePikachuQuestLine.addQuest(searchForClues7);

        const labAmbush = new CustomQuest(1, 0, 'It was an ambush! You have been followed to Nuvema Town, defeat the mysterious attackers and escape!', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Lab Ambush')]());
        detectivePikachuQuestLine.addQuest(labAmbush);

        const searchForClues8 = new TalkToNPCQuest(Mewtwo1, 'Detective Pikachu is injured. He asks you to get help from his friend near Cerulean Cave');
        detectivePikachuQuestLine.addQuest(searchForClues8);

        const searchForClues9 = new TalkToNPCQuest(HowardClifford2, 'Confront Howard Clifford in Goldenrod City about his involvement with the R vials.');
        detectivePikachuQuestLine.addQuest(searchForClues9);

        const imposterAttack = new CustomQuest(1, 0, 'Defeat Howard\'s bodyguard and escape.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Imposter')]());
        detectivePikachuQuestLine.addQuest(imposterAttack);

        const howardConfront = new TalkToNPCQuest(HowardClifford3, 'Give Howard Clifford one last chance to surrender!');
        detectivePikachuQuestLine.addQuest(howardConfront);

        const possessedFight = new CustomQuest(1, 0, 'Defeat Mewtwo to free it from Howard\'s control!', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Possessed Mewtwo')]());
        detectivePikachuQuestLine.addQuest(possessedFight);

        const searchForClues10 = new TalkToNPCQuest(Mewtwo2, 'Talk to Mewtwo near Cerulean Cave about Detective Pikachu\'s partner.');
        detectivePikachuQuestLine.addQuest(searchForClues10);

        const DetectiveRaichuReward = () => {
            App.game.party.gainPokemonByName('Detective Raichu');
            Notifier.notify({
                title: detectivePikachuQuestLine.name,
                message: 'Detective Pikachu\'s partner has been nursed back to health!',
                type: NotificationConstants.NotificationOption.success,
                timeout: 3e4,
            });
        };

        const searchForClues11 = new TalkToNPCQuest(DetectiveRaichu, 'Talk to Detective Raichu', DetectiveRaichuReward);
        detectivePikachuQuestLine.addQuest(searchForClues11);

        App.game.quests.questLines().push(detectivePikachuQuestLine);
    }

    public static createVivillonQuestLine() {
        const vivillonQuestLine = new QuestLine('The Great Vivillon Hunt!', 'Discover the beauty of Vivillon.', new GymBadgeRequirement(BadgeEnums.Iceberg), GameConstants.BulletinBoards.Kalos);

        const createVivillonQuest = (type: PokemonType, vivillon: PokemonNameType, dungeons: Array<string>, hint: string) => {
            // Capture 100 Water type Pokemon
            const catchType = new CustomQuest(100, undefined, `Capture or hatch 100 ${PokemonType[type]}-type Pokémon.`, () => {
                return pokemonMap.filter(p => p.type.includes(type)).map(p => App.game.statistics.pokemonCaptured[p.id]()).reduce((a,b) => a + b, 0);
            });
            vivillonQuestLine.addQuest(catchType);

            // Capture Vivillon in a dungeon
            const vivillonAdd = () => {
                dungeons.forEach(dungeon => {
                    dungeonList[dungeon].bossList.push(new DungeonBossPokemon(vivillon, 93659450, 80));
                });
                Notifier.notify({
                    title: vivillonQuestLine.name,
                    message: `A Vivillon is hiding somewhere.\n${hint}`,
                    type: NotificationConstants.NotificationOption.info,
                });
            };
            const vivillonRemove = () => {
                dungeons.forEach(dungeon => {
                    dungeonList[dungeon].bossList = dungeonList[dungeon].bossList.filter(boss => boss.name != vivillon || (boss.name == vivillon && boss.options?.requirement));
                });
                Notifier.notify({
                    title: vivillonQuestLine.name,
                    message: `You caught the rare ${vivillon}!`,
                    type: NotificationConstants.NotificationOption.success,
                });
            };
            const catchVivillon = new CaptureSpecificPokemonQuest(
                vivillon,
                `Find and capture the rare Vivillon!\nHint: ${hint}`,
                1,
                false,
                vivillonRemove,
                vivillonAdd);
            vivillonQuestLine.addQuest(catchVivillon);
        };

        createVivillonQuest(PokemonType.Water, 'Vivillon (Marine)', ['Lake Verity', 'Lake Valor', 'Lake Acuity'], 'It has been spotted at some Lakes.');
        createVivillonQuest(PokemonType.Psychic, 'Vivillon (Modern)', ['Cerulean Cave'], 'It\'s surrounded by strong Pokémon.');
        createVivillonQuest(PokemonType.Poison, 'Vivillon (Jungle)', ['Moor of Icirrus'], 'It has been spotted in a swamp.');
        createVivillonQuest(PokemonType.Dark, 'Vivillon (Monsoon)', ['Dark Cave'], 'It\'s hiding at a dark place.');
        createVivillonQuest(PokemonType.Steel, 'Vivillon (Tundra)', ['Poké Ball Factory'], 'It flew into a factory.');
        createVivillonQuest(PokemonType.Fire, 'Vivillon (Sun)', ['Mt. Chimney Crater'], 'It seems to like hot places.');
        createVivillonQuest(PokemonType.Fighting, 'Vivillon (Archipelago)', ['Sprout Tower'], 'It\'s sitting on a swaying pillar.');
        createVivillonQuest(PokemonType.Ghost, 'Vivillon (Elegant)', ['Lost Hotel'], 'It\'s visiting an abandoned and spooky place.');
        createVivillonQuest(PokemonType.Fairy, 'Vivillon (Ocean)', ['Dreamyard'], 'It\'s flying around an overgrown place full of dreams.');
        createVivillonQuest(PokemonType.Electric, 'Vivillon (Continental)', ['New Mauville'], 'It\'s currently in a City full of Electric-type Pokémon.');
        createVivillonQuest(PokemonType.Bug, 'Vivillon (River)', ['Eterna Forest'], 'It hides in a dark Forest.');
        createVivillonQuest(PokemonType.Flying, 'Vivillon (Polar)', ['Sky Pillar'], 'It\'s high up in the sky.');
        createVivillonQuest(PokemonType.Ground, 'Vivillon (Sandstorm)', ['Relic Castle'], 'It got lost in the desert sand.');
        createVivillonQuest(PokemonType.Grass, 'Vivillon (Garden)', ['Flower Paradise'], 'It only shows up amongst the most beautiful flowers.');
        createVivillonQuest(PokemonType.Rock, 'Vivillon (High Plains)', ['Mt. Moon'], 'It has been spotted dancing in the moonlight.');
        createVivillonQuest(PokemonType.Dragon, 'Vivillon (Savanna)', ['Dragonspiral Tower'], 'It\'s surrounded by dragons.');
        createVivillonQuest(PokemonType.Ice, 'Vivillon (Icy Snow)', ['Frost Cavern'], 'It can be found at a very cold place.');

        // Capture 200 Normal type Pokemon
        const catchNormal = new CustomQuest(200, undefined, 'Capture or hatch 200 Normal-type Pokémon.', () => {
            return pokemonMap.filter(p => p.type.includes(PokemonType.Normal)).map(p => App.game.statistics.pokemonCaptured[p.id]()).reduce((a,b) => a + b, 0);
        });
        vivillonQuestLine.addQuest(catchNormal);

        // Capture Vivillon (Pokéball)
        const viviBallAdd = () => {
            BattleFrontierMilestones.addMilestone(new BattleFrontierMilestonePokemon(666, 'Vivillon (Poké Ball)'));
            Notifier.notify({
                title: vivillonQuestLine.name,
                message: 'A Vivillon is hiding somewhere.\nOnly the strongest Challengers can reach it.',
                type: NotificationConstants.NotificationOption.success,
            });
        };
        const viviBalldone = () => {
            Notifier.notify({
                title: vivillonQuestLine.name,
                message: 'You caught the last rare Vivillon (Poké Ball).\nCongratulations!',
                type: NotificationConstants.NotificationOption.success,
            });
        };
        const catchBall = new CaptureSpecificPokemonQuest(
            'Vivillon (Poké Ball)',
            'Find and capture the rare Vivillon!\nHint: Only the strongest Challengers can reach it.',
            1,
            false,
            viviBalldone,
            viviBallAdd);
        vivillonQuestLine.addQuest(catchBall);

        // Add quest to quest line
        App.game.quests.questLines().push(vivillonQuestLine);
    }

    public static createAshKetchumQuestLine() {
        const ashKetchumQuestLine = new QuestLine('The New Kid', 'A new kid from your home town is making waves. Show him who the real prodigy of Pallet Town is.', new GymBadgeRequirement(BadgeEnums.Elite_KalosChampion), GameConstants.BulletinBoards.Kalos);

        const clearKantoAsh = new CustomQuest(1, 0, 'Defeat the kid near Pallet Town.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Ash Ketchum Kanto')]());
        ashKetchumQuestLine.addQuest(clearKantoAsh);

        const clearJohtoAsh = new CustomQuest(1, 0, 'He\'s not stopping. Find the kid in Johto.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Ash Ketchum Johto')]());
        ashKetchumQuestLine.addQuest(clearJohtoAsh);

        const clearHoennAsh = new CustomQuest(1, 0, 'He just won\'t learn his lesson. Defeat the kid again in Hoenn.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Ash Ketchum Hoenn')]());
        ashKetchumQuestLine.addQuest(clearHoennAsh);

        const clearSinnohAsh = new CustomQuest(1, 0, 'Who does this kid think he is anyway? Pretending he\'s the main character. He\'s in Sinnoh now.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Ash Ketchum Sinnoh')]());
        ashKetchumQuestLine.addQuest(clearSinnohAsh);

        const clearUnovaAsh = new CustomQuest(1, 0, 'The kid is hiding in Unova!', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Ash Ketchum Unova')]());
        ashKetchumQuestLine.addQuest(clearUnovaAsh);

        const AshKetchumReward = () => {
            App.game.party.gainPokemonByName('Ash-Greninja');
            Notifier.notify({
                title: ashKetchumQuestLine.name,
                message: 'You obtained Ash-Greninja!',
                type: NotificationConstants.NotificationOption.success,
                timeout: 3e4,
            });
        };

        const clearKalosAsh = new CustomQuest(1, AshKetchumReward, 'Maybe you were too hard on the kid... You should offer him an apology in Kalos.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Ash Ketchum Kalos')]());
        ashKetchumQuestLine.addQuest(clearKalosAsh);

        App.game.quests.questLines().push(ashKetchumQuestLine);
    }

    public static createPrincessDiancieQuestLine() {
        const princessDiancieQuestLine = new QuestLine('Princess Diancie', 'Princess Diancie has been spotted in Kalos! She\'s searching for something.', new MultiRequirement([new ObtainedPokemonRequirement('Doublade'), new GymBadgeRequirement(BadgeEnums.Elite_Malva), new GymBadgeRequirement(BadgeEnums.Elite_Siebold), new GymBadgeRequirement(BadgeEnums.Elite_Wikstrom), new GymBadgeRequirement(BadgeEnums.Elite_Drasna)]) , GameConstants.BulletinBoards.Kalos);

        const catchFairy = new CustomQuest(100, undefined, 'Capture or hatch 100 Fairy-type Pokémon to follow Diancie\'s Fairy Aura.', () => {
            return pokemonMap.filter(p => p.type.includes(PokemonType.Fairy)).map(p => App.game.statistics.pokemonCaptured[p.id]()).reduce((a,b) => a + b, 0);
        });
        princessDiancieQuestLine.addQuest(catchFairy);

        const fightRiot = new CustomQuest(1, 0, 'Defend Diancie from the attacking ninja in Shalour City.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Riot')]());
        princessDiancieQuestLine.addQuest(fightRiot);

        const fightMerilyn = new CustomQuest(1, 0, 'Diancie has escaped to the shopping mall in Lumiose City, but is under attack again!', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Merilyn')]());
        princessDiancieQuestLine.addQuest(fightMerilyn);

        const diamondDomain = new CustomQuest(5, undefined, 'Diancie has fled to the Diamond Domain. Dig in the Underground to find it.', App.game.statistics.undergroundLayersMined);
        princessDiancieQuestLine.addQuest(diamondDomain);

        const fightSteels = new CustomQuest(1, 0, 'Millis and Argus Steel let you do the hard work while they set up an ambush in Shalour City.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Millis and Argus Steel')]());
        princessDiancieQuestLine.addQuest(fightSteels);

        const BladeAegislashReward = () => {
            App.game.party.gainPokemonByName('Aegislash (Blade)');
            Notifier.notify({
                title: princessDiancieQuestLine.name,
                message: 'Your Doublade has evolved into Blade Forme Aegislash!',
                type: NotificationConstants.NotificationOption.success,
                timeout: 3e4,
            });
        };

        const bladeForme = new TalkToNPCQuest(ExamineAegislash, 'Your Doublade learned something from the Steels, examine it in Shalour City to find out what!', BladeAegislashReward);
        princessDiancieQuestLine.addQuest(bladeForme);

        const heartDiamond = new CustomQuest(1000, undefined, 'Diancie needs help building a Heart Diamond to stabilize the Diamond Domain. Gather some Fairy Gems for her.', App.game.statistics.gemsGained[17]);
        princessDiancieQuestLine.addQuest(heartDiamond);

        const thanksDiancie = new TalkToNPCQuest(ThanksDiancie, 'Talk to Princess Diancie in Shalour City.');
        princessDiancieQuestLine.addQuest(thanksDiancie);

        const DiancieCatch = new CaptureSpecificPokemonQuest(
            'Diancie',
            'Capture Diancie in Reflection Cave.',
            1,
            false,
            undefined,
            undefined
        );

        princessDiancieQuestLine.addQuest(DiancieCatch);

        const fightYveltal = new CustomQuest(1, 0, 'A rampaging Yveltal is threatening the Diamond Domain! Help Diancie defeat it!', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Rampaging Yveltal')]());
        princessDiancieQuestLine.addQuest(fightYveltal);

        App.game.quests.questLines().push(princessDiancieQuestLine);
    }


    // Alola QuestLines
    // Started upon defeating Konikoni City's gym.
    public static createSkullAetherAlolaQuestLine() {
        const skullAetherAlolaQuestLine = new QuestLine('Eater of Light', 'A dangerous Pokémon from another world threatens the Alola region.');

        const clearUltraWormhole = new CustomQuest(1, 0, 'A strange creature has appeared in Aether Paradise. Make it go away. Clear the Ultra Wormhole.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Ultra Wormhole')]());
        skullAetherAlolaQuestLine.addQuest(clearUltraWormhole);

        const clearMalieGarden = new CustomQuest(1, 0, 'Team Skull are being annoying. Get rid of them. Clear the Malie Garden dungeon.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Malie Garden')]());
        skullAetherAlolaQuestLine.addQuest(clearMalieGarden);

        const clearPoTown = new CustomQuest(1, 0, 'Team Skull have stolen a child\'s Yungoos. Raid their base. Clear the Po Town dungeon.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Po Town')]());
        skullAetherAlolaQuestLine.addQuest(clearPoTown);

        const clearAetherFoundation = new CustomQuest(1, 0, 'Aether president Lusamine has recruited Team Skull in her own plan to stop the Eater of Light. Stop her. Clear the Aether Foundation dungeon.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Aether Foundation')]());
        skullAetherAlolaQuestLine.addQuest(clearAetherFoundation);

        const UltraMegalopolisReward = () => {
            App.game.pokeballs.gainPokeballs(GameConstants.Pokeball.Masterball, 1, false);
            Notifier.notify({
                title: skullAetherAlolaQuestLine.name,
                message: 'You found a Master Ball!',
                type: NotificationConstants.NotificationOption.success,
                timeout: 3e4,
            });
        };

        const clearUltraMegalopolis = new CustomQuest(1, UltraMegalopolisReward, 'Stop the Eater of Light from absorbing all light in Alola. Clear Ultra Megalopolis at the Altar of the Sunne and Moone.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Ultra Megalopolis')]());
        skullAetherAlolaQuestLine.addQuest(clearUltraMegalopolis);

        App.game.quests.questLines().push(skullAetherAlolaQuestLine);
    }

    // Started upon defeating Ultra Necrozma temp battle.
    public static createMinasTrialAlolaQuestLine() {
        const minasTrialAlolaQuestLine = new QuestLine('Mina\'s Trial', 'Mina has asked you to battle the Trial captains of the other islands to earn access to her Trial site.');

        const clearCaptainMina = new CustomQuest(1, 0, 'Defeat Captain Mina in Seafolk Village.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Captain Mina')]());
        minasTrialAlolaQuestLine.addQuest(clearCaptainMina);

        const clearCaptainIlima = new CustomQuest(1, 0, 'Defeat Captain Ilima in Hau\'oli Cemetery.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Captain Ilima')]());
        minasTrialAlolaQuestLine.addQuest(clearCaptainIlima);

        const clearCaptainMallow = new CustomQuest(1, 0, 'Defeat Captain Mallow in Lush Jungle.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Captain Mallow')]());
        minasTrialAlolaQuestLine.addQuest(clearCaptainMallow);

        const clearCaptainLana = new CustomQuest(1, 0, 'Defeat Captain Lana in Lush Jungle.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Captain Lana')]());
        minasTrialAlolaQuestLine.addQuest(clearCaptainLana);

        const clearCaptainKiawe = new CustomQuest(1, 0, 'Defeat Captain Kiawe in Wela Volcano Park.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Captain Kiawe')]());
        minasTrialAlolaQuestLine.addQuest(clearCaptainKiawe);

        const clearCaptainSophocles = new CustomQuest(1, 0, 'Defeat Captain Sophocles in Hokulani Observatory.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Captain Sophocles')]());
        minasTrialAlolaQuestLine.addQuest(clearCaptainSophocles);

        const clearKahunaNanu = new CustomQuest(1, 0, 'Captain Acerola is apparently busy with something at the top of Mount Lanakila. Defeat Kahuna Nanu in Tapu Village instead.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Kahuna Nanu')]());
        minasTrialAlolaQuestLine.addQuest(clearKahunaNanu);

        const clearMinasHouseboat = new CustomQuest(1, 0, 'Complete the Trial! Clear Mina\'s Houseboat in Seafolk Village.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Mina\'s Houseboat')]());
        minasTrialAlolaQuestLine.addQuest(clearMinasHouseboat);

        App.game.quests.questLines().push(minasTrialAlolaQuestLine);
    }

    public static createUltraBeastQuestLine() {
        const UltraBeastQuestLine = new QuestLine('Ultra Beast Hunt', 'Track down the mysterious Ultra Beasts', new GymBadgeRequirement(BadgeEnums.Elite_AlolaChampion), GameConstants.BulletinBoards.Alola);

        const talkToLooker = new TalkToNPCQuest(RoadsideMotelLooker1, 'Talk to Looker at the Roadside Motel.');
        UltraBeastQuestLine.addQuest(talkToLooker);

        const AnabelReward = () => {
            App.game.pokeballs.gainPokeballs(GameConstants.Pokeball.Beastball,5,false);
        };

        const AnabelBattle = new CustomQuest(
            1,
            AnabelReward,
            'Defeat Agent Anabel at the Roadside Motel.',
            () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Anabel')](),
            0
        );
        UltraBeastQuestLine.addQuest(AnabelBattle);

        const talkToAnabel1 = new TalkToNPCQuest(RoadsideMotelAnabel1, 'Talk to Anabel at the Roadside Motel.');
        UltraBeastQuestLine.addQuest(talkToAnabel1);

        const talkToLooker2 = new TalkToNPCQuest(RoadsideMotelLooker2, 'Talk to Looker at the Roadside Motel to learn about Beast Balls.');
        UltraBeastQuestLine.addQuest(talkToLooker2);

        const createUltraBeastQuest = (ultrabeast: PokemonNameType, hint: string, numberCaught: number, ultraBeastReward?: (() => void)) => {
            const time = (numberCaught > 0) ?  'times!' : 'time!';
            const validHint = hint ?? '';

            const catchUltraBeast = new CaptureSpecificPokemonQuest(
                ultrabeast,
                `Capture ${ultrabeast} ${numberCaught} ${time} ${validHint}`,
                numberCaught,
                false,
                ultraBeastReward,
                undefined
            );

            return catchUltraBeast;
        };
        const ultraBeastReward = () => {
            Notifier.notify({
                title: UltraBeastQuestLine.name,
                message: 'An Ultra Beast is hiding somewhere...',
                type: NotificationConstants.NotificationOption.info,
                timeout: 3e1,
            });
        };

        UltraBeastQuestLine.addQuest(createUltraBeastQuest('Nihilego', ' Nihilego has been spotted at Wela Volcano Park and Diglett\'s Tunnel!', 1, ultraBeastReward));

        const talkToAnabel2 = new TalkToNPCQuest(RoadsideMotelAnabel2, 'Talk to Anabel at the Roadside Motel.');
        UltraBeastQuestLine.addQuest(talkToAnabel2);

        UltraBeastQuestLine.addQuest(new MultipleQuestsQuest(
            [
                createUltraBeastQuest('Buzzwole', undefined, 2),
                createUltraBeastQuest('Pheromosa', undefined, 4),
            ], 'Rare Ultra Beasts have been spotted!\nBuzzwole in Melemele Meadow and Pheromosa in Verdant Cavern!', ultraBeastReward));

        const talkToAnabel3 = new TalkToNPCQuest(RoadsideMotelAnabel3, 'Talk to Anabel at the Roadside Motel.');
        UltraBeastQuestLine.addQuest(talkToAnabel3);

        const MinaBattle = new CustomQuest(
            1,
            undefined,
            'Defeat Trial Captain Mina at the Roadside Motel.',
            () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Captain Mina UB')](),
            0
        );
        UltraBeastQuestLine.addQuest(MinaBattle);

        const talkToMina1 = new TalkToNPCQuest(RoadsideMotelMina, 'Talk to Captain Mina at the Roadside Motel.');
        UltraBeastQuestLine.addQuest(talkToMina1);

        UltraBeastQuestLine.addQuest(createUltraBeastQuest('Xurkitree', ' Xurkitree has been spotted at Memorial Hill and Lush Jungle!', 2, ultraBeastReward));

        const talkToNanu1 = new TalkToNPCQuest(RoadsideMotelNanu1, 'Talk to Kahuna Nanu at the Roadside Motel.');
        UltraBeastQuestLine.addQuest(talkToNanu1);

        UltraBeastQuestLine.addQuest(new MultipleQuestsQuest(
            [
                createUltraBeastQuest('Kartana', undefined, 4),
                createUltraBeastQuest('Celesteela', undefined, 2),
            ], 'Rare Ultra Beasts have been spotted! Kartana at Malie Garden and Route 17, and Celesteela at Malie Garden and Haina Desert!', ultraBeastReward));

        const talkToNanu2 = new TalkToNPCQuest(RoadsideMotelNanu2, 'Talk to Kahuna Nanu at the Roadside Motel.');
        UltraBeastQuestLine.addQuest(talkToNanu2);

        const NanuBattle = new CustomQuest(
            1,
            undefined,
            'Defeat Kahuna Nanu at the Roadside Motel.',
            () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Kahuna Nanu UB')](),
            0
        );
        UltraBeastQuestLine.addQuest(NanuBattle);

        const talkToAnabel4 = new TalkToNPCQuest(RoadsideMotelAnabel4, 'Talk to Anabel at the Roadside Motel.');
        UltraBeastQuestLine.addQuest(talkToAnabel4);

        UltraBeastQuestLine.addQuest(new MultipleQuestsQuest(
            [
                createUltraBeastQuest('Blacephalon', undefined, 5),
                createUltraBeastQuest('Stakataka', undefined, 5),
            ], 'Rare Ultra Beasts have been spotted! Blacephalon and Stakataka are both at Poni Grove!', ultraBeastReward));

        const talkToAnabel5 = new TalkToNPCQuest(RoadsideMotelAnabel5, 'Talk to Anabel at the Roadside Motel.');
        UltraBeastQuestLine.addQuest(talkToAnabel5);

        const GuzzlordReward = () => {
            Notifier.notify({ message: 'You caught all the Ultra Beasts!', type: NotificationConstants.NotificationOption.success });
            App.game.pokeballs.gainPokeballs(GameConstants.Pokeball.Beastball,50,false);
        };

        const GuzzlordCatch = new CaptureSpecificPokemonQuest(
            'Guzzlord',
            'Catch Guzzlord at Resolution Cave.',
            1,
            false,
            GuzzlordReward,
            undefined
        );

        UltraBeastQuestLine.addQuest(GuzzlordCatch);

        App.game.quests.questLines().push(UltraBeastQuestLine);
    }

    // Magikarp Jump
    public static createDrSplashQuestLine() {
        const drSplashQuestLine = new QuestLine('Dr. Splash\'s Research Project', 'Help Dr. Splash unlock the full potential of your Magikarps.', new GymBadgeRequirement(BadgeEnums.Great_League), GameConstants.BulletinBoards.Hoppy);

        const talkToDrSplash1 = new TalkToNPCQuest(DrSplash1, 'Talk to Dr. Splash in Hoppy Town.');
        drSplashQuestLine.addQuest(talkToDrSplash1);

        const farmOran = new HarvestBerriesQuest(129, undefined, BerryType.Oran);
        const farmSitrus = new HarvestBerriesQuest(129, undefined, BerryType.Sitrus);
        const farmPecha = new HarvestBerriesQuest(129, undefined, BerryType.Pecha);
        const farmRindo = new HarvestBerriesQuest(129, undefined, BerryType.Rindo);
        const farmWacan = new HarvestBerriesQuest(129, undefined, BerryType.Wacan);
        const farmLeppa = new HarvestBerriesQuest(129, undefined, BerryType.Leppa);
        const farmRawst = new HarvestBerriesQuest(129, undefined, BerryType.Rawst);
        const farmAspear = new HarvestBerriesQuest(129, undefined, BerryType.Aspear);
        const farmRazz = new HarvestBerriesQuest(129, undefined, BerryType.Razz);
        const farmBluk = new HarvestBerriesQuest(129, undefined, BerryType.Bluk);

        drSplashQuestLine.addQuest(new MultipleQuestsQuest([
            farmOran,
            farmSitrus,
            farmPecha,
            farmRindo,
            farmWacan,
            farmLeppa,
            farmRawst,
            farmAspear,
            farmRazz,
            farmBluk,
        ],'Gather berries for Dr. Splash.'));

        const talkToDrSplash2 = new TalkToNPCQuest(DrSplash2, 'Report back to Dr. Splash about your berry research.');
        drSplashQuestLine.addQuest(talkToDrSplash2);

        const sandBag = new GainGemsQuest(5000, 0, PokemonType.Ground);
        const jumpCounter = new CaptureSpecificPokemonQuest('Spoink', 'Catch or hatch 10 Spoink.', 10, true, 0, undefined);
        const timber = new GainGemsQuest(5000, 0, PokemonType.Grass);
        const rockCruncher = new GainGemsQuest(5000, 0, PokemonType.Rock);
        const powerGenerator = new CaptureSpecificPokemonQuest('Voltorb', 'Catch or hatch 10 Voltorb.', 10, true, 0, undefined);
        const pokeballSmash = new BuyPokeballsQuest(100000, 0, GameConstants.Pokeball.Pokeball);
        const frostCruncher = new GainGemsQuest(5000, 0, PokemonType.Ice);

        drSplashQuestLine.addQuest(new MultipleQuestsQuest([
            sandBag,
            jumpCounter,
            timber,
            rockCruncher,
            powerGenerator,
            pokeballSmash,
            frostCruncher,
        ],'Gather materials for Dr. Splash.'));

        const talkToDrSplash3 = new TalkToNPCQuest(DrSplash3, 'Return to Dr. Splash in Hoppy Town with the training materials.');
        drSplashQuestLine.addQuest(talkToDrSplash3);


        const pushDwebble = new CaptureSpecificPokemonQuest('Dwebble', 'Catch or hatch 10 Dwebble.', 10, true, 0, undefined);
        const pushBoldore = new CaptureSpecificPokemonQuest('Boldore', 'Catch or hatch 10 Boldore.', 10, true, 0, undefined);
        const pushForretress = new CaptureSpecificPokemonQuest('Forretress', 'Catch or hatch 10 Forretress.', 10, true, 0, undefined);
        const pushGolem = new CaptureSpecificPokemonQuest('Golem', 'Catch or hatch 10 Golem.', 10, true, 0, undefined);
        const pushSteelix = new CaptureSpecificPokemonQuest('Steelix', 'Catch or hatch 10 Steelix.', 10, true, 0, undefined);

        drSplashQuestLine.addQuest(new MultipleQuestsQuest([
            pushDwebble,
            pushBoldore,
            pushForretress,
            pushGolem,
            pushSteelix,
        ],'Catch Pokémon for Dr. Splash\'s training grounds.'));

        const talkToDrSplash4 = new TalkToNPCQuest(DrSplash4, 'Return to Dr. Splash in Hoppy Town with the pushable Pokémon.');
        drSplashQuestLine.addQuest(talkToDrSplash4);

        const tackleMachine = new CustomQuest(5000, 0, 'Defeat 5,000 Pokémon', App.game.statistics.totalPokemonDefeated);
        drSplashQuestLine.addQuest(tackleMachine);

        const SaucyBlueReward = () => {
            App.game.party.gainPokemonByName('Magikarp Saucy Blue');
            Notifier.notify({
                title: drSplashQuestLine.name,
                message: 'Dr. Splash gives you a Saucy Blue Magikarp!',
                type: NotificationConstants.NotificationOption.success,
                timeout: 3e4,
                sound: NotificationConstants.NotificationSound.General.new_catch,
            });
        };

        const talkToDrSplash5 = new TalkToNPCQuest(DrSplash5, 'Wrap up your research project by talking to Dr. Splash in Hoppy Town.', SaucyBlueReward);
        drSplashQuestLine.addQuest(talkToDrSplash5);

        App.game.quests.questLines().push(drSplashQuestLine);

    }
    public static createMeltanQuestLine() {
        const meltanQuestLine = new QuestLine('Let\'s Go, Meltan!', 'I need your assistance in learning more about the newly discovered Pokémon that has really sent me and other Pokémon researchers into quite a tizzy.', new GymBadgeRequirement(BadgeEnums.Elite_AlolaChampion), GameConstants.BulletinBoards.Alola);

        // Multi-step #0:

        const meltanMine10 = new MineItemsQuest(10, 0);
        const meltanCatch50 = new CapturePokemonsQuest(50, 0);

        meltanQuestLine.addQuest(new MultipleQuestsQuest([
            meltanMine10,
            meltanCatch50,
        ],'Step 1 of Let\'s Go, Meltan!'));

        // Multi-step #1:

        const meltanBreed50 = new HatchEggsQuest(50, 0);
        const meltanObtain15kFP = new GainFarmPointsQuest(15000, 0);

        meltanQuestLine.addQuest(new MultipleQuestsQuest([
            meltanBreed50,
            meltanObtain15kFP,
        ],'Step 2 of Let\'s Go, Meltan!'));

        // Multi-step #2:

        const meltanCatch5Ditto = new CaptureSpecificPokemonQuest('Ditto', 'Catch or hatch 5 Ditto.', 5, true, 0, undefined);
        const meltanDefeatMolayne10 = new DefeatGymQuest(10, 0, 'Elite Molayne');

        meltanQuestLine.addQuest(new MultipleQuestsQuest([
            meltanCatch5Ditto,
            meltanDefeatMolayne10,
        ],'Step 3 of Let\'s Go, Meltan!'));

        // Multi-step #3:

        const meltanCatch50Steel = new CapturePokemonTypesQuest(50, undefined, PokemonType.Steel);
        const meltanCatch50Electric = new CapturePokemonTypesQuest(50, undefined, PokemonType.Electric);
        const meltanDefeatOlivia10 = new DefeatGymQuest(10, 0, 'Elite Olivia');

        meltanQuestLine.addQuest(new MultipleQuestsQuest([
            meltanCatch50Steel,
            meltanCatch50Electric,
            meltanDefeatOlivia10,
        ],'Step 4 of Let\'s Go, Meltan!'));

        // Multi-step #4:

        const meltanCatch5Grimer = new CaptureSpecificPokemonQuest('Alolan Grimer', 'Catch or hatch 5 Alolan Grimer.', 5, true, 0, undefined);
        const meltanCatch5Slugma = new CaptureSpecificPokemonQuest('Slugma', 'Catch or hatch 5 Slugma.', 5, true, 0, undefined);
        const meltanCatch10Gulpin = new CaptureSpecificPokemonQuest('Gulpin', 'Catch or hatch 10 Gulpin.', 10, true, 0, undefined);

        meltanQuestLine.addQuest(new MultipleQuestsQuest([
            meltanCatch5Grimer,
            meltanCatch5Slugma,
            meltanCatch10Gulpin,
        ],'Step 5 of Let\'s Go, Meltan!'));

        // Multi-step #5:

        const meltanObtain10MB = new BuyPokeballsQuest(10, 0, GameConstants.Pokeball.Masterball);
        meltanQuestLine.addQuest(new MultipleQuestsQuest([meltanObtain10MB],'Step 6 of Let\'s Go, Meltan!'));

        // Multi-step #6:

        const meltanCatch10Magnemite = new CaptureSpecificPokemonQuest('Magnemite', 'Catch or hatch 10 Magnemite.', 10, true, 0, undefined);
        const meltanCatch10Exeggcute = new CaptureSpecificPokemonQuest('Exeggcute', 'Catch or hatch 10 Exeggcute.', 10, true, 0, undefined);
        const meltanDefeatAcerola10 = new DefeatGymQuest(10, 0, 'Elite Acerola');

        meltanQuestLine.addQuest(new MultipleQuestsQuest([
            meltanCatch10Magnemite,
            meltanCatch10Exeggcute,
            meltanDefeatAcerola10,
        ],'Step 7 of Let\'s Go, Meltan!'));

        // Multi-step #7:

        const meltanCatch15Drowzee = new CaptureSpecificPokemonQuest('Drowzee', 'Catch or hatch 15 Drowzee.', 15, true, 0, undefined);
        const meltanCatch15Cubone = new CaptureSpecificPokemonQuest('Cubone', 'Catch or hatch 15 Cubone.', 15, true, 0, undefined);
        const meltanCatch15Scyther = new CaptureSpecificPokemonQuest('Scyther', 'Catch or hatch 15 Scyther.', 15, true, 0, undefined);
        const meltanDefeatKahili10 = new DefeatGymQuest(10, 0, 'Elite Kahili');

        meltanQuestLine.addQuest(new MultipleQuestsQuest([
            meltanCatch15Drowzee,
            meltanCatch15Cubone,
            meltanCatch15Scyther,
            meltanDefeatKahili10,
        ],'Step 8 of Let\'s Go, Meltan!'));

        // Multi-step #8:

        const meltanCatch20Kabuto = new CaptureSpecificPokemonQuest('Kabuto', 'Catch or hatch 20 Kabuto.', 20, true, 0, undefined);
        const meltanCatch20Omanyte = new CaptureSpecificPokemonQuest('Omanyte', 'Catch or hatch 20 Omanyte.', 20, true, 0, undefined); // Praise Lord Helix
        const meltanDig30 = new MineLayersQuest(30, 0);

        meltanQuestLine.addQuest(new MultipleQuestsQuest([
            meltanCatch20Kabuto,
            meltanCatch20Omanyte,
            meltanDig30,
        ],'Step 9 of Let\'s Go, Meltan!'));

        // Multi-step #9:

        const meltanCatch20Anorith = new CaptureSpecificPokemonQuest('Anorith', 'Catch or hatch 20 Anorith.', 20, true, 0, undefined);
        const meltanCatch20Lileep = new CaptureSpecificPokemonQuest('Lileep', 'Catch or hatch 20 Lileep.', 20, true, 0, undefined);
        const meltanCatch20Aerodactyl = new CaptureSpecificPokemonQuest('Aerodactyl', 'Catch or hatch 20 Aerodactyl.', 20, true, 0, undefined);
        const meltanDefeatHau15 = new DefeatGymQuest(15, 0, 'Champion Hau');

        meltanQuestLine.addQuest(new MultipleQuestsQuest([
            meltanCatch20Anorith,
            meltanCatch20Lileep,
            meltanCatch20Aerodactyl,
            meltanDefeatHau15,
        ],'Step 10 of Let\'s Go, Meltan!', () => App.game.quests.getQuestLine('Defeat Rainbow Rocket').beginQuest()));

        // Multi-step #10

        const meltanCatch400Meltan = new CaptureSpecificPokemonQuest('Meltan','Catch 400 Meltan in Alola.', 400, false, 0, undefined);
        const meltanRainbowRocket = new CustomQuest(1, 0, 'Defeat Team Rainbow Leader Giovanni.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Team Rainbow Leader Giovanni')]());

        const meltanGetMelmetal = () => {
            App.game.party.gainPokemonByName('Melmetal');
            Notifier.notify({
                title: meltanQuestLine.name,
                message: 'You found Melmetal!',
                type: NotificationConstants.NotificationOption.success,
                timeout: 3e4,
            });
        };

        meltanQuestLine.addQuest(new MultipleQuestsQuest([
            meltanCatch400Meltan,
            meltanRainbowRocket,
        ],'Let\'s Go, Meltan!',meltanGetMelmetal));

        App.game.quests.questLines().push(meltanQuestLine);

    }

    public static createRainbowRocketQuestLine() {
        const rainbowQuestLine = new QuestLine('Defeat Rainbow Rocket', 'Team Rainbow Rocket has stolen the Meltan research! Defeat them to get it back!', new QuestLineStepCompletedRequirement('Let\'s Go, Meltan!', 9));

        const rainbowGrunts = new CustomQuest(2, 0, 'Defeat the Grunts guarding the Aether Foundation takeover.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Rainbow Rocket Grunt 1')]() + App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Rainbow Rocket Grunt 2')]());
        rainbowQuestLine.addQuest(rainbowGrunts);

        const rainbowFaba = new CustomQuest(1, 0, 'Defeat Aether Branch Chief Faba.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Aether Branch Chief Faba')]());
        rainbowQuestLine.addQuest(rainbowFaba);

        const rainbowArchie = new CustomQuest(1, 0, 'Defeat Team Aqua Leader Archie.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Team Aqua Leader Archie')]());
        const rainbowMaxie = new CustomQuest(1, 0, 'Defeat Team Magma Leader Maxie.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Team Magma Leader Maxie')]());

        rainbowQuestLine.addQuest(new MultipleQuestsQuest([
            rainbowArchie,
            rainbowMaxie,
        ],'Defeat Archie and Maxie.'));

        const rainbowCyrus = new CustomQuest(1, 0, 'Defeat Team Galactic Leader Cyrus.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Team Galactic Leader Cyrus')]());
        rainbowQuestLine.addQuest(rainbowCyrus);

        const rainbowLysandre = new CustomQuest(1, 0, 'Defeat Team Flare Leader Lysandre.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Team Flare Leader Lysandre')]());
        rainbowQuestLine.addQuest(rainbowLysandre);

        const rainbowGhetsis = new CustomQuest(1, 0, 'Defeat Team Plasma Leader Ghetsis.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Team Plasma Leader Ghetsis')]());
        rainbowQuestLine.addQuest(rainbowGhetsis);

        const rainbowGiovanni = new CustomQuest(1, 0, 'Defeat Team Rainbow Leader Giovanni.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Team Rainbow Leader Giovanni')]());
        rainbowQuestLine.addQuest(rainbowGiovanni);

        App.game.quests.questLines().push(rainbowQuestLine);

    }

    public static createMagikarpJumpQuestLine() {
        const magikarpJumpQuestLine = new QuestLine('Magikarp Jump', 'Go to Hoppy Town and share their love for Magikarp.', new GymBadgeRequirement(BadgeEnums.Elite_AlolaChampion), GameConstants.BulletinBoards.Alola);

        const talkToMayor = new TalkToNPCQuest(MayorKarp, 'Use the subregion travel to talk to Mayor Karp in Hoppy Town.');
        magikarpJumpQuestLine.addQuest(talkToMayor);

        App.game.quests.questLines().push(magikarpJumpQuestLine);
    }

    // Galar QuestLines
    // Started by defeating both Stow-on-Side gyms.
    public static createDarkestDayQuestLine() {
        const darkestDayQuestLine = new QuestLine('The Darkest Day', 'Stop the return of the Darkest Day!');

        const talkToMural1 = new TalkToNPCQuest(AncientMural1, 'Check out Stow-on-Side\'s mural.');
        darkestDayQuestLine.addQuest(talkToMural1); // 0

        const clearBede3 = new CustomQuest(1, 0, 'Stop Bede from destroying the mural!', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Bede 3')]());
        darkestDayQuestLine.addQuest(clearBede3);

        const talkToMural2 = new TalkToNPCQuest(AncientMural2, '');
        const talkToSonia1 = new TalkToNPCQuest(StowonSideSonia, 'Talk to Sonia.');
        darkestDayQuestLine.addQuest(new MultipleQuestsQuest(
            [
                talkToMural2,
                talkToSonia1,
            ], 'The mural was destroyed! See what you can learn by inspecting the ruins and speaking to the bystander.')); // Step 2

        const clearHop6 = new CustomQuest(1, 0, 'Defeat the next gym and catch up with Hop.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Hop 6')]());
        darkestDayQuestLine.addQuest(clearHop6);

        const clearHop7 = new CustomQuest(1, 0, 'Continue your Gym Challenge and have a battle with Hop in Circhester.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Hop 7')]());
        darkestDayQuestLine.addQuest(clearHop7);

        const talkToBath = new TalkToNPCQuest(HerosBath, '');
        const talkToHop1 = new TalkToNPCQuest(CirchesterHop, 'Talk to Hop.');
        const talkToSonia2 = new TalkToNPCQuest(CirchesterSonia, 'Talk to Sonia.');
        darkestDayQuestLine.addQuest(new MultipleQuestsQuest(
            [
                talkToBath,
                talkToHop1,
                talkToSonia2,
            ], 'Learn more about the heroes who stopped The Darkest Day.')); // Step 5

        const clearHammerlockeGym = new CustomQuest(1, 0, 'Continue your Gym Challenge and gain entry to the Champion Cup.', () => App.game.statistics.gymsDefeated[GameConstants.getGymIndex('Hammerlocke')]());
        darkestDayQuestLine.addQuest(clearHammerlockeGym);

        const clearTrainerMarnie = new CustomQuest(1, 0, 'Defeat Marnie at Wyndon Stadium to reach the quarter-finals of the Champion Cup.', () => App.game.statistics.gymsDefeated[GameConstants.getGymIndex('Elite Trainer Marnie')]());
        darkestDayQuestLine.addQuest(clearTrainerMarnie);

        const clearGymLeaderBede = new CustomQuest(1, 0, 'Defeat Bede to reach the semi-finals of the Champion Cup.', () => App.game.statistics.gymsDefeated[GameConstants.getGymIndex('Elite Gym Leader Bede')]());
        darkestDayQuestLine.addQuest(clearGymLeaderBede);

        const clearTrainerHop = new CustomQuest(1, 0, 'Defeat Hop to reach the final of the Champion Cup!', () => App.game.statistics.gymsDefeated[GameConstants.getGymIndex('Elite Trainer Hop')]());
        darkestDayQuestLine.addQuest(clearTrainerHop);

        const clearRoseTower = new CustomQuest(1, 0, 'Champion Leon was seen heading to Rose Tower. Ascend Rose Tower so you can find him.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Rose Tower')]());
        darkestDayQuestLine.addQuest(clearRoseTower);

        const talktoRoseBroadcast = new TalkToNPCQuest(RoseBroadcast, 'The Championship Match is about to start, but Chairman Rose is broadcasting something to the Stadium? Listen to the broadcast.');
        darkestDayQuestLine.addQuest(talktoRoseBroadcast);

        const talktoHop2 = new TalkToNPCQuest(WyndonHop, 'Talk to Hop in Wyndon Stadium.');
        darkestDayQuestLine.addQuest(talktoHop2);

        const clearSlumberingWeald = new CustomQuest(1, 0, 'Chairman Rose has interrupted your fight with Leon and brought about the Darkest Day. Clear Slumbering Weald Shrine.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Slumbering Weald Shrine')]());
        darkestDayQuestLine.addQuest(clearSlumberingWeald);

        const talktoHop3 = new TalkToNPCQuest(SlumberingHop1, 'Talk to Hop in Slumbering Weald Shrine.');
        darkestDayQuestLine.addQuest(talktoHop3);

        const clearEnergyPlant = new CustomQuest(1, 0, 'Unfortunately, all you found at the Slumbering Weald was a rusty sword and shield. Go to the Energy Plant in Hammerlocke to put an end to Chairman Rose\'s plans!', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Energy Plant')]());
        darkestDayQuestLine.addQuest(clearEnergyPlant);

        const talktoRose = new TalkToNPCQuest(EnergyPlantRose, 'Talk to Chairman Rose in Energy Plant');
        darkestDayQuestLine.addQuest(talktoRose);

        const clearEternatus = new CustomQuest(1, 0, 'Leon failed to capture Eternatus. Defeat it before it can cause any more damage!', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Eternatus')]());
        darkestDayQuestLine.addQuest(clearEternatus);

        const TheDarkestDayReward = () => {
            App.game.pokeballs.gainPokeballs(GameConstants.Pokeball.Masterball, 1, false);
            Notifier.notify({
                title: darkestDayQuestLine.name,
                message: 'You found a Master Ball!',
                type: NotificationConstants.NotificationOption.success,
                timeout: 3e4,
            });
        };

        const clearTheDarkestDay = new CustomQuest(1, TheDarkestDayReward, 'Eternatus has ascended to its Eternamax form! Catch it to put an end to the Darkest Day!', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('The Darkest Day')]());
        darkestDayQuestLine.addQuest(clearTheDarkestDay);

        const talktoLeon = new TalkToNPCQuest(Leon, 'After all those interruptions, it\'s finally time for the Championship match! Talk to Leon at Wyndon Stadium.');
        darkestDayQuestLine.addQuest(talktoLeon);

        const clearLeon = new CustomQuest(1, 0, 'Defeat Leon to become the Champion of Galar!', () => App.game.statistics.gymsDefeated[GameConstants.getGymIndex('Champion Leon')]());
        darkestDayQuestLine.addQuest(clearLeon);

        App.game.quests.questLines().push(darkestDayQuestLine);
    }

    public static createSwordShieldQuestLine() {
        const swordShieldQuestLine = new QuestLine('Sword and Shield', 'Stop the weapons from making a mess.', new GymBadgeRequirement(BadgeEnums.Elite_GalarChampion), GameConstants.BulletinBoards.Galar);

        const talktoHop4 = new TalkToNPCQuest(SlumberingHop2, 'Talk to Hop in the Slumbering Weald.');
        swordShieldQuestLine.addQuest(talktoHop4);

        const clearHop8 = new CustomQuest(1, 0, 'Hop wants to fight you one more time at Slumbering Weald Shrine.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Hop 8')]());
        swordShieldQuestLine.addQuest(clearHop8);

        const talktoSordwardShielbert1 = new TalkToNPCQuest(SordwardShielbert1, 'Talk to Sordward & Shielbert in the Slumbering Weald.');
        swordShieldQuestLine.addQuest(talktoSordwardShielbert1);

        const clearSordward1 = new CustomQuest(1, 0, 'Defeat Sordward.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Sordward 1')]());
        const clearShielbert1 = new CustomQuest(1, 0, 'Defeat Shielbert.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Shielbert 1')]());
        swordShieldQuestLine.addQuest(new MultipleQuestsQuest(
            [
                clearSordward1,
                clearShielbert1,
            ], 'A pair with weird hair has taken the Rusted Sword and Rusted Shield. Defeat them to take them back.'));

        const clearRampagingTsareena = new CustomQuest(1, 0, 'Sordward and Shielbert are forcing Pokémon to rampage in Galar\'s Stadiums. First is a Tsareena in Turffield Stadium. Defeat it.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Rampaging Tsareena')]());
        swordShieldQuestLine.addQuest(clearRampagingTsareena);

        const clearRampagingGyarados = new CustomQuest(1, 0, 'Sordward and Shielbert have forced a Gyarados to rampage in Hulbury Stadium. Defeat it as well.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Rampaging Gyarados')]());
        swordShieldQuestLine.addQuest(clearRampagingGyarados);

        const clearRampagingTorkoal = new CustomQuest(1, 0, 'Sordward and Shielbert have forced a Torkoal to rampage in Motostoke Stadium. Defeat it as well.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Rampaging Torkoal')]());
        swordShieldQuestLine.addQuest(clearRampagingTorkoal);

        const talktoSordwardShielbert2 = new TalkToNPCQuest(SordwardShielbert2, 'Talk to Sordward & Shielbert in Wedgehurst.');
        swordShieldQuestLine.addQuest(talktoSordwardShielbert2);

        const clearSordwardandShielbert = new CustomQuest(1, 0, 'Sordward and Shielbert are trying to steal the Wishing Stars at Professor Magnolia\'s Lab in Wedgehurst. Stop them.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Sordward & Shielbert')]());
        swordShieldQuestLine.addQuest(clearSordwardandShielbert);

        const clearRampagingConkeldurr = new CustomQuest(1, 0, 'Defeat Conkeldurr.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Rampaging Conkeldurr')]());
        const clearRampagingDusknoir = new CustomQuest(1, 0, 'Defeat Dusknoir.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Rampaging Dusknoir')]());
        swordShieldQuestLine.addQuest(new MultipleQuestsQuest(
            [
                clearRampagingConkeldurr,
                clearRampagingDusknoir,
            ], 'Sordward and Shielbert have forced a Conkeldurr and a Dusknoir to rampage in Stow-on-Side Stadium. Defeat them both.'));

        const clearGymLeaderBede2 = new CustomQuest(1, 0, 'There were rampaging Pokémon at Ballonlea Stadium, but Bede already defeated them. There are no more rampaging Pokémon for now, and he wants to battle.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Gym Leader Bede')]());
        swordShieldQuestLine.addQuest(clearGymLeaderBede2);

        const clearRampagingGigalith = new CustomQuest(1, 0, 'Defeat Gigalith.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Rampaging Gigalith')]());
        const clearRampagingFroslass = new CustomQuest(1, 0, 'Defeat Froslass.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Rampaging Froslass')]());
        swordShieldQuestLine.addQuest(new MultipleQuestsQuest(
            [
                clearRampagingGigalith,
                clearRampagingFroslass,
            ], 'Sordward and Shielbert have forced a Gigalith and a Froslass to rampage in Circhester Stadium. Defeat them both'));

        const clearGymLeaderMarnie = new CustomQuest(1, 0, 'There are no more rampaging Pokémon for now and Marnie wants to battle you in Spikemuth.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Gym Leader Marnie')]());
        swordShieldQuestLine.addQuest(clearGymLeaderMarnie);

        const clearRampagingHaxorus = new CustomQuest(1, 0, 'Sordward and Shielbert have forced a Haxorus to rampage in Hammerlocke Stadium. Hopefully this is the last one.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Rampaging Haxorus')]());
        swordShieldQuestLine.addQuest(clearRampagingHaxorus);

        const talktoSordwardShielbert3 = new TalkToNPCQuest(SordwardShielbert3, 'Talk to Sordward & Shielbert in the Energy Plant.');
        swordShieldQuestLine.addQuest(talktoSordwardShielbert3);

        const clearSordward2 = new CustomQuest(1, 0, 'Defeat Sordward.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Sordward 2')]());
        const clearShielbert2 = new CustomQuest(1, 0, 'Defeat Shielbert.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Shielbert 2')]());
        swordShieldQuestLine.addQuest(new MultipleQuestsQuest(
            [
                clearSordward2,
                clearShielbert2,
            ], 'Sordward and Shielbert are trying to use the Rusted Sword and Shield to make Zacian and Zamazenta go on a rampage in Energy Plant. Stop them.'));

        const talktoSordwardShielbert4 = new TalkToNPCQuest(SordwardShielbert4, 'Talk to Sordward & Shielbert in the Energy Plant.');
        swordShieldQuestLine.addQuest(talktoSordwardShielbert4);

        const clearRampagingZacian = new CustomQuest(1, 0, 'Defeat Zacian.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Rampaging Zacian')]());
        const clearRampagingZamazenta = new CustomQuest(1, 0, 'Defeat Zamazenta.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Rampaging Zamazenta')]());
        swordShieldQuestLine.addQuest(new MultipleQuestsQuest(
            [
                clearRampagingZacian,
                clearRampagingZamazenta,
            ], 'Zacian and Zamazenta are rampaging in Energy Plant. Defeat them!'));

        const talktoPiers = new TalkToNPCQuest(Piers, 'Talk to Piers in the Energy Plant.');
        swordShieldQuestLine.addQuest(talktoPiers);

        const catchZacian = new CustomQuest(1, 0, 'Catch Zacian.', () => App.game.statistics.pokemonCaptured[pokemonMap['Zacian (Battle Hero)'].id](), 0);
        const catchZamazenta = new CustomQuest(1, 0, 'Catch Zamazenta.', () => App.game.statistics.pokemonCaptured[pokemonMap['Zamazenta (Battle Hero)'].id](), 0);
        swordShieldQuestLine.addQuest(new MultipleQuestsQuest(
            [
                catchZacian,
                catchZamazenta,
            ], 'Now that they have calmed down, Zacian and Zamazenta seem to be willing to let you try to catch them!'));

        App.game.quests.questLines().push(swordShieldQuestLine);
    }

    public static createDojoArmorQuestLine() {
        const dojoArmorQuestLine = new QuestLine('The Dojo\'s Armor', 'Obtain the Secret Armor of the Master Dojo.', new GymBadgeRequirement(BadgeEnums.Elite_GalarChampion), GameConstants.BulletinBoards.Armor);

        const talktoMustard1 = new TalkToNPCQuest(Mustard1, 'Talk to Mustard at the Master Dojo.');
        dojoArmorQuestLine.addQuest(talktoMustard1);

        const clearMustard = new CustomQuest(1, 0, 'Mustard wants to test your ability at the Master Dojo. Defeat him.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Mustard')]());
        dojoArmorQuestLine.addQuest(clearMustard);

        const talktoMustard2 = new TalkToNPCQuest(Mustard2, 'Talk to Mustard at the Master Dojo.');
        dojoArmorQuestLine.addQuest(talktoMustard2);

        const catch6GalarianSlowpoke = new CaptureSpecificPokemonQuest('Galarian Slowpoke', 'Catch 6 Galarian Slowpoke.', 6, false, 0, undefined);
        dojoArmorQuestLine.addQuest(catch6GalarianSlowpoke);

        const talktoMustard3 = new TalkToNPCQuest(Mustard3, 'Talk to Mustard at the Master Dojo.');
        dojoArmorQuestLine.addQuest(talktoMustard3);

        const talktoMustard4 = new TalkToNPCQuest(Mustard4, 'It seems Mustard still wants to talk to you? Talk to Mustard again at the Master Dojo.');
        dojoArmorQuestLine.addQuest(talktoMustard4);

        const talktoKlara1 = new TalkToNPCQuest(Klara1, 'Talk to Klara.');
        const talktoAvery1 = new TalkToNPCQuest(Avery1, 'Talk to Avery.');
        dojoArmorQuestLine.addQuest(new MultipleQuestsQuest(
            [
                talktoKlara1,
                talktoAvery1,
            ], 'Talk to Klara and Avery in Warm-Up Tunnel.'));

        const clearKlara2 = new CustomQuest(1, 0, 'Defeat Klara.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Klara 2')]());
        const clearAvery2 = new CustomQuest(1, 0, 'Defeat Avery.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Avery 2')]());
        dojoArmorQuestLine.addQuest(new MultipleQuestsQuest(
            [
                clearKlara2,
                clearAvery2,
            ], 'You, Klara and Avery have happened upon the same Max Mushroom in Warm-Up Tunnel. Defeat them both to win it.'));

        const talktoMustard5 = new TalkToNPCQuest(Mustard5, 'Talk to Mustard at the Master Dojo.');
        dojoArmorQuestLine.addQuest(talktoMustard5);

        const talktoKlara2 = new TalkToNPCQuest(Klara2, 'Talk to Klara.');
        const talktoAvery2 = new TalkToNPCQuest(Avery2, 'Talk to Avery.');
        dojoArmorQuestLine.addQuest(new MultipleQuestsQuest(
            [
                talktoKlara2,
                talktoAvery2,
            ], 'Talk to Klara and Avery in the Master Dojo.'));

        const clearKlara3 = new CustomQuest(1, 0, 'Defeat Klara.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Klara 3')]());
        const clearAvery3 = new CustomQuest(1, 0, 'Defeat Avery', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Avery 3')]());
        dojoArmorQuestLine.addQuest(new MultipleQuestsQuest(
            [
                clearKlara3,
                clearAvery3,
            ], 'For the final trial, you must defeat both Klara and Avery on the Master Dojo Battle Court.'));

        const talktoMustard6 = new TalkToNPCQuest(Mustard6, 'Talk to Mustard at the Master Dojo.');
        dojoArmorQuestLine.addQuest(talktoMustard6);

        const catchKubfu = new CaptureSpecificPokemonQuest('Kubfu', 'Catch Kubfu', 1, false, 0, undefined);
        dojoArmorQuestLine.addQuest(catchKubfu);

        const talktoMustard7 = new TalkToNPCQuest(Mustard7, 'Talk to Mustard at the Master Dojo.');
        dojoArmorQuestLine.addQuest(talktoMustard7);

        const defeatDark = new CustomQuest(500, 0, 'Defeat 500 Dark-type Pokémon.', () => {
            return pokemonMap.filter(p => p.type.includes(PokemonType.Dark)).map(p => App.game.statistics.pokemonDefeated[p.id]()).reduce((a,b) => a + b, 0);
        });
        const defeatWater = new CustomQuest(500, 0, 'Defeat 500 Water-type Pokémon.', () => {
            return pokemonMap.filter(p => p.type.includes(PokemonType.Water)).map(p => App.game.statistics.pokemonDefeated[p.id]()).reduce((a,b) => a + b, 0);
        });
        dojoArmorQuestLine.addQuest(new MultipleQuestsQuest(
            [
                defeatDark,
                defeatWater,
            ], 'Train Kubfu by defeating Dark and Water-type Pokémon.'));

        const talktoMustard8 = new TalkToNPCQuest(Mustard8, 'Talk to Mustard at the Master Dojo.');
        dojoArmorQuestLine.addQuest(talktoMustard8);

        const catchDark = new CustomQuest(250, 0, 'Capture or hatch 250 Dark-type Pokémon.', () => {
            return pokemonMap.filter(p => p.type.includes(PokemonType.Dark)).map(p => App.game.statistics.pokemonCaptured[p.id]()).reduce((a,b) => a + b, 0);
        });
        const catchWater = new CustomQuest(250, 0, 'Capture or hatch 250 Water-type Pokémon.', () => {
            return pokemonMap.filter(p => p.type.includes(PokemonType.Water)).map(p => App.game.statistics.pokemonCaptured[p.id]()).reduce((a,b) => a + b, 0);
        });
        dojoArmorQuestLine.addQuest(new MultipleQuestsQuest(
            [
                catchDark,
                catchWater,
            ], 'Train Kubfu more by catching or hatching Dark and Water-type Pokémon.'));

        const talktoMustard9 = new TalkToNPCQuest(Mustard9, 'Talk to Mustard at the Master Dojo.');
        dojoArmorQuestLine.addQuest(talktoMustard9);

        const clearTowerofDarkness = new CustomQuest(1, 0, 'Defeat Tower of Darkness.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Tower of Darkness')]());
        const clearTowerofWaters = new CustomQuest(1, 0, 'Defeat Tower of Waters', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Tower of Waters')]());
        dojoArmorQuestLine.addQuest(new MultipleQuestsQuest(
            [
                clearTowerofDarkness,
                clearTowerofWaters,
            ], 'Complete Kubfu\'s training in the Tower of Darkness and the Tower of Waters so it can evolve!'));

        const talktoMustard10 = new TalkToNPCQuest(Mustard10, 'Talk to Mustard at one of the Towers of Two Fists.');
        dojoArmorQuestLine.addQuest(talktoMustard10);

        App.game.quests.questLines().push(dojoArmorQuestLine);
    }

    public static createJungleSecretsQuestLine() {
        const jungleSecretsQuestLine = new QuestLine('Secrets of the Jungle', 'Discover the secrets of the jungle.', new TemporaryBattleRequirement('Ash Ketchum Alola'), GameConstants.BulletinBoards.Armor);

        const talktoJungleAsh1 = new TalkToNPCQuest(JungleAsh1, 'Ash Ketchum wants to talk to you at the Master Dojo.');
        jungleSecretsQuestLine.addQuest(talktoJungleAsh1);

        const talktoJungleKoko1 = new TalkToNPCQuest(JungleKoko1, 'Talk to Ash Ketchum\'s friend, Koko, in Glimwood Tangle.');
        jungleSecretsQuestLine.addQuest(talktoJungleKoko1);

        const catchZarude = new CaptureSpecificPokemonQuest('Zarude', 'Catch the missing Zarude roaming around the Isle of Armor.', 1, false, 0, undefined);
        jungleSecretsQuestLine.addQuest(catchZarude);

        const talktoJungleKoko2 = new TalkToNPCQuest(JungleKoko2, 'Take Zarude back to Koko in Glimwood Tangle.');
        jungleSecretsQuestLine.addQuest(talktoJungleKoko2);

        const clearZarudeTribe1 = new CustomQuest(1, 0, 'A group of Zarude are attacking you. Defeat them.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Zarude Tribe 1')]());
        jungleSecretsQuestLine.addQuest(clearZarudeTribe1);

        const talktoJungleKoko3 = new TalkToNPCQuest(JungleKoko3, 'Talk to Koko in Glimwood Tangle.');
        jungleSecretsQuestLine.addQuest(talktoJungleKoko3);

        const clearZarudeTribes = new CustomQuest(2, 0, 'Another two groups of Zarude are attacking you. Defeat them as well.', () =>
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Zarude Tribe 2')]() +
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Zarude Tribe 3')]()
        );
        jungleSecretsQuestLine.addQuest(clearZarudeTribes);

        const talktoJungleKoko4 = new TalkToNPCQuest(JungleKoko4, 'Talk to Koko in Glimwood Tangle.');
        jungleSecretsQuestLine.addQuest(talktoJungleKoko4);

        const talktoJungleAsh2 = new TalkToNPCQuest(JungleAsh2, 'Talk to Ash Ketchum at the Master Dojo.');
        jungleSecretsQuestLine.addQuest(talktoJungleAsh2);

        const clearGalarAsh = new CustomQuest(1, 0, 'Defeat Ash Ketchum outside the Master Dojo.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Ash Ketchum Galar')]());
        jungleSecretsQuestLine.addQuest(clearGalarAsh);

        const talktoJungleKoko5 = new TalkToNPCQuest(JungleKoko5, 'Talk to Koko in Glimwood Tangle.');
        jungleSecretsQuestLine.addQuest(talktoJungleKoko5);

        const clearZarudeDada = new CustomQuest(1, 0, 'A final Zarude wants to challenge you. Defeat Zarude (Dada).', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Zarude (Dada)')]());
        jungleSecretsQuestLine.addQuest(clearZarudeDada);

        const talktoJungleAsh3 = new TalkToNPCQuest(JungleAsh3, 'Talk to Ash Ketchum in Glimwood Tangle.');
        jungleSecretsQuestLine.addQuest(talktoJungleAsh3);

        const catchFloweringCelebi = new CaptureSpecificPokemonQuest('Flowering Celebi', 'Play with Flowering Celebi.', 1, false, 0, undefined);
        jungleSecretsQuestLine.addQuest(catchFloweringCelebi);

        const talktoJungleKoko6 = new TalkToNPCQuest(JungleKoko6, 'Talk to Koko in Glimwood Tangle.');
        jungleSecretsQuestLine.addQuest(talktoJungleKoko6);

        App.game.quests.questLines().push(jungleSecretsQuestLine);
    }

    public static createGalarCrownQuestLine() {
        const galarCrownQuestLine = new QuestLine('The Crown of Galar', 'Help the ancient king of Galar, Calyrex, return to its former glory.', new GymBadgeRequirement(BadgeEnums.Elite_GalarChampion), GameConstants.BulletinBoards.Crown);

        const talktoCrownPeony1 = new TalkToNPCQuest(CrownPeony1, 'Talk to Peony to find out about the ancient king of Galar.');
        galarCrownQuestLine.addQuest(talktoCrownPeony1);

        const clearCalyrex = new CustomQuest(1, 0, 'A mysterious Pokémon has appeared and challenged you to a battle.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Calyrex')]());
        galarCrownQuestLine.addQuest(clearCalyrex);

        const talktoCalyrex1 = new TalkToNPCQuest(Calyrex1, 'The Pokémon you just fought has possessed Peony. Talk to it.');
        galarCrownQuestLine.addQuest(talktoCalyrex1);

        const oldCemetery = new DefeatPokemonsQuest(50, 0, 49, GameConstants.Region.galar, 'Old Cemetery');
        const snowslideSlope = new DefeatPokemonsQuest(50, 0, 54, GameConstants.Region.galar, 'Snowslide Slope');
        galarCrownQuestLine.addQuest(new MultipleQuestsQuest(
            [
                oldCemetery,
                snowslideSlope,
            ], 'Calyrex is going to Old Cemetery and Snowslide Slope to grow a Shaderoot Carrot and an Iceroot Carrot. Protect it from wild Pokémon so it can concentrate.'));

        const talktoCalyrex2 = new TalkToNPCQuest(Calyrex2, 'After growing both carrots, Calyrex has returned to Freezington. Talk to it.');
        galarCrownQuestLine.addQuest(talktoCalyrex2);

        const clearSpectrier = new CustomQuest(1, 0, 'Defeat Spectrier.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Spectrier')]());
        const clearGlastrier = new CustomQuest(1, 0, 'Defeat Glastrier.', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Glastrier')]());
        galarCrownQuestLine.addQuest(new MultipleQuestsQuest(
            [
                clearSpectrier,
                clearGlastrier,
            ], 'Fight Calyrex\'s steeds to get them out of Freezington!'));

        const talktoCalyrex3 = new TalkToNPCQuest(Calyrex3, 'Talk to Calyrex again.');
        galarCrownQuestLine.addQuest(talktoCalyrex3);

        const catchSpectrier = new CaptureSpecificPokemonQuest('Spectrier', 'Catch Spectrier.', 1, false, 0, undefined);
        const catchGlastrier = new CaptureSpecificPokemonQuest('Glastrier', 'Catch Glastrier.', 1, false, 0, undefined);
        galarCrownQuestLine.addQuest(new MultipleQuestsQuest(
            [
                catchSpectrier,
                catchGlastrier,
            ], 'Spectrier and Glastrier are now roaming the Crown Tundra. Catch them when the opportunity arises!'));

        const UnityReward = () => {
            App.game.keyItems.gainKeyItem(KeyItemType.Reins_of_unity, true);
            $('#npcModal').one('hidden.bs.modal', () => {
                KeyItemController.showGainModal(KeyItemType.Reins_of_unity);
            });
        };

        const talktoCalyrex4 = new TalkToNPCQuest(Calyrex4, 'Now that you have captured both of its steeds, talk to Calyrex at the Crown Shrine.', UnityReward);
        galarCrownQuestLine.addQuest(talktoCalyrex4);

        const catchCalyrex = new CaptureSpecificPokemonQuest('Calyrex', 'Now that you have found and caught Glastrier and Spectrier, Calyrex wants to challenge you at Crown Shrine. Catch it!', 1, false, 0, undefined);
        galarCrownQuestLine.addQuest(catchCalyrex);

        const talktoCrownPeony2 = new TalkToNPCQuest(CrownPeony2, 'Now that you have captured Calyrex, go report back to Peony!');
        galarCrownQuestLine.addQuest(talktoCrownPeony2);

        App.game.quests.questLines().push(galarCrownQuestLine);
    }

    public static createDynaTreeBirdsQuestLine() {
        const dynaTreeBirdsQuestLine = new QuestLine('The Birds of the Dyna Tree', 'Find the Legendary birds of the Dyna Tree.', new GymBadgeRequirement(BadgeEnums.Elite_GalarChampion), GameConstants.BulletinBoards.Crown);

        const talktoBirdPeony1 = new TalkToNPCQuest(BirdPeony1, 'Talk to Peony to find out about some legendary bird sightings.');
        dynaTreeBirdsQuestLine.addQuest(talktoBirdPeony1);

        const clearDynaTreeHill = new CustomQuest(1, 0, 'Some unknown bird Pokémon have been sighted near Dyna Tree Hill in Ballimere Lake. Explore the area to see for yourself.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Dyna Tree Hill')]());
        dynaTreeBirdsQuestLine.addQuest(clearDynaTreeHill);

        const clearDynaTreeBirds = new CustomQuest(1, 0, 'You witnessed 3 powerful looking bird pokemon resembling Articuno, Zapdos, and Moltres fighting over the fruit of the Dyna Tree. Upon noticing you, they attack!', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Dyna Tree Birds')]());
        dynaTreeBirdsQuestLine.addQuest(clearDynaTreeBirds);

        const talktoBirdPeony2 = new TalkToNPCQuest(BirdPeony2, 'Tell Peony about your encounter with the birds resembling Articuno, Zapdos, and Moltres.');
        dynaTreeBirdsQuestLine.addQuest(talktoBirdPeony2);

        const chaseGalarianArticuno = new CustomQuest (3, 0, 'Search for Galarian Articuno in the Crown Tundra.', () =>
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Galarian Articuno 1')]() +
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Galarian Articuno 2')]() +
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Galarian Articuno 3')]()
        );
        const chaseGalarianZapdos = new CustomQuest (3, 0, 'Search for Galarian Zapdos in the Wild Area of Southern Galar.', () =>
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Galarian Zapdos 1')]() +
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Galarian Zapdos 2')]() +
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Galarian Zapdos 3')]()
        );
        const chaseGalarianMoltres = new CustomQuest (3, 0, 'Search for Galarian Moltres in the Isle of Armor.', () =>
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Galarian Moltres 1')]() +
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Galarian Moltres 2')]() +
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Galarian Moltres 3')]()
        );
        dynaTreeBirdsQuestLine.addQuest(new MultipleQuestsQuest(
            [
                chaseGalarianArticuno,
                chaseGalarianZapdos,
                chaseGalarianMoltres,
            ], 'Galarian Articuno, Zapdos, and Moltres have fled to the Crown Tundra, Southern Galar, and the Isle of Armor respectively. Search for them.'));

        const talktoBirdPeony3 = new TalkToNPCQuest(BirdPeony3, 'You defeated Galarian Articuno, Zapdos, and Moltres multiple times each. Ask Peony what to do next.');
        dynaTreeBirdsQuestLine.addQuest(talktoBirdPeony3);

        const catchGalarianArticuno = new CaptureSpecificPokemonQuest('Galarian Articuno', 'Catch Galarian Articuno.', 1, false, 0, undefined);
        const catchGalarianZapdos = new CaptureSpecificPokemonQuest('Galarian Zapdos', 'Catch Galarian Zapdos.', 1, false, 0, undefined);
        const catchGalarianMoltres = new CaptureSpecificPokemonQuest('Galarian Moltres', 'Catch Galarian Moltres.', 1, false, 0, undefined);
        dynaTreeBirdsQuestLine.addQuest(new MultipleQuestsQuest(
            [
                catchGalarianArticuno,
                catchGalarianZapdos,
                catchGalarianMoltres,
            ], 'Galarian Articuno, Zapdos, and Moltres are now roaming in the Crown Tundra, Southern Galar, and the Isle of Armor respectively. Catch them when the opportunity arises!'));

        const talktoBirdPeony4 = new TalkToNPCQuest(BirdPeony4, 'Now that you have captured Galarian Articuno, Zapdos, and Moltres, go report back to Peony!');
        dynaTreeBirdsQuestLine.addQuest(talktoBirdPeony4);

        App.game.quests.questLines().push(dynaTreeBirdsQuestLine);
    }

    public static createAncientGolemsQuestLine() {
        const ancientGolemsQuestLine = new QuestLine('The Ancient Golems', 'Discover the ancient Golems in the ruins of the Crown Tundra.', new GymBadgeRequirement(BadgeEnums.Elite_GalarChampion), GameConstants.BulletinBoards.Crown);

        const talktoGolemPeony1 = new TalkToNPCQuest(GolemPeony1, 'Talk to Peony to find out about some ancient ruins.');
        ancientGolemsQuestLine.addQuest(talktoGolemPeony1);

        const threePointPass = new DefeatPokemonsQuest(100, 0, 52, GameConstants.Region.galar, 'Peony told you of a peculiar ruin located at Three-Point Pass. Explore the area to find it.');
        ancientGolemsQuestLine.addQuest(threePointPass);

        const talktoGolemPeony2 = new TalkToNPCQuest(GolemPeony2, 'The ruins were locked, go report back to Peony.');
        ancientGolemsQuestLine.addQuest(talktoGolemPeony2);

        const clearRockPeakRuins = new CustomQuest(10, 0, 'Clear Rock Peak Ruins 10 times.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Rock Peak Ruins')]());
        const clearIcebergRuins = new CustomQuest(10, 0, 'Clear Iceberg Ruins 10 times.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Iceberg Ruins')]());
        const clearIronRuins = new CustomQuest(10, 0, 'Clear Iron Ruins 10 times.', () => App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Iron Ruins')]());
        ancientGolemsQuestLine.addQuest(new MultipleQuestsQuest(
            [
                clearRockPeakRuins,
                clearIcebergRuins,
                clearIronRuins,
            ], 'Clear Rock Peak Ruins, Iceberg Ruins, and Iron Ruins 10 times each.'));

        const talktoGolemPeony3 = new TalkToNPCQuest(GolemPeony3, 'The ruins are still locked, report to Peony.');
        ancientGolemsQuestLine.addQuest(talktoGolemPeony3);

        const catchRegirock = new CaptureSpecificPokemonQuest('Regirock', 'Catch Regirock.', 1, false, 0, undefined);
        const catchRegice = new CaptureSpecificPokemonQuest('Regice', 'Catch Regice.', 1, false, 0, undefined);
        const catchRegisteel = new CaptureSpecificPokemonQuest('Registeel', 'Catch Registeel.', 1, false, 0, undefined);
        ancientGolemsQuestLine.addQuest(new MultipleQuestsQuest(
            [
                catchRegirock,
                catchRegice,
                catchRegisteel,
            ], 'Catch Regirock, Regice, and Registeel in the Rock Peak Ruins, Iceberg Ruins, and Iron Ruins respectively.'));

        const talktoGolemPeony4 = new TalkToNPCQuest(GolemPeony4, 'You have captured Regirock, Regice, and Registeel, now go report back to Peony.');
        ancientGolemsQuestLine.addQuest(talktoGolemPeony4);

        const clearRegigigas = new CustomQuest(1, 0, 'Defeat Regigigas at Giant\'s Bed!', () => App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Regigigas')]());
        const catchRegigigas = new CaptureSpecificPokemonQuest('Regigigas', 'Catch Regigigas.', 1, false, 0, undefined);
        ancientGolemsQuestLine.addQuest(new MultipleQuestsQuest(
            [
                clearRegigigas,
                catchRegigigas,
            ], 'After you caught three of the legendary golems it created, Regigigas appeared in Giant\'s Bed. Defeat and catch it!'));

        const talktoGolemPeony5 = new TalkToNPCQuest(GolemPeony5, 'You have captured Regigigas, now go report back to Peony.');
        ancientGolemsQuestLine.addQuest(talktoGolemPeony5);

        const catchRegieleki = new CaptureSpecificPokemonQuest('Regieleki', 'Catch Regieleki.', 1, false, 0, undefined);
        const catchRegidrago = new CaptureSpecificPokemonQuest('Regidrago', 'Catch Regidrago.', 1, false, 0, undefined);
        ancientGolemsQuestLine.addQuest(new MultipleQuestsQuest(
            [
                catchRegieleki,
                catchRegidrago,
            ], 'Now that it has finally unlocked, catch Regieleki and Regidrago in the Split-Decision Ruins!'));

        const talktoGolemPeony6 = new TalkToNPCQuest(GolemPeony6, 'You finally captured Regieleki and Regidrago. Go report back to Peony!');
        ancientGolemsQuestLine.addQuest(talktoGolemPeony6);

        App.game.quests.questLines().push(ancientGolemsQuestLine);
    }

    public static createOriginalColorMagearnaQuestLine() {
        const magearnaQuestLine = new QuestLine('A Mystery Gift', 'You have recieved a Mystery Gift.',
            new MultiRequirement([
                new CaughtUniqueShinyPokemonsByRegionRequirement(GameConstants.Region.kanto),
                new CaughtUniqueShinyPokemonsByRegionRequirement(GameConstants.Region.johto),
                new CaughtUniqueShinyPokemonsByRegionRequirement(GameConstants.Region.hoenn),
                new CaughtUniqueShinyPokemonsByRegionRequirement(GameConstants.Region.sinnoh),
                new CaughtUniqueShinyPokemonsByRegionRequirement(GameConstants.Region.unova),
                new CaughtUniqueShinyPokemonsByRegionRequirement(GameConstants.Region.kalos),
                new CaughtUniqueShinyPokemonsByRegionRequirement(GameConstants.Region.alola),
                new CaughtUniqueShinyPokemonsByRegionRequirement(GameConstants.Region.galar),
            ]), GameConstants.BulletinBoards.Galar);

        const mysteryGift = new TalkToNPCQuest(MagearnaMysteryGift, 'Go home and open your Mystery Gift', () => {
            App.game.party.gainPokemonByName('Magearna (Original Color)');
            Notifier.notify({
                title: magearnaQuestLine.name,
                message: 'You obtained Magearna (Original Color)!',
                type: NotificationConstants.NotificationOption.success,
                timeout: 3e4,
            });
        });
        magearnaQuestLine.addQuest(mysteryGift);

        App.game.quests.questLines().push(magearnaQuestLine);
    }

    public static createHisuiForcesQuestLine() {
        const hisuiForcesQuestLine = new QuestLine('Incarnate Forces of Hisui', 'Cogita would like you to catch the Forces of Nature.', new DevelopmentRequirement(), GameConstants.BulletinBoards.Hisui);

        const talktoForcesCogita1 = new TalkToNPCQuest(ForcesCogita1, 'Speak to Cogita in Galaxy Hall.');
        hisuiForcesQuestLine.addQuest(talktoForcesCogita1);

        const chaseTornadus = new CustomQuest (3, 0, 'Pursue Tornadus in the Alabaster Icelands.', () =>
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Tornadus 1')]() +
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Tornadus 2')]() +
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Tornadus 3')]()
        );
        const captureTornadus = new CaptureSpecificPokemonQuest('Tornadus', 'Catch Tornadus in the Alabaster Icelands', 1, true, 0, undefined);
        const chaseThundurus = new CustomQuest (3, 0, 'Pursue Thundurus in the Cobalt Coastlands.', () =>
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Thundurus 1')]() +
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Thundurus 2')]() +
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Thundurus 3')]()
        );
        const captureThundurus = new CaptureSpecificPokemonQuest('Thundurus', 'Catch Thundurus in the Cobalt Coastlands', 1, true, 0, undefined);
        const chaseLandorus = new CustomQuest (3, 0, 'Pursue Landorus in the Obsidian Fieldlands.', () =>
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Landorus 1')]() +
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Landorus 2')]() +
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Landorus 3')]()
        );
        const captureLandorus = new CaptureSpecificPokemonQuest('Landorus', 'Catch Landorus in the Obsidian Fieldlands', 1, true, 0, undefined);
        hisuiForcesQuestLine.addQuest(new MultipleQuestsQuest(
            [
                chaseTornadus,
                captureTornadus,
                chaseThundurus,
                captureThundurus,
                chaseLandorus,
                captureLandorus,
            ], 'Tornadus, Thundurus and Landorus have been sighted in the Alabaster Icelands, Cobalt Coastlands and Obsidian Fieldland respectively. Pursue and capture them.'));

        const talktoForcesCogita2 = new TalkToNPCQuest(ForcesCogita2, 'Speak to Cogita at Ancient Retreat.');
        hisuiForcesQuestLine.addQuest(talktoForcesCogita2);

        const chaseEnamorus = new CustomQuest (3, 0, 'Pursue Enamorus in the Crimson Mirelands.', () =>
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Enamorus 1')]() +
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Enamorus 2')]() +
            App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex('Enamorus 3')]()
        );
        hisuiForcesQuestLine.addQuest(chaseEnamorus);

        const captureEnamorus = new CaptureSpecificPokemonQuest('Enamorus', 'Catch Enamorus roaming around Hisui.', 1, true, 0, undefined);
        hisuiForcesQuestLine.addQuest(captureEnamorus);

        const talktoForcesCogita3 = new TalkToNPCQuest(ForcesCogita3, 'Speak to Cogita at Ancient Retreat.');
        hisuiForcesQuestLine.addQuest(talktoForcesCogita3);

        App.game.quests.questLines().push(hisuiForcesQuestLine);
    }

    // Event QuestLines
    // Open the game between April 8-29.
    public static createFindSurpriseTogepiForEasterQuestLine() {
        const findSurpriseTogepiForEasterQuestLine = new QuestLine('Togepi Egg Hunt', 'A strange Togepi has been spotted, but cannot be found!');

        const surpriseTogepi = pokemonMap['Surprise Togepi'];

        const togepiInKantoSetup = () => {
            dungeonList['Viridian Forest'].bossList.push(new DungeonTrainer('Egg Hunter', [new GymPokemon('Surprise Togepi', 300000, 100)], { weight: 1, requirement: new GymBadgeRequirement(BadgeEnums.Elite_KantoChampion) }));
            App.game.statistics.pokemonDefeated[surpriseTogepi.id](0);
        };
        const afterDefeatingTogepiInKanto = () => {
            Notifier.notify({
                title: findSurpriseTogepiForEasterQuestLine.name,
                message: 'Seems like this was just an Easter egg after all...',
                image: `assets/images/profile/trainer-${App.game.profile.trainer() || 0}.png`,
                type: NotificationConstants.NotificationOption.info,
                timeout: 3e4,
            });

            dungeonList['Viridian Forest'].bossList = dungeonList['Viridian Forest'].bossList.filter(boss => boss.name != 'Egg Hunter');
        };
        const defeatTogepiInKanto = new CustomQuest(1, afterDefeatingTogepiInKanto, 'A strange Togepi has been seen around Kanto. Go look for it! Maybe Erika knows more.', App.game.statistics.pokemonDefeated[surpriseTogepi.id], 0, togepiInKantoSetup);
        findSurpriseTogepiForEasterQuestLine.addQuest(defeatTogepiInKanto);

        const togepiInJohtoSetup = () => {
            dungeonList['Ilex Forest'].bossList.push(new DungeonTrainer('Egg Hunter', [new GymPokemon('Surprise Togepi', 900000, 100)], { weight: 1, requirement: new GymBadgeRequirement(BadgeEnums.Elite_JohtoChampion) }));
        };
        const afterDefeatingTogepiInJohto = () => {
            Notifier.notify({
                title: findSurpriseTogepiForEasterQuestLine.name,
                message: 'I swear that was a Togepi... well, maybe not.',
                image: `assets/images/profile/trainer-${App.game.profile.trainer() || 0}.png`,
                type: NotificationConstants.NotificationOption.info,
                timeout: 3e4,
            });
            dungeonList['Ilex Forest'].bossList = dungeonList['Ilex Forest'].bossList.filter(boss => boss.name != 'Egg Hunter');
        };
        const encounterSurpriseTogepiInJohto = new CustomQuest(1, afterDefeatingTogepiInJohto, 'Another report just came in, there have been sightings of a strange egg in a forest in Johto!', App.game.statistics.pokemonDefeated[surpriseTogepi.id], 1, togepiInJohtoSetup);
        findSurpriseTogepiForEasterQuestLine.addQuest(encounterSurpriseTogepiInJohto);

        const togepiInHoennSetup = () => {
            dungeonList['Petalburg Woods'].bossList.push(new DungeonTrainer('Egg Hunter', [new GymPokemon('Surprise Togepi', 2700000, 100)], { weight: 1, requirement: new GymBadgeRequirement(BadgeEnums.Elite_HoennChampion) }));
        };
        const afterDefeatingTogepiInHoenn = () => {
            App.game.party.gainPokemonByName('Surprise Togepi');
            Notifier.notify({
                title: findSurpriseTogepiForEasterQuestLine.name,
                message: 'You found the special Togepi!',
                type: NotificationConstants.NotificationOption.success,
                timeout: 3e4,
            });
            dungeonList['Petalburg Woods'].bossList = dungeonList['Petalburg Woods'].bossList.filter(boss => boss.name != 'Egg Hunter');
        };
        const encounterTogepiInHoenn = new CustomQuest(1, afterDefeatingTogepiInHoenn, 'There is a big Egg Hunt going on in the woods south of Rustboro in Hoenn; maybe you should take a look?', App.game.statistics.pokemonDefeated[surpriseTogepi.id], 2, togepiInHoennSetup);
        findSurpriseTogepiForEasterQuestLine.addQuest(encounterTogepiInHoenn);

        App.game.quests.questLines().push(findSurpriseTogepiForEasterQuestLine);
    }

    // Open the game on April 1.
    public static createHoopaDayPikabluQuestLine() {
        const hoopaDayPikabluQuestLine = new QuestLine('How blu mouse?', 'Apparently a strange blue mouse-like Pokémon might be out there somewhere?');

        const PikabluCatch = new CaptureSpecificPokemonQuest(
            'Marill',
            'Catch Pikablu.',
            1,
            false,
            5000,
            undefined
        );

        hoopaDayPikabluQuestLine.addQuest(PikabluCatch);

        App.game.quests.questLines().push(hoopaDayPikabluQuestLine);
    }

    public static isQuestLineCompleted(name: string) {
        return App.game.quests.getQuestLine(name)?.state() == QuestLineState.ended;
    }

    public static loadQuestLines() {
        this.createTutorial();
        this.createRocketKantoQuestLine();
        this.createBillsGrandpaQuestLine();
        this.createUndergroundQuestLine();
        this.createBillSeviiQuestLine();
        this.createPersonsofInterestQuestLine();
        this.createRocketJohtoQuestLine();
        this.createJohtoBeastsQuestLine();
        this.createJohtoSuicuneQuestLine();
        this.createlugiaJohtoQuestLine();
        this.createhoohJohtoQuestLine();
        this.createCelebiJohtoQuestLine();
        this.createAquaMagmaHoennQuestLine();
        this.createWeatherTrioQuestLine();
        this.createDeoxysQuestLine();
        this.createEonDuoQuestLine();
        this.createRubySapphireSeviiQuestLine();
        this.createPinkanThemeparkQuestLine();
        this.createRegiTrioQuestLine();
        this.createJirachiQuestLine();
        this.createMetaGroudonQuestLine();
        this.createGalacticSinnohQuestLine();
        this.createManaphyQuestLine();
        this.createGiratinaQuestLine();
        this.createPlasmaUnovaQuestLine();
        this.createDeltaEpisodeQuestLine();
        this.createDetectivePikachuQuestLine();
        this.createVivillonQuestLine();
        this.createFlareKalosQuestLine();
        this.createPrincessDiancieQuestLine();
        this.createAshKetchumQuestLine();
        this.createSkullAetherAlolaQuestLine();
        this.createMinasTrialAlolaQuestLine();
        this.createUltraBeastQuestLine();
        this.createMagikarpJumpQuestLine();
        this.createDarkestDayQuestLine();
        this.createSwordShieldQuestLine();
        this.createDojoArmorQuestLine();
        this.createJungleSecretsQuestLine();
        this.createGalarCrownQuestLine();
        this.createDynaTreeBirdsQuestLine();
        this.createAncientGolemsQuestLine();
        this.createOriginalColorMagearnaQuestLine();
        this.createHisuiForcesQuestLine();
        this.createFindSurpriseTogepiForEasterQuestLine();
        this.createHoopaDayPikabluQuestLine();
        this.createDrSplashQuestLine();
        this.createMeltanQuestLine();
        this.createRainbowRocketQuestLine();
    }
}
