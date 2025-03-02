import { idol1 } from "~/assets/idol1.ts";
import { idol2 } from "~/assets/idol2.ts";
import { idol3 } from "~/assets/idol3.ts";
import { idol4 } from "~/assets/idol4.ts";

export type IdolData = {
	Name: string;
	Code: string;
	Level: string;
	ModGenerationTypeID: string;
	ModFamilyList: string[];
	DropChance: number; //Weighting
	str: string; //Description
};

export const allIdolData: IdolData[] = [...idol1, ...idol2, ...idol3, ...idol4];
