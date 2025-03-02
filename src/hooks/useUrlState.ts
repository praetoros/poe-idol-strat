import { useCallback, useEffect, useState } from "react";
import { type IdolMechanic, IdolMechanics, IdolTypes } from "../helpers/idol";

interface UrlState {
	searchQuery: string;
	activeMechanics: Record<IdolMechanic, boolean>;
	activeIdolTypes: Record<number, boolean>;
}

const useUrlState = (): [UrlState, (newState: Partial<UrlState>) => void] => {
	const getInitialState = useCallback((): UrlState => {
		const params = new URLSearchParams(window.location.search);
		const initialSearchQuery = params.get("q") || "";
		const initialMechanics = params.get("m");
		const initialIdolTypes = params.get("t");

		const initialActiveMechanics: Record<IdolMechanic, boolean> = Object.values(
			IdolMechanics,
		).reduce(
			(mechanics, mechanic) => {
				mechanics[mechanic] = true;
				return mechanics;
			},
			{} as Record<IdolMechanic, boolean>,
		);

		if (initialMechanics) {
			for (const mechanic in initialMechanics.split(",")) {
				if (IdolMechanics[mechanic as IdolMechanic]) {
					initialActiveMechanics[mechanic as IdolMechanic] = true;
				}
			}
			for (const mechanic in initialActiveMechanics) {
				if (!initialMechanics.split(",").includes(mechanic)) {
					initialActiveMechanics[mechanic as IdolMechanic] = false;
				}
			}
		}

		const initialActiveIdolTypes: Record<number, boolean> = Object.values(
			IdolTypes,
		).reduce(
			(types, type) => {
				types[type] = true;
				return types;
			},
			{} as Record<number, boolean>,
		);

		if (initialIdolTypes) {
			for (const type in initialIdolTypes.split(",")) {
				const typeNum = Number.parseInt(type, 10);
				if (!Number.isNaN(typeNum) && IdolTypes[typeNum] !== undefined) {
					initialActiveIdolTypes[typeNum] = true;
				}
			}

			for (const type in initialActiveIdolTypes) {
				if (!initialIdolTypes.split(",").includes(type)) {
					initialActiveIdolTypes[Number.parseInt(type)] = false;
				}
			}
		}

		return {
			searchQuery: initialSearchQuery,
			activeMechanics: initialActiveMechanics,
			activeIdolTypes: initialActiveIdolTypes,
		};
	}, []);

	const [state, setState] = useState<UrlState>(getInitialState);

	useEffect(() => {
		setState(getInitialState()); // Update state when URL changes
	}, [getInitialState]);

	const setUrlState = useCallback((newState: Partial<UrlState>) => {
		setState((prevState) => {
			const updatedState = { ...prevState, ...newState };

			const params = new URLSearchParams();
			if (updatedState.searchQuery) {
				params.set("q", updatedState.searchQuery);
			}
			const selectedMechanics = Object.entries(updatedState.activeMechanics)
				.filter(([, value]) => value)
				.map(([key]) => key)
				.join(",");
			if (selectedMechanics) {
				params.set("m", selectedMechanics);
			}
			const selectedIdolTypes = Object.entries(updatedState.activeIdolTypes)
				.filter(([, value]) => value)
				.map(([key]) => key)
				.join(",");
			if (selectedIdolTypes) {
				params.set("t", selectedIdolTypes);
			}

			const newUrl = `${window.location.pathname}?${params.toString()}`;
			window.history.replaceState({}, "", newUrl); // Update URL without reload

			return updatedState;
		});
	}, []);

	// Listen for popstate events (back/forward button)
	useEffect(() => {
		const handlePopstate = () => {
			setState(getInitialState());
		};

		window.addEventListener("popstate", handlePopstate);
		return () => {
			window.removeEventListener("popstate", handlePopstate);
		};
	}, [getInitialState]);

	return [state, setUrlState];
};

export default useUrlState;
