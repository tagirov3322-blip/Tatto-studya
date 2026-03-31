'use client';
import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { PhoneIcon, MailIcon, MapPinIcon, CameraIcon, MessageCircleIcon } from 'lucide-react';

interface FooterLink {
	title: string;
	href: string;
	icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
	label: string;
	links: FooterLink[];
}

const footerLinks: FooterSection[] = [
	{
		label: 'Навигация',
		links: [
			{ title: 'Главная', href: '#hero' },
			{ title: 'Портфолио', href: '#portfolio' },
			{ title: 'Мастера', href: '#masters' },
			{ title: 'Обучение', href: '#training' },
		],
	},
	{
		label: 'Услуги',
		links: [
			{ title: 'Тату', href: '#tattoo-price' },
			{ title: 'Пирсинг', href: '#piercing-price' },
			{ title: 'Обучение', href: '#training' },
		],
	},
	{
		label: 'Информация',
		links: [
			{ title: 'FAQ', href: '#faq' },
			{ title: 'Контакты', href: '#contacts' },
			{ title: 'Политика конфиденциальности', href: '/privacy' },
			{ title: 'Пользовательское соглашение', href: '/terms' },
		],
	},
	{
		label: 'Соцсети',
		links: [
			{ title: 'ВКонтакте', href: '#', icon: CameraIcon },
			{ title: 'Telegram', href: '#', icon: MessageCircleIcon },
			{ title: 'Телефон', href: 'tel:+74951234567', icon: PhoneIcon },
			{ title: 'Почта', href: 'mailto:hello@klyaksa.ink', icon: MailIcon },
		],
	},
];

export function Footer() {
	return (
		<footer className="md:rounded-t-6xl relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center rounded-t-4xl border-t border-green-500/20 bg-[radial-gradient(35%_128px_at_50%_0%,rgba(34,197,94,0.08),transparent)] px-6 py-12 lg:py-16">
			<div className="bg-green-500/30 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />

			<div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
				<AnimatedContainer className="space-y-4">
					<h2 className="text-3xl font-bold text-green-400 tracking-tight">КЛЯКСА</h2>
					<p className="text-neutral-500 mt-8 text-sm md:mt-0">
						Тату · пирсинг · обучение
					</p>
					<div className="flex items-center gap-2 text-neutral-400 text-sm">
						<MapPinIcon className="size-4 text-green-500" />
						<span>Набережные Челны, пр. Сююмбике, 2/19</span>
					</div>
					<p className="text-neutral-600 text-xs">
						© {new Date().getFullYear()} Клякса. Все права защищены.
					</p>
				</AnimatedContainer>

				<div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8 xl:col-span-2 xl:mt-0">
					{footerLinks.map((section, index) => (
						<AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
							<div className="mb-10 md:mb-0">
								<h3 className="text-xs text-green-400 uppercase tracking-wider">{section.label}</h3>
								<ul className="text-neutral-500 mt-4 space-y-2 text-sm">
									{section.links.map((link) => (
										<li key={link.title}>
											<a
												href={link.href}
												className="hover:text-green-400 inline-flex items-center transition-all duration-300"
											>
												{link.icon && <link.icon className="me-1 size-4" />}
												{link.title}
											</a>
										</li>
									))}
								</ul>
							</div>
						</AnimatedContainer>
					))}
				</div>
			</div>
		</footer>
	);
}

type ViewAnimationProps = {
	delay?: number;
	className?: ComponentProps<typeof motion.div>['className'];
	children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <>{children}</>;
	}

	return (
		<motion.div
			initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.8 }}
			className={className}
		>
			{children}
		</motion.div>
	);
}
