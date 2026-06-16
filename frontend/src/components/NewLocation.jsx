import React, { useState } from "react";
import {
  PlusOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { Button, Col, Drawer, Form, Input, Row, Space, message } from "antd";
import {
  useCreateLocation,
  useDeleteLocation,
} from "../hooks/locations/useLocations"; // Assuming this hook exists

const NewLocation = () => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  // Use the location creation hook
  const { mutateAsync, isPending } = useCreateLocation();

  const showDrawer = () => setOpen(true);

  const onClose = () => {
    form.resetFields();
    setOpen(false);
  };

  const onFinish = async (values) => {
    try {
      await mutateAsync(values);
      message.success("Location added successfully!");
      onClose();
    } catch (error) {
      message.error("Failed to add location. Please try again.");
    }
  };

  return (
    <>
      <Button
        className="!bg-indigo-600 hover:!bg-indigo-700 !text-white flex items-center shadow-md font-semibold"
        type="primary"
        onClick={showDrawer}
        icon={<PlusOutlined />}
      >
        Add Location
      </Button>

      <Drawer
        title={
          <span className="font-bold text-lg italic text-indigo-600">
            New Location
          </span>
        }
        size={450} // Smaller size for location form
        onClose={onClose}
        open={open}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              onClick={() => form.submit()}
              type="primary"
              loading={isPending}
              className="!bg-indigo-600"
            >
              Save Location
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ country: "India" }} // Defaulting to India based on your data
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="city"
                label="City Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter the city name (e.g. Mumbai)",
                  },
                ]}
              >
                <Input
                  prefix={<EnvironmentOutlined className="text-gray-400" />}
                  placeholder="Ex: Mumbai"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="state"
                label="State / Province"
                rules={[{ required: false }]} // Optional as per your "Pan India" example
              >
                <Input placeholder="Ex: Maharashtra (Leave blank for Pan India/Remote)" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="country"
                label="Country"
                rules={[
                  { required: true, message: "Please enter the country" },
                ]}
              >
                <Input
                  prefix={<GlobalOutlined className="text-gray-400" />}
                  placeholder="Ex: India"
                />
              </Form.Item>
            </Col>
          </Row>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-600 m-0">
              <strong>Note:</strong> Locations added here will immediately
              become available in the "Job Posting" dropdown for HR recruitment.
            </p>
          </div>
        </Form>
      </Drawer>
    </>
  );
};

export default NewLocation;
