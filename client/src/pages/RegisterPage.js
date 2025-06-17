import React, { useState } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/RegisterPage.css';
import config from '../config/config';

const { Title, Text } = Typography;

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [formInstance] = Form.useForm();
  const navigate = useNavigate();

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const onFinish = async (values) => {
    const { name, email, password, confirmPassword } = values;

    if (password !== confirmPassword) {
      return setSnackbar({
        open: true,
        message: 'Passwords do not match',
        severity: 'error',
      });
    }

    try {
      setLoading(true);
      const res = await axios.post(`${config.endpoint}/auth/register`, {
        name,
        email,
        password,
      });

      setSnackbar({
        open: true,
        message: res.data.msg || 'Registration successful',
        severity: 'success',
      });

      formInstance.resetFields(); 
      setTimeout(() => navigate('/'), 1500); 

    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.msg || 'Something went wrong',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <div className="register-left">
          <img src="/dashboard.png" alt="Dashboard" className="dashboard-img" />
          <div className="left-text">
            <h3>Lorem ipsum dolor sit amet</h3>
            <p>
              Tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
              quis nostrud exercitation ullamco laboris nisi ut aliquip.
            </p>
            <div className="carousel-dots">
              <span className="dot active" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>
        </div>

        <div className="register-right">
          <img src="/logo.jpeg" alt="Logo" className="register-logo" />
          <Title level={3}>Welcome to Dashboard</Title>

          <Form
            layout="vertical"
            onFinish={onFinish}
            form={formInstance}
          >
            <Form.Item
              label="Full name"
              name="name"
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input placeholder="Full name" />
            </Form.Item>

            <Form.Item
              label="Email Address"
              name="email"
              rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
            >
              <Input placeholder="Email Address" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                placeholder="Password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              rules={[{ required: true, message: 'Please confirm your password' }]}
            >
              <Input.Password
                placeholder="Confirm Password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                style={{ backgroundColor: '#4b0082' }}
              >
                Register
              </Button>
            </Form.Item>
          </Form>

          <Text type="secondary">
            Already have an account? <a href="/">Login</a>
          </Text>
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={handleSnackbarClose} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RegisterPage;
