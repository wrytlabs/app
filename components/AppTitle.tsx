interface Props {
	title?: string;
	className?: string;
	classNameTitle?: string;
	children?: React.ReactElement | React.ReactElement[];
}

export default function AppTitle({ title, className, classNameTitle, children }: Props) {
	return (
		<div className={`${className} mt-4`}>
			<span className={`${classNameTitle} font-bold text-xl`}>{title}</span>
			{children ?? null}
		</div>
	);
}
