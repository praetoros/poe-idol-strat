import { Button } from "@/components/ui/button.tsx";
import {
	type EnrichedIdolData,
	type IdolType,
	IdolTypes,
	idolColourClass,
} from "@/models/idol.ts";
import { Clipboard } from "lucide-react";
import { toast } from "sonner";

interface IdolListItemProps {
	idol: EnrichedIdolData;
}

function getText(str: string, type: IdolType, copyType: "Trade" | "Stash") {
	const tempDiv = document.createElement("div");
	tempDiv.innerHTML = str;

	const spans = tempDiv.querySelectorAll("span");
	for (const span of spans) {
		if (copyType === "Trade") {
			const spanReplacement = `${span.textContent?.startsWith("+") ? "+" : ""}#`;
			span.parentNode?.insertBefore(
				document.createTextNode(spanReplacement),
				span,
			);
		}
		if (copyType === "Stash") {
			const spanReplacement = `${span.textContent?.startsWith("+") ? `+""` : `""`}`;
			span.parentNode?.insertBefore(
				document.createTextNode(spanReplacement),
				span,
			);
		}
		span.parentNode?.removeChild(span);
	}

	if (type === IdolTypes.Idol0) {
		const firstLine = tempDiv.innerHTML?.split("<br>")[0];
		if (firstLine) {
			tempDiv.textContent = firstLine;
		} else {
			toast("Failed to copy text. Please report this on GitHub");
			return;
		}
	} else {
		const breaks = tempDiv.querySelectorAll("br");
		for (const br of breaks) {
			br.parentNode?.insertBefore(document.createTextNode(" "), br);
			br.parentNode?.removeChild(br);
		}
	}

	const textToCopy = tempDiv.textContent || tempDiv.innerText;
	const trimmed =
		copyType === "Stash" ? textToCopy.substring(0, 48) : textToCopy;
	return copyType === "Stash" ? `"${trimmed}"` : trimmed;
}

function copyText(str: string, type: IdolType, copyType: "Trade" | "Stash") {
	const textToCopy = getText(str, type, copyType);

	if (textToCopy) {
		if (navigator.clipboard) {
			navigator.clipboard
				.writeText(textToCopy)
				.then(() => {
					if (type === IdolTypes.Idol0) {
						toast(
							`${copyType} search text copied to clipboard. (First line only)`,
						);
					} else {
						toast(`${copyType} search text copied to clipboard.`);
					}
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

function IdolListItem({ idol }: IdolListItemProps) {
	return (
		<li key={idol.Code} className="flex flex-col rounded border p-2 shadow">
			<h2 className="font-semibold text-md">{idol.DisplayCode}</h2>
			<p
				// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
				dangerouslySetInnerHTML={{ __html: idol.str }}
				className="[&>span]:font-bold [&>span]:text-green-600"
			/>
			<div className="mt-auto text-sm">
				<p>
					Mechanic: {idol.Mechanic} |{" "}
					{idol.Level !== "0" ? `Min Level: ${idol.Level} | ` : ""}Size:{" "}
					{idol.Size} |{" "}
					<span className={idolColourClass(idol)}>{idol.Affix}</span>
				</p>
				<div className="flex gap-2 p-0">
					<Button
						onClick={() => copyText(idol.str, idol.Type, "Trade")}
						className="h-5 max-w-2/5 p-1"
					>
						<Clipboard className="hidden h-4 w-4 md:block" />
						Trade
					</Button>
					<Button
						onClick={() => copyText(idol.str, idol.Type, "Stash")}
						className="h-5 max-w-2/5 p-1"
					>
						<Clipboard className="hidden h-4 w-4 md:block" />
						Stash
					</Button>
				</div>
			</div>
		</li>
	);
}

export default IdolListItem;
