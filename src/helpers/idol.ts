import { idol0 } from "@/data/idol0.ts";
import { idol1 } from "@/data/idol1.ts";
import { idol2 } from "@/data/idol2.ts";
import { idol3 } from "@/data/idol3.ts";
import { idol4 } from "@/data/idol4.ts";

export type BaseIdolData = {
	Name: string;
	Code: string;
	Level: string;
	ModGenerationTypeID: string;
	ModFamilyList: string[];
	DropChance: number; //Weighting
	str: string; //Description
};

export type IdolType = keyof typeof IdolTypes;

export const IdolTypes: Record<string, number> = {
	Idol0: 0,
	Idol1: 1,
	Idol2: 2,
	Idol3: 3,
	Idol4: 4,
	Unique: 0,
	Minor: 1,
	Kamasan: 2,
	Noble: 2,
	Totemic: 3,
	Burial: 3,
	Conqueror: 4,
};

export const idolTypeToSize = (
	type: (typeof IdolTypes)[keyof typeof IdolTypes],
): string => {
	switch (type) {
		case 0:
			return "1x1 (Unique)";
		case 1:
			return "1x1";
		case 2:
			return "1x2,2x1";
		case 3:
			return "1x3,3x1";
		case 4:
			return "2x2";
		default:
			return "Unknown";
	}
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
	Unique: "Unique",
};

export type EnrichedIdolData = BaseIdolData & {
	Mechanic: IdolMechanic;
	Type: number;
	Affix: "Suffix" | "Prefix";
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

function idolNameToAffix(Name: string): "Suffix" | "Prefix" {
	return Name.startsWith("of ") ? "Suffix" : "Prefix";
}

export const idolDataWithTypeAndMechanic = (
	idol: BaseIdolData,
	type: number,
): EnrichedIdolData => {
	return {
		...idol,
		Mechanic: type === 0 ? IdolMechanics.Unique : idolNameToMechanic(idol.Name),
		Type: type,
		Affix: idolNameToAffix(idol.Name),
	};
};

export const allIdolData: EnrichedIdolData[] = [
	...idol0.map((idol) => idolDataWithTypeAndMechanic(idol, IdolTypes.Idol0)),
	...idol1.map((idol) => idolDataWithTypeAndMechanic(idol, IdolTypes.Idol1)),
	...idol2.map((idol) => idolDataWithTypeAndMechanic(idol, IdolTypes.Idol2)),
	...idol3.map((idol) => idolDataWithTypeAndMechanic(idol, IdolTypes.Idol3)),
	...idol4.map((idol) => idolDataWithTypeAndMechanic(idol, IdolTypes.Idol4)),
].filter((idol) => !idol.str.includes("144&ndash;180")); // Remove 144-180 affixes since they are only for ruthless
