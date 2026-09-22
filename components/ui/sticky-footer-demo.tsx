import React from 'react';
import { StickyFooter } from "@/components/ui/sticky-footer";
import { ArrowDownIcon } from 'lucide-react';

export default function StickyFooterDemo() {
	return (
		<div className="relative w-full">
			<div className="flex h-screen flex-col items-center justify-center gap-10">
				<h1 className="max-w-xl text-center">
					<span className="text-foreground/80 text-4xl font-semibold">
						example of
					</span>
					<br />
					<span className="text-5xl font-bold">Sticky Footer</span>
				</h1>
				<div className="flex items-center gap-2">
					<p>Scroll down</p>
					<ArrowDownIcon className="size-4" />
				</div>
			</div>
			<StickyFooter />
		</div>
	);
}
