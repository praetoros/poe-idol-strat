import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { type IdolType, IdolTypes } from "@/models/idol.ts";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

type IdolComboboxTypeProps = {
	activeIdolTypes: Record<IdolType, boolean>;
	toggleIdolType: (type: IdolType) => void;
};

export function IdolComboboxType({
	toggleIdolType,
	activeIdolTypes,
}: IdolComboboxTypeProps) {
	const [open, setOpen] = React.useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					// biome-ignore lint/a11y/useSemanticElements: <explanation>
					role="combobox"
					aria-expanded={open}
					className="h-14 w-72 justify-between"
				>
					Select Type (
					{Object.values(activeIdolTypes).reduce(
						(count, active) => (active ? count + 1 : count),
						0,
					)}{" "}
					Active)
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-72 p-0">
				<Command>
					<CommandInput placeholder="Search types..." />
					<CommandList>
						<CommandEmpty>No types found.</CommandEmpty>
						<CommandGroup>
							{Object.entries(activeIdolTypes).map(([type, active]) => (
								<CommandItem
									key={type}
									value={IdolTypes[type]}
									onSelect={() => {
										toggleIdolType(type);
									}}
									className="flex"
								>
									{IdolTypes[type]}
									<Check
										className={cn(
											"ml-auto h-4 w-4",
											active ? "opacity-100" : "opacity-0",
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
