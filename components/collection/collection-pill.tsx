import Link from "next/link";
import { Package } from "lucide-react";
import { Collection } from "@/data/types";
import { SiNextdotjs, SiPython, SiReact, SiHtml5 } from "@icons-pack/react-simple-icons";

interface CollectionPillProps {
	collection: Collection & { ruleCount: number };
}

const getIconComponent = (iconName?: string) => {
	const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
		nextdotjs: SiNextdotjs,
		python: SiPython,
		react: SiReact,
		html5: SiHtml5,
	};

	const IconComponent = iconName ? iconMap[iconName] : null;
	return IconComponent;
};

export function CollectionPill({ collection }: CollectionPillProps) {
	const IconComponent = getIconComponent(collection.icon);

	return (
		<Link href={`/collections/${collection.slug}`} className="block">
			<div className="group transition-all duration-200 hover:shadow-md bg-background border rounded-full px-5 py-4 flex items-center gap-3 hover:border-foreground/20">
				<div className="flex items-center gap-2.5">
					{IconComponent ? (
						<IconComponent className="h-4 w-4 text-foreground" />
					) : (
						<Package className="h-4 w-4 text-muted-foreground" />
					)}
					<span className="font-medium text-sm">
						{collection.name} ({collection.ruleCount}{" "}
						{collection.ruleCount === 1 ? "rule" : "rules"})
					</span>
				</div>
			</div>
		</Link>
	);
}
