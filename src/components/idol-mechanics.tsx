import { useMemo, useState } from "react";
import { allIdolData, idolNameToMechanic } from "~/helpers/idol.ts";

function IdolMechanics() {
	const [searchQuery, setSearchQuery] = useState("");

	const allIdolMechanics = useMemo(() => {
		const allIdolNames = Array.from(
			new Set(allIdolData.map((idol) => idol.Name)),
		);

		return Array.from(new Set(allIdolNames.map(idolNameToMechanic)));
	}, []);
	const filteredIdolMechanics = useMemo(() => {
		if (!searchQuery) {
			return allIdolMechanics;
		}
		const lowerCaseQuery = searchQuery.toLowerCase();
		return allIdolMechanics.filter((idol) =>
			idol.toLowerCase().includes(lowerCaseQuery),
		);
	}, [searchQuery, allIdolMechanics]);

	return (
		<div className="container mx-auto p-4">
			<h1 className="mb-4 font-bold text-2xl">Idol Mechanic List</h1>

			<input
				type="text"
				placeholder="Search by name or description..."
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				className="mb-4 w-full rounded border border-gray-300 p-2"
			/>

			<ul className="grid grid-cols-4 gap-2">
				{filteredIdolMechanics.map((mechanic) => (
					<li key={mechanic} className="rounded border p-2 shadow">
						{mechanic}
					</li>
				))}
			</ul>
			{filteredIdolMechanics.length === 0 && searchQuery && (
				<p className="mt-4 text-center">No idols found matching your search.</p>
			)}
		</div>
	);
}

export default IdolMechanics;
