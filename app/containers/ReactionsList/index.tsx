import React, { useState } from 'react';
import { View, Dimensions } from 'react-native';
import { TabView } from 'react-native-tab-view';

import { TGetCustomEmoji } from '../../definitions/IEmoji';
import { IReaction } from '../../definitions';
import I18n from '../../i18n';
import styles from './styles';
import AllTab from './AllTab';
import UsersList from './UsersList';
import ReactionsTabBar from './ReactionsTabBar';

interface IReactionsListProps {
	getCustomEmoji: TGetCustomEmoji;
	reactions?: IReaction[];
}

const ReactionsList = ({ reactions, getCustomEmoji }: IReactionsListProps): React.ReactElement => {

	const sortedReactions = reactions?.sort((a, b) => b.usernames.length - a.usernames.length) || [];
	const allTabLabel = { emoji: I18n.t('All'), usernames: [], names: [], _id: 'All' };

	const [index, setIndex] = useState(0);
	const [routes] = useState([
		{ key: 'all', title: I18n.t('All') },
		...sortedReactions.map(reaction => ({ key: reaction.emoji, title: reaction.emoji }))
	]);

	const renderScene = ({ route }: { route: { key: string } }) => {
		if (route.key === 'all') {
			return <AllTab reactions={sortedReactions} getCustomEmoji={getCustomEmoji} tabLabel={allTabLabel} />;
		}
		const reaction = sortedReactions.find(r => r.emoji === route.key);
		return reaction ? <UsersList tabLabel={reaction} /> : null;
	};

	return (
		<View style={styles.container} testID='reactionsList'>
			<TabView
				navigationState={{ index, routes }}
				renderScene={renderScene}
				onIndexChange={setIndex}
				initialLayout={{ width: Dimensions.get('window').width }}
				renderTabBar={props => <ReactionsTabBar {...props} getCustomEmoji={getCustomEmoji} tabs={sortedReactions} />}
			/>
		</View>
	);
};

export default ReactionsList;
