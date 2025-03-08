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
}

const useIdolStore = create<IdolState>((set, get) => ({
	getState: () => get(),
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
	filteredIdols: allIdolData,
	setSearchQuery: (query: string) => {
		set({ searchQuery: query });
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
		const idolAffixMatch = state.activeIdolAffixes[idol.Affix];
		return mechanicMatch && idolTypeMatch && idolAffixMatch;
	});

	return idols;
}

export default useIdolStore;
