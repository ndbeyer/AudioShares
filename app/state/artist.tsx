// flow
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { BetInfoFragment } from './bet';

export const ArtistInfoFragment = gql`
	fragment ArtistInfoFragment on Artist {
		id
		name
		image
		popularity
		followers
		monthlyListeners
		spotifyUrl
		joinableBets {
			id
		}
		monthlyListenersHistory {
			id
			monthlyListeners
			dateTime
		}
	}
`;

export type ArtistOfPlayListType = {
	id: string;
	name: string;
	image: string;
}[];

export const useArtistsOfPlaylist = (id: string): ArtistOfPlayListType | undefined | null => {
	const { data } = useQuery(
		gql`
			query artistsOfPlaylist($playlistId: ID!) {
				artistsOfPlaylist(playlistId: $playlistId) {
					id
					name
					image
				}
			}
		`,
		{
			variables: {
				playlistId: id,
			},
		}
	);

	return React.useMemo(() => data?.artistsOfPlaylist, [data]);
};

export type ArtistType = {
	id: string;
	name: string;
	image: string;
	popularity: number;
	followers: number;
	monthlyListeners: number;
	spotifyUrl: string;
	joinableBets: {
		id: string;
		artistId: string;
		listeners: number;
		type: 'HIGHER' | 'LOWER';
		startDate: string;
		endDate: string;
		quote?: number;
		supportersAmount?: number;
		contradictorsAmount?: number;
		currentUserAmount?: number;
		currentUserSupports?: boolean;
		status: string;
		listenersAtStartDate: number;
		listenersAtEndDate?: number;
	}[];
	monthlyListenersHistory: {
		id: string;
		monthlyListeners: number;
		dateTime: string;
	}[];
};

export const useArtist = (id: string): ArtistType | undefined | null => {
	const { data } = useQuery(
		gql`
			query artist($id: ID!) {
				artist(id: $id) {
					...ArtistInfoFragment
					joinableBets {
						...BetInfoFragment
					}
				}
			}
			${BetInfoFragment}
			${ArtistInfoFragment}
		`,
		{
			variables: {
				id,
			},
		}
	);

	return React.useMemo(() => data?.artist, [data]);
};
