import { IdolComboboxAffix } from "@/components/idol-combobox-affix.tsx";
import { IdolComboboxMechanic } from "@/components/idol-combobox-mechanic.tsx";
import { IdolComboboxType } from "@/components/idol-combobox-type.tsx";
import IdolListItem from "@/components/idol-list-item.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import useIdolStore from "@/store/idolStore";
import { useEffect } from "react";

function IdolList() {
	const {
		searchQuery,
		filteredIdols,
		setSearchQuery,
		resetAll,
		activeMechanics,
		toggleMechanic,
		toggleAllMechanics,
		activeIdolTypes,
		toggleIdolType,
		activeIdolAffixes,
		toggleIdolAffix,
		refresh,
	} = useIdolStore();

	useEffect(() => {
		// Update the list of idols when the component is mounted and the URL loaded list can be generated
		refresh();
	}, [refresh]);

	return (
		<div className="container mx-auto h-full overflow-visible overflow-x-clip bg-background p-4 text-foreground">
			<div className="mb-4 flex flex-col gap-2 md:flex-row">
				<Input
					type="text"
					placeholder="Search by name or description (case insensitive, regex supported)"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="h-14 w-full rounded border border-border p-2 md:max-w-1/2"
				/>
				<IdolComboboxMechanic
					activeMechanics={activeMechanics}
					toggleMechanic={toggleMechanic}
					toggleAllMechanics={toggleAllMechanics}
				/>
				<IdolComboboxType
					activeIdolTypes={activeIdolTypes}
					toggleIdolType={toggleIdolType}
				/>
				<IdolComboboxAffix
					activeIdolAffixes={activeIdolAffixes}
					toggleIdolAffix={toggleIdolAffix}
				/>
				<Button
					onClick={resetAll}
					className="h-14 w-18 rounded bg-red-500 p-2 text-white transition-colors hover:bg-red-700"
					type="button"
				>
					Reset
				</Button>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{filteredIdols.length === 0 ? (
					<div className="col-span-full text-center text-gray-500">
						No idols found matching the current filter criteria.
					</div>
				) : (
					filteredIdols.map((idol) => (
						<IdolListItem key={idol.Code} idol={idol} />
					))
				)}
			</div>
		</div>
	);
}

export default IdolList;
