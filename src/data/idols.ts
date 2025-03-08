import { idol0 } from "@/data/idol0.ts";
import { idol1 } from "@/data/idol1.ts";
import { idol2 } from "@/data/idol2.ts";
import { idol3 } from "@/data/idol3.ts";
import { idol4 } from "@/data/idol4.ts";
import {
	type EnrichedIdolData,
	idolDataWithTypeAndMechanic,
} from "@/models/idol.ts";

export const allIdolData: EnrichedIdolData[] = [
	...idol0.map((idol) => idolDataWithTypeAndMechanic(idol, "Idol0")),
	...idol1.map((idol) => idolDataWithTypeAndMechanic(idol, "Idol1")),
	...idol2.map((idol) => idolDataWithTypeAndMechanic(idol, "Idol2")),
	...idol3.map((idol) => idolDataWithTypeAndMechanic(idol, "Idol3")),
	...idol4.map((idol) => idolDataWithTypeAndMechanic(idol, "Idol4")),
]
	// Remove 144-180 affixes since they are only for ruthless
	.filter((idol) => !idol.str.includes("144&ndash;180"))
	.sort((a, b) => {
		if (a.Mechanic < b.Mechanic) {
			return -1;
		}
		if (a.Mechanic > b.Mechanic) {
			return 1;
		}
		if (a.Size < b.Size) {
			return -1;
		}
		if (a.Size > b.Size) {
			return 1;
		}
		if (a.Affix < b.Affix) {
			return -1;
		}
		if (a.Affix > b.Affix) {
			return 1;
		}
		if (a.DisplayCode < b.DisplayCode) {
			return -1;
		}
		if (a.DisplayCode > b.DisplayCode) {
			return 1;
		}
		return 0;
	});
