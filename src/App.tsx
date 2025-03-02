import { useMemo, useState } from "react";
import { allIdolData } from "~/helpers/idol.ts";

function App() {
	const [searchQuery, setSearchQuery] = useState("");
	const filteredIdols = useMemo(() => {
		if (!searchQuery) {
			return allIdolData;
		}
		const lowerCaseQuery = searchQuery.toLowerCase();
		return allIdolData.filter(
			(idol) =>
				idol.Name.toLowerCase().includes(lowerCaseQuery) ||
				idol.str.toLowerCase().includes(lowerCaseQuery),
		);
	}, [searchQuery]);

	return (
		<div className="container mx-auto p-4">
			<h1 className="mb-4 font-bold text-2xl">Idol List</h1>

			<input
				type="text"
				placeholder="Search by name or description..."
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				className="mb-4 w-full rounded border border-gray-300 p-2"
			/>

			<ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{filteredIdols.map((idol) => (
					<li key={idol.Code} className="rounded border p-4 shadow">
						<h2 className="font-semibold text-lg">{idol.Name}</h2>
						<p className="text-gray-600">{idol.str}</p>
						<p className="mt-2 text-sm">Level: {idol.Level}</p>
						{/* Add other details as needed */}
					</li>
				))}
			</ul>
			{filteredIdols.length === 0 && searchQuery && (
				<p className="mt-4 text-center">No idols found matching your search.</p>
			)}
		</div>
	);
}

export default App;
