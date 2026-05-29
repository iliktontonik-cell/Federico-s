import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import './Records.css'

const Records = ({ url }) => {
    const [records, setRecords] = useState([]);
    const [todayCount, setTodayCount] = useState(0);
    const [todayRevenue, setTodayRevenue] = useState(0);

    const fetchRecords = async () => {
        try {
            const response = await axios.get(url + "/api/order/records");
            if (response.data.success) {
                setRecords(response.data.data);
                setTodayCount(response.data.todayCount);
                setTodayRevenue(response.data.todayRevenue);
            } else {
                toast.error("Failed to fetch records");
            }
        } catch (error) {
            toast.error("Error fetching records");
        }
    }

    useEffect(() => {
        fetchRecords();
    }, [])

    return (
        <div className='records'>
            <h3>Order Records</h3>

            <div className="records-summary">
                <div className="summary-card">
                    <h4>Orders Completed Today</h4>
                    <p className='summary-count'>{todayCount}</p>
                </div>
                <div className="summary-card">
                    <h4>Revenue Today</h4>
                    <p className='summary-count'>₱{todayRevenue}</p>
                </div>
            </div>

            <h4 className='records-subtitle'>All Completed Orders</h4>
            <div className="records-table-wrapper">
                <table className='records-table'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Removed At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{record.customerName}</td>
                                <td>
                                    {record.items.map((item, i) => (
                                        <span key={i}>
                                            {item.name} x {item.quantity}{i < record.items.length - 1 ? ", " : ""}
                                        </span>
                                    ))}
                                </td>
                                <td>₱{record.amount}</td>
                                <td>
                                    <span className={`status-badge ${record.status === "Delivered" ? "delivered" : ""}`}>
                                        {record.status}
                                    </span>
                                </td>
                                <td>{new Date(record.removedAt).toLocaleString()}</td>
                            </tr>
                        ))}
                        {records.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center" }}>No records yet</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Records