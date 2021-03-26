import React, { useMemo, PropsWithChildren, Dispatch } from 'react';
import { Form, Input, Button, message } from 'antd';
import { RouteComponentProps } from 'dva/router';
import './index.less';
import { FormError } from 'src/typings';
import { storage } from 'src/utils';
import { connect } from 'dva';

type Props = PropsWithChildren<
  RouteComponentProps & {
    dispatch: Dispatch<any>;
  }
>;

const Login = (props: Props) => {
  useMemo(() => {
    storage.clear();
  }, []);

  // 成功的提交
  const onFinish = (values: any) => {
    console.log('Success:', values, typeof values);
    props.dispatch({ type: 'login/loginApi', payload: values });
  };
  // 失败的提示
  const onFinishFailed = (errorInfo: FormError) => {
    const { errorFields } = errorInfo;
    // 取出第一个的错误提示出来
    message.warning(errorFields[0].errors[0]);
  };
  return (
    <div className="login">
      <div className="login-panel">
        <div className="title">后台管理系统平台</div>
        <Form name="basic" layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-btn">
              登录
            </Button>
          </Form.Item>
          <div className="tools">用户名和密码随便输入</div>
        </Form>
      </div>
    </div>
  );
};

export default connect()(Login);