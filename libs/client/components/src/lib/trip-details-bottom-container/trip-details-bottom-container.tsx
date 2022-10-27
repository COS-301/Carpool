import React, { useEffect } from 'react';
import {
  Image,
  Text,
  View,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconEntypo from 'react-native-vector-icons/Entypo';
import Icons from 'react-native-vector-icons/MaterialIcons';
import IconFont from 'react-native-vector-icons/FontAwesome';
import { Button } from '@carpool/client/components';
import { useSelector, useDispatch } from 'react-redux';
import { styles } from './trip-details-bottom-container.style';
import {
  TripDetailsType,
  RootStore,
  startTrip,
  AppDispatch,
} from '@carpool/client/store';

type props = {
  trip: TripDetailsType;
  type: string;
  userId: string;
  chat: () => void;
  onPress: () => void;
  onPressUser: () => void;
  onPressStart?: () => void;
};

type Passenger = {
  userId: string;
  status: string;
  pickUp: {
    address: string;
  };
};

export function TripDetailsBottomContainer({
  trip,
  type,
  onPress,
  onPressUser,
  onPressStart,
  userId,
  chat,
}: props) {
  return (
    <>
      {trip.status === 'completed' ||
      new Date(trip.tripDate) < new Date() ? null : (
        <View style={[styles.flexCol, styles.userContainer]}>
          {trip.status !== 'active' && trip.driver.id !== userId && (
            <View style={[styles.flexRow, { flex: 1 }]}>
              <Pressable
                style={[
                  styles.flexRow,
                  {
                    flex: 12,
                  },
                ]}
                onPress={onPressUser}
              >
                <View
                  style={[
                    styles.flexRow,
                    {
                      flex: 1,
                      justifyContent: 'flex-start',
                    },
                  ]}
                >
                  <Image
                    source={{ uri: trip.driver.profilePic }}
                    resizeMode="cover"
                    style={styles.image}
                  />
                  <View>
                    <Text
                      style={[
                        styles.textLargeBlack,
                        {
                          marginBottom: 5,
                        },
                      ]}
                    >
                      {trip && trip.driver.name} {trip && trip.driver.surname}
                    </Text>
                    <Text style={styles.textMediumLight}>
                      Last trip: 1 April 2022
                    </Text>
                    <View style={styles.flexRow}>
                      {/* <Icon size={15} name="star" color="#FACC15" />
                      <Icon size={15} name="star" color="#FACC15" />
                      <Icon size={15} name="star" color="#FACC15" />
                      <Icon size={15} name="star" color="#FACC15" />
                      <Icon size={15} name="star" color="#FACC15" /> */}
                      <Icon
                        size={20}
                        name={
                          trip.driver.avgRating >= 1
                            ? 'start'
                            : trip.driver.avgRating >= 0.5
                            ? 'star-half-full'
                            : 'star-outline'
                        }
                        color="#FACC15"
                      />
                      <Icon
                        size={20}
                        name={
                          trip.driver.avgRating >= 2
                            ? 'start'
                            : trip.driver.avgRating >= 1.5
                            ? 'star-half-full'
                            : 'star-outline'
                        }
                        color="#FACC15"
                      />
                      <Icon
                        size={20}
                        name={
                          trip.driver.avgRating >= 3
                            ? 'start'
                            : trip.driver.avgRating >= 2.5
                            ? 'star-half-full'
                            : 'star-outline'
                        }
                        color="#FACC15"
                      />
                      <Icon
                        size={20}
                        name={
                          trip.driver.avgRating >= 4
                            ? 'start'
                            : trip.driver.avgRating >= 3.5
                            ? 'star-half-full'
                            : 'star-outline'
                        }
                        color="#FACC15"
                      />
                      <Icon
                        size={20}
                        name={
                          trip.driver.avgRating >= 5
                            ? 'start'
                            : trip.driver.avgRating >= 4.5
                            ? 'star-half-full'
                            : 'star-outline'
                        }
                        color="#FACC15"
                      />
                      <Text
                        style={[
                          styles.textMediumLight,
                          {
                            marginLeft: 5,
                            marginBottom: 0,
                          },
                        ]}
                      >
                        5 ratings
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
              <Pressable
                onPress={chat}
                style={[styles.shadow, styles.chatButton, { flex: 1 }]}
              >
                <Icons name="chat-bubble" color="#188aed" size={25} />
              </Pressable>
            </View>
          )}
          {Number(trip.seatsAvailable) === 0 ||
          new Date(trip.tripDate) < new Date() ||
          trip.status === 'completed' ? (
            <></>
          ) : (
            trip.driver.id !== userId &&
            !trip.passengers.some(
              (passenger: Passenger) => passenger.userId === userId
            ) && (
              <View
                style={[
                  styles.flexCol,
                  {
                    flex: 1,
                    justifyContent: 'flex-end',
                  },
                ]}
              >
                <Button title="Book Ride" onPress={onPress} />
              </View>
            )
          )}
          {trip.status === 'completed' ||
          new Date(trip.tripDate) < new Date() ? (
            <></>
          ) : (
            trip.driver.id !== userId &&
            trip.passengers.some(
              (passenger: Passenger) => passenger.userId === userId
            ) && (
              <View
                style={[
                  styles.flexRow,
                  {
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}
              >
                {trip.passengers.some(
                  (passenger: Passenger) =>
                    passenger.userId === userId &&
                    passenger.status === 'requested'
                ) && (
                  <View style={{ flex: 1, marginHorizontal: 3 }}>
                    <Pressable>
                      <View
                        style={[
                          styles.flexRow,
                          {
                            backgroundColor: '#999',
                            borderWidth: 2,
                            borderRadius: 50,
                            borderColor: '#f2cb05',
                            padding: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                          },
                        ]}
                      >
                        <IconEntypo
                          size={15}
                          name="back-in-time"
                          color="#FACC15"
                          style={{ marginRight: 10 }}
                        />
                        <Text
                          style={{
                            color: 'white',
                            textAlign: 'center',
                            fontWeight: '600',
                            fontSize: 13,
                          }}
                        >
                          Pending Approval
                        </Text>
                      </View>
                    </Pressable>
                  </View>
                )}
                {trip.status === 'completed' ||
                new Date(trip.tripDate) < new Date() ? (
                  <></>
                ) : (
                  trip.passengers.some(
                    (passenger: Passenger) =>
                      passenger.userId === userId &&
                      passenger.status === 'declined'
                  ) && (
                    <View style={{ flex: 1, marginHorizontal: 3 }}>
                      <Pressable>
                        <View
                          style={[
                            styles.flexRow,
                            {
                              backgroundColor: '#999',
                              borderWidth: 2,
                              borderRadius: 50,
                              borderColor: '#ff0000',
                              padding: 10,
                              justifyContent: 'center',
                              alignItems: 'center',
                            },
                          ]}
                        >
                          <IconFont
                            size={15}
                            name="times-circle"
                            color="#ff0000"
                            style={{ marginRight: 10 }}
                          />
                          <Text
                            style={{
                              color: 'white',
                              textAlign: 'center',
                              fontWeight: '600',
                              fontSize: 13,
                            }}
                          >
                            Request Declined
                          </Text>
                        </View>
                      </Pressable>
                    </View>
                  )
                )}
                {trip.status === 'completed' ||
                new Date(trip.tripDate) < new Date() ? (
                  <></>
                ) : (
                  trip.passengers.some(
                    (passenger: Passenger) =>
                      passenger.userId === userId &&
                      passenger.status === 'confirmed'
                  ) && (
                    <View style={{ flex: 1, marginHorizontal: 3 }}>
                      <Pressable>
                        <View
                          style={[
                            styles.flexRow,
                            {
                              backgroundColor: '#188aed',
                              borderWidth: 2,
                              borderRadius: 50,
                              borderColor: '#188aed',
                              padding: 8,
                              justifyContent: 'center',
                              alignItems: 'center',
                            },
                          ]}
                        >
                          <Text
                            style={{
                              color: 'white',
                              textAlign: 'center',
                              fontWeight: '600',
                            }}
                          >
                            Pay Now
                          </Text>
                        </View>
                      </Pressable>
                    </View>
                  )
                )}
                {trip.status === 'completed' ||
                new Date(trip.tripDate) < new Date() ? (
                  <></>
                ) : (
                  trip.passengers.some(
                    (passenger: Passenger) =>
                      passenger.userId === userId && passenger.status === 'paid'
                  ) && (
                    <View style={{ flex: 1, marginHorizontal: 3 }}>
                      <Pressable>
                        <View
                          style={[
                            styles.flexRow,
                            {
                              backgroundColor: '#bfbfbf',
                              borderWidth: 2,
                              borderRadius: 50,
                              borderColor: '#bfbfbf',
                              padding: 6.5,
                              justifyContent: 'center',
                              alignItems: 'center',
                            },
                          ]}
                        >
                          <Icon
                            size={20}
                            name="check-circle"
                            color="#03A61C"
                            style={{ marginRight: 10 }}
                          />
                          <Text
                            style={{
                              color: 'white',
                              textAlign: 'center',
                              fontWeight: '600',
                            }}
                          >
                            Confirmed
                          </Text>
                        </View>
                      </Pressable>
                    </View>
                  )
                )}
                <View
                  style={{
                    flex: 1,
                    marginHorizontal: 3,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Pressable>
                    <View
                      style={[
                        styles.flexRow,
                        {
                          backgroundColor: '#ff0000',
                          borderWidth: 2,
                          borderRadius: 50,
                          borderColor: '#ff0000',
                          padding: 8,
                          justifyContent: 'center',
                          alignItems: 'center',
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: 'white',
                          textAlign: 'center',
                          fontWeight: '600',
                        }}
                      >
                        Cancel
                      </Text>
                    </View>
                  </Pressable>
                </View>
              </View>
            )
          )}
          {trip.status === 'completed' ||
          new Date(trip.tripDate) < new Date() ? (
            <></>
          ) : trip.driver.id === userId ? (
            <View
              style={[
                styles.flexCol,
                {
                  flex: 0.8,
                  justifyContent: 'center',
                  paddingTop: 20,
                },
              ]}
            >
              {/* <Text
       style={{
         textAlign: 'center',
         paddingBottom: 10,
         fontSize: 18,
         color: '#999',
         fontWeight: '600',
       }}
     >
       Ready to start your trip?
     </Text>
     <Button title="Start Trip" onPress={onPress} /> */}
              <View style={{ flex: 1, marginHorizontal: 3 }}>
                <Pressable onPress={onPressStart}>
                  <View
                    style={[
                      styles.flexRow,
                      {
                        backgroundColor: '#188aed',
                        borderWidth: 2,
                        borderRadius: 50,
                        borderColor: '#188aed',
                        padding: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: 'white',
                        textAlign: 'center',
                        fontWeight: '600',
                        fontSize: 15,
                      }}
                    >
                      Start Trip
                    </Text>
                  </View>
                </Pressable>
              </View>
              <View
                style={{
                  flex: 1,
                  marginHorizontal: 3,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Pressable>
                  <View
                    style={[
                      styles.flexRow,
                      {
                        backgroundColor: '#ff0000',
                        borderWidth: 2,
                        borderRadius: 50,
                        borderColor: '#ff0000',
                        padding: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: 'white',
                        textAlign: 'center',
                        fontWeight: '600',
                        fontSize: 15,
                      }}
                    >
                      Cancel
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>
          ) : (
            <></>
          )}
        </View>
      )}
    </>
  );
}

export default TripDetailsBottomContainer;
