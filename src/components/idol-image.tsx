import type React from "react";
import { IdolType } from "~/helpers/idol.ts";

interface ImageComponentProps {
	idolType: IdolType;
	height?: number;
}

const IdolImage: React.FC<ImageComponentProps> = ({
	idolType,
	height = 32,
}) => {
	const images: Record<IdolType, { asset: string; alt: string }[]> = {
		[IdolType.Idol1]: [
			{
				asset: "assets/idol_minor.webp",
				alt: "Minor Idol",
			},
		],
		[IdolType.Idol2]: [
			{
				asset: "assets/idol_kamasan.webp",
				alt: "Kamasan Idol",
			},
			{
				asset: "assets/idol_noble.webp",
				alt: "Noble Idol",
			},
		],
		[IdolType.Idol3]: [
			{
				asset: "assets/idol_totemic.webp",
				alt: "Totemic Idol",
			},
			{
				asset: "assets/idol_burial.webp",
				alt: "Burial Idol",
			},
		],
		[IdolType.Idol4]: [
			{
				asset: "assets/idol_conqueror.webp",
				alt: "Conqueror Idol",
			},
		],
	};

	return (
		<div className="flex flex-wrap gap-2">
			{images[idolType].map((image) => (
				<img
					key={image.asset}
					src={image.asset}
					alt={image.alt}
					style={{ maxHeight: height }}
				/>
			))}
		</div>
	);
};

export default IdolImage;
