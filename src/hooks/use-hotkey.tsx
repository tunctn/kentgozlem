"use client";
import { useEffect } from "react";

interface UseHotkeyProps {
	hotkey: string;
	withCtrlOrCmd?: boolean;
	withShift?: boolean;
	action: () => void;
	enabled?: boolean;
}

export const useHotkey = ({
	hotkey,
	withCtrlOrCmd = false,
	withShift = false,
	action,
	enabled = true,
}: UseHotkeyProps) => {
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			const key = e.key?.toLowerCase();
			const checkHotkey = hotkey.toLowerCase();

			if (key !== checkHotkey) {
				return;
			}

			const isCtrlOrCmd = withCtrlOrCmd ? e.metaKey || e.ctrlKey : false;
			const isShift = withShift ? e.shiftKey : false;
			// Check if user is typing in an input field
			if (e.target instanceof HTMLInputElement) {
				return;
			}
			// Check if user is typing in a textarea
			if (e.target instanceof HTMLTextAreaElement) {
				return;
			}
			// Check if user is typing in a select element
			if (e.target instanceof HTMLSelectElement) {
				return;
			}
			// Check if user is typing in a contenteditable element
			if (e.target instanceof HTMLElement && e.target.isContentEditable) {
				return;
			}

			if (!enabled) {
				return;
			}

			let canRun = true;
			if (withCtrlOrCmd && !isCtrlOrCmd) canRun = false;
			if (withShift && !isShift) canRun = false;

			if (canRun) {
				action();
			}
		};

		document.addEventListener("keydown", handler);

		return () => {
			document.removeEventListener("keydown", handler);
		};
	}, [hotkey, action, enabled, withCtrlOrCmd, withShift]);
};
