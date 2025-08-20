import { useState } from 'react';
import { Form, Input, Button, Upload, InputNumber, Checkbox, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export default function CreateListingForm() {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e && e.fileList;
  };

  const onFinish = async (values) => {
    setLoading(true);
    
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('price', values.price);
    formData.append('address', values.address);
    formData.append('maxGuests', values.maxGuests);
    formData.append('bedrooms', values.bedrooms);
    formData.append('beds', values.beds);
    
    // এমেনিটিজ যোগ করুন
    Object.keys(values.amenities).forEach(key => {
      formData.append(`amenities[${key}]`, values.amenities[key]);
    });
    
    // ইমেজ ফাইলস যোগ করুন
    fileList.forEach(file => {
      formData.append('images', file.originFileObj);
    });

    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create listing');
      
      message.success('Listing created successfully!');
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item label="Title" name="title" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      
      <Form.Item label="Description" name="description" rules={[{ required: true }]}>
        <Input.TextArea rows={4} />
      </Form.Item>
      
      <Form.Item label="Price per night" name="price" rules={[{ required: true }]}>
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>
      
      <Form.Item label="Address" name="address" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      
      <Form.Item label="Maximum guests" name="maxGuests" rules={[{ required: true }]}>
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>
      
      <Form.Item label="Bedrooms" name="bedrooms" rules={[{ required: true }]}>
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>
      
      <Form.Item label="Beds" name="beds" rules={[{ required: true }]}>
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>
      
      <Form.Item label="Amenities" name="amenities">
        <Checkbox.Group>
          <Checkbox name="amenities[wifi]" value={true}>Wi-Fi</Checkbox>
          <Checkbox name="amenities[ac]" value={true}>Air Conditioning</Checkbox>
          <Checkbox name="amenities[kitchen]" value={true}>Kitchen</Checkbox>
          <Checkbox name="amenities[parking]" value={true}>Parking</Checkbox>
          <Checkbox name="amenities[tv]" value={true}>TV</Checkbox>
        </Checkbox.Group>
      </Form.Item>
      
      <Form.Item
        label="Upload Images"
        name="images"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[{ required: true, message: 'Please upload at least one image' }]}
      >
        <Upload
          listType="picture"
          beforeUpload={() => false}
          onChange={({ fileList }) => setFileList(fileList)}
        >
          <Button icon={<UploadOutlined />}>Select Images</Button>
        </Upload>
      </Form.Item>
      
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Create Listing
        </Button>
      </Form.Item>
    </Form>
  );
}