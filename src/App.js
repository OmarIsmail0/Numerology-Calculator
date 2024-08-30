import "./App.css";
import { Button, Col, Form, Grid, Row, Typography } from "antd";
import { useState } from "react";
import InputField from "./components/InputField";

const { useBreakpoint } = Grid;

function App() {
  const [form] = Form.useForm();
  const [mode, setMode] = useState(true);

  const screens = useBreakpoint();

  const chaldeanMap = {
    A: 1,
    B: 2,
    C: 3,
    D: 4,
    E: 5,
    F: 8,
    G: 3,
    H: 5,
    I: 1,
    J: 1,
    K: 2,
    L: 3,
    M: 4,
    N: 5,
    O: 7,
    P: 8,
    Q: 1,
    R: 2,
    S: 3,
    T: 4,
    U: 6,
    V: 6,
    W: 6,
    X: 5,
    Y: 1,
    Z: 7,
  };

  const pythagoreanMap = {
    A: 1,
    B: 2,
    C: 3,
    D: 4,
    E: 5,
    F: 6,
    G: 7,
    H: 8,
    I: 9,
    J: 1,
    K: 2,
    L: 3,
    M: 4,
    N: 5,
    O: 6,
    P: 7,
    Q: 8,
    R: 9,
    S: 1,
    T: 2,
    U: 3,
    V: 4,
    W: 5,
    X: 6,
    Y: 7,
    Z: 8,
  };

  const reduceToSingleDigit = (num) => {
    if (num.toString().length > 1) {
      while (num > 9) {
        num = num
          .toString()
          .split("")
          .reduce((acc, digit) => acc + parseInt(digit), 0);
        console.log(num);
      }
      return `/ ${num}`;
    }

    return "";
  };

  const calculateNumerology = (name, map) => {
    let vowelsTotal = 0;
    let consonantsTotal = 0;
    let vowelStr = "";
    let consonantStr = "";
    const vowels = "AEIOU";
    for (let char of name.toUpperCase()) {
      if (map[char]) {
        if (vowels.includes(char)) {
          vowelsTotal += map[char];
          vowelStr += map[char] + " ";
        } else {
          consonantsTotal += map[char];
          consonantStr += map[char] + " ";
        }
      }
    }

    const total = vowelsTotal + consonantsTotal;
    return {
      vowelStr,
      vowelsTotal,
      consonantStr,
      consonantsTotal,
      total,
      reducedTotal: reduceToSingleDigit(total),
      consonantTotal: reduceToSingleDigit(consonantsTotal),
    };
  };

  const onFinish = (values) => {
    if (values.name) {
      if (mode) {
        let result = calculateNumerology(values.name, chaldeanMap);
        form.setFieldValue("vowels", result.vowelStr);
        form.setFieldValue("consonant", result.consonantStr);
        form.setFieldValue("total", result.total);
        console.log(calculateNumerology(values.name, chaldeanMap));
      } else {
        let result = calculateNumerology(values.name, pythagoreanMap);
        form.setFieldValue("vowels", result.vowelStr);
        form.setFieldValue("consonant", result.consonantStr);
        form.setFieldValue("total", result.total);

        form.setFieldValue("py_vowels", result.vowelsTotal);
        form.setFieldValue("py_consonant", `${result.consonantsTotal} ${result.consonantTotal}`);
        form.setFieldValue("py_total", `${result.total} ${result.reducedTotal}`);
        console.log(calculateNumerology(values.name, pythagoreanMap));
      }
    }
  };

  const handleClear = () => {
    form.resetFields();
  };

  const handleMode = () => {
    setMode(!mode);
    form.submit();
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Form
      labelAlign="left"
      labelCol={{
        span: 4,
      }}
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Row justify="center" className="centered-container">
        <Col span={24}>
          <div style={{ fontSize: 24, fontWeight: "bold", display: "flex", justifyContent: "center" }}>Calculator</div>
        </Col>
        <Col span={24}>
          <Typography.Text style={{ fontSize: 15 }}>
            ONLY USE NAME WINDOW TO INPUT YOUR NAME <br /> <br />
            You can switch between Chaldean and Pythagorean system by pressing the button below. You can type in your
            name, last name or both and see if they are lucky or not. <br /> <br />
            If the description of your name, last name is not lucky, I suggest that you contact me so I can help fix
            your bad vibrations. <br /> <br />
            <br />
          </Typography.Text>
        </Col>

        <Col span={18}>
          <InputField name={"vowels"} label={"Vowels"} readOnly />
        </Col>

        <Col span={6}>{!mode && <InputField name={"py_vowels"} label={screens.xs ? " " : ""} readOnly />}</Col>

        <Col span={18}>
          <InputField name={"name"} label={"Name"} />
        </Col>
        <Col span={6} />

        <Col span={18}>
          <InputField name={"consonant"} label={"Consonant"} readOnly />
        </Col>

        <Col span={6}>{!mode && <InputField name={"py_consonant"} label={screens.xs ? " " : ""} readOnly />}</Col>

        <Col span={18}>
          <InputField name={"total"} label={"Total"} readOnly />
        </Col>

        <Col span={6}>{!mode && <InputField name={"py_total"} label={screens.xs ? " " : ""} readOnly />}</Col>

        <Col xs={0} sm={3} span={3} />

        <Col span={6}>
          <Form.Item>
            <Button
              style={{ width: "100%", backgroundColor: "#31344b", color: "#fff" }}
              type="primary"
              htmlType="submit"
            >
              Calculate
            </Button>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item>
            <Button style={{ width: "100%", backgroundColor: "#31344b", color: "#fff" }} onClick={handleMode}>
              {mode ? "to Pythagorean" : "to Chaldean"}
            </Button>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item>
            <Button style={{ width: "100%", backgroundColor: "#31344b", color: "#fff" }} onClick={handleClear}>
              Clear
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default App;
