import React from 'react';
import { Form, Col, FormItemProps } from 'antd';

interface FormFieldProps extends FormItemProps {
  children: React.ReactNode;
  md?: number;
  span?: number;
  noStyle?: boolean;
}

const FormField = ({
  children,
  md,
  span,
  noStyle = false,
  ...props
}: FormFieldProps) => {

  if (noStyle) {
    return <Form.Item {...props}>{children}</Form.Item>;
  }

  return (
    <Col xs={24} md={md} span={span}>
      <Form.Item {...props}>{children}</Form.Item>
    </Col>
  );
};

export default FormField;
