import { User, Driver } from '@carpool/api/authentication/entities';
import {
  Trip,
  Booking,
  Location,
  BookingStatusUpdate,
  ReviewsStatusUpdate,
  Reviews,
  TripByMonth,
  Notification,
  BookingRequest,
} from '@carpool/api/trips/entities';
import { TripsService } from '@carpool/api/trips/service';
import {
  Args,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
  Subscription,
} from '@nestjs/graphql';
import { AuthService } from '@carpool/api/authentication/service';

import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver(() => Trip)
export class TripsResolver {
  constructor(
    private readonly tripsService: TripsService,
    private readonly authService: AuthService
  ) {}

  @ResolveField(() => [Booking])
  async coordinates(@Root() trip: Trip): Promise<Location[]> {
    return await this.tripsService.findCoordinatesByTrip(trip.tripId);
  }

  @ResolveField(() => [Location])
  async passengers(@Root() trip: Trip): Promise<Booking[]> {
    return await this.tripsService.findBookingByTrip(trip.tripId);
  }

  @ResolveField(() => User)
  async driver(@Root() trip: Trip): Promise<User> {
    return await this.authService.findUserById(trip.driverId);
  }

  @Subscription(() => Notification, { name: 'requestReceived' })
  requestReceived() {
    return pubSub.asyncIterator('requestReceived');
  }

  @Subscription(() => [Notification], { name: 'tripStarted' })
  tripStarted() {
    return pubSub.asyncIterator('tripStarted');
  }

  /**
   * Query to find all trips
   * @returns {Promise<Trip[]>}
   */
  @Query(() => [Trip])
  async findAllTrips(): Promise<Trip[]> {
    return await this.tripsService.findAll();
  }

  /**
   * Query to find all notifications
   * @returns {Promise<Notification[]>}
   */
  @Query(() => [Notification])
  async findAllNotifications(@Args('id') id: string): Promise<Notification[]> {
    return await this.tripsService.findAllNotifications(id);
  }

  /**
   * Query to delete all message notifications
   * @returns {Promise<null>}
   */
  @Mutation(() => String)
  async deleteMessageNotifications(
    @Args('userId') userId: string
  ): Promise<string> {
    return await this.tripsService.deleteMessageNotifications(userId);
  }

  @Mutation(() => String)
  async deleteBookingRequestNotification(
    @Args('userId') userId: string,
    @Args('entity') entity: string
  ): Promise<string> {
    return await this.tripsService.deleteBookingRequestNotification(
      userId,
      entity
    );
  }

  @Mutation(() => String)
  async deleteBookingAcceptedNotification(
    @Args('userId') userId: string,
    @Args('entity') entity: string
  ): Promise<string> {
    return await this.tripsService.deleteBookingAcceptedNotification(
      userId,
      entity
    );
  }

  /**
   * Query to find number of trips for month
   * @returns {Promise<number>}
   */
  @Query(() => Number)
  async findTripsForMonth(): Promise<number> {
    return await this.tripsService.findTripsForMonth();
  }

  @Query(() => [Booking])
  async findBookingsByUser(@Args('userId') userId: string): Promise<Booking[]> {
    return await this.tripsService.findBookingsByUser(userId);
  }

  @Query(() => [TripByMonth])
  async findTripsByMonth(): Promise<TripByMonth[]> {
    return await this.tripsService.findTripsByMonth();
  }

  /**
   * Query to find number of bookings for month
   * @returns {Promise<number>}
   */
  @Query(() => Number)
  async findBookingsForMonth(): Promise<number> {
    return await this.tripsService.findBookingsForMonth();
  }

  /**
   * Query to find a trip by id
   * @param {string} id The id of the trip to find
   * @returns {Promise<Trip>}
   */
  @Query(() => Trip)
  async findTripById(@Args('id') id: string): Promise<Trip> {
    return await this.tripsService.findTripById(id);
  }

  /**
   * Query to find trips by driver id
   * @param {string} id The id of the driver to find the trips by
   * @returns {Promise<Trip[]>}
   */
  @Query(() => [Trip])
  async findByDriver(@Args('id') id: string): Promise<Trip[]> {
    return await this.tripsService.findByDriver(id);
  }

  /**
   * Query to find trips by driver id
   * @param {string} id The id of the driver to find the trips by
   * @returns {Promise<Trip[]>}
   */
  @Query(() => [Trip])
  async findByDriverForDashboard(@Args('id') id: string): Promise<Trip[]> {
    return await this.tripsService.findByDriverForDashboard(id);
  }

  /**
   * Query to find trips by passenger id
   * @param {string} id The id of the passenger to find the trips by
   * @returns {Promise<Trip[]>}
   */
  @Query(() => [Trip])
  async findByPassenger(@Args('id') id: string): Promise<Trip[]> {
    return await this.tripsService.findByPassenger(id);
  }

  /**
   * Query to find upcoming trip for user
   * @param {string} id The id of the passenger to find the trips by
   * @returns {Promise<Trip>}
   */
  @Query(() => Trip)
  async findUpcomingTrip(@Args('id') id: string): Promise<Trip | null> {
    return await this.tripsService.findUpcomingTrip(id);
  }

  @Query(() => Booking)
  async findBookingByTripAndUserId(
    @Args('tripId') tripId: string,
    @Args('userId') userId: string
  ): Promise<Booking> {
    return await this.tripsService.findBookingByTripAndUserId(tripId, userId);
  }

  @Query(() => [Trip])
  async findByConfirmedTrips(@Args('id') id: string): Promise<Trip[]> {
    return await this.tripsService.findByConfirmedTrips(id);
  }

  @Query(() => [Trip])
  async findByRequestedTrips(@Args('id') id: string): Promise<Trip[]> {
    return await this.tripsService.findByRequestedTrips(id);
  }

  @Query(() => [Trip])
  async findByPassengerReviews(@Args('id') id: string): Promise<Trip[]> {
    return await this.tripsService.findByPassengerReviews(id);
  }

  @Query(() => [Trip])
  async findByDriverReviews(@Args('id') id: string): Promise<Trip[]> {
    return await this.tripsService.findByDriverReviews(id);
  }

  @Query(() => BookingRequest)
  async findTripByBooking(
    @Args('bookingId') bookingId: string
  ): Promise<BookingRequest | null> {
    return await this.tripsService.findTripByBooking(bookingId);
  }

  @Query(() => [Trip])
  async findAllPassengers(@Args('id') id: string): Promise<Trip[]> {
    return await this.tripsService.findAllPassengers(id);
  }

  @Query(() => [Trip])
  async searchTrips(
    @Args('date') date: string,
    @Args('startLongitude') startLongitude: string,
    @Args('startLatitude') startLatitude: string,
    @Args('destinationLongitude') destinationLongitude: string,
    @Args('destinationLatitude') destinationLatitude: string
  ): Promise<Trip[] | null> {
    const trips = await this.tripsService.searchTrips(date);

    const searchResults = [];

    if (trips.length !== 0) {
      trips.map((trip) => {
        if (
          trip.coordinates[0].longitude === startLongitude &&
          trip.coordinates[0].latitude === startLatitude &&
          trip.coordinates[1].longitude === destinationLongitude &&
          trip.coordinates[1].latitude === destinationLatitude
        ) {
          searchResults.push(trip);
        }
      });
    }

    return searchResults;
  }

  @Mutation(() => Trip)
  async create(
    @Args('driver') driver: string,
    @Args('tripDate') tripDate: string,
    @Args('seatsAvailable') seatsAvailable: string,
    @Args('price') price: string,
    @Args('status') status: string,
    @Args('startLocationAddress') startLocationAddress: string,
    @Args('startLocationLongitude') startLocationLongitude: string,
    @Args('startLocationLatitude') startLocationLatitude: string,
    @Args('destinationAddress') destinationAddress: string,
    @Args('destinationLongitude') destinationLongitude: string,
    @Args('destinationLatitude') destinationLatitude: string
  ): Promise<Trip> {
    return await this.tripsService.create(
      driver,
      tripDate,
      seatsAvailable,
      price,
      status,
      startLocationAddress,
      startLocationLongitude,
      startLocationLatitude,
      destinationAddress,
      destinationLongitude,
      destinationLatitude
    );
  }

  @Query(() => Booking)
  async findBookingById(
    @Args('bookingId') bookingId: string
  ): Promise<Booking> {
    return await this.tripsService.findBookingById(bookingId);
  }

  @Mutation(() => Booking)
  async updatePaymentStatus(
    @Args('bookingId') bookingId: string
  ): Promise<BookingStatusUpdate> {
    const booking = await this.tripsService.findBookingById(bookingId);

    const trip = await this.tripsService.findTripById(booking.tripId);

    const notification = new Notification();
    notification.message = 'Payment has been made for one of your trips.';
    notification.userId = trip.driverId;

    pubSub.publish('requestReceived', { requestReceived: notification });

    return await this.tripsService.updatePaymentStatus(bookingId);
  }

  @Mutation(() => Booking)
  async updateReviewPassenger(
    @Args('bookingId') bookingId: string
  ): Promise<BookingStatusUpdate> {
    return await this.tripsService.updateReviewPassenger(bookingId);
  }

  @Mutation(() => Trip)
  async updateReviewDriver(
    @Args('tripId') tripId: string
  ): Promise<ReviewsStatusUpdate> {
    return await this.tripsService.updateReviewDriver(tripId);
  }

  @Mutation(() => Booking)
  async bookTrip(
    @Args('tripId') tripId: string,
    @Args('passengerId') passengerId: string,
    @Args('seatsBooked') seatsBooked: string,
    @Args('status') status: string,
    @Args('price') price: string,
    @Args('address') address: string,
    @Args('longitude') longitude: string,
    @Args('latitude') latitude: string
  ): Promise<Booking | null> {
    const trip = await this.tripsService.findTripById(tripId);

    const notification = new Notification();
    notification.message = 'You have a new booking request';
    notification.userId = trip.driverId;

    pubSub.publish('requestReceived', { requestReceived: notification });

    return await this.tripsService.bookTrip(
      passengerId,
      tripId,
      seatsBooked,
      status,
      price,
      address,
      longitude,
      latitude
    );
  }

  @Mutation(() => Reviews)
  async postReview(
    @Args('byId') byId: string,
    @Args('forId') forId: string,
    @Args('tripId') tripId: string,
    @Args('role') role: string,
    @Args('comment') comment: string,
    @Args('rating') rating: string
  ): Promise<Reviews | null> {
    console.log('POSTREVIEW');
    return await this.tripsService.postReview(
      byId,
      forId,
      tripId,
      role,
      comment,
      rating
    );
  }

  @Mutation(() => Trip)
  async acceptTripRequest(
    @Args('id') tripId: string,
    @Args('bookingId') bookingId: string
  ): Promise<Trip> {
    const booking = await this.tripsService.findBookingById(bookingId);

    const notification = new Notification();
    notification.message = 'Your booking request has been approved';
    notification.userId = booking.userId;

    pubSub.publish('requestReceived', { requestReceived: notification });

    return await this.tripsService.acceptTripRequest(tripId, bookingId);
  }

  @Mutation(() => Booking)
  async declineTripRequest(
    @Args('bookingId') bookingId: string
  ): Promise<Booking> {
    const booking = await this.tripsService.findBookingById(bookingId);

    const notification = new Notification();
    notification.message = 'Your booking request has been declined';
    notification.userId = booking.userId;

    pubSub.publish('requestReceived', { requestReceived: notification });

    return await this.tripsService.declineTripRequest(bookingId);
  }

  @Mutation(() => Trip)
  async startTrip(@Args('id') tripId: string): Promise<Trip> {
    const passengers = await this.tripsService.findBookingByTrip(tripId);

    const notifications: Notification[] = [];

    passengers.map((passenger) => {
      const notification = new Notification();
      notification.message = 'Your trip has started';
      notification.userId = passenger.userId;

      notifications.push(notification);
    });

    pubSub.publish('tripStarted', { tripStarted: notifications });

    return await this.tripsService.startTrip(tripId);
  }

  @Mutation(() => Trip)
  async endTrip(@Args('id') tripId: string): Promise<Trip> {
    console.log('END');

    const passengers = await this.tripsService.findBookingByTrip(tripId);

    const notifications: Notification[] = [];

    passengers.map((passenger) => {
      const notification = new Notification();
      notification.message = 'Your trip has ended';
      notification.userId = passenger.userId;

      notifications.push(notification);
    });

    pubSub.publish('tripStarted', { tripStarted: notifications });

    return await this.tripsService.endTrip(tripId);
  }
}
