import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Upload,
  Select,
  Table,
  Modal,
  message,
  Dropdown,
  Menu,
  Popconfirm,
  Row,
  Col,
} from 'antd';
import {
  UploadOutlined,
  PlusOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import config from '../config/config';
import '../styles/AddCandidate.css';

const { Option } = Select;
const statusOptions = ['New', 'Scheduled', 'Ongoing', 'Selected', 'Rejected'];
const positionOptions = ['Designer', 'Developer', 'Human Resource'];

const AddCandidate = () => {
  const [form] = Form.useForm();
  const [resumeFile, setResumeFile] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');

  const fetchCandidates = async () => {
    try {
      const res = await axios.get(`${config.endpoint}/candidates?search=${search}`);
      setCandidates(res.data);
    } catch (err) {
      message.error('Error fetching candidates');
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [search]);

  useEffect(() => {
    filterCandidates();
  }, [candidates, statusFilter, positionFilter]);

  const filterCandidates = () => {
    let filtered = [...candidates];
    if (statusFilter) {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }
    if (positionFilter) {
      filtered = filtered.filter((c) => c.position === positionFilter);
    }
    setFilteredCandidates(filtered);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (!resumeFile) {
        message.error('Please upload a resume');
        return;
      }

      const data = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        data.append(key, value);
      });
      data.append('resume', resumeFile);

      await axios.post(`${config.endpoint}/candidates`, data);

      message.success('Candidate added successfully');
      form.resetFields();
      setResumeFile(null);
      setIsModalOpen(false);
      fetchCandidates();
    } catch (err) {
    
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${config.endpoint}/candidates/status/${id}`, { status: newStatus });
      message.success('Status updated');
      fetchCandidates();
    } catch (err) {
      message.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${config.endpoint}/candidates/${id}`);
      message.success('Candidate deleted successfully');
      fetchCandidates();
    } catch (err) {
      message.error('Failed to delete candidate');
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Position', dataIndex: 'position', key: 'position' },
    { title: 'Experience', dataIndex: 'experience', key: 'experience' },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    {
      title: 'Skills',
      dataIndex: 'skills',
      key: 'skills',
      render: (skills) => skills.join(', '),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => (
        <div className={`status-select-wrapper status-${text.toLowerCase()}`}>
          <Select
            value={text}
            style={{ width: 130 }}
            onChange={(value) => handleStatusChange(record._id, value)}
          >
            {statusOptions.map((s) => (
              <Option key={s} value={s}>
                {s}
              </Option>
            ))}
          </Select>
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const menu = (
          <Menu>
            <Menu.Item key="download">
              <a
                href={`http://localhost:5000/${record.resume}`}
                target="_blank"
                rel="noreferrer"
              >
                Download Resume
              </a>
            </Menu.Item>
            <Menu.Item key="delete">
              <Popconfirm
                title="Are you sure you want to delete this candidate?"
                onConfirm={() => handleDelete(record._id)}
                okText="Yes"
                cancelText="No"
              >
                <span style={{ color: 'red' }}>Delete Candidate</span>
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
              placeholder="Search candidates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="add-candidate-search"
            />
          </Col>
          <Col xs={12} sm={6}>
            <Select
              allowClear
              placeholder="Filter by Status"
              style={{ width: '100%' }}
              value={statusFilter || undefined}
              onChange={(value) => setStatusFilter(value)}
            >
              {statusOptions.map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={6}>
            <Select
              allowClear
              placeholder="Filter by Position"
              style={{ width: '100%' }}
              value={positionFilter || undefined}
              onChange={(value) => setPositionFilter(value)}
            >
              {positionOptions.map((pos) => (
                <Option key={pos} value={pos}>
                  {pos}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={4}>
            <Button
              className="add-candidate-button"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
              block
            >
              Add
            </Button>
          </Col>
        </Row>
      </div>

      <Table
        columns={columns}
        dataSource={filteredCandidates}
        rowKey="_id"
        className="add-candidate-table"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Add New Candidate"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setResumeFile(null);
        }}
        footer={null}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter name' }]}>
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}>
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item name="phone" label="Phone" rules={[{ required: true, message: 'Please enter phone number' }]}>
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item name="position" label="Position" rules={[{ required: true, message: 'Please select position' }]}>
            <Select placeholder="Select position">
              {positionOptions.map((pos) => (
                <Option key={pos} value={pos}>
                  {pos}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="experience" label="Experience" rules={[{ required: true, message: 'Please enter experience' }]}>
            <Input placeholder="Enter experience" />
          </Form.Item>

          <Form.Item name="location" label="Location" rules={[{ required: true, message: 'Please enter location' }]}>
            <Input placeholder="Enter location" />
          </Form.Item>

          <Form.Item name="skills" label="Skills (comma separated)" rules={[{ required: true, message: 'Please enter skills' }]}>
            <Input placeholder="e.g. React, Node, MongoDB" />
          </Form.Item>

          <Form.Item label="Resume (PDF)" required>
            <Upload
              accept=".pdf"
              beforeUpload={(file) => {
                setResumeFile(file);
                return false;
              }}
              fileList={resumeFile ? [resumeFile] : []}
              onRemove={() => setResumeFile(null)}
            >
              <Button icon={<UploadOutlined />}>Upload Resume</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button
              className="add-candidate-button"
              type="primary"
              block
              onClick={handleSubmit}
            >
              Add Candidate
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddCandidate;
