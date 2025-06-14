import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AddEmployee = () => {
  const [candidates, setCandidates] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', skills: '' });
  const [resume, setResume] = useState(null);
  const [search, setSearch] = useState('');

  const fetchCandidates = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/employee?search=${search}`);
      setCandidates(res.data);
    } catch (err) {
      console.error('Error fetching candidates', err);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [search]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) return alert('Resume is required');
    const data = new FormData();
    data.append('name', form.name);
    data.append('email', form.email);
    data.append('phone', form.phone);
    data.append('skills', form.skills);
    data.append('resume', resume);

    try {
      await axios.post('http://localhost:5000/api/candidates', data);
      setForm({ name: '', email: '', phone: '', skills: '' });
      setResume(null);
      fetchCandidates();
    } catch (err) {
      console.error('Error adding candidate', err);
    }
  };

  const handlePromote = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/candidates/promote/${id}`);
      fetchCandidates();
    } catch (err) {
      console.error('Promotion failed', err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Candidate Management</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required /> <br />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required /> <br />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required /> <br />
        <input name="skills" placeholder="Skills (comma separated)" value={form.skills} onChange={handleChange} required /> <br />
        <input type="file" accept="application/pdf" onChange={(e) => setResume(e.target.files[0])} required /> <br />
        <button type="submit">Add Candidate</button>
      </form>

      <input
        type="text"
        placeholder="Search candidates..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '1rem' }}
      />

      {candidates.map((c) => (
        <div key={c._id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
          <p><strong>{c.name}</strong></p>
          <p>{c.email} | {c.phone}</p>
          <p>Skills: {c.skills.join(', ')}</p>
          <a href={`http://localhost:5000/${c.resume}`} target="_blank" rel="noopener noreferrer">Download Resume</a> <br />
          <button onClick={() => handlePromote(c._id)}>Promote to Employee</button>
        </div>
      ))}
    </div>
  );
};

export default AddEmployee;
