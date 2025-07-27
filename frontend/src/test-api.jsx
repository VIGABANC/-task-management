import React, { useState } from 'react';
import { api } from './utils/api';

export default function TestApi() {
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const testGet = async () => {
        setLoading(true);
        try {
            const data = await api.getRendezvous();
            setResult(JSON.stringify(data, null, 2));
        } catch (error) {
            setResult(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const testPost = async () => {
        setLoading(true);
        try {
            const testData = {
                date: '2025-07-26',
                time: '15:00:00',
                person: 'Test Person',
                subject: 'Test Meeting',
                notes: 'Test notes',
                admin_id: 1,
                superadmin_id: 1,
            };
            const data = await api.createRendezvous(testData);
            setResult(JSON.stringify(data, null, 2));
        } catch (error) {
            setResult(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>API Test Component</h2>
            <button onClick={testGet} disabled={loading}>
                Test GET /api/v1/rendezvous
            </button>
            <br /><br />
            <button onClick={testPost} disabled={loading}>
                Test POST /api/v1/rendezvous
            </button>
            <br /><br />
            {loading && <p>Loading...</p>}
            <pre style={{ background: '#f5f5f5', padding: '10px', maxHeight: '400px', overflow: 'auto' }}>
                {result}
            </pre>
        </div>
    );
} 