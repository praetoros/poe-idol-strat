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
import type { IdolAffix } from "@/models/idol.ts";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

type IdolComboboxTypeProps = {
	activeIdolAffixes: Record<IdolAffix, boolean>;
	toggleIdolAffix: (affix: IdolAffix) => void;
};

export function IdolComboboxAffix({
	activeIdolAffixes,
	toggleIdolAffix,
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
					className="h-14 w-52 justify-between"
				>
					Select Affix (
					{Object.values(activeIdolAffixes).reduce(
						(count, active) => (active ? count + 1 : count),
						0,
					)}{" "}
					Active)
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-52 p-0">
				<Command>
					<CommandInput placeholder="Search affixes..." />
					<CommandList>
						<CommandEmpty>No affix found.</CommandEmpty>
						<CommandGroup>
							{Object.entries(activeIdolAffixes).map(([affix, active]) => (
								<CommandItem
									key={affix}
									value={affix}
									onSelect={() => {
										toggleIdolAffix(affix);
									}}
									className="flex"
								>
									{affix}
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
