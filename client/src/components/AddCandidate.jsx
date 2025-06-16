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
} from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;
const statusOptions = ['New', 'Scheduled', 'Ongoing', 'Selected', 'Rejected'];

const AddCandidate = () => {
  const [candidates, setCandidates] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);
  const [search, setSearch] = useState('');
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCandidates = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/candidates?search=${search}`
      );
      setCandidates(res.data);
    } catch (err) {
      message.error('Error fetching candidates');
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [search]);

  const handleSubmit = async (values) => {
    if (!resumeFile) {
      return message.warning('Please upload a resume');
    }

    const data = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      data.append(key, value);
    });
    data.append('resume', resumeFile);

    try {
      await axios.post('http://localhost:5000/api/candidates', data);
      message.success('Candidate added successfully');
      form.resetFields();
      setResumeFile(null);
      setIsModalOpen(false);
      fetchCandidates();
    } catch (err) {
      message.error('Failed to add candidate');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/candidates/status/${id}`, {
        status: newStatus,
      });
      message.success('Status updated');
      fetchCandidates();
    } catch (err) {
      message.error('Failed to update status');
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
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Experience',
      dataIndex: 'experience',
      key: 'experience',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Skills',
      dataIndex: 'skills',
      key: 'skills',
      render: (skills) => skills.join(', '),
    },
    {
      title: 'Resume',
      dataIndex: 'resume',
      key: 'resume',
      render: (resume) => (
        <a href={`http://localhost:5000/${resume}`} target="_blank" rel="noreferrer">
          Download
        </a>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => (
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
      ),
    },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Input
          placeholder="Search candidates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '300px' }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Add Candidate
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={candidates}
        rowKey="_id"
        style={{ marginTop: '2rem' }}
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
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="Enter full name" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item name="position" label="Position" rules={[{ required: true }]}>
            <Input placeholder="Enter position" />
          </Form.Item>
          <Form.Item name="experience" label="Experience" rules={[{ required: true }]}>
            <Input placeholder="Enter experience" />
          </Form.Item>
          <Form.Item name="location" label="Location" rules={[{ required: true }]}>
            <Input placeholder="Enter location" />
          </Form.Item>
          <Form.Item name="skills" label="Skills (comma separated)" rules={[{ required: true }]}>
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
            <Button type="primary" htmlType="submit" block>
              Add Candidate
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddCandidate;
