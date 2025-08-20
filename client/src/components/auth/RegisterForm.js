import { useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Input, Button, Select, message } from 'antd';

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');
      
      message.success('Registration successful!');
      router.push('/dashboard');
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
        <Input />
      </Form.Item>
      
      <Form.Item label="Password" name="password" rules={[{ required: true, min: 6 }]}>
        <Input.Password />
      </Form.Item>
      
      <Form.Item label="Role" name="role" initialValue="guest">
        <Select>
          <Select.Option value="guest">Guest</Select.Option>
          <Select.Option value="host">Host</Select.Option>
        </Select>
      </Form.Item>
      
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Register
        </Button>
      </Form.Item>
    </Form>
  );
}