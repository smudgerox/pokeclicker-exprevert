import { Pokerus } from '../GameConstants';
import BooleanSetting from '../settings/BooleanSetting';
import Setting from '../settings/Setting';
import GameHelper from '../GameHelper';
import SettingOption from '../settings/SettingOption';
import KeyItemType from '../enums/KeyItemType';
import DevelopmentRequirement from '../requirements/DevelopmentRequirement';
import Requirement from '../requirements/Requirement';
import CustomRequirement from '../requirements/CustomRequirement';
import PokemonType from '../enums/PokemonType';

class PokeballFilterOption<T, M = T> {
    public defaultSetting: Setting<T>;

    constructor(
        public createSetting: (defaultVal?: T, name?: string, defaultName?: string) => Setting<T>,
        public describe: (value: T) => string,
        public requirement?: Requirement,
        public matchTest: (optionValue: T, testValue: M) => boolean = (
            optionValue: T, testValue: M,
        ) => optionValue === (testValue as unknown as T),
    ) {
        this.defaultSetting = createSetting();
    }

    public canUse() {
        return this.requirement?.isCompleted() ?? true;
    }
}

const tempShadowRequirement = new DevelopmentRequirement();

export const pokeballFilterOptions = {
    shiny: new PokeballFilterOption<boolean>(
        (bool = true) => new BooleanSetting(
            'pokeballFilterShiny',
            'Shiny',
            bool,
        ),
        (isShiny) => `Are ${
            isShiny ? '' : 'not '
        }Shiny`,
    ),

    shadow: new PokeballFilterOption<boolean>(
        (bool = true) => new BooleanSetting(
            'pokeballFilterShadow',
            'Shadow',
            bool,
        ),
        (isShadow) => `Are ${
            isShadow ? '' : 'not '
        }Shadow`,
        tempShadowRequirement,
    ),

    caught: new PokeballFilterOption<boolean>(
        (bool = true) => new BooleanSetting(
            'pokeballFilterCaught',
            'Caught',
            bool,
        ),
        (isCaught) => `${
            isCaught ? 'Already' : 'Not yet'
        } caught`,
    ),

    caughtShiny: new PokeballFilterOption<boolean>(
        (bool = true) => new BooleanSetting(
            'pokeballFilterCaughtShiny',
            'Caught Shiny',
            bool,
        ),
        (isCaughtShiny) => `Shiny form ${
            isCaughtShiny ? 'already ' : 'not yet '
        }caught`,
    ),

    caughtShadow: new PokeballFilterOption<boolean>(
        (bool = true) => new BooleanSetting(
            'pokeballFilterCaughtShadow',
            'Caught Shadow',
            bool,
        ),
        (isCaughtShadow) => `Shadow form ${
            isCaughtShadow ? 'already ' : 'not yet '
        }caught`,
        tempShadowRequirement,
    ),

    pokerus: new PokeballFilterOption<Pokerus>(
        (pokerus = Pokerus.Uninfected) => new Setting(
            'pokeballFilterPokerus',
            'Pokérus State',
            GameHelper.enumStrings(Pokerus).map((k) => new SettingOption(k, Pokerus[k])),
            pokerus,
        ),
        (pokerusState) => `Are in the ${
            Pokerus[pokerusState]
        } Pokérus state`,
        new CustomRequirement(
            ko.pureComputed(() => App.game.keyItems.hasKeyItem(KeyItemType.Pokerus_virus)),
            true, 'Pokérus virus is required',
        ),
    ),

    pokemonType: new PokeballFilterOption<PokemonType, [PokemonType, PokemonType]>(
        (type = PokemonType.Normal, name = 'pokeballFilterPokemonType', defaultName = 'Pokémon Type') => new Setting(
            name,
            defaultName,
            GameHelper.enumStrings(PokemonType).map((k) => new SettingOption(k, PokemonType[k])),
            type,
        ),
        (pokemonType) => `Is ${PokemonType[pokemonType]} type`,
        undefined,
        (
            optionValue: PokemonType,
            testValues: [PokemonType, PokemonType],
        ) => testValues.includes(optionValue),
    ),
};

type PokeballFilterValueType<T>
    = T extends PokeballFilterOption<infer K> ? K : never;

type PokeballFilterMatchType<T>
    = T extends PokeballFilterOption<any, infer M> ? M : never;

export type PokeballFilterOptions = Partial<{
    [K in keyof typeof pokeballFilterOptions]: PokeballFilterValueType<typeof pokeballFilterOptions[K]>;
}>;

export type PokeballFilterMatchData = {
    [K in keyof typeof pokeballFilterOptions]: PokeballFilterMatchType<typeof pokeballFilterOptions[K]>;
};
