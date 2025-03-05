import { ArrowDownIcon } from "@heroicons/react/24/solid";
import { forwardRef } from "react";

interface IdolTypeDropdownProps {
	idolTypeSearchQuery: string;
	setIdolTypeSearchQuery: (query: string) => void;
	showIdolTypeDropdown: boolean;
	setShowIdolTypeDropdown: (show: boolean) => void;
	filteredIdolTypes: number[];
	activeIdolTypes: Record<number, boolean>;
	toggleIdolType: (type: number) => void;
}

const getIdolTypeName = (type: number): string => {
	switch (type) {
		case 0:
			return "Unique";
		case 1:
			return "1x1";
		case 2:
			return "1x2,2x1";
		case 3:
			return "1x3,3x1";
		case 4:
			return "2x2";
		default:
			return "Unknown";
	}
};

const IdolTypeDropdown = forwardRef<HTMLDivElement, IdolTypeDropdownProps>(
	(
		{
			idolTypeSearchQuery,
			setIdolTypeSearchQuery,
			showIdolTypeDropdown,
			setShowIdolTypeDropdown,
			filteredIdolTypes,
			activeIdolTypes,
			toggleIdolType,
		},
		ref,
	) => {
		return (
			<div className="relative w-full" ref={ref}>
				<input
					type="text"
					placeholder="Search idol types"
					value={idolTypeSearchQuery}
					onChange={(e) => setIdolTypeSearchQuery(e.target.value)}
					onClick={() => setShowIdolTypeDropdown(true)}
					className="w-full rounded border border-border p-2 pr-10"
				/>
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
				<div
					className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
					onClick={() => setShowIdolTypeDropdown(!showIdolTypeDropdown)}
				>
					<ArrowDownIcon className="size-6 text-blue-500" />
				</div>
				{showIdolTypeDropdown && (
					<div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-muted text-muted-foreground shadow-lg">
						{filteredIdolTypes.map((type) => (
							// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
							<div
								key={type}
								className="flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-background"
								onClick={() => toggleIdolType(type)}
							>
								<span>{getIdolTypeName(type)}</span>
								<input
									type="checkbox"
									checked={activeIdolTypes[type] || false}
									onChange={() => toggleIdolType(type)}
									className="form-checkbox h-4 w-4 text-blue-600"
								/>
							</div>
						))}
						{filteredIdolTypes.length === 0 && (
							<div className="px-4 py-2 text-foreground">
								No idol types found.
							</div>
						)}
					</div>
				)}
			</div>
		);
	},
);
IdolTypeDropdown.displayName = "IdolTypeDropdown";

export default IdolTypeDropdown;
