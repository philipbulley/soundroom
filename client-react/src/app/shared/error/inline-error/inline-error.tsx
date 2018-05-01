import * as React from 'react';
import styled from 'styled-components';
import colors from '../../colors/colors';

const InlineError: React.StatelessComponent<Props> = ({
	message,
	status,
	children,
	className
}: Props) => {
	const statusStr = typeof status !== 'undefined' ? 'status:' + status : null;

	const extra =
		statusStr && message ? statusStr + ' | ' + message : statusStr || message;

	return (
		<div className={className}>
			{children} <ExtraInfo>{extra && `[${extra}]`}</ExtraInfo>
		</div>
	);
};

interface Props {
	/** An error message potentially from the server */
	message?: string;

	/* The network status code if available */
	status?: number;

	/** A custom user-friendly error message */
	children?: any;

	className?: string;
}

const ExtraInfo = styled.div`
	display: inline;
	color: ${colors.black};
	font-size: 0.7em;
`;

export default styled(InlineError)`
	padding: 10px;
	background-color: ${colors.red};
	color: ${colors.white};
`;
