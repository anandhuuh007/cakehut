import React from 'react';
import { cn } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';
import {
	FacebookIcon,
	FrameIcon,
	InstagramIcon,
	YoutubeIcon,
} from 'lucide-react';
import { Button } from './button';

interface FooterLink {
	title: string;
	href: string;
	icon?: React.ComponentType<{ className?: string }>;
}
interface FooterLinkGroup {
	label: string;
	links: FooterLink[];
}

type StickyFooterProps = React.ComponentProps<'footer'>;

export function StickyFooter({ className, ...props }: StickyFooterProps) {
	return (
		<footer
			className={cn('relative h-[720px] w-full', className)}
			style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}
			{...props}
		>
			<div className="fixed bottom-0 h-[720px] w-full bg-zinc-950 text-white">
				<div className="sticky top-[calc(100vh-720px)] h-full overflow-y-auto">
					<div className="relative flex size-full flex-col justify-between gap-5 border-t border-white/10 px-4 py-16 md:px-12">
						<div
							aria-hidden
							className="absolute inset-0 isolate z-0 contain-strict pointer-events-none"
						>
							<div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,rgba(255,255,255,0.06)_0,rgba(255,255,255,0.02)_50%,transparent_80%)] absolute top-0 left-0 h-[320px] w-[140px] -translate-y-[87.5px] -rotate-45 rounded-full" />
							<div className="bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.04)_0,rgba(255,255,255,0.01)_80%,transparent_100%)] absolute top-0 left-0 h-[320px] w-[60px] translate-x-[5%] -translate-y-1/2 -rotate-45 rounded-full" />
						</div>
						<div className="mt-10 flex flex-col gap-12 md:flex-row xl:mt-0 z-10">
							<AnimatedContainer className="w-full max-w-sm min-w-[16rem] space-y-6">
								<h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                                    <FrameIcon className="size-8 text-primary" />
                                    Sweet Layers
                                </h2>
								<p className="text-zinc-400 mt-8 text-sm leading-relaxed md:mt-0">
									Contact with us. We bake the finest cakes and pastries using premium ingredients, crafted with passion and dedication to sweetness.
								</p>
								<div className="flex gap-3">
									{socialLinks.map((link) => (
										<Button key={link.title} size="icon" variant="outline" className="size-10 rounded-full border-zinc-800 bg-zinc-900/50 hover:bg-primary hover:text-white hover:border-primary transition-colors text-zinc-300">
											<link.icon className="size-4" />
										</Button>
									))}
								</div>
							</AnimatedContainer>
							
                            <div className="flex gap-12 w-full flex-wrap lg:flex-nowrap justify-between md:justify-end">
                                {footerLinkGroups.map((group, index) => (
                                    <AnimatedContainer
                                        key={group.label}
                                        delay={0.1 + index * 0.1}
                                        className="w-auto min-w-[120px]"
                                    >
                                        <div className="mb-10 md:mb-0">
                                            <h3 className="text-xs uppercase tracking-wider font-semibold text-white/80">{group.label}</h3>
                                            <ul className="text-zinc-400 mt-6 space-y-3 text-sm">
                                                {group.links.map((link) => (
                                                    <li key={link.title}>
                                                        <a
                                                            href={link.href}
                                                            className="hover:text-primary inline-flex items-center transition-colors duration-300"
                                                        >
                                                            {link.icon && <link.icon className="me-2 size-4" />}
                                                            {link.title}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </AnimatedContainer>
                                ))}
                                
                                <AnimatedContainer delay={0.4} className="w-auto min-w-[180px] max-w-xs">
                                    <div className="mb-10 md:mb-0">
                                        <h3 className="text-xs uppercase tracking-wider font-semibold text-white/80">Payments Accepted</h3>
                                        <p className="text-zinc-400 mt-6 text-sm leading-relaxed mb-4">
                                            Currently we accept Cash on Delivery and UPI payments.
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            <div className="bg-white p-2 rounded flex items-center justify-center shadow-inner hover:scale-105 transition-transform cursor-pointer h-10 w-16">
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" className="h-full w-full object-contain" />
                                            </div>
                                            <div className="bg-white p-2 rounded flex items-center justify-center shadow-inner hover:scale-105 transition-transform cursor-pointer h-10 w-16">
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" alt="PhonePe" className="h-full w-full object-contain" />
                                            </div>
                                            <div className="bg-white p-2 rounded flex items-center justify-center shadow-inner hover:scale-105 transition-transform cursor-pointer h-10 w-16">
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="Paytm" className="h-full w-full object-contain" />
                                            </div>
                                            <div className="bg-white p-2 rounded flex items-center justify-center shadow-inner hover:scale-105 transition-transform cursor-pointer h-10 w-16">
                                                <img src="https://navi.com/static/media/naviLogo.c2380d7b.svg" alt="Navi" className="h-full w-full object-contain rounded-sm" />
                                            </div>
                                        </div>
                                    </div>
                                </AnimatedContainer>
                            </div>
						</div>
						<div className="text-zinc-500 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm md:flex-row z-10">
							<p>© 2026 Sweet Layers Bakery. All rights reserved.</p>
							<div className="flex gap-4">
                                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                                <a href="#" className="hover:text-white transition-colors">Terms</a>
                            </div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}

const socialLinks = [
	{ title: 'Facebook', href: '#', icon: FacebookIcon },
	{ title: 'Instagram', href: '#', icon: InstagramIcon },
	{ title: 'Youtube', href: '#', icon: YoutubeIcon },
];

const footerLinkGroups: FooterLinkGroup[] = [
	{
		label: 'Shop',
		links: [
			{ title: 'Our Cakes', href: '#' },
			{ title: 'Breads', href: '#' },
			{ title: 'Pastries', href: '#' },
			{ title: 'Cafe', href: '#' },
		],
	},
	{
		label: 'Customer Support',
		links: [
			{ title: 'Contact Us', href: '#' },
			{ title: 'Help Center', href: '#' },
			{ title: 'Policy and Terms', href: '#' },
		],
	},
];

type AnimatedContainerProps = React.ComponentProps<typeof motion.div> & {
	children?: React.ReactNode;
	delay?: number;
};

function AnimatedContainer({
	delay = 0.1,
	children,
	...props
}: AnimatedContainerProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return children;
	}

	return (
		<motion.div
			initial={{ filter: 'blur(4px)', translateY: 15, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.8 }}
			{...props}
		>
			{children}
		</motion.div>
	);
}
