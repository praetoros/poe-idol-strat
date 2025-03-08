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
import type { IdolMechanic } from "@/models/idol.ts";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

type IdolComboboxMechanicProps = {
	activeMechanics: Record<IdolMechanic, boolean>;
	toggleMechanic: (mechanic: IdolMechanic) => void;
	toggleAllMechanics: (enable: boolean) => void;
};

export function IdolComboboxMechanic({
	toggleMechanic,
	activeMechanics,
	toggleAllMechanics,
}: IdolComboboxMechanicProps) {
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
					Select Mechanic (
					{Object.values(activeMechanics).reduce(
						(count, active) => (active ? count + 1 : count),
						0,
					)}{" "}
					Active)
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-72 p-0">
				<Command>
					<CommandInput placeholder="Search mechanic..." />
					<CommandList>
						<CommandEmpty>No mechanics found.</CommandEmpty>
						<CommandGroup>
							<CommandItem
								value="enableAll"
								onSelect={() => {
									toggleAllMechanics(true);
								}}
							>
								Enable All
							</CommandItem>
							<CommandItem
								value="disableAll"
								onSelect={() => {
									toggleAllMechanics(false);
								}}
							>
								Disable All
							</CommandItem>
							<hr className="my-1" />
							{Object.entries(activeMechanics).map(([mechanic, active]) => (
								<CommandItem
									key={mechanic}
									value={mechanic}
									onSelect={() => {
										toggleMechanic(mechanic);
									}}
									className="flex"
								>
									{mechanic}
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
