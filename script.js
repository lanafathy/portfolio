import React from 'react';
import { Helmet } from 'react-helmet';
import HeroSection from '@/components/HeroSection.jsx';
import AboutSection from '@/components/AboutSection.jsx';
import ExperienceSection from '@/components/ExperienceSection.jsx';
import EducationSection from '@/components/EducationSection.jsx';
import SkillsSection from '@/components/SkillsSection.jsx';
import ProjectsSection from '@/components/ProjectsSection.jsx';
import SwimmingCareerSection from '@/components/SwimmingCareerSection.jsx';
import MissEcoTeenSection from '@/components/MissEcoTeenSection.jsx';
import LanguagesSection from '@/components/LanguagesSection.jsx';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Lana Mohamed Fathy - Cybersecurity & Networks Specialist | Portfolio</title>
        <meta 
          name="description" 
          content="Portfolio of Lana Mohamed Fathy, Computer Science student specializing in Networks & Cyber Security. Experienced in SOC operations, DFIR, penetration testing, and cloud security." 
        />
      </Helmet>
      
      <main className="bg-slate-900">
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <EducationSection />
        <SkillsSection />
        <ProjectsSection />
        <SwimmingCareerSection />
        <MissEcoTeenSection />
        <LanguagesSection />
      </main>
    </>
  );
};

export default HomePage;
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
	<App />
);
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}
import { useState, useEffect } from "react"

const TOAST_LIMIT = 1

let count = 0
function generateId() {
	count = (count + 1) % Number.MAX_VALUE
	return count.toString()
}

const toastStore = {
	state: {
		toasts: [],
	},
	listeners: [],

	getState: () => toastStore.state,

	setState: (nextState) => {
		if (typeof nextState === 'function') {
			toastStore.state = nextState(toastStore.state)
		} else {
			toastStore.state = { ...toastStore.state, ...nextState }
		}

		toastStore.listeners.forEach(listener => listener(toastStore.state))
	},

	subscribe: (listener) => {
		toastStore.listeners.push(listener)
		return () => {
			toastStore.listeners = toastStore.listeners.filter(l => l !== listener)
		}
	}
}

export const toast = ({ ...props }) => {
	const id = generateId()

	const update = (props) =>
		toastStore.setState((state) => ({
			...state,
			toasts: state.toasts.map((t) =>
				t.id === id ? { ...t, ...props } : t
			),
		}))

	const dismiss = () => toastStore.setState((state) => ({
		...state,
		toasts: state.toasts.filter((t) => t.id !== id),
	}))

	toastStore.setState((state) => ({
		...state,
		toasts: [
			{ ...props, id, dismiss },
			...state.toasts,
		].slice(0, TOAST_LIMIT),
	}))

	return {
		id,
		dismiss,
		update,
	}
}

export function useToast() {
	const [state, setState] = useState(toastStore.getState())

	useEffect(() => {
		const unsubscribe = toastStore.subscribe((state) => {
			setState(state)
		})

		return unsubscribe
	}, [])

	useEffect(() => {
		const timeouts = []

		state.toasts.forEach((toast) => {
			if (toast.duration === Infinity) {
				return
			}

			const timeout = setTimeout(() => {
				toast.dismiss()
			}, toast.duration || 5000)

			timeouts.push(timeout)
		})

		return () => {
			timeouts.forEach((timeout) => clearTimeout(timeout))
		}
	}, [state.toasts])

	return {
		toast,
		toasts: state.toasts,
	}
}
import {
	Toast,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import React from 'react';

export function Toaster() {
	const { toasts } = useToast();

	return (
		<ToastProvider>
			{toasts.map(({ id, title, description, action, ...props }) => {
				return (
					<Toast key={id} {...props}>
						<div className="grid gap-1">
							{title && <ToastTitle>{title}</ToastTitle>}
							{description && (
								<ToastDescription>{description}</ToastDescription>
							)}
						</div>
						{action}
						<ToastClose />
					</Toast>
				);
			})}
			<ToastViewport />
		</ToastProvider>
	);
}
import { cn } from '@/lib/utils';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva } from 'class-variance-authority';
import { X } from 'lucide-react';
import React from 'react';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
	<ToastPrimitives.Viewport
		ref={ref}
		className={cn(
			'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
			className,
		)}
		{...props}
	/>
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
	'data-[swipe=move]:transition-none group relative pointer-events-auto flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full data-[state=closed]:slide-out-to-right-full',
	{
		variants: {
			variant: {
				default: 'bg-background border',
				destructive:
          'group destructive border-destructive bg-destructive text-destructive-foreground',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
);

const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
	return (
		<ToastPrimitives.Root
			ref={ref}
			className={cn(toastVariants({ variant }), className)}
			{...props}
		/>
	);
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
	<ToastPrimitives.Action
		ref={ref}
		className={cn(
			'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-destructive/30 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive',
			className,
		)}
		{...props}
	/>
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
	<ToastPrimitives.Close
		ref={ref}
		className={cn(
			'absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600',
			className,
		)}
		toast-close=""
		{...props}
	>
		<X className="h-4 w-4" />
	</ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
	<ToastPrimitives.Title
		ref={ref}
		className={cn('text-sm font-semibold', className)}
		{...props}
	/>
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
	<ToastPrimitives.Description
		ref={ref}
		className={cn('text-sm opacity-90', className)}
		{...props}
	/>
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

export {
	Toast,
	ToastAction,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
};import { cn } from '@/lib/utils';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva } from 'class-variance-authority';
import { X } from 'lucide-react';
import React from 'react';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
	<ToastPrimitives.Viewport
		ref={ref}
		className={cn(
			'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
			className,
		)}
		{...props}
	/>
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
	'data-[swipe=move]:transition-none group relative pointer-events-auto flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full data-[state=closed]:slide-out-to-right-full',
	{
		variants: {
			variant: {
				default: 'bg-background border',
				destructive:
          'group destructive border-destructive bg-destructive text-destructive-foreground',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
);

const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
	return (
		<ToastPrimitives.Root
			ref={ref}
			className={cn(toastVariants({ variant }), className)}
			{...props}
		/>
	);
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
	<ToastPrimitives.Action
		ref={ref}
		className={cn(
			'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-destructive/30 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive',
			className,
		)}
		{...props}
	/>
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
	<ToastPrimitives.Close
		ref={ref}
		className={cn(
			'absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600',
			className,
		)}
		toast-close=""
		{...props}
	>
		<X className="h-4 w-4" />
	</ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
	<ToastPrimitives.Title
		ref={ref}
		className={cn('text-sm font-semibold', className)}
		{...props}
	/>
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
	<ToastPrimitives.Description
		ref={ref}
		className={cn('text-sm opacity-90', className)}
		{...props}
	/>
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

export {
	Toast,
	ToastAction,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
};
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import React from 'react';

const buttonVariants = cva(
	'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/90',
				destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
				outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
				secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 rounded-md px-3',
				lg: 'h-11 rounded-md px-8',
				icon: 'h-10 w-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	const Comp = asChild ? Slot : 'button';
	return (
		<Comp
			className={cn(buttonVariants({ variant, size, className }))}
			ref={ref}
			{...props}
		/>
	);
});
Button.displayName = 'Button';

export { Button, buttonVariants };
import React from 'react';
import { motion } from 'framer-motion';
import { Waves, Trophy, Medal, Award, Star } from 'lucide-react';

const SwimmingCareerSection = () => {
  const achievements = [
    {
      title: 'Professional Swimmer',
      subtitle: 'AL-Ahly Club',
      period: 'Since 2013',
      description: 'Long-term commitment to competitive swimming excellence at one of Egypt\'s most prestigious sporting institutions.',
      icon: Waves,
      color: 'text-cyan-400',
      bg: 'bg-cyan-400/10',
      border: 'border-cyan-400/20'
    },
    {
      title: 'Regional Competitions',
      subtitle: 'Multiple Medals',
      period: 'Consistent Winner',
      description: 'Achieved numerous medals across various swimming styles in regional level competitions and championships.',
      icon: Trophy,
      color: 'text-teal-400',
      bg: 'bg-teal-400/10',
      border: 'border-teal-400/20'
    },
    {
      title: 'National Championships',
      subtitle: 'Elite Athlete',
      period: 'Competitive Excellence',
      description: 'Represented Egypt in national swimming championships, demonstrating athletic discipline and competitive prowess.',
      icon: Medal,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      border: 'border-blue-400/20'
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section id="swimming" className="py-16 md:py-24 bg-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-full" 
          style={{
            backgroundImage: 'radial-gradient(circle at 100% 0%, cyan 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>
      
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4 flex items-center gap-3">
            <span className="text-cyan-400 font-mono text-2xl">06.</span>
            Professional Swimmer
            <div className="flex-1 h-px bg-slate-700 ml-4 max-w-xs"></div>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl">
            Dedicated professional athlete at AL-Ahly Club with a legacy of competitive excellence and regional/national achievements.
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 lg:gap-8"
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className={`relative p-6 rounded-xl bg-slate-800/50 backdrop-blur-sm border ${achievement.border} hover:shadow-2xl hover:shadow-cyan-400/10 transition-all duration-300 group`}
            >
              <div className={`w-14 h-14 rounded-lg ${achievement.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <achievement.icon className={`w-8 h-8 ${achievement.color}`} />
              </div>
              
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Award className="w-16 h-16 text-slate-100" />
              </div>

              <h3 className="text-xl font-bold text-slate-100 mb-1">{achievement.title}</h3>
              <p className={`text-sm font-semibold ${achievement.color} mb-3`}>{achievement.subtitle}</p>
              
              <div className="flex items-center gap-2 mb-4 text-slate-400 text-sm">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span>{achievement.period}</span>
              </div>
              
              <p className="text-slate-300 leading-relaxed text-sm">
                {achievement.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SwimmingCareerSection;
import React from 'react';
import { motion } from 'framer-motion';

const SkillsSection = () => {
  const skillCategories = [
    {
      title: 'Cybersecurity & Networking',
      skills: [
        'CCNA', 'Network Security', 'Signal Processing', 'SOC Operations',
        'DFIR (Digital Forensics & Incident Response)', 'Penetration Testing',
        'GRC (Governance, Risk & Compliance)', 'Threat Analysis',
        'Vulnerability Assessment', 'Security Monitoring'
      ],
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      title: 'Programming Languages',
      skills: [
        'Python', 'C++', 'Java', 'C#', 'SQL',
        'Data Structures & Algorithms (DSA)', 'Object-Oriented Programming',
        'Database Management', 'Software Development'
      ],
      gradient: 'from-teal-500 to-cyan-500'
    },
    {
      title: 'Tools & Platforms',
      skills: [
        'Linux', 'Visual Studio', 'MSSQL Server', 'Arduino',
        'IBM QRadar (SIEM)', 'EDR/XDR Platforms', 'KAPE (DFIR Tool)',
        'Git & Version Control', 'Command Line Interface'
      ],
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      title: 'Cryptography',
      skills: [
        'DES (Data Encryption Standard)', 'AES (Advanced Encryption Standard)',
        'RSA (Rivest-Shamir-Adleman)', 'LFSR (Linear Feedback Shift Register)',
        'Error Detection & Correction', 'Hash Functions',
        'Digital Signatures', 'Public Key Infrastructure'
      ],
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Cloud & Data Protection',
      skills: [
        'Microsoft 365', 'Microsoft Azure', 'Microsoft Purview',
        'Cloud Security', 'Data Loss Prevention', 'Identity & Access Management',
        'Compliance Management', 'Cloud Infrastructure Security'
      ],
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      title: 'Soft Skills',
      skills: [
        'Problem Solving', 'Critical Thinking', 'Team Collaboration',
        'Communication', 'Time Management', 'Adaptability',
        'Attention to Detail', 'Continuous Learning'
      ],
      gradient: 'from-pink-500 to-rose-500'
    }
  ];

  return (
    <section id="skills" className="py-16 md:py-24 bg-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" 
          style={{
            backgroundImage: 'linear-gradient(45deg, transparent 48%, cyan 50%, transparent 52%)',
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4 flex items-center gap-3">
            <span className="text-cyan-400 font-mono text-2xl">04.</span>
            Skills & Expertise
            <div className="flex-1 h-px bg-slate-700 ml-4 max-w-xs"></div>
          </h2>
          
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * categoryIndex }}
                className="p-6 rounded-xl bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 hover:border-cyan-400/30 transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                  <div className={`w-1 h-6 bg-gradient-to-b ${category.gradient} rounded-full`}></div>
                  {category.title}
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.span
                      key={skillIndex}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.03 * skillIndex }}
                      whileHover={{ scale: 1.1, y: -2 }}
                      className={`px-3 py-1.5 rounded-lg bg-gradient-to-r ${category.gradient} bg-opacity-10 text-slate-100 text-sm font-medium border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 cursor-default`}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
import { useLocation } from 'react-router-dom';
import { useLayoutEffect } from 'react';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [pathname]);

    return null;
}

export default ScrollToTop;
import React from 'react';
import { motion } from 'framer-motion';
import { Code2, ExternalLink } from 'lucide-react';

const ProjectsSection = () => {
  const projects = [
    {
      title: 'Arcadia Game Engine',
      description: 'Developed a comprehensive game engine with advanced graphics rendering, physics simulation, and game logic implementation. Features include collision detection, sprite management, and scene handling.',
      technologies: ['C++', 'Graphics Programming', 'Physics Engine', 'Game Development'],
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      title: 'Encryption/Decryption Systems',
      description: 'Implemented multiple cryptographic algorithms including DES, AES, RSA, and LFSR. Created secure communication systems with error detection and correction mechanisms.',
      technologies: ['Java', 'Cryptography', 'DES', 'AES', 'RSA', 'Security'],
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Print Job Queue Scheduler',
      description: 'Built an efficient print job scheduling system using advanced data structures. Implemented priority queues and optimized algorithms for job management and resource allocation.',
      technologies: ['C++', 'Data Structures', 'Algorithms', 'Queue Management'],
      gradient: 'from-teal-500 to-cyan-500'
    },
    {
      title: 'Browser Navigation System',
      description: 'Developed a browser-like navigation system with forward/backward functionality, history management, and bookmark features using stack and queue data structures.',
      technologies: ['C++', 'Data Structures', 'Stack', 'Queue', 'UI Design'],
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      title: 'Transportation System',
      description: 'Created a comprehensive transportation management system with database integration. Features include route planning, vehicle tracking, and passenger management with SQL database backend.',
      technologies: ['C#', 'SQL', 'Database Design', 'MSSQL Server', 'System Design'],
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      title: 'Hospital Admission System',
      description: 'Designed and implemented a hospital patient admission and management system. Includes patient records, appointment scheduling, and medical history tracking.',
      technologies: ['C++', 'Data Management', 'File Handling', 'System Architecture'],
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      title: 'Line Follower Vehicle',
      description: 'Built an autonomous line-following robot using Arduino. Implemented sensor integration, motor control, and path-following algorithms for precise navigation.',
      technologies: ['Arduino', 'C/C++', 'Sensors', 'Motor Control', 'Embedded Systems'],
      gradient: 'from-green-500 to-teal-500'
    },
    {
      title: 'Rotating LED Display',
      description: 'Created a persistence of vision (POV) display using Arduino and LEDs. Programmed synchronized LED patterns to create rotating visual displays and animations.',
      technologies: ['Arduino', 'C/C++', 'LED Control', 'Timing', 'Hardware Integration'],
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Calculator Application',
      description: 'Developed a feature-rich calculator application with graphical user interface using Python Tkinter. Supports basic and advanced mathematical operations.',
      technologies: ['Python', 'Tkinter', 'GUI Development', 'Event Handling'],
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section id="projects" className="py-16 md:py-24 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" 
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, cyan 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4 flex items-center gap-3">
            <span className="text-cyan-400 font-mono text-2xl">05.</span>
            Projects
            <div className="flex-1 h-px bg-slate-700 ml-4 max-w-xs"></div>
          </h2>
          
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * index }}
                whileHover={{ y: -8 }}
                className="group relative p-6 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-cyan-400/10"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${project.gradient} bg-opacity-10`}>
                    <Code2 className="w-6 h-6 text-cyan-400" />
                  </div>
                  <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors cursor-pointer" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-cyan-400 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 text-xs font-medium text-cyan-400 bg-cyan-400/10 rounded border border-cyan-400/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Star, Award, Sparkles } from 'lucide-react';

const MissEcoTeenSection = () => {
  return (
    <section id="pageant" className="py-16 bg-slate-800/50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full" 
          style={{
            backgroundImage: 'linear-gradient(45deg, transparent 48%, teal 50%, transparent 52%)',
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border border-cyan-400/30 shadow-2xl shadow-cyan-400/5 p-8 md:p-12"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Crown className="w-48 h-48 text-cyan-400 rotate-12" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-400 text-sm font-medium mb-6 border border-cyan-400/20"
            >
              <Sparkles className="w-4 h-4" />
              Achievement
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4 leading-tight">
              Miss Eco Teen <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
                Fitness 2021
              </span>
            </h2>
            
            <p className="text-slate-300 text-lg mb-8 leading-relaxed max-w-xl">
              Honored winner of the Miss Eco Teen Fitness Egypt 2021 pageant, representing environmental advocacy, 
              fitness excellence, and commitment to healthy living and social responsibility.
            </p>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <Crown className="w-8 h-8 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-slate-100 font-bold text-lg">2021 Winner</h3>
                <p className="text-slate-400">Miss Eco Teen Fitness Egypt</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MissEcoTeenSection;
import React from 'react';
import { motion } from 'framer-motion';
import { Languages, Globe, MessageCircle } from 'lucide-react';

const LanguagesSection = () => {
  const languages = [
    { 
      name: 'English', 
      level: 'Fluent', 
      description: 'Professional working proficiency',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      name: 'Arabic', 
      level: 'Native', 
      description: 'Mother tongue',
      color: 'from-emerald-500 to-teal-500'
    },
    { 
      name: 'French', 
      level: 'Intermediate', 
      description: 'Conversational proficiency',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <section id="languages" className="py-16 bg-slate-900 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4 flex items-center gap-3">
            <span className="text-cyan-400 font-mono text-2xl">07.</span>
            Languages
            <div className="flex-1 h-px bg-slate-700 ml-4 max-w-xs"></div>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {languages.map((lang, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative p-6 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-cyan-400/30 transition-all duration-300"
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${lang.color} rounded-t-xl opacity-50 group-hover:opacity-100 transition-opacity`} />
              
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 group-hover:border-cyan-400/30 transition-colors">
                  <Globe className="w-6 h-6 text-slate-300 group-hover:text-cyan-400 transition-colors" />
                </div>
                <span className="px-3 py-1 text-xs font-medium text-slate-300 bg-slate-700/50 rounded-full border border-slate-600">
                  {lang.level}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-100 mb-2">{lang.name}</h3>
              <p className="text-slate-400 text-sm">{lang.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LanguagesSection;
import React from 'react';
import { motion } from 'framer-motion';
import { Languages, Trophy, Medal, Award } from 'lucide-react';

const LanguagesAwardsSection = () => {
  const languages = [
    { name: 'English', proficiency: 'Fluent' },
    { name: 'Arabic', proficiency: 'Native' },
    { name: 'French', proficiency: 'Intermediate' }
  ];

  const awards = [
    {
      title: 'AL-Ahly Swimming Club Member',
      description: 'Active member of one of Egypt\'s most prestigious swimming clubs',
      icon: Medal
    },
    {
      title: 'Professional Swimmer',
      description: 'Multiple medals and achievements in competitive swimming (2017-2023)',
      icon: Trophy
    },
    {
      title: 'Miss Eco Teen Egypt 2021',
      description: 'Winner of Miss Eco Teen Egypt beauty pageant',
      icon: Award
    },
    {
      title: 'Miss Fitness Egypt 2021',
      description: 'Winner of Miss Fitness Egypt competition',
      icon: Award
    }
  ];

  return (
    <section id="awards" className="py-16 md:py-24 bg-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" 
          style={{
            backgroundImage: 'linear-gradient(90deg, transparent 49%, teal 50%, transparent 51%)',
            backgroundSize: '80px 80px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4 flex items-center gap-3">
            <span className="text-cyan-400 font-mono text-2xl">06.</span>
            Languages & Awards
            <div className="flex-1 h-px bg-slate-700 ml-4 max-w-xs"></div>
          </h2>
          
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            {/* Languages */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3">
                <Languages className="w-7 h-7 text-cyan-400" />
                Languages
              </h3>
              
              <div className="space-y-4">
                {languages.map((lang, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                    className="p-5 rounded-lg bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-slate-100">{lang.name}</span>
                      <span className="px-3 py-1 text-sm font-medium text-cyan-400 bg-cyan-400/10 rounded-full border border-cyan-400/20">
                        {lang.proficiency}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Awards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3">
                <Trophy className="w-7 h-7 text-cyan-400" />
                Awards & Achievements
              </h3>
              
              <div className="space-y-4">
                {awards.map((award, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                    className="p-5 rounded-lg bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-cyan-400/10 rounded-lg flex-shrink-0">
                        <award.icon className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-slate-100 mb-1">
                          {award.title}
                        </h4>
                        <p className="text-slate-400 text-sm leading-relaxed">
                          {award.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LanguagesAwardsSection;
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import profileImage from 'C:\Users\lanam\Downloads\port.png';

const HeroSection = () => {
  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 lg:py-0"
      style={{
        backgroundImage: `linear-gradient(rgba(10, 25, 47, 0.9), rgba(17, 34, 64, 0.95)), url('https://images.unsplash.com/photo-1699843526854-250e2aca1a60')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          
          {/* Text Content - Left Side on Desktop, Top on Mobile */}
          <motion.div 
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.p 
              className="text-cyan-400 text-lg md:text-xl font-mono mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Hi, my name is
            </motion.p>
            
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-100 mb-4 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Lana Mohamed Fathy
            </motion.h1>
            
            <motion.h2 
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-400 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Undergraduate Computer Science Student
            </motion.h2>
            
            <motion.p 
              className="text-xl md:text-2xl text-cyan-400 font-semibold mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Networks & Cyber Security Specialist
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 md:gap-6 text-slate-300 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-400" />
                <span className="text-base md:text-lg">Cairo, Egypt</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-cyan-400" />
                <a href="mailto:lana.mohamed04@gmail.com" className="text-base md:text-lg hover:text-cyan-400 transition-colors">
                  lana.mohamed04@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-cyan-400" />
                <a href="tel:01096109189" className="text-base md:text-lg hover:text-cyan-400 transition-colors">
                  01096109189
                </a>
              </div>
            </motion.div>
            
            <motion.p 
              className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              Passionate about securing digital infrastructures and defending against cyber threats. 
              Specializing in network security, threat analysis, and digital forensics.
            </motion.p>
            
            <motion.div
              className="flex justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <a 
                href="#contact" 
                className="inline-block px-8 py-4 bg-transparent border-2 border-cyan-400 text-cyan-400 rounded-lg font-semibold text-lg hover:bg-cyan-400/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/20"
              >
                Get In Touch
              </a>
            </motion.div>
          </motion.div>

          {/* Image Content - Right Side on Desktop, Bottom on Mobile */}
          <motion.div 
            className="flex-1 relative w-full max-w-md lg:max-w-lg"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative">
              {/* Glassmorphism Frame */}
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-teal-500/20 rounded-2xl blur-xl transform rotate-3 scale-105 opacity-60"></div>
              
              <div className="relative p-3 bg-slate-800/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-900/50">
                {/* Corner Accents */}
                <div className="absolute -top-1 -left-1 w-16 h-16 border-t-2 border-l-2 border-cyan-400/60 rounded-tl-2xl pointer-events-none"></div>
                <div className="absolute -bottom-1 -right-1 w-16 h-16 border-b-2 border-r-2 border-teal-400/60 rounded-br-2xl pointer-events-none"></div>
                
                <div className="relative rounded-xl overflow-hidden aspect-[3/4] w-full bg-slate-900">
                  <img 
                    src={profileImage} 
                    alt="Lana Mohamed Fathy - Professional Portrait" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Subtle overlay for better integration with dark theme */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent pointer-events-none"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-cyan-400 rounded-full flex justify-center">
          <motion.div
            className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Education', href: '#education' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Awards', href: '#awards' },
    { name: 'Contact', href: '#contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-900/95 backdrop-blur-md shadow-lg shadow-cyan-400/5' 
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#home');
            }}
            className="text-xl md:text-2xl font-bold text-slate-100 hover:text-cyan-400 transition-colors cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-cyan-400">{'<'}</span>
            Lana Mohamed
            <span className="text-cyan-400">{' />'}</span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className="text-slate-300 hover:text-cyan-400 transition-colors font-medium cursor-pointer"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -2 }}
              >
                <span className="text-cyan-400 text-sm font-mono mr-1">0{index + 1}.</span>
                {link.name}
              </motion.a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-cyan-400 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900/98 backdrop-blur-md border-t border-slate-800"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.href);
                  }}
                  className="block text-slate-300 hover:text-cyan-400 transition-colors font-medium cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <span className="text-cyan-400 text-sm font-mono mr-2">0{index + 1}.</span>
                  {link.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Linkedin, Github, Twitter, Heart } from 'lucide-react';

const Footer = () => {
  const contactInfo = [
    { icon: Mail, text: 'lana.mohamed04@gmail.com', href: 'mailto:lana.mohamed04@gmail.com' },
    { icon: Phone, text: '01096109189', href: 'tel:01096109189' }
  ];

  const socialLinks = [
    { icon: Linkedin, href: 'https://www.linkedin.com/in/lanafathy/', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/lanafathy/', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' }
  ];

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' }
  ];

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact" className="bg-slate-900 border-t border-slate-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" 
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, cyan 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold text-slate-100 mb-4">Get In Touch</h3>
            <div className="space-y-3">
              {contactInfo.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center gap-3 text-slate-300 hover:text-cyan-400 transition-colors group"
                >
                  <item.icon className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span>{item.text}</span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-xl font-bold text-slate-100 mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.href);
                  }}
                  className="text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-bold text-slate-100 mb-4">Connect With Me</h3>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-400 transition-all duration-300 hover:scale-110"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-800">
          <p className="text-center text-slate-400 flex items-center justify-center gap-2">
            <span>© 2026 Lana Mohamed Fathy. Built with</span>
            <Heart className="w-4 h-4 text-cyan-400 fill-cyan-400" />
            <span>and React</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin } from 'lucide-react';

const ExperienceSection = () => {
  const experiences = [
    {
      title: 'Forensics Investigator Intern',
      company: 'DEPI',
      location: 'Cairo, Egypt',
      period: 'November 2025 - July 2026',
      responsibilities: [
        'Monitored security events and incidents in Security Operations Center (SOC) environment',
        'Utilized EDR/XDR platforms for endpoint threat detection and response',
        'Analyzed security logs and events using SIEM tools (IBM QRadar)',
        'Conducted digital forensics investigations using DFIR tools (KAPE)',
        'Performed phishing email analysis and threat intelligence gathering',
        'Managed security operations using Microsoft 365, Azure, and Purview',
        'Collaborated with GRC team on compliance and risk management initiatives',
        'Participated in penetration testing exercises and vulnerability assessments'
      ]
    },
    {
      title: 'Information Security Intern',
      company: 'Fawry',
      location: 'Cairo, Egypt',
      period: 'August 2025 - September 2025',
      responsibilities: [
        'Assisted in security monitoring and incident response activities',
        'Gained hands-on experience with enterprise security tools and platforms',
        'Supported SOC team in threat detection and analysis',
        'Participated in security awareness and training initiatives',
        'Contributed to security documentation and reporting processes',
        'Learned industry best practices for information security management'
      ]
    }
  ];

  return (
    <section id="experience" className="py-16 md:py-24 bg-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" 
          style={{
            backgroundImage: 'linear-gradient(90deg, transparent 49%, cyan 50%, transparent 51%)',
            backgroundSize: '80px 80px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4 flex items-center gap-3">
            <span className="text-cyan-400 font-mono text-2xl">02.</span>
            Professional Experience
            <div className="flex-1 h-px bg-slate-700 ml-4 max-w-xs"></div>
          </h2>
          
          <div className="mt-12 space-y-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 * index }}
                className="relative"
              >
                <div className="p-6 md:p-8 rounded-xl bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-400/10">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-cyan-400 mb-2 flex items-center gap-2">
                        <Briefcase className="w-6 h-6" />
                        {exp.title}
                      </h3>
                      <p className="text-lg text-slate-100 font-semibold mb-2">{exp.company}</p>
                    </div>
                    <div className="flex flex-col gap-2 text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{exp.period}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{exp.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <ul className="space-y-3 mt-6">
                    {exp.responsibilities.map((resp, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 * idx }}
                        className="flex items-start gap-3 text-slate-300"
                      >
                        <span className="text-cyan-400 mt-1.5 flex-shrink-0">▹</span>
                        <span className="leading-relaxed">{resp}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExperienceSection;
import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award, CheckCircle } from 'lucide-react';

const EducationSection = () => {
  const certificates = [
    { name: 'Sprints X Microsoft - Cybersecurity Program', issuer: 'Sprints & Microsoft' },
    { name: 'Linux Basics for Hackers', issuer: 'Linux Academy' },
    { name: 'Huawei Cybersecurity Academy', issuer: 'Huawei' },
    { name: 'HCIA-AI (Huawei Certified ICT Associate - AI)', issuer: 'Huawei' },
    { name: 'HCIA-Security (Huawei Certified ICT Associate - Security)', issuer: 'Huawei' },
    { name: 'HCIP-Security (Huawei Certified ICT Professional - Security)', issuer: 'Huawei' },
    { name: 'ITI - Network Security Course', issuer: 'Information Technology Institute' },
    { name: 'ITI - Cybersecurity Fundamentals', issuer: 'Information Technology Institute' },
    { name: 'ITI - Ethical Hacking', issuer: 'Information Technology Institute' }
  ];

  return (
    <section id="education" className="py-16 md:py-24 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" 
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, teal 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4 flex items-center gap-3">
            <span className="text-cyan-400 font-mono text-2xl">03.</span>
            Education & Certificates
            <div className="flex-1 h-px bg-slate-700 ml-4 max-w-xs"></div>
          </h2>
          
          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-12 p-6 md:p-8 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-cyan-400/30 shadow-xl shadow-cyan-400/10"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-cyan-400/10 rounded-lg">
                <GraduationCap className="w-8 h-8 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-100 mb-2">
                  Bachelor of Computers and Artificial Intelligence
                </h3>
                <p className="text-lg text-cyan-400 font-semibold mb-2">
                  Cairo University - IBCU
                </p>
                <div className="flex flex-wrap gap-4 text-slate-300 mb-3">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-400" />
                    2023 - 2027
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-400" />
                    3rd Year Student
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-400" />
                    Networks & Cyber Security Specialization
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Pursuing comprehensive education in computer science with specialized focus on network 
                  security, cryptography, and cyber defense mechanisms. Gaining deep knowledge in secure 
                  system design, threat analysis, and digital forensics.
                </p>
              </div>
            </div>
          </motion.div>
          
          {/* Certificates */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3">
              <Award className="w-7 h-7 text-cyan-400" />
              Professional Certificates
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certificates.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * index }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="p-5 rounded-lg bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/10"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-cyan-400/10 rounded">
                      <Award className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-slate-100 font-semibold mb-1 leading-tight">
                        {cert.name}
                      </h4>
                      <p className="text-slate-400 text-sm">{cert.issuer}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EducationSection;
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Network, Lock, Database, Cloud, Code } from 'lucide-react';

const AboutSection = () => {
  const expertise = [
    { icon: Network, title: 'Networking', description: 'Advanced network architecture and protocols' },
    { icon: Shield, title: 'Cyber Defense', description: 'Threat detection and incident response' },
    { icon: Lock, title: 'Cryptography', description: 'Encryption algorithms and secure communications' },
    { icon: Database, title: 'Data Protection', description: 'Information security and privacy' },
    { icon: Cloud, title: 'Cloud Security', description: 'Microsoft Azure and cloud infrastructure' },
    { icon: Code, title: 'Programming', description: 'Multi-language development expertise' }
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" 
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, cyan 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4 flex items-center gap-3">
            <span className="text-cyan-400 font-mono text-2xl">01.</span>
            About Me
            <div className="flex-1 h-px bg-slate-700 ml-4 max-w-xs"></div>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 mt-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <p className="text-slate-300 text-lg leading-relaxed">
                I am a dedicated Computer Science student at Cairo University's IBCU, specializing in 
                <span className="text-cyan-400 font-semibold"> Networks and Cyber Security</span>. 
                Currently in my third year, I am building a strong foundation in protecting digital assets 
                and securing network infrastructures.
              </p>
              
              <p className="text-slate-300 text-lg leading-relaxed">
                My expertise spans across <span className="text-cyan-400 font-semibold">network security protocols</span>, 
                <span className="text-cyan-400 font-semibold"> cryptographic algorithms</span>, and 
                <span className="text-cyan-400 font-semibold"> cyber defense strategies</span>. I have hands-on experience 
                with SOC operations, digital forensics, and threat analysis through my internships at DEPI and Fawry.
              </p>
              
              <p className="text-slate-300 text-lg leading-relaxed">
                I am passionate about staying ahead of emerging cyber threats and continuously expanding my knowledge 
                in <span className="text-cyan-400 font-semibold">cloud security</span>, 
                <span className="text-cyan-400 font-semibold"> data protection</span>, and 
                <span className="text-cyan-400 font-semibold"> penetration testing</span>. My goal is to contribute 
                to building secure, resilient systems that protect organizations from evolving cyber risks.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-4"
            >
              {expertise.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.05 }}
                  className="p-4 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300"
                >
                  <item.icon className="w-8 h-8 text-cyan-400 mb-3" />
                  <h3 className="text-slate-100 font-semibold mb-1">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
