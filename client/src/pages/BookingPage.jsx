import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { useAsync } from '../hooks/useAsync'
import { listingService } from '../services/listingService'
import { bookingService } from '../services/bookingService'
import { localized } from '../utils/format'
import { clampInt, isDateString } from '../utils/booking'
import PageTransition from '../components/layout/PageTransition'
import Spinner from '../components/common/Spinner'
import { ErrorState } from '../components/common/StateMessage'
import ListingImage from '../components/listings/ListingImage'
import StepIndicator from '../components/booking/StepIndicator'
import TripStep from '../components/booking/TripStep'
import GuestStep from '../components/booking/GuestStep'
import ReviewStep from '../components/booking/ReviewStep'
import BookingConfirmation from '../components/booking/BookingConfirmation'

function initialTrip(searchParams) {
  const date = searchParams.get('date') ?? searchParams.get('check_in')
  return {
    date: isDateString(date) ? date : '',
    travelers: clampInt(searchParams.get('travelers'), 1, 100, 2),
    roomTypeId: Number(searchParams.get('room')) || null,
    nights: clampInt(searchParams.get('nights'), 1, 30, 1),
    rooms: clampInt(searchParams.get('rooms'), 1, 10, 1),
  }
}

const stepMotion = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.25 },
}

function BookingPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const { t, i18n } = useTranslation()
  const { user } = useAuth()

  const listingState = useAsync(() => listingService.get(id), [id])
  const listing = listingState.data && String(listingState.data.id) === String(id) ? listingState.data : null
  const isHotel = listing?.type === 'hotel'

  const [step, setStep] = useState(0)
  const [trip, setTrip] = useState(() => initialTrip(searchParams))
  const [guest, setGuest] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [booking, setBooking] = useState(null)

  const roomQuery = isHotel && isDateString(trip.date) ? { check_in: trip.date, nights: trip.nights } : {}
  const roomsState = useAsync(
    () => (isHotel ? listingService.rooms(id, roomQuery) : Promise.resolve([])),
    [id, isHotel, roomQuery],
  )
  const selectedRoom = roomsState.data?.find((room) => room.id === trip.roomTypeId) ?? null

  if (listingState.error) {
    return (
      <PageTransition className="container-page py-16">
        <ErrorState error={listingState.error} onRetry={listingState.reload} />
      </PageTransition>
    )
  }

  if (!listing) {
    return <Spinner fullPage />
  }

  const guestDefaults = guest ?? {
    guest_name: user?.name ?? '',
    guest_email: user?.email ?? '',
    guest_phone: user?.phone ?? '',
    special_requests: '',
  }

  async function handleConfirm() {
    setSubmitting(true)
    setSubmitError('')

    const payload = {
      listing_id: listing.id,
      booking_date: trip.date,
      number_of_people: trip.travelers,
      guest_name: guest.guest_name,
      guest_email: guest.guest_email,
      guest_phone: guest.guest_phone || null,
      special_requests: guest.special_requests?.trim() || null,
    }
    if (isHotel) {
      Object.assign(payload, { room_type_id: trip.roomTypeId, nights: trip.nights, rooms: trip.rooms })
    }

    try {
      const created = await bookingService.create(payload)
      setBooking(created)
    } catch (error) {
      setSubmitError(error.message)
      if (error.status === 409) {
        roomsState.reload()
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageTransition className="container-page py-8">
      <Link to={`/listings/${listing.id}`} className="inline-flex items-center gap-1 text-sm text-charcoal/70 hover:text-forest">
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        {t('booking.backToListing')}
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-charcoal/5 sm:p-8">
          {booking ? (
            <BookingConfirmation booking={booking} listing={listing} />
          ) : (
            <>
              <h1 className="font-display text-3xl text-charcoal">{t('booking.title')}</h1>
              <div className="mt-6">
                <StepIndicator current={step} />
              </div>

              <div className="mt-8">
                <AnimatePresence mode="wait">
                  {step === 0 && (
                    <motion.div key="trip" {...stepMotion}>
                      <TripStep listing={listing} trip={trip} onChange={setTrip} rooms={isHotel ? roomsState.data : []} onNext={() => setStep(1)} />
                    </motion.div>
                  )}
                  {step === 1 && (
                    <motion.div key="guest" {...stepMotion}>
                      <GuestStep
                        defaultValues={guestDefaults}
                        onBack={() => setStep(0)}
                        onNext={(values) => {
                          setGuest(values)
                          setStep(2)
                        }}
                      />
                    </motion.div>
                  )}
                  {step === 2 && guest && (
                    <motion.div key="review" {...stepMotion}>
                      <ReviewStep
                        listing={listing}
                        trip={trip}
                        room={selectedRoom}
                        guest={guest}
                        submitting={submitting}
                        error={submitError}
                        onBack={() => setStep(isHotel && submitError ? 0 : 1)}
                        onConfirm={handleConfirm}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 overflow-hidden rounded-lg bg-white ring-1 ring-charcoal/5">
            <div className="aspect-[4/3]">
              <ListingImage listing={listing} />
            </div>
            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-mountain">{t(`types.${listing.type}`)} · {listing.city}</p>
              <p className="mt-1 font-display text-lg text-charcoal">{localized(listing, 'name', i18n.language)}</p>
            </div>
          </div>
        </aside>
      </div>
    </PageTransition>
  )
}

export default BookingPage
