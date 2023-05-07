class PurifyChamberTownContent extends TownContent {
    constructor() {
        super([PurifyChamber.requirements]);
    }
    public cssClass(): string {
        return 'btn btn-info';
    }
    public text(): string {
        return 'Purify Chamber';
    }
    public isVisible(): boolean {
        return true;
    }
    public onclick(): void {
        $('#purifyChamberModal').modal('show');
    }

}

class PurifyChamber implements Saveable {
    public static requirements = new DevelopmentRequirement(); //TODO: when should this unlock? Waiting for story

    public selectedPokemon: KnockoutObservable<PartyPokemon>;
    public currentFlow: KnockoutObservable<number>;
    public flowNeeded: KnockoutComputed<number>;

    constructor() {
        this.selectedPokemon = ko.observable(undefined);
        this.currentFlow = ko.observable(0);
        this.flowNeeded = ko.pureComputed(() => {
            const purifiedPokemon = App.game.party.caughtPokemon.filter((p) => p.shadow == GameConstants.ShadowStatus.Purified).length;
            const flow = 160 * purifiedPokemon * purifiedPokemon +
                3000 * purifiedPokemon +
                1000 * Math.exp(0.08 * purifiedPokemon);
            return Math.round(flow);
        });
    }

    public canPurify() : boolean {
        if (!this.selectedPokemon()) {
            return false;
        }
        if (this.selectedPokemon().shadow != GameConstants.ShadowStatus.Shadow) {
            return false;
        }
        if (this.currentFlow() < this.flowNeeded()) {
            return false;
        }
        return true;
    }

    public purify() {
        if (!this.canPurify()) {
            return;
        }
        this.selectedPokemon().shadow = GameConstants.ShadowStatus.Purified;
        this.currentFlow(0);
    }

    public gainFlow(exp: number) {
        if (!PurifyChamber.requirements.isCompleted() || !App.game.party.caughtPokemon.some((p) => p.shadow == GameConstants.ShadowStatus.Shadow)) {
            return;
        }
        const newFlow = Math.round(this.currentFlow() + exp / 1000);
        this.currentFlow(Math.min(newFlow, this.flowNeeded()));
    }

    saveKey = 'PurifyChamber';
    defaults: Record<string, any>;
    toJSON(): Record<string, any> {
        return {
            selectedPokemon: this.selectedPokemon()?.id,
            currentFlow: this.currentFlow(),
        };
    }

    fromJSON(json: Record<string, any>): void {
        if (json) {
            if (json.selectedPokemon) {
                let selectedPokemon = App.game.party.getPokemon(json.selectedPokemon);
                if (selectedPokemon.shadow != GameConstants.ShadowStatus.Shadow) {
                    selectedPokemon = undefined;
                }
                this.selectedPokemon(selectedPokemon);

                this.currentFlow(json.currentFlow ?? 0);
            }
        }
    }
}
