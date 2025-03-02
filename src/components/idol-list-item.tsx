import { type EnrichedIdolData, idolTypeToSize } from "@/helpers/idol";

interface IdolListItemProps {
	idol: EnrichedIdolData;
	copyTradeText: (tradeStr: string) => void;
}

function IdolListItem({ idol, copyTradeText }: IdolListItemProps) {
	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<li
			key={idol.Code}
			className="flex flex-col rounded border p-2 shadow"
			onClick={() => copyTradeText(idol.str)}
		>
			<h2 className="break-all font-semibold text-md">{idol.Code}</h2>
			<p
				className="text-gray-600"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
				dangerouslySetInnerHTML={{ __html: idol.str }}
			/>
			<p className="mt-auto text-sm">
				Mechanic: {idol.Mechanic} | Min Level: {idol.Level} | Size:{" "}
				{idolTypeToSize(idol.Type)}
			</p>
		</li>
	);
}

export default IdolListItem;
