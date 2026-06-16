import React, { useState } from "react";
import {
  PlusOutlined,
  InboxOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons"; // Added EnvironmentOutlined icon
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
  Upload,
  message,
} from "antd";
import { useLocations } from "../hooks/locations/useLocations";
import { useCreateJob } from "../hooks/jobs/useJobs";

const { TextArea } = Input;

const NewJob = () => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { data: locationsData, isLoading, error: locationErr } = useLocations();
  const { mutateAsync, isPending, error } = useCreateJob();
  // --- Transform your location data for the Select component ---
  const locationOptions = locationsData?.locations?.map((loc) => ({
    // Display "City, State" or just "City" if state is null
    label: `${loc.city}${loc.state ? `, ${loc.state}` : ""}`,
    value: loc.id.toString(), // Send the ID to the backend
  }));

  const showDrawer = () => setOpen(true);
  const onClose = () => {
    form.resetFields();
    setOpen(false);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const submitData = {
        ...values,
        jd_file: values.jd_file?.[0]?.originFileObj || null,
      };
      await mutateAsync(submitData);
      message.success("Job created successfully!");
    } catch (error) {
      message.error("Failed to create job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        className="!bg-indigo-600 hover:!bg-indigo-700 !text-white flex items-center shadow-md"
        type="primary"
        onClick={showDrawer}
        icon={<PlusOutlined />}
      >
        New Job
      </Button>

      <Drawer
        title={<span className="font-bold text-lg">Post a New Job</span>}
        size={720}
        onClose={onClose}
        open={open}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              onClick={() => form.submit()}
              type="primary"
              loading={loading}
              className="!bg-indigo-600"
            >
              Submit Job
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Job Title"
                rules={[{ required: true, message: "Enter job title" }]}
              >
                <Input placeholder="Ex: Frontend Developer" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="designation"
                label="Designation"
                rules={[{ required: true, message: "Enter designation" }]}
              >
                <Input placeholder="Ex: React JS Developer" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              {/* --- LOCATION SELECT --- */}
              <Form.Item
                name="location"
                label="Location"
                rules={[
                  { required: true, message: "Please select a location" },
                ]}
              >
                <Select
                  placeholder="Select job location"
                  showSearch
                  optionFilterProp="label" // Allows searching by City name
                  options={locationOptions}
                  suffixIcon={
                    <EnvironmentOutlined style={{ color: "#bfbfbf" }} />
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="short_description"
                label="Short Description"
                rules={[
                  { required: true, message: "Enter short description" },
                  { max: 150, message: "Max 150 characters" },
                ]}
              >
                <TextArea rows={3} placeholder="Brief summary of the role..." />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="jd_file"
                label="Job Description (PDF)"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                rules={[{ required: true, message: "Please upload JD" }]}
              >
                <Upload.Dragger
                  multiple={false}
                  beforeUpload={() => false}
                  maxCount={1}
                  accept=".pdf"
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined className="text-indigo-600" />
                  </p>
                  <p className="ant-upload-text font-medium">
                    Click or drag PDF to upload
                  </p>
                </Upload.Dragger>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};

export default NewJob;
