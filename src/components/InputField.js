import { Form, Input } from "antd";
import React from "react";

const InputField = ({ label, name, ...props }) => {
  return (
    <Form.Item colon={false} label={label} name={name}>
      <Input
        style={{
          border: "1px solid #807d78",
          boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.3)",
          backgroundColor: props.readOnly ? "#e6e7ee" : "#fff",
        }}
        {...props}
      />
    </Form.Item>
  );
};

export default InputField;
