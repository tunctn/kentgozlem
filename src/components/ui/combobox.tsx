"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { LoadingBladeSpinner } from "./loading-blade-spinner";

interface ComboboxProps<T extends string | number> {
	options: Array<{ value: T; label: React.ReactNode; searchLabel?: string }>;
	initialValue: T | null;
	onChange: (value: T) => void;
	placeholder?: string;
	searchPlaceholder: string;
	empty: React.ReactNode;
	isLoading?: boolean;
	isDisabled?: boolean;
	commandInputProps?: React.ComponentProps<typeof CommandInput>;
	commandEmptyProps?: React.ComponentProps<typeof CommandEmpty>;
}
export function Combobox<T extends string | number>({
	options,
	initialValue,
	onChange,
	placeholder,
	searchPlaceholder,
	empty,
	isLoading,
	isDisabled,
	commandInputProps,
	commandEmptyProps,
}: ComboboxProps<T>) {
	const containerRef = React.useRef<HTMLDivElement>(null);
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState<T | null>(initialValue);

	return (
		<div ref={containerRef}>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						aria-expanded={open}
						isDisabled={isDisabled || isLoading}
						className={cn(
							"relative",
							"justify-between w-full bg-background border-input hover:bg-background/80 ",
							"placeholder:text-muted-foreground/40",
							"disabled:cursor-not-allowed disabled:opacity-50 min-w-0",
						)}
					>
						<span className="truncate">
							{value
								? options.find((option) => option.value === value)?.label
								: (placeholder ?? "Select...")}
						</span>
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						{isLoading && (
							<div className="absolute right-0 mr-12">
								<LoadingBladeSpinner size={15} />
							</div>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className="w-[var(--radix-popover-trigger-width)] p-0"
					container={containerRef.current}
				>
					<Command>
						<CommandInput placeholder={searchPlaceholder} {...commandInputProps} />
						<CommandList>
							<CommandEmpty {...commandEmptyProps}>{empty}</CommandEmpty>
							<CommandGroup className="min-w-0">
								{options.map((option) => (
									<CommandItem
										key={option.value}
										value={option.searchLabel ?? option.value.toString()}
										onSelect={() => {
											setValue(option.value);
											onChange(option.value);
											setOpen(false);
										}}
										className="flex items-center justify-between"
									>
										{option.label}
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												value === option.value ? "opacity-100" : "opacity-0",
											)}
										/>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}
