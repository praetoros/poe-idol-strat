// components/idol-list-item.tsx (Modified)
import { type EnrichedIdolData, idolTypeToSize } from "@/helpers/idol";
import { toast } from "sonner";

interface IdolListItemProps {
	idol: EnrichedIdolData;
}

function copyTradeText(tradeStr: string, type: number) {
	const tempDiv = document.createElement("div");
	tempDiv.innerHTML = tradeStr;

	const spans = tempDiv.querySelectorAll("span");
	for (const span of spans) {
		const spanReplacement = `${span.textContent?.startsWith("+") ? "+" : ""}#`;
		span.parentNode?.insertBefore(
			document.createTextNode(spanReplacement),
			span,
		);
		span.parentNode?.removeChild(span);
	}

	if (type === 0) {
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

	if (textToCopy) {
		if (navigator.clipboard) {
			navigator.clipboard
				.writeText(textToCopy)
				.then(() => {
					if (type === 0) {
						toast("Trade search text copied to clipboard. (First line only)");
					} else {
						toast("Trade search text copied to clipboard.");
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
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<li
			key={idol.Code}
			className="flex flex-col rounded border p-2 shadow"
			onClick={() => copyTradeText(idol.str, idol.Type)}
		>
			<h2 className="font-semibold text-md">
				{idol.Code.replace(/_/g, " ").replace(/\b\w/g, (char) =>
					char.toUpperCase(),
				)}
			</h2>
			<p
				// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
				dangerouslySetInnerHTML={{ __html: idol.str }}
				className="[&>span]:font-bold [&>span]:text-green-600"
			/>
			<p className="mt-auto text-sm">
				Mechanic: {idol.Mechanic} | Min Level: {idol.Level} | Size:{" "}
				{idolTypeToSize(idol.Type)}
				{idol.Type !== 0 && (
					<>
						{" "}
						|{" "}
						<span
							className={
								idol.Affix === "Suffix" ? "text-red-600" : "text-blue-600"
							}
						>
							{idol.Affix}
						</span>
					</>
				)}
			</p>
		</li>
	);
}

export default IdolListItem;
