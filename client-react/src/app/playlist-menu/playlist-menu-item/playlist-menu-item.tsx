import * as React from 'react';
import styled from 'styled-components';
import Icon from '../../shared/icon/icon';
import colors from '../../shared/colors/colors';
import PlaylistMenuItemCloseButton from './playlist-menu-item-close-button';
import { Link } from 'react-router-dom';
import { Playlist } from '../../shared/model/playlist';
import Button from '../../shared/button/button';

class PlaylistMenuItem extends React.Component<PlaylistMenuItemProps> {
	name: HTMLHeadingElement;
	joinButton: HTMLButtonElement;

	// doTransition = (node, done) => {
	// 	const { in: inProp, playlist } = this.props;
	//
	// 	console.log('PlaylistMenuItem.doTransition():', playlist.name, inProp ? 'IN' : 'OUT');
	//
	// 	if (this.tl) {
	// 		this.tl.kill();
	// 	}
	//
	// 	this.tl = new TimelineMax();
	//
	// 	if (inProp) {
	// 		console.log('in tween:', this.name, this.joinButton);
	// 		this.tl.add(
	// 			[
	// 				TweenMax.fromTo(
	// 					this.name,
	// 					0.8,
	// 					{ y: 30, opacity: 0 },
	// 					{
	// 						y: 0,
	// 						opacity: 1,
	// 						ease: Expo.easeOut
	// 					}
	// 				),
	// 				TweenMax.fromTo(
	// 					this.joinButton,
	// 					0.8,
	// 					{ y: 30, opacity: 0 },
	// 					{
	// 						y: 0,
	// 						opacity: 1,
	// 						ease: Expo.easeOut,
	// 						onComplete: () => {
	// 							console.log('About to call done():', playlist.name);
	// 							done();
	// 						}
	// 					}
	// 				)
	// 			],
	// 			null,
	// 			null,
	// 			0.2
	// 		);
	// 	} else {
	// 		this.tl.add(
	// 			TweenMax.to(this.name, 0.5, {
	// 				scale: 0.5,
	// 				ease: Back.easeIn,
	// 				onComplete: () => {
	// 					console.log('About to call done():', playlist.name);
	// 					done();
	// 				}
	// 			})
	// 		);
	// 	}
	// };

	setNameRef = ref => (this.name = ref);
	setJoinButtonRef = ref => (this.joinButton = ref);

	render() {
		const { playlist, className } = this.props;

		return (
			<PlaylistMenuItemStyled className={className}>
				<PlaylistMenuItemCloseButton noStyle>
					<Icon id="close" />
				</PlaylistMenuItemCloseButton>

				<h3 className="name" ref={this.setNameRef}>
					{playlist.name}
				</h3>

				<Link className="button" to={'/room/' + playlist._id}>
					<Button innerRef={this.setJoinButtonRef}>Join Room</Button>
				</Link>
			</PlaylistMenuItemStyled>
		);
	}
}

interface PlaylistMenuItemProps {
	playlist: Playlist;
	className?: string;
	index: number;
}

const PlaylistMenuItemStyled = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	padding: 30px;
	text-align: center;
	background-color: ${colors.white};
`;
PlaylistMenuItemStyled.displayName = 'Host';

export default PlaylistMenuItem;
