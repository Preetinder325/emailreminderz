'use client';

import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: '',
    customerEmail: '',
    managerEmail: '',
    workEmail: '',
  });

  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Scheduling...');

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setStatus('✅ Reminder scheduled!');
        setFormData({
          date: '',
          time: '',
          reason: '',
          customerEmail: '',
          managerEmail: '',
          workEmail: '',
        });
      } else {
        setStatus('❌ Failed: ' + data.error);
      }
    } catch (err) {
      setStatus('❌ Error: ' + err.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-xl bg-white shadow-md rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Email Reminderz</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {['date', 'time'].map((field) => (
            <div key={field}>
              <label className="block font-medium mb-1 capitalize">{field}</label>
              <input
                type={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                required
              />
            </div>
          ))}

          <div>
            <label className="block font-medium mb-1">Reason</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>

          {['customerEmail', 'managerEmail', 'workEmail'].map((emailField) => (
            <div key={emailField}>
              <label className="block font-medium mb-1 capitalize">{emailField.replace('Email', "'s Email")}</label>
              <input
                type="email"
                name={emailField}
                value={formData[emailField]}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                required
              />
            </div>
          ))}

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Schedule Reminder
          </button>
        </form>

        {status && <p className="mt-4 text-center text-gray-700">{status}</p>}
      </div>
    </main>
  );
}
