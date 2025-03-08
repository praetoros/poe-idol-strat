export type BaseIdolData = {
	Name: string;
	Code: string;
	Level: string;
	ModGenerationTypeID: string;
	ModFamilyList: string[];
	DropChance: number;
	str: string;
};

export type IdolAffix = keyof typeof IdolTypes;

export const IdolAffixes: Record<string, string> = {
	Prefix: "Prefix",
	Suffix: "Suffix",
};

export type IdolType = keyof typeof IdolTypes;

export const IdolTypes: Record<string, string> = {
	Idol0: "1x1 (Unique)",
	Idol1: "1x1",
	Idol2: "1x2,2x1",
	Idol3: "1x3,3x1",
	Idol4: "2x2",
};

export type IdolMechanic = keyof typeof IdolMechanics;

export const IdolMechanics: Record<string, string> = {
	Abyss: "Abyss",
	Incursion: "Incursion",
	RougeExile: "RougeExile",
	EinharBeasts: "EinharBeasts",
	BeyondDemons: "BeyondDemons",
	Blight: "Blight",
	Breach: "Breach",
	Exarch: "Exarch",
	Delirium: "Delirium",
	Niko: "Niko",
	Domination: "Domination",
	Essence: "Essence",
	Expedition: "Expedition",
	Harbinger: "Harbinger",
	Harvest: "Harvest",
	Heist: "Heist",
	Syndicate: "Syndicate",
	Legion: "Legion",
	Maps: "Maps",
	Ultimatum: "Ultimatum",
	Ritual: "Ritual",
	Scarab: "Scarab",
	Strongbox: "Strongbox",
	Eater: "Eater",
	Torment: "Torment",
	Corruption: "Corruption",
	Scouting: "Scouting",
	Conqueror: "Conqueror",
	Shaper: "Shaper",
	Elder: "Elder",
	Synthesis: "Synthesis",
	Bold: "Bold",
	Kirac: "Kirac",
	Ascendancy: "Ascendancy",
	Maven: "Maven",
	Unknown: "Unknown",
};

export type EnrichedIdolData = BaseIdolData & {
	Mechanic: IdolMechanic;
	Type: IdolType;
	Affix: "Suffix" | "Prefix" | "Unique";
	IsUnique: boolean;
	Size: string;
	DisplayCode: string;
};

export const idolNameToMechanic = (name: string): IdolMechanic => {
	switch (name) {
		case "Abyssal":
		case "of the Abyss":
			return IdolMechanics.Abyss;
		case "Alva's":
		case "of Incursion":
			return IdolMechanics.Incursion;
		case "Exiled":
		case "of Exiles":
			return IdolMechanics.RougeExile;
		case "Bestial":
		case "of Beasts":
			return IdolMechanics.EinharBeasts;
		case "Demonic":
		case "of the Scourge":
			return IdolMechanics.BeyondDemons;
		case "Blighted":
		case "of Blight":
			return IdolMechanics.Blight;
		case "Breachlord's":
		case "of the Breach":
			return IdolMechanics.Breach;
		case "of the Conqueror":
		case "Conquered":
			return IdolMechanics.Conqueror;
		case "Delirious":
		case "of Delirium":
			return IdolMechanics.Delirium;
		case "Niko's":
		case "of the Underground":
			return IdolMechanics.Niko;
		case "of Domination":
		case "Domination":
			return IdolMechanics.Domination;
		case "of Essences":
		case "Essence":
			return IdolMechanics.Essence;
		case "Ruinic":
		case "of Expedition":
			return IdolMechanics.Expedition;
		case "Harbinger's":
		case "of the Harbinger":
			return IdolMechanics.Harbinger;
		case "Bountiful":
		case "of Harvest":
			return IdolMechanics.Harvest;
		case "Smuggler's":
		case "of Smuggling":
			return IdolMechanics.Heist;
		case "Syndicate's":
		case "of Betrayal":
			return IdolMechanics.Syndicate;
		case "General's":
		case "of the Legion":
			return IdolMechanics.Legion;
		case "of Ultimatum":
		case "Trialmaster's":
			return IdolMechanics.Ultimatum;
		case "Ritualistic":
		case "of the Ritual":
			return IdolMechanics.Ritual;
		case "Skittering":
		case "of Skittering":
			return IdolMechanics.Scarab;
		case "Trapped":
		case "of Ambush":
			return IdolMechanics.Strongbox;
		case "of the Eater":
			return IdolMechanics.Eater;
		case "Tormented":
		case "of Torment":
			return IdolMechanics.Torment;
		case "Corrupting":
		case "of Corruption":
			return IdolMechanics.Corruption;
		case "Scout's":
		case "of Scouting":
			return IdolMechanics.Scouting;
		case "Shaper's":
		case "of the Shaper":
			return IdolMechanics.Shaper;
		case "Elder's":
		case "of the Elder":
			return IdolMechanics.Elder;
		case "Synthesised":
		case "of Synthesis":
			return IdolMechanics.Synthesis;
		case "Ascendant's":
		case "of Ascendancy":
			return IdolMechanics.Ascendancy;
		case "of the Bold":
			return IdolMechanics.Bold;
		case "Kirac's":
			return IdolMechanics.Kirac;
		case "Cartographer's":
			return IdolMechanics.Maps;
		case "of the Maven":
			return IdolMechanics.Maven;
		case "of the Exarch":
			return IdolMechanics.Exarch;
		default:
			return IdolMechanics.Unknown;
	}
};

export const idolDataWithTypeAndMechanic = (
	idol: BaseIdolData,
	type: IdolType,
): EnrichedIdolData => {
	if (type === IdolTypes.Idol0) {
		return {
			...idol,
			Mechanic: idol.Name,
			Type: type,
			Affix: "Unique",
			IsUnique: true,
			Size: IdolTypes[type],
			DisplayCode: idol.Code,
		};
	}
	return {
		...idol,
		Mechanic: idolNameToMechanic(idol.Name),
		Type: type,
		Affix: idol.Name.startsWith("of ") ? "Suffix" : "Prefix",
		IsUnique: false,
		Size: IdolTypes[type],
		DisplayCode: idol.Code.replace(
			/(\w)([A-Z0-9])/g,
			(_, ...args) => `${args[0]} ${args[1]}`,
		),
	};
};

export const idolColourClass = (idol: EnrichedIdolData) => {
	switch (idol.Affix) {
		case "Suffix":
			return "text-red-600";
		case "Prefix":
			return "text-blue-600";
		case "Unique":
			return "text-orange-600";
	}
};
