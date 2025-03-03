import IdolListItem from "@/components/idol-list-item.tsx";
import IdolTypeDropdown from "@/components/idol-type-dropdown.tsx";
import {
	type IdolMechanic,
	IdolMechanics,
	IdolTypes,
	allIdolData,
	idolNameToMechanic,
} from "@/helpers/idol";
import useUrlState from "@/hooks/useUrlState.ts";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import MechanicDropdown from "./idol-mechanic-dropdown";

function copyTradeText(tradeStr: string) {
	const tempDiv = document.createElement("div");
	tempDiv.innerHTML = tradeStr;

	const spans = tempDiv.querySelectorAll("span");
	for (const span of spans) {
		span.parentNode?.removeChild(span);
	}

	const breaks = tempDiv.querySelectorAll("br");
	for (const br of breaks) {
		br.parentNode?.insertBefore(document.createTextNode(" "), br);
		br.parentNode?.removeChild(br);
	}

	const textToCopy = tempDiv.textContent || tempDiv.innerText;

	if (textToCopy) {
		if (navigator.clipboard) {
			navigator.clipboard
				.writeText(textToCopy)
				.then(() => {
					toast("Trade search text copied to clipboard.");
				})
				.catch((err) => {
					toast("Failed to copy text.");
					console.error("Failed to copy text: ", err);
				});
		} else {
			toast("Your browser does not support copying to clipboard.");
		}
	} else {
		toast("No text to copy after removing spans.");
	}
}

function IdolList() {
	const [{ searchQuery, activeMechanics, activeIdolTypes }, setUrlState] =
		useUrlState();

	const [mechanicSearchQuery, setMechanicSearchQuery] = useState("");
	const [idolTypeSearchQuery, setIdolTypeSearchQuery] = useState("");
	const [showMechanicDropdown, setShowMechanicDropdown] = useState(false);
	const [showIdolTypeDropdown, setShowIdolTypeDropdown] = useState(false);

	const mechanicDropdownRef = useRef<HTMLDivElement>(null);
	const idolTypeDropdownRef = useRef<HTMLDivElement>(null);

	const filteredIdols = useMemo(() => {
		let idols = allIdolData.sort((a, b) => {
			if (a.Mechanic < b.Mechanic) {
				return -1;
			}
			if (a.Mechanic > b.Mechanic) {
				return 1;
			}
			if (a.Name < b.Name) {
				return -1;
			}
			if (a.Name > b.Name) {
				return 1;
			}

			return 0;
		});

		if (searchQuery) {
			const lowerCaseQuery = searchQuery.toLowerCase();
			try {
				const regex = new RegExp(searchQuery, "i");

				idols = idols.filter(
					(idol) =>
						regex.test(idol.Name) ||
						regex.test(idol.str) ||
						idol.Name.toLowerCase().includes(lowerCaseQuery) ||
						idol.str.toLowerCase().includes(lowerCaseQuery),
				);
			} catch (error) {
				// For invalid regex

				idols = idols.filter(
					(idol) =>
						idol.Name.toLowerCase().includes(lowerCaseQuery) ||
						idol.str.toLowerCase().includes(lowerCaseQuery),
				);
			}
		}

		idols = idols.filter((idol) => {
			const idolMechanics = idolNameToMechanic(idol.Name);
			const mechanicMatch = Array.isArray(idolMechanics)
				? idolMechanics.some((mechanic) => activeMechanics[mechanic])
				: activeMechanics[idolMechanics];

			const idolTypeMatch = activeIdolTypes[idol.Type];

			return mechanicMatch && idolTypeMatch;
		});

		return idols;
	}, [searchQuery, activeMechanics, activeIdolTypes]);

	const filteredMechanics = useMemo(() => {
		const allMechanics = Object.values(IdolMechanics).sort();
		if (!mechanicSearchQuery) {
			return allMechanics;
		}
		const lowerCaseQuery = mechanicSearchQuery.toLowerCase();
		return allMechanics.filter((mechanic) =>
			mechanic.toLowerCase().includes(lowerCaseQuery),
		);
	}, [mechanicSearchQuery]);

	const filteredIdolTypes = useMemo(() => {
		const allTypes = Array.from(new Set(Object.values(IdolTypes)));
		if (!idolTypeSearchQuery) {
			return allTypes;
		}
		const lowerCaseQuery = idolTypeSearchQuery.toLowerCase();
		return allTypes.filter((type) => type.toString() === lowerCaseQuery);
	}, [idolTypeSearchQuery]);

	const toggleMechanic = (mechanic: IdolMechanic) => {
		setUrlState({
			activeMechanics: {
				...activeMechanics,
				[mechanic]: !activeMechanics[mechanic],
			},
		});
	};

	const toggleIdolType = (type: number) => {
		setUrlState({
			activeIdolTypes: {
				...activeIdolTypes,
				[type]: !activeIdolTypes[type],
			},
		});
	};

	const allMechanicsSelected = useMemo(() => {
		return filteredMechanics.every((mechanic) => activeMechanics[mechanic]);
	}, [filteredMechanics, activeMechanics]);

	const toggleAllMechanics = () => {
		const newMechanics = { ...activeMechanics };
		if (allMechanicsSelected) {
			for (const mechanic of filteredMechanics) {
				newMechanics[mechanic] = false;
			}
		} else {
			for (const mechanic of filteredMechanics) {
				newMechanics[mechanic] = true;
			}
		}
		setUrlState({ activeMechanics: newMechanics });
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				mechanicDropdownRef.current &&
				!mechanicDropdownRef.current.contains(event.target as Node)
			) {
				setShowMechanicDropdown(false);
			}
			if (
				idolTypeDropdownRef.current &&
				!idolTypeDropdownRef.current.contains(event.target as Node)
			) {
				setShowIdolTypeDropdown(false);
			}
		};

		if (showMechanicDropdown || showIdolTypeDropdown) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showMechanicDropdown, showIdolTypeDropdown]);

	const resetAll = () => {
		setUrlState({
			searchQuery: "",
			activeMechanics: Object.values(IdolMechanics).reduce(
				(mechanics, mechanic) => {
					mechanics[mechanic] = true;
					return mechanics;
				},
				{} as Record<IdolMechanic, boolean>,
			),
			activeIdolTypes: Object.values(IdolTypes).reduce(
				(types, type) => {
					types[type] = true;
					return types;
				},
				{} as Record<number, boolean>,
			),
		});
		//clear url
		window.history.replaceState({}, "", window.location.pathname);
	};

	return (
		<div className="container mx-auto h-full overflow-visible overflow-x-clip bg-background p-4 text-foreground">
			<div className="mb-4 flex flex-col gap-2 md:flex-row">
				<input
					type="text"
					placeholder="Search by name or description (case insensitive, regex supported)"
					value={searchQuery}
					onChange={(e) => setUrlState({ searchQuery: e.target.value })}
					className="w-full rounded border border-border p-2 md:max-w-1/2"
				/>

				<MechanicDropdown
					ref={mechanicDropdownRef}
					mechanicSearchQuery={mechanicSearchQuery}
					setMechanicSearchQuery={setMechanicSearchQuery}
					showMechanicDropdown={showMechanicDropdown}
					setShowMechanicDropdown={setShowMechanicDropdown}
					filteredMechanics={filteredMechanics}
					activeMechanics={activeMechanics}
					toggleMechanic={toggleMechanic}
					allMechanicsSelected={allMechanicsSelected}
					toggleAllMechanics={toggleAllMechanics}
				/>

				<IdolTypeDropdown
					ref={idolTypeDropdownRef}
					idolTypeSearchQuery={idolTypeSearchQuery}
					setIdolTypeSearchQuery={setIdolTypeSearchQuery}
					showIdolTypeDropdown={showIdolTypeDropdown}
					setShowIdolTypeDropdown={setShowIdolTypeDropdown}
					filteredIdolTypes={filteredIdolTypes}
					activeIdolTypes={activeIdolTypes}
					toggleIdolType={toggleIdolType}
				/>

				{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
				<button
					onClick={resetAll}
					className="w-full rounded bg-destructive px-4 py-2 text-foreground hover:bg-destructive-foreground md:w-auto"
				>
					Reset
				</button>
			</div>

			<ul className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
				{filteredIdols.map((idol) => (
					<IdolListItem
						key={idol.Code}
						idol={idol}
						copyTradeText={copyTradeText}
					/>
				))}
			</ul>
			{filteredIdols.length === 0 && (
				<p className="mt-4 text-center">No idols found matching your search.</p>
			)}
		</div>
	);
}

export default IdolList;
