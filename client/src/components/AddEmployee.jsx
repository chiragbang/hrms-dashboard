import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  Table,
  Modal,
  message,
  Dropdown,
  Menu,
  Popconfirm,
  Row,
  Col,
  DatePicker,
} from 'antd';
import {
  PlusOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import config from '../config/config';
import '../styles/AddCandidate.css'; 
import dayjs from 'dayjs';

const { Option } = Select;
const departments = ['Design', 'Development', 'HR', 'Marketing', 'Sales'];
const positions = ['Intern', 'Full Time', 'Junior', 'Senior', 'Team Lead'];

const AddEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${config.endpoint}/employees?search=${search}`);
      setEmployees(res.data);
    } catch (err) {
      message.error('Error fetching employees');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [search]);

  useEffect(() => {
    let data = [...employees];
    if (deptFilter) data = data.filter(emp => emp.department === deptFilter);
    if (positionFilter) data = data.filter(emp => emp.position === positionFilter);
    setFilteredEmployees(data);
  }, [employees, deptFilter, positionFilter]);

  const handleSubmit = async (values) => {
    try {
      if (editingId) {
        await axios.put(`${config.endpoint}/employees/${editingId}`, values);
        message.success('Employee updated');
      } else {
        await axios.post(`${config.endpoint}/employees`, values);
        message.success('Employee added');
      }
      form.resetFields();
      setIsModalOpen(false);
      setEditingId(null);
      fetchEmployees();
    } catch (err) {
      message.error('Error saving employee');
    }
  };

const handleEdit = (record) => {
  setEditingId(record._id);
  setIsModalOpen(true);

  
  const formattedRecord = {
    ...record,
    dateOfJoining: record.dateOfJoining ? dayjs(record.dateOfJoining) : null,
  };

  form.setFieldsValue(formattedRecord);
};
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${config.endpoint}/employees/${id}`);
      message.success('Employee deleted');
      fetchEmployees();
    } catch {
      message.error('Failed to delete');
    }
  };

  const columns = [
    { title: 'Full Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { title: 'Position', dataIndex: 'position', key: 'position' },
   {
  title: 'Date of Joining',
  dataIndex: 'dateOfJoining',
  key: 'dateOfJoining',
  render: (date) => date ? dayjs(date).format('DD MMM YYYY') : '-',
},
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const menu = (
          <Menu>
            <Menu.Item key="edit" onClick={() => handleEdit(record)}>Edit</Menu.Item>
            <Menu.Item key="delete">
              <Popconfirm
                title="Are you sure to delete this employee?"
                onConfirm={() => handleDelete(record._id)}
                okText="Yes"
                cancelText="No"
              >
                <span style={{ color: 'red' }}>Delete</span>
              </Popconfirm>
            </Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={['click']}>
            <EllipsisOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div className="add-candidate-container">
      <div className="add-candidate-topbar">
        <Row gutter={[12, 12]} style={{ width: '100%' }}>
          <Col xs={24} sm={8}>
            <Input
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="add-candidate-search"
            />
          </Col>
          <Col xs={12} sm={6}>
            <Select
              allowClear
              placeholder="Filter by Department"
              value={deptFilter || undefined}
              onChange={value => setDeptFilter(value)}
              style={{ width: '100%' }}
            >
              {departments.map(dept => (
                <Option key={dept}>{dept}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={6}>
            <Select
              allowClear
              placeholder="Filter by Position"
              value={positionFilter || undefined}
              onChange={value => setPositionFilter(value)}
              style={{ width: '100%' }}
            >
              {positions.map(pos => (
                <Option key={pos}>{pos}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={4}>
            <Button
              type="primary"
              block
              className="add-candidate-button"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingId(null);
                form.resetFields();
                setIsModalOpen(true);
              }}
            >
              Add
            </Button>
          </Col>
        </Row>
      </div>

      <Table
        columns={columns}
        dataSource={filteredEmployees}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
        className="add-candidate-table"
      />

      <Modal
        title={editingId ? 'Edit Employee' : 'Add New Employee'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setEditingId(null);
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={(values) => {
  values.dateOfJoining = values.dateOfJoining.format('YYYY-MM-DD');
  handleSubmit(values);
}}>
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
            <Input placeholder="Enter full name" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
            <Input placeholder="Enter phone" />
          </Form.Item>
          <Form.Item name="department" label="Department" rules={[{ required: true }]}>
            <Select placeholder="Select department">
              {departments.map(d => <Option key={d}>{d}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="position" label="Position" rules={[{ required: true }]}>
            <Select placeholder="Select position">
              {positions.map(p => <Option key={p}>{p}</Option>)}
            </Select>
          </Form.Item>
         <Form.Item
  name="dateOfJoining"
  label="Date of Joining"
  rules={[{ required: true }]}
>
  <DatePicker style={{ width: '100%' }} />
</Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block className="add-candidate-button">
              {editingId ? 'Update Employee' : 'Add Employee'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddEmployee;
