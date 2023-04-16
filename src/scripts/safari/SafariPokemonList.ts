type SafariType = {
    name: PokemonNameType,
    weight: number
}

class SafariPokemonList {
    public safariPokemon: SafariType[];
    public static list: Record<GameConstants.Region, KnockoutObservableArray<SafariPokemonList>> = {};

    constructor(safariPokemon: SafariType[]) {
        this.safariPokemon = safariPokemon;
    }

    public static generateSafariLists() {
        const safariRegions = [GameConstants.Region.kanto, GameConstants.Region.kalos];

        for (const region of safariRegions) {
            if (!SafariPokemonList.list[region]) {
                SafariPokemonList.list[region] = ko.observableArray();
            } else {
                SafariPokemonList.list[region].removeAll();
            }
        }

        SafariPokemonList.list[GameConstants.Region.kanto].push(...this.generateKantoSafariList());
        SafariPokemonList.list[GameConstants.Region.kalos].push(...this.generateKalosSafariList());
    }

    private static generateKantoSafariList() {
        // Push each zone for the region into this list
        const list = [];
        // Lower weighted pokemon will appear less frequently, equally weighted are equally likely to appear
        list.push(new SafariPokemonList([
            {name: 'Nidoran(F)', weight: 15},
            {name: 'Nidorina', weight: 10 },
            {name: 'Nidoran(M)', weight: 25 },
            {name: 'Nidorino', weight: 10 },
            {name: 'Exeggcute', weight: 20 },
            {name: 'Paras', weight: 5 },
            {name: 'Parasect', weight: 15 },
            {name: 'Rhyhorn', weight: 10 },
            {name: 'Chansey', weight: 4 },
            {name: 'Scyther', weight: 4 },
            {name: 'Pinsir', weight: 4 },
            {name: 'Kangaskhan', weight: 15 },
            {name: 'Tauros', weight: 10 },
            {name: 'Cubone', weight: 10 },
            {name: 'Marowak', weight: 5 },
            {name: 'Tangela', weight: 4 },
        ]));
        return list;
    }

    private static generateKalosSafariList() {
        SeededRand.seedWithDate(new Date());
        const pokemon : SafariType[] = SeededRand.shuffleArray(App.game.party.caughtPokemon.map((p) => p.name)
            .filter((p) => !PokemonHelper.hasEvableLocations(p) && Object.keys(PokemonHelper.getPokemonLocations(p)).length)
            .map((p) => {
                return {name: p, weight: 3};
            })).slice(0, 5);
        pokemon.push({ name: 'Shuckle', weight: 2 });
        pokemon.push({ name: 'Stunfisk', weight: 2 });
        pokemon.push({ name: 'Magmar', weight: 2 });
        pokemon.push({ name: 'Maractus', weight: 2 });
        pokemon.push({ name: 'Klefki', weight: 2 });
        pokemon.push({ name: 'Breloom', weight: 2 });
        pokemon.push({ name: 'Woobat', weight: 2 });
        pokemon.push({ name: 'Golurk', weight: 2 });
        pokemon.push({ name: 'Marowak', weight: 2 });
        pokemon.push({ name: 'Lapras', weight: 2 });
        return [new SafariPokemonList(pokemon)];
    }
}
