import { allIdolData } from "@/data/idols.ts";
import {
	type EnrichedIdolData,
	type IdolAffix,
	IdolAffixes,
	type IdolMechanic,
	IdolMechanics,
	type IdolType,
	IdolTypes,
} from "@/models/idol.ts";
import { create } from "zustand";

interface IdolState {
	searchQuery: string;
	activeMechanics: Record<IdolMechanic, boolean>;
	activeIdolTypes: Record<IdolType, boolean>;
	activeIdolAffixes: Record<IdolAffix, boolean>;
	filteredIdols: EnrichedIdolData[];
	setSearchQuery: (query: string) => void;
	toggleMechanic: (mechanic: IdolMechanic) => void;
	toggleIdolType: (type: IdolType) => void;
	toggleIdolAffix: (affix: IdolAffix) => void;
	toggleAllMechanics: (enable: boolean) => void;
	resetAll: () => void;
	getState: () => IdolState;
	refresh: () => void;
}

const enrichRecordWithParams = (
	record: Record<string, boolean>,
	params: string | null,
) => {
	if (params) {
		const splitParams = params.split(",");
		for (const param of splitParams) {
			if (record[param] !== undefined) {
				record[param] = true;
			}
		}
	}
	return record;
};

const initialParams = new URLSearchParams(
	typeof window !== "undefined" ? window.location.search : "",
);
const initialSearchQuery = initialParams.get("q") || "";
const paramsMechanics = initialParams.get("m");
const paramsIdolTypes = initialParams.get("t");
const paramsIdolAffixes = initialParams.get("a");

const initialActiveMechanics = Object.keys(IdolMechanics)
	.sort()
	.reduce(
		(acc, mechanic) => {
			acc[mechanic] = !paramsMechanics;
			return acc;
		},
		{} as Record<IdolMechanic, boolean>,
	);
const initialActiveIdolTypes = Object.keys(IdolTypes).reduce(
	(acc, type) => {
		acc[type] = !paramsIdolTypes;
		return acc;
	},
	{} as Record<IdolType, boolean>,
);
const initialActiveIdolAffixes = Object.keys(IdolAffixes).reduce(
	(acc, affix) => {
		acc[affix] = !paramsIdolAffixes;
		return acc;
	},
	{} as Record<IdolAffix, boolean>,
);

const useIdolStore = create<IdolState>((set, get) => ({
	getState: () => get(),
	searchQuery: initialSearchQuery,
	activeMechanics: enrichRecordWithParams(
		initialActiveMechanics,
		paramsMechanics,
	),
	activeIdolTypes: enrichRecordWithParams(
		initialActiveIdolTypes,
		paramsIdolTypes,
	),
	activeIdolAffixes: enrichRecordWithParams(
		initialActiveIdolAffixes,
		paramsIdolAffixes,
	),
	filteredIdols: allIdolData,
	setSearchQuery: (query: string) => {
		set({ searchQuery: query });
		setUrlFromState(get());
		set((state) => ({
			filteredIdols: filterIdols(state),
		}));
	},
	toggleMechanic: (mechanic: IdolMechanic) => {
		set((state) => ({
			activeMechanics: {
				...state.activeMechanics,
				[mechanic]: !state.activeMechanics[mechanic],
			},
		}));
		setUrlFromState(get());
		set((state) => ({
			filteredIdols: filterIdols(state),
		}));
	},
	toggleIdolType: (type: IdolType) => {
		set((state) => ({
			activeIdolTypes: {
				...state.activeIdolTypes,
				[type]: !state.activeIdolTypes[type],
			},
		}));
		setUrlFromState(get());
		set((state) => ({
			filteredIdols: filterIdols(state),
		}));
	},
	toggleIdolAffix: (type: IdolAffix) => {
		set((state) => ({
			activeIdolAffixes: {
				...state.activeIdolAffixes,
				[type]: !state.activeIdolAffixes[type],
			},
		}));
		setUrlFromState(get());
		set((state) => ({
			filteredIdols: filterIdols(state),
		}));
	},
	toggleAllMechanics: (enable: boolean) => {
		set((state) => {
			const newMechanics = { ...state.activeMechanics };
			for (const mechanic of Object.keys(state.activeMechanics)) {
				newMechanics[mechanic] = enable;
			}
			return {
				activeMechanics: newMechanics,
			};
		});
		setUrlFromState(get());
		set((state) => ({
			filteredIdols: filterIdols(state),
		}));
	},
	resetAll: () => {
		set({
			searchQuery: "",
			activeMechanics: Object.keys(IdolMechanics).reduce(
				(acc, mechanic) => {
					acc[mechanic] = true;
					return acc;
				},
				{} as Record<IdolMechanic, boolean>,
			),
			activeIdolTypes: Object.keys(IdolTypes).reduce(
				(acc, type) => {
					acc[type] = true;
					return acc;
				},
				{} as Record<IdolType, boolean>,
			),
			activeIdolAffixes: Object.keys(IdolAffixes).reduce(
				(acc, affix) => {
					acc[affix] = true;
					return acc;
				},
				{} as Record<IdolAffix, boolean>,
			),
		});
		setUrlFromState(get());
		set((state) => ({
			filteredIdols: filterIdols(state),
		}));
	},
	refresh: () => {
		set((state) => ({
			filteredIdols: filterIdols(state),
		}));
	},
}));

function filterIdols(state: IdolState): EnrichedIdolData[] {
	let idols = [...allIdolData];

	if (state.searchQuery) {
		const lowerCaseQuery = state.searchQuery.toLowerCase();
		try {
			const regex = new RegExp(state.searchQuery, "i");
			idols = idols.filter(
				(idol) =>
					regex.test(idol.DisplayCode) ||
					regex.test(idol.str) ||
					idol.Name.toLowerCase().includes(lowerCaseQuery) ||
					idol.str.toLowerCase().includes(lowerCaseQuery),
			);
		} catch (error) {
			// For invalid regex
			idols = idols.filter(
				(idol) =>
					idol.DisplayCode.toLowerCase().includes(lowerCaseQuery) ||
					idol.str.toLowerCase().includes(lowerCaseQuery),
			);
		}
	}

	idols = idols.filter((idol) => {
		const mechanicMatch = state.activeMechanics[idol.Mechanic];
		const idolTypeMatch = state.activeIdolTypes[idol.Type];
		const idolAffixMatch =
			state.activeIdolAffixes[idol.Affix] || idol.Type === "Idol0";
		return mechanicMatch && idolTypeMatch && idolAffixMatch;
	});

	return idols;
}

const recordToUrl = (record: Record<string, boolean>) => {
	return Object.entries(record)
		.filter(([, value]) => value)
		.map(([key]) => key)
		.join(",");
};

function setUrlFromState(state: IdolState) {
	const params = new URLSearchParams();
	if (state.searchQuery) {
		params.set("q", state.searchQuery);
	}

	const selectedMechanics = recordToUrl(state.activeMechanics);
	if (selectedMechanics) {
		params.set("m", selectedMechanics);
	}

	const selectedIdolTypes = recordToUrl(state.activeIdolTypes);
	if (selectedIdolTypes) {
		params.set("t", selectedIdolTypes);
	}

	const selectedIdolAffixes = recordToUrl(state.activeIdolAffixes);
	if (selectedIdolAffixes) {
		params.set("a", selectedIdolAffixes);
	}

	const newUrl = `${window.location.pathname}?${params.toString()}`;
	window.history.replaceState({}, "", newUrl);
}

export default useIdolStore;
