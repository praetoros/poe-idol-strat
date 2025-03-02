import { ArrowDownIcon } from "@heroicons/react/24/solid";
import { useMemo, useState } from "react";
import {
	type IdolMechanic,
	IdolMechanics,
	allIdolData,
	idolNameToMechanic,
	idolTypeToSize,
} from "~/helpers/idol.ts";

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
			if (Array.isArray(idolMechanics)) {
				return idolMechanics.some((mechanic) => activeMechanics[mechanic]);
			}
			return activeMechanics[idolMechanics];
		});

		return idols;
	}, [searchQuery, activeMechanics]);

	const filteredMechanics = useMemo(() => {
		const allMechanics = Object.values(IdolMechanics);
		if (!mechanicSearchQuery) {
			return allMechanics;
		}
		const lowerCaseQuery = mechanicSearchQuery.toLowerCase();
		return allMechanics.filter((mechanic) =>
			mechanic.toLowerCase().includes(lowerCaseQuery),
		);
	}, [mechanicSearchQuery]);

	const toggleMechanic = (mechanic: IdolMechanic) => {
		setActiveMechanics((prevMechanics) => ({
			...prevMechanics,
			[mechanic]: !prevMechanics[mechanic],
		}));
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="mb-4 font-bold text-2xl">Idol List</h1>

			<div className="mb-4 flex flex-col gap-2 md:flex-row">
				<input
					type="text"
					placeholder="Search by name, description"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full rounded border border-gray-300 p-2"
				/>

				<div className="relative w-full md:w-auto">
					<input
						type="text"
						placeholder="Search mechanics"
						value={mechanicSearchQuery}
						onChange={(e) => setMechanicSearchQuery(e.target.value)}
						className="w-full rounded border border-gray-300 p-2 pr-10" // Added pr-10 for the dropdown icon
					/>
					<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
						<ArrowDownIcon className="size-6 text-blue-500" />
					</div>
					{/* Dropdown List */}
					{
						<div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
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
					}
				</div>
			</div>

			<ul className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
				{filteredIdols.map((idol) => (
					<li key={idol.Code} className="rounded border p-2 shadow">
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
