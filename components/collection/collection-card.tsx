import Link from "next/link";
import { Package } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collection } from "@/data/types";
import {
	SiNextdotjs,
	SiPython,
	SiReact,
	SiHtml5
} from "@icons-pack/react-simple-icons";

interface CollectionCardProps {
	collection: Collection & { ruleCount: number };
}

const getIconComponent = (iconName?: string) => {
	const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
		'nextdotjs': SiNextdotjs,
		'python': SiPython,
		'react': SiReact,
		'html5': SiHtml5,
	};

	const IconComponent = iconName ? iconMap[iconName] : null;
	return IconComponent;
};

export function CollectionCard({ collection }: CollectionCardProps) {
	return (
			<Card className="group transition-all duration-200 hover:shadow-md h-[200px] relative flex flex-col">
				<CardHeader className="flex-1">
					<div className="flex items-start justify-between">
						<div className="flex-1">
							<div className="flex items-center gap-2.5 mb-2">
								{(() => {
									const IconComponent = getIconComponent(collection.icon);
									return IconComponent ? (
										<IconComponent className="h-5 w-5 text-foreground" />
									) : (
										<Package className="h-6 w-6 text-muted-foreground" />
									);
								})()}
								<CardTitle className="text-lg">{collection.name}</CardTitle>
							</div>
							<CardDescription className="line-clamp-2">
								{collection.description}
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="pt-0 mt-auto">
					<div className="flex items-center justify-between">
						<span className="text-sm text-muted-foreground -mb-4">
							{collection.ruleCount}{" "}
							{collection.ruleCount === 1 ? "rule" : "rules"}
						</span>
						<Link href={`/collections/${collection.slug}`} className="block">
							<Button
								variant="outline"
								size="sm"
								className="opacity-0 group-hover:opacity-100 transition-opacity"
							>
								View
							</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
	);
}
