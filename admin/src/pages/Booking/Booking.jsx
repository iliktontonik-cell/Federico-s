import React, { useState, useEffect } from 'react'
import './Booking.css'
import { toast } from 'react-toastify'
import axios from 'axios'

const Booking = ({ url }) => {
    const [bookings, setBookings] = useState([])
    const [records, setRecords] = useState([])
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('')
    const [expandedRow, setExpandedRow] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchBookings = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${url}/api/booking/list`)
            if (response.data.success) {
                setBookings(response.data.data)
            } else {
                toast.error('Failed to load bookings')
            }
        } catch (error) {
            toast.error('Error fetching bookings')
        } finally {
            setLoading(false)
        }
    }

    const fetchRecords = async () => {
        try {
            const response = await axios.get(`${url}/api/booking/records`)
            if (response.data.success) {
                setRecords(response.data.data)
            }
        } catch (error) {
            console.log('Error fetching records')
        }
    }

    const handleStatusChange = async (bookingId, bookingStatus) => {
        try {
            const response = await axios.post(`${url}/api/booking/status`, {
                bookingId,
                bookingStatus,
            })
            if (response.data.success) {
                toast.success('Status updated')
                fetchBookings()
            }
        } catch (error) {
            toast.error('Failed to update status')
        }
    }

    const removeBooking = async (bookingId) => {
        try {
            const response = await axios.delete(`${url}/api/booking/remove/${bookingId}`)
            if (response.data.success) {
                toast.success('Booking removed and recorded')
                fetchBookings()
                fetchRecords()
            } else {
                toast.error('Failed to remove booking')
            }
        } catch (error) {
            toast.error('Error removing booking')
        }
    }

    useEffect(() => {
        fetchBookings()
        fetchRecords()
    }, [])

    // Calculate yearly earnings from records
    const currentYear = new Date().getFullYear()
    const yearlyEarnings = records
        .filter(r => new Date(r.removedAt).getFullYear() === currentYear)
        .reduce((sum, r) => sum + r.totalAmount, 0)

    const todayEarnings = records
        .filter(r => {
            const d = new Date(r.removedAt)
            const today = new Date()
            return d.getFullYear() === today.getFullYear() &&
                d.getMonth() === today.getMonth() &&
                d.getDate() === today.getDate()
        })
        .reduce((sum, r) => sum + r.totalAmount, 0)

    const filtered = bookings.filter(b => {
        const q = search.toLowerCase()
        const matchSearch =
            b.customerName?.toLowerCase().includes(q) ||
            b.userId?.toLowerCase().includes(q) ||
            b.email?.toLowerCase().includes(q) ||
            b._id?.toLowerCase().includes(q)
        const matchStatus = !filter || b.bookingStatus === filter
        return matchSearch && matchStatus
    })

    const stats = {
        total: bookings.length,
        confirmed: bookings.filter(b => b.bookingStatus === 'Confirmed').length,
        pending: bookings.filter(b => b.bookingStatus === 'Processing').length,
        paid: bookings.filter(b => b.payment === true).length,
    }

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount)

    const formatDate = (dateStr) => {
        if (!dateStr) return '—'
        return new Date(dateStr).toLocaleDateString('en-PH', {
            year: 'numeric', month: 'short', day: 'numeric',
        })
    }

    const getInitials = (name = '') =>
        name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

    const AVATAR_COLORS = [
        { bg: '#EEEDFE', fg: '#534AB7' },
        { bg: '#E1F5EE', fg: '#0F6E56' },
        { bg: '#FAECE7', fg: '#993C1D' },
        { bg: '#FBEAF0', fg: '#993556' },
        { bg: '#E6F1FB', fg: '#185FA5' },
        { bg: '#EAF3DE', fg: '#3B6D11' },
    ]

    const getAvatarColor = (name = '') =>
        AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]

    return (
        <div className="booking-wrap">

            {/* Yearly Earnings Banner */}
            <div className="booking-earnings-banner">
                <div className="booking-earnings-card booking-earnings-card--year">
                    <div className="booking-earnings-icon">📅</div>
                    <div>
                        <div className="booking-earnings-label">Total Earnings {currentYear}</div>
                        <div className="booking-earnings-val">{formatCurrency(yearlyEarnings)}</div>
                        <div className="booking-earnings-sub">{records.filter(r => new Date(r.removedAt).getFullYear() === currentYear).length} completed bookings this year</div>
                    </div>
                </div>
                <div className="booking-earnings-card booking-earnings-card--today">
                    <div className="booking-earnings-icon">🗓️</div>
                    <div>
                        <div className="booking-earnings-label">Today's Earnings</div>
                        <div className="booking-earnings-val">{formatCurrency(todayEarnings)}</div>
                        <div className="booking-earnings-sub">{records.filter(r => {
                            const d = new Date(r.removedAt)
                            const today = new Date()
                            return d.getFullYear() === today.getFullYear() &&
                                d.getMonth() === today.getMonth() &&
                                d.getDate() === today.getDate()
                        }).length} completed bookings today</div>
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="booking-header">
                <div>
                    <h1 className="booking-title">Bookings</h1>
                    <p className="booking-subtitle">Manage all customer reservations</p>
                </div>
                <button className="booking-btn-refresh" onClick={() => { fetchBookings(); fetchRecords(); }}>
                    ↻ Refresh
                </button>
            </div>

            {/* Stats */}
            <div className="booking-stats">
                <div className="booking-stat">
                    <div className="booking-stat__label">Total</div>
                    <div className="booking-stat__val">{stats.total}</div>
                </div>
                <div className="booking-stat">
                    <div className="booking-stat__label">Confirmed</div>
                    <div className="booking-stat__val booking-stat__val--green">{stats.confirmed}</div>
                </div>
                <div className="booking-stat">
                    <div className="booking-stat__label">Processing</div>
                    <div className="booking-stat__val booking-stat__val--amber">{stats.pending}</div>
                </div>
                <div className="booking-stat">
                    <div className="booking-stat__label">Paid</div>
                    <div className="booking-stat__val booking-stat__val--blue">{stats.paid}</div>
                </div>
            </div>

            {/* Table */}
            <div className="booking-table-wrap">
                {/* Toolbar */}
                <div className="booking-tbar">
                    <div className="booking-search-wrap">
                        <span className="booking-search-icon">⌕</span>
                        <input
                            type="text"
                            className="booking-search"
                            placeholder="Search by name, user ID, email…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="booking-filter"
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                    >
                        <option value="">All statuses</option>
                        <option value="Processing">Processing</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                {loading ? (
                    <div className="booking-empty">Loading bookings…</div>
                ) : filtered.length === 0 ? (
                    <div className="booking-empty">No bookings found</div>
                ) : (
                    <table className="booking-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Booking ID</th>
                                <th>User ID</th>
                                <th>Customer</th>
                                <th>Event</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(b => {
                                const { bg, fg } = getAvatarColor(b.customerName)
                                const isExpanded = expandedRow === b._id
                                const hasSpecialRequests = b.specialRequests && b.specialRequests.trim() !== ''

                                return (
                                    <React.Fragment key={b._id}>
                                        <tr
                                            className={`booking-row ${isExpanded ? 'booking-row--expanded' : ''}`}
                                            onClick={() => setExpandedRow(isExpanded ? null : b._id)}
                                        >
                                            <td className="booking-expand-cell">
                                                <span className={`booking-expand-icon ${isExpanded ? 'open' : ''}`}>›</span>
                                            </td>

                                            <td className="booking-id">{b._id.slice(-8).toUpperCase()}</td>

                                            <td className="booking-userid" title={b.userId}>
                                                {b.userId?.slice(-8).toUpperCase()}
                                            </td>

                                            <td>
                                                <div className="booking-name-cell">
                                                    <span className="booking-avatar" style={{ background: bg, color: fg }}>
                                                        {getInitials(b.customerName)}
                                                    </span>
                                                    <div>
                                                        <div className="booking-name">{b.customerName}</div>
                                                        <div className="booking-email">{b.email}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <div className="booking-event">{b.eventType}</div>
                                                <div className="booking-location">{b.location}</div>
                                            </td>

                                            <td>{formatDate(b.eventDate)}</td>

                                            <td className="booking-amount">{formatCurrency(b.totalAmount)}</td>

                                            <td>
                                                <span className={`booking-badge ${b.payment ? 'booking-badge--paid' : 'booking-badge--unpaid'}`}>
                                                    {b.payment ? 'Paid' : 'Unpaid'}
                                                </span>
                                            </td>

                                            <td onClick={e => e.stopPropagation()}>
                                                <select
                                                    className={`booking-status-select booking-status-select--${b.bookingStatus?.toLowerCase()}`}
                                                    value={b.bookingStatus}
                                                    onChange={e => handleStatusChange(b._id, e.target.value)}
                                                >
                                                    <option value="Processing">Processing</option>
                                                    <option value="Confirmed">Confirmed</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </td>

                                            <td onClick={e => e.stopPropagation()}>
                                                <button
                                                    className="booking-remove-btn"
                                                    onClick={() => removeBooking(b._id)}
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>

                                        {isExpanded && (
                                            <tr className="booking-details-row">
                                                <td colSpan={10}>
                                                    <div className="booking-details">

                                                        <div className="booking-details__meta">
                                                            <div className="booking-details__meta-item">
                                                                <span className="booking-details__meta-label">Full Booking ID</span>
                                                                <span className="booking-details__meta-val mono">{b._id}</span>
                                                            </div>
                                                            <div className="booking-details__meta-item">
                                                                <span className="booking-details__meta-label">Full User ID</span>
                                                                <span className="booking-details__meta-val mono">{b.userId}</span>
                                                            </div>
                                                        </div>

                                                        <div className="booking-special-wrap">
                                                            <div className="booking-special-header">
                                                                <span className="booking-special-icon">📋</span>
                                                                <span className="booking-special-title">Special Instructions / Requests</span>
                                                                {!hasSpecialRequests && (
                                                                    <span className="booking-special-none">None provided</span>
                                                                )}
                                                            </div>
                                                            {hasSpecialRequests && (
                                                                <div className="booking-special-body">
                                                                    {b.specialRequests}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="booking-details__header">
                                                            <span>Booked Items</span>
                                                            <span className="booking-details__count">
                                                                {b.selectedItems?.length || 0} item{b.selectedItems?.length !== 1 ? 's' : ''}
                                                            </span>
                                                        </div>

                                                        <div className="booking-items-grid">
                                                            {b.selectedItems?.length > 0 ? (
                                                                b.selectedItems.map((item, idx) => (
                                                                    <div className="booking-item-card" key={idx}>
                                                                        {item.image && (
                                                                            <img
                                                                                src={item.image}
                                                                                alt={item.name}
                                                                                className="booking-item-img"
                                                                            />
                                                                        )}
                                                                        <div className="booking-item-info">
                                                                            <div className="booking-item-name">{item.name}</div>
                                                                            <div className="booking-item-meta">
                                                                                <span>Qty: {item.quantity}</span>
                                                                                <span>{formatCurrency(item.price)}</span>
                                                                            </div>
                                                                            <div className="booking-item-subtotal">
                                                                                Subtotal: {formatCurrency(item.price * item.quantity)}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p className="booking-items-empty">No items recorded</p>
                                                            )}
                                                        </div>

                                                        <div className="booking-details__footer">
                                                            <span>Service Charge</span>
                                                            <span>{formatCurrency(80)}</span>
                                                        </div>
                                                        <div className="booking-details__total">
                                                            <span>Total</span>
                                                            <span>{formatCurrency(b.totalAmount)}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                )
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

export default Booking