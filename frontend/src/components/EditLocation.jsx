import React, { useState, useEffect } from "react";
import { GlobalOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { Button, Col, Drawer, Form, Input, Row, Space, message } from "antd";
import { useUpdateLocation } from "../hooks/locations/useLocations";
import { Edit3 } from "lucide-react"; // Import Edit icon

const EditLocation = ({ location }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  // Use the update hook
  const { mutateAsync, isPending } = useUpdateLocation();

  const showDrawer = () => setOpen(true);

  const onClose = () => {
    setOpen(false);
  };

  // --- 1. Populate the form with Location data when opened ---
  useEffect(() => {
    if (open && location) {
      form.setFieldsValue({
        city: location.city,
        state: location.state,
        country: location.country,
      });
    }
  }, [open, location, form]);

  // --- 2. Handle Update Submission ---
  const onFinish = async (values) => {
    try {
      // Pass both the ID and the new values to your hook
      await mutateAsync({ id: location.id, ...values });
      message.success("Location updated successfully!");
      onClose();
    } catch (error) {
      message.error("Failed to update location.");
    }
  };

  return (
    <>
      {/* Trigger Button (Matching your "Beautiful Table" style) */}
      <button
        onClick={showDrawer}
        className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
        title="Edit Location"
      >
        <Edit3 size={18} />
      </button>

      <Drawer
        title={
          <span className="font-bold text-lg text-indigo-600">
            Edit Location
          </span>
        }
        size={400}
        onClose={onClose}
        open={open}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              onClick={() => form.submit()}
              type="primary"
              loading={isPending}
              className="!bg-indigo-600 hover:!bg-indigo-700"
            >
              Update Details
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="city"
                label="City Name"
                rules={[{ required: true, message: "Please enter the city" }]}
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
                rules={[{ required: false }]}
              >
                <Input placeholder="Ex: Maharashtra" />
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

          <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-700 text-xs">
            <p className="m-0 leading-relaxed">
              <strong>Notice:</strong> Changing these details will update all
              existing job postings currently linked to this location.
            </p>
          </div>
        </Form>
      </Drawer>
    </>
  );
};

export default EditLocation;
