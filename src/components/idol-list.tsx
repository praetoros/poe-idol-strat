import {
	type IdolMechanic,
	IdolMechanics,
	IdolTypes,
	allIdolData,
	idolNameToMechanic,
	idolTypeToSize,
} from "@/helpers/idol.ts";
import { ArrowDownIcon } from "@heroicons/react/24/solid";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner"; // Import useRef and useEffect

function copyTradeText(tradeStr: string) {
	// 1. Create a temporary element to manipulate the HTML.
	const tempDiv = document.createElement("div");
	tempDiv.innerHTML = tradeStr;

	// 2. Remove all <span> elements.
	const spans = tempDiv.querySelectorAll("span");
	for (const span of spans) {
		span.parentNode?.removeChild(span);
	}

	// 3. Get the text content (now without spans).
	const textToCopy = tempDiv.textContent || tempDiv.innerText; // Use textContent or innerText for cross-browser compatibility

	// 4. Copy the text to the clipboard.
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
	const [searchQuery, setSearchQuery] = useState("");
	const [activeMechanics, setActiveMechanics] = useState(() => {
		return Object.values(IdolMechanics).reduce(
			(mechanics, mechanic) => {
				mechanics[mechanic] = true;
				return mechanics;
			},
			{} as Record<IdolMechanic, boolean>,
		);
	});
	const [mechanicSearchQuery, setMechanicSearchQuery] = useState("");
	const [activeIdolTypes, setActiveIdolTypes] = useState(() => {
		return Object.values(IdolTypes).reduce(
			(types, type) => {
				types[type] = true;
				return types;
			},
			{} as Record<number, boolean>,
		);
	});
	const [idolTypeSearchQuery, setIdolTypeSearchQuery] = useState("");
	const [showMechanicDropdown, setShowMechanicDropdown] = useState(false);
	const [showIdolTypeDropdown, setShowIdolTypeDropdown] = useState(false);

	// Refs for the dropdown containers
	const mechanicDropdownRef = useRef<HTMLDivElement>(null);
	const idolTypeDropdownRef = useRef<HTMLDivElement>(null);

	const filteredIdols = useMemo(() => {
		let idols = allIdolData;

		if (searchQuery) {
			const lowerCaseQuery = searchQuery.toLowerCase();
			idols = idols.filter(
				(idol) =>
					idol.Name.toLowerCase().includes(lowerCaseQuery) ||
					idol.str.toLowerCase().includes(lowerCaseQuery),
			);
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
		setActiveMechanics((prevMechanics) => ({
			...prevMechanics,
			[mechanic]: !prevMechanics[mechanic],
		}));
	};

	const toggleIdolType = (type: number) => {
		setActiveIdolTypes((prevTypes) => ({
			...prevTypes,
			[type]: !prevTypes[type],
		}));
	};

	const allMechanicsSelected = useMemo(() => {
		return filteredMechanics.every((mechanic) => activeMechanics[mechanic]);
	}, [filteredMechanics, activeMechanics]);

	const toggleAllMechanics = () => {
		const newMechanics = { ...activeMechanics };
		if (allMechanicsSelected) {
			// Unselect all
			for (const mechanic of filteredMechanics) {
				newMechanics[mechanic] = false;
			}
		} else {
			// Select all
			for (const mechanic of filteredMechanics) {
				newMechanics[mechanic] = true;
			}
		}
		setActiveMechanics(newMechanics);
	};

	// Click outside handler
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

		// Add event listener when either dropdown is open
		if (showMechanicDropdown || showIdolTypeDropdown) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		// Clean up event listener
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showMechanicDropdown, showIdolTypeDropdown]); // Depend on dropdown states

	return (
		<div className="container mx-auto p-4">
			<h1 className="mb-4 font-bold text-2xl">Idol List</h1>

			<div className="mb-4 flex flex-col gap-2 md:flex-row">
				{/* Search by Name/Description */}
				<input
					type="text"
					placeholder="Search by name, description"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full rounded border border-gray-300 p-2"
				/>

				{/* Mechanic Dropdown */}
				<div className="relative w-full md:w-auto" ref={mechanicDropdownRef}>
					<input
						type="text"
						placeholder="Search mechanics"
						value={mechanicSearchQuery}
						onChange={(e) => setMechanicSearchQuery(e.target.value)}
						onClick={() => setShowMechanicDropdown(true)} // Always open on click
						className="w-full rounded border border-gray-300 p-2 pr-10"
					/>
					{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
					<div
						className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
						onClick={() => setShowMechanicDropdown(!showMechanicDropdown)}
					>
						<ArrowDownIcon className="size-6 text-blue-500" />
					</div>
					{showMechanicDropdown && (
						<div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
							{/* Select/Unselect All Checkbox */}
							{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
							<div
								className="flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-gray-100"
								onClick={toggleAllMechanics}
							>
								<span>Select/Unselect All</span>
								<input
									type="checkbox"
									checked={allMechanicsSelected}
									onChange={toggleAllMechanics}
									className="form-checkbox h-4 w-4 text-blue-600"
								/>
							</div>
							{/* Divider */}
							<hr className="border-gray-300" />
							{filteredMechanics.map((mechanic) => (
								// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
								<div
									key={mechanic}
									className="flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-gray-100"
									onClick={() => toggleMechanic(mechanic)}
								>
									<span>{mechanic}</span>
									<input
										type="checkbox"
										checked={activeMechanics[mechanic] || false}
										onChange={() => toggleMechanic(mechanic)}
										className="form-checkbox h-4 w-4 text-blue-600"
									/>
								</div>
							))}
							{filteredMechanics.length === 0 && (
								<div className="px-4 py-2 text-gray-500">
									No mechanics found.
								</div>
							)}
						</div>
					)}
				</div>

				{/* Idol Type Dropdown */}
				<div className="relative w-full md:w-auto" ref={idolTypeDropdownRef}>
					<input
						type="text"
						placeholder="Search idol types"
						value={idolTypeSearchQuery}
						onChange={(e) => setIdolTypeSearchQuery(e.target.value)}
						onClick={() => setShowIdolTypeDropdown(true)} // Always open on click
						className="w-full rounded border border-gray-300 p-2 pr-10"
					/>
					{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
					<div
						className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
						onClick={() => setShowIdolTypeDropdown(!showIdolTypeDropdown)}
					>
						<ArrowDownIcon className="size-6 text-blue-500" />
					</div>
					{showIdolTypeDropdown && (
						<div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
							{filteredIdolTypes.map((type) => (
								// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
								<div
									key={type}
									className="flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-gray-100"
									onClick={() => toggleIdolType(type)}
								>
									<span>{type}</span>
									<input
										type="checkbox"
										checked={activeIdolTypes[type] || false}
										onChange={() => toggleIdolType(type)}
										className="form-checkbox h-4 w-4 text-blue-600"
									/>
								</div>
							))}
							{filteredIdolTypes.length === 0 && (
								<div className="px-4 py-2 text-gray-500">
									No idol types found.
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			<ul className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
				{filteredIdols.map((idol) => (
					// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
					<li
						key={idol.Code}
						className="rounded border p-2 shadow"
						onClick={() => copyTradeText(idol.str)}
					>
						<h2 className="font-semibold text-md">{idol.Code}</h2>

						<p
							className="text-gray-600"
							// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
							dangerouslySetInnerHTML={{ __html: idol.str }}
						/>
						<p className="mt-1 text-sm">
							Mechanic: {idolNameToMechanic(idol.Name)} | Min Level:{" "}
							{idol.Level} | Size: {idolTypeToSize(idol.Type)}
						</p>
					</li>
				))}
			</ul>
			{filteredIdols.length === 0 && (
				<p className="mt-4 text-center">No idols found matching your search.</p>
			)}
		</div>
	);
}

export default IdolList;
