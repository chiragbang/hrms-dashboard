import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Table,
  Modal,
  message,
  Tag,
  Calendar,
  Card,
} from 'antd';
import axios from 'axios';
import config from '../config/config';
import dayjs from 'dayjs';
import '../styles/AddLeave.css';

const { Option } = Select;
const { RangePicker } = DatePicker;

const AddLeave = () => {
  const [form] = Form.useForm();
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${config.endpoint}/employees`);
      setEmployees(res.data);
    } catch {
      message.error('Failed to fetch employees');
    }
  };

  const fetchLeaves = async () => {
    try {
      const res = await axios.get(`${config.endpoint}/leaves`);
      setLeaves(res.data);
    } catch {
      message.error('Failed to fetch leave records');
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchLeaves();
  }, []);

  const handleEmployeeChange = (value) => {
    const emp = employees.find((e) => e._id === value);
    setSelectedEmployee(emp);
    form.setFieldsValue({ employeeId: value });
  };

  const handleSubmit = async (values) => {
    const [fromDate, toDate] = values.dateRange;
    try {
      await axios.post(`${config.endpoint}/leaves`, {
        employeeId: values.employeeId,
        fromDate: fromDate.format('YYYY-MM-DD'),
        toDate: toDate.format('YYYY-MM-DD'),
        reason: values.reason,
      });
      message.success('Leave added successfully');
      form.resetFields();
      fetchLeaves();
      setModalVisible(false);
    } catch (err) {
      message.error(err.response?.data?.msg || 'Failed to add leave');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`${config.endpoint}/leaves/${id}`, { status });
      message.success(`Leave ${status}`);
      fetchLeaves();
    } catch {
      message.error('Failed to update status');
    }
  };

  const columns = [
    {
      title: 'Employee',
      dataIndex: ['employeeId', 'name'],
      key: 'name',
    },
    {
      title: 'From',
      dataIndex: 'fromDate',
      render: (date) => dayjs(date).format('DD MMM YYYY'),
    },
    {
      title: 'To',
      dataIndex: 'toDate',
      render: (date) => dayjs(date).format('DD MMM YYYY'),
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => {
        const color = {
          Pending: 'orange',
          Approved: 'green',
          Rejected: 'red',
        }[status] || 'gray';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Action',
      render: (_, record) => (
        <Select
          value={record.status}
          onChange={(value) => handleStatusChange(record._id, value)}
          style={{ width: 120 }}
        >
          <Option value="Pending">Pending</Option>
          <Option value="Approved">Approve</Option>
          <Option value="Rejected">Reject</Option>
        </Select>
      ),
    },
  ];

  return (
    <div className="leave-management-container">
      <div className="left-section">
        <Table
          columns={columns}
          dataSource={leaves}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
        />
      </div>

      <div className="right-section">
        <div className="calendar-container">
          <Calendar fullscreen={false} />
        </div>

        <div className="approved-leaves">
          <h3>Approved Leaves</h3>
          {leaves
            .filter((l) => l.status === 'Approved')
            .map((l) => (
              <p key={l._id}>{l.employeeId?.name}: {dayjs(l.fromDate).format('DD MMM')} - {dayjs(l.toDate).format('DD MMM')}</p>
            ))}
        </div>

        <Button
          type="primary"
          className="add-leave-btn"
          onClick={() => setModalVisible(true)}
        >
          Add Leave
        </Button>
      </div>

      <Modal
        title="Assign Leave"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="employeeId"
            label="Select Employee"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select employee" onChange={handleEmployeeChange}>
              {employees.map((emp) => (
                <Option key={emp._id} value={emp._id}>{emp.name}</Option>
              ))}
            </Select>
          </Form.Item>

          {selectedEmployee && (
            <p><strong>Designation:</strong> {selectedEmployee.designation}</p>
          )}

          <Form.Item
            name="dateRange"
            label="Leave Dates"
            rules={[{ required: true }]}
          >
            <RangePicker />
          </Form.Item>

          <Form.Item
            name="reason"
            label="Reason"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={3} placeholder="Enter reason for leave" />
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit" type="primary" block>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddLeave;
