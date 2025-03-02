import type { IdolMechanic } from "@/helpers/idol";
import { ArrowDownIcon } from "@heroicons/react/24/solid";
import { forwardRef } from "react";

interface MechanicDropdownProps {
	mechanicSearchQuery: string;
	setMechanicSearchQuery: (query: string) => void;
	showMechanicDropdown: boolean;
	setShowMechanicDropdown: (show: boolean) => void;
	filteredMechanics: IdolMechanic[];
	activeMechanics: Record<IdolMechanic, boolean>;
	toggleMechanic: (mechanic: IdolMechanic) => void;
	allMechanicsSelected: boolean;
	toggleAllMechanics: () => void;
}

const MechanicDropdown = forwardRef<HTMLDivElement, MechanicDropdownProps>(
	(
		{
			mechanicSearchQuery,
			setMechanicSearchQuery,
			showMechanicDropdown,
			setShowMechanicDropdown,
			filteredMechanics,
			activeMechanics,
			toggleMechanic,
			allMechanicsSelected,
			toggleAllMechanics,
		},
		ref,
	) => {
		return (
			<div className="relative w-full md:w-auto" ref={ref}>
				<input
					type="text"
					placeholder="Search mechanics"
					value={mechanicSearchQuery}
					onChange={(e) => setMechanicSearchQuery(e.target.value)}
					onClick={() => setShowMechanicDropdown(true)}
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
						<hr className="border-gray-300" />
						{filteredMechanics.map((mechanic) => (
							// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
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
							<div className="px-4 py-2 text-gray-500">No mechanics found.</div>
						)}
					</div>
				)}
			</div>
		);
	},
);
MechanicDropdown.displayName = "MechanicDropdown";

export default MechanicDropdown;
