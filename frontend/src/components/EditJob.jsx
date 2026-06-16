import React, { useState, useEffect } from "react";
import { InboxOutlined, EnvironmentOutlined } from "@ant-design/icons";
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
import { useUpdateJob } from "../hooks/jobs/useJobs";
import { Edit } from "lucide-react";

const { TextArea } = Input;

const EditJob = ({ job }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const { data: locationsData } = useLocations();
  const { mutateAsync, isPending } = useUpdateJob();

  // --- 1. Populate Form when Drawer Opens ---
  useEffect(() => {
    if (open && job) {
      form.setFieldsValue({
        title: job.title,
        designation: job.designation,
        location: job.location, // Assuming job.location is the ID string
        short_description: job.short_description,
        // Ant Design Upload expects an array for the fileList
        jd_file: job.jd_file
          ? [
              {
                uid: "-1",
                name: "Current_JD.pdf",
                status: "done",
                url: job.jd_file,
              },
            ]
          : [],
      });
    }
  }, [open, job, form]);

  const locationOptions = locationsData?.locations?.map((loc) => ({
    label: `${loc.city}${loc.state ? `, ${loc.state}` : ""}`,
    value: loc.id.toString(),
  }));

  const showDrawer = () => setOpen(true);

  const onClose = () => {
    setOpen(false);
  };

  // --- 2. Handle Submission ---
  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append("id", job.id); // Crucial for update
      formData.append("title", values.title);
      formData.append("designation", values.designation);
      formData.append("location", values.location);
      formData.append("short_description", values.short_description);

      // Check if user uploaded a NEW file or kept the old one
      const fileEntry = values.jd_file?.[0];
      if (fileEntry?.originFileObj) {
        // It's a new file upload
        formData.append("jd_file", fileEntry.originFileObj);
      } else if (fileEntry?.url) {
        // User didn't change the file, keep existing URL or send reference
        formData.append("existing_jd_file", fileEntry.url);
      }

      await mutateAsync({ id: job.id, jobData: formData });
      message.success("Job updated successfully!");
      setOpen(false);
    } catch (error) {
      message.error("Failed to update job.");
    }
  };

  return (
    <>
      <button
        onClick={showDrawer}
        className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
        title="Edit Details"
      >
        <Edit size={18} />
      </button>

      <Drawer
        title={<span className="font-bold text-lg">Edit Job Posting</span>}
        size={720}
        onClose={onClose}
        open={open}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              onClick={() => form.submit()}
              type="primary"
              loading={isPending}
              className="!bg-amber-600 hover:!bg-amber-700"
            >
              Update Job
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
                  optionFilterProp="label"
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
                <TextArea rows={3} placeholder="Brief summary..." />
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
              >
                <Upload.Dragger
                  multiple={false}
                  beforeUpload={() => false}
                  maxCount={1}
                  accept=".pdf"
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined className="text-amber-600" />
                  </p>
                  <p className="ant-upload-text font-medium">
                    Click or drag to replace PDF
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

export default EditJob;
