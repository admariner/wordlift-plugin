/**
 * External dependencies
 */
import styled from 'styled-components';

export const Wrapper = styled.div`
	display: block;
	position: relative;
	box-sizing: border-box;
	overflow: hidden;
	border-radius: 2px;
	margin: 8px auto;
	width: 248px;
	height: 32px;
	font-family: OpenSans;
	background-color: #f5f5f5;
	box-shadow: 0 4px 4px -3px rgba(0,0,0,.25), 0 8px 8px -6px rgba(0,0,0,.25);
	transition: all 150ms ease-out;
	&:hover {
		transform: scale( ${ props => 0 < props.entity.occurrences.length ? 1 : 1.01 } ); 
	};
`;

export const Main = styled.div`
	display: block;
	position: absolute;
	left: ${ props => props.open ? '-248px' : 0 };
	top: 0;
	bottom: 0;
	box-sizing: border-box;
	width: 248px;
	height: 32px;
	transition: left 200ms ease;
`;

export const Count = styled.div`
	display: inline-block;
	position: relative;
	margin: 8px;
	width: 16px;
	height: 16px;
	border-radius: 2px;
	padding: 2px 0;
	text-align: center;
	font-weight: 600;
	font-size: 12px;
	color: #FFFFFF;
	letter-spacing: -0.21px;
	line-height: 12px;
	user-select: none;
	background-color: ${ props => 0 < props.entity.occurrences.length ? '#2e92ff' : '#c7c7c7' };
`;

export const Label = styled.div`
	display: inline-block;
	position: relative;
	box-sizing: border-box;
	max-width: 200px;
	height: 32px;
	line-height: 32px;
	font-weight: 600;
	font-size: 12px;
	user-select: none;
	color: ${ props => 0 < props.entity.occurrences.length ? '#2e92ff' : '#c7c7c7' };
`;

export const Cloud = styled.i`
	display: block;
	position: absolute;
	right: 20px;
	top: 8px;
	font-size: 14px;
	line-height: 1;
	color: #CBCBCB;
	user-select: none;
	transition: opacity 150ms ease;
	opacity: ${ props => 0 < props.entity.occurrences.length ? 1 : 0 }
`;

export const Trigger = styled.div`
	display: ${ props => 0 < props.entity.occurrences.length ? 'block' : 'none' };
	transition: opacity 150ms ease;
	opacity: ${ props => 0 < props.entity.occurrences.length ? 1 : 0 }
	position: absolute;
	right: 0;
	top: 0;
	bottom: 0;
	box-sizing: border-box;
	width: 16px;
	height: 32px;
	padding: 8px 4px;
	background-color: #f1f1f1;
`;

export const Arrow = styled.div`
	display: block;
	width: 8px;
	height: 8px;
	border-top: 8px solid transparent;
	border-bottom: 8px solid transparent;
	border-left: 8px solid #7d7d7d;
	border-radius: 16px;
	transition: transform 150ms ease;
	transform: rotate( ${ props => props.open ? 180 : 0 }deg );
	&:hover {
		border-left-color: #fccd34;
	} 
`;
