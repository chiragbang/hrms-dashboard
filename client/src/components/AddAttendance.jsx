import React, { useEffect, useState } from 'react';
import {
  Table,
  Select,
  DatePicker,
  Button,
  message,
} from 'antd';
import axios from 'axios';
import config from '../config/config';
import '../styles/AddAttendance.css';
import dayjs from 'dayjs';

const { Option } = Select;

const statusOptions = ['Present', 'Absent', 'Half Day', 'Work From Home'];

const AddAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${config.endpoint}/employees`);
      setEmployees(res.data);
    } catch (err) {
      message.error('Failed to fetch employees');
    }
  };

  const fetchAttendance = async () => {
    try {
      const date = selectedDate.format('YYYY-MM-DD');
      const res = await axios.get(`${config.endpoint}/attendance?date=${date}`);
      const map = {};
      res.data.forEach((entry) => {
        map[entry.employeeId._id] = entry.status;
      });
      setAttendanceMap(map);
    } catch (err) {
      message.error('Failed to fetch attendance');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAttendance();
    }
  }, [selectedDate]);

  const handleStatusChange = (employeeId, status) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [employeeId]: status,
    }));
  };

  const handleSaveAll = async () => {
    try {
      setLoading(true);
      const date = selectedDate.format('YYYY-MM-DD');
      const requests = employees.map((emp) => {
        const status = attendanceMap[emp._id];
        if (!status) return null;
        return axios.post(`${config.endpoint}/attendance`, {
          employeeId: emp._id,
          date,
          status,
        });
      });

      await Promise.all(requests.filter(Boolean));
      message.success('Attendance saved successfully');
      fetchAttendance();
    } catch (err) {
      message.error('Failed to save attendance');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const status = attendanceMap[record._id] || '';
        const classMap = {
          Present: 'status-present',
          Absent: 'status-absent',
          'Half Day': 'status-halfday',
          'Work From Home': 'status-wfh',
        };

        return (
          <Select
            className={`status-select ${classMap[status] || ''}`}
            value={status}
            placeholder="Mark Status"
            onChange={(value) => handleStatusChange(record._id, value)}
          >
            {statusOptions.map((opt) => (
              <Option key={opt} value={opt}>
                {opt}
              </Option>
            ))}
          </Select>
        );
      },
    },
  ];

  return (
    <div className="add-attendance-container">
      <div className="add-attendance-topbar">
        <DatePicker
          value={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="add-attendance-datepicker"
        />
        <Button
          type="primary"
          className="add-attendance-save-button"
          onClick={handleSaveAll}
          loading={loading}
        >
          Save Attendance
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={employees}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
        bordered
        className="add-attendance-table"
      />
    </div>
  );
};

export default AddAttendance;
