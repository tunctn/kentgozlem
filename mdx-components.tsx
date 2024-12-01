import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		...components,
		p: ({ children }) => <p style={{ marginBottom: "10px" }}>{children}</p>,
		li: ({ children }) => (
			<li
				style={{
					marginLeft: "10px",
					marginBottom: "5px",
					listStyleType: "disc",
				}}
			>
				{children}
			</li>
		),
	};
}
